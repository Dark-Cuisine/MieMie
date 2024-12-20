import React, { Component, useState, useReducer, useEffect, useImperativeHandle, forwardRef, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtTextarea, AtSegmentedControl, AtIcon, AtModal } from 'taro-ui'

import ExpressInfoContainer from '../../containers/ExpressInfoContainer/ExpressInfoContainer'
import Dialog from '../../components/dialogs/Dialog/Dialog'
import ActionDialog from '../../components/dialogs/ActionDialog/ActionDialog'
import TabPage from '../../components/formats/TabPage/TabPage'
import ActionButtons from '../../components/buttons/ActionButtons/ActionButtons'
import StationsCard from '../../components/cards/StationsCard/StationsCard'
import TrainStationSetter from '../../components/TrainStationSetter/TrainStationSetter'
import * as math_functions from '../../utils/functions/tool_functions/math_functions'
import * as text_functions from '../../utils/functions/tool_functions/text_functions'

import './PickUpWayContainer.scss'

/***
 * <PickUpWayContainer
 * styleType={}//0:tab页式，1:列表式-商品接龙, 2:列表式-活动接龙
 * type={} //'GOODS''EVENT'
 * mode={}
   shop={state.shop}
  handleSave={() => handleSave()}
  handleChoose={} 
/>
 */

const PickUpWayContainer = (props, ref) => {
  const initState = {
    pickUpWay: props.shop.pickUpWay,

    currentSegment: 0,//0:selfPickUp ,1:stationPickUp ,2:expressPickUp


    //正在修改的项目,同时也用作init新项目
    modifyingSelfPickUp: { place: '', placeDetail: '', nearestStation: { line: '', stations: { list: [], from: '', to: '' } }, announcements: [], dates: [] },
    modifyingStationPickUp: { line: '', stations: { list: [], from: '', to: '' }, floorPrice: 0, dates: [] },
    modifyingExpressPickUp: { area: '', floorPrice: 0 },

    currentItemIndex: null,//正在修改的项目的index
    deleteWay: null,

    focusedInput: null,

    mode: props.mode,//'BUYER','SELLER_MODIFYING','SELLER_PREVIEW'
  }
  const words = props.type === 'GOODS' ? {
    selfPickUp: '自提点',
    stationPickUp: '送货车站',
  } : {
    selfPickUp: '集合点',
    stationPickUp: '集合车站',
  }
  const TrainStationSetterRef = useRef();

  const [state, setState] = useState(initState);
  const [choosenItem, setChoosenItem] = useState(props.choosenItem);
  const [openedDialog, setOpenedDialog] = useState(null);//'SELF_PICK_UP','STATION_PICK_UP','EXPRESS_PICK_UP','DELETE','EXPRESS_INFO_CONTAINER'


  useEffect(() => {
    // console.log('refe-pick-up');
    setState({
      ...state,
      pickUpWay: {
        ...initState.pickUpWay,
      },
    });
  }, [props.shop,]);//status改变时就重新执行 *problem 忘了这里写的status是什么鬼了！

  useEffect(() => {
    setChoosenItem(props.choosenItem)
  }, [props.choosenItem]);
  useEffect(() => {
    setState({
      ...state,
      mode: initState.mode
    });
  }, [props.mode]);

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return (state.pickUpWay)
    }
  }));

  const handleClickSegment = (value) => {//切换页面
    setState({
      ...state,
      currentSegment: value
    })
  }

  //handle action buttons
  const handleActionButtons = (way) => {
    switch (way) {
      case 'MODIFY':
        setState({
          ...state,
          mode: 'SELLER_MODIFYING'
        });
        break;
      case 'PREVIEW':
        setState({
          ...state,
          mode: 'SELLER_PREVIEW'
        });
        break;
      case '':

        break;
      default:
        break;
    }
  }

  const toggleDialog = (way, it = null, i = null) => {
     setOpenedDialog(way)
    switch (way) {
      case 'SELF_PICK_UP':
        setState({
          ...state,
          modifyingSelfPickUp: (it === null) ? initState.modifyingSelfPickUp : it,
          currentItemIndex: i,
        });
        break;
      case 'STATION_PICK_UP':
        setState({
          ...state,
          modifyingStationPickUp: (it === null) ? initState.modifyingStationPickUp : it,
          currentItemIndex: i,
        });
        break;
      case 'EXPRESS_PICK_UP':
        setState({
          ...state,
          modifyingExpressPickUp: (it === null) ? initState.modifyingExpressPickUp : it,
          currentItemIndex: i,
        });
        break;
      case 'DELETE':
         setState({
          ...state,
          deleteWay: it,
          currentItemIndex: i,
        });
        break;
      case '':
        break;
      default:
        break;
    }
  }


  const handleChange = (way, v = null) => { //handle change 
    switch (way) {
      case 'SELF_PICK_UP_PLACE'://self pick up
        setState({
          ...state,
          modifyingSelfPickUp: {
            ...state.modifyingSelfPickUp,
            place: v
          }
        });
        break;
      case 'SELF_PICK_UP_PLACE_DETAIL':
        setState({
          ...state,
          modifyingSelfPickUp: {
            ...state.modifyingSelfPickUp,
            placeDetail: v
          }
        });
        break;
      case 'SELF_PICK_UP_NEARLEST_STATION':
        setState({
          ...state,
          modifyingSelfPickUp: {
            ...state.modifyingSelfPickUp,
            nearestStation: v
          }
        });
        break;
      case 'SELF_PICK_UP_DES':
        setState({
          ...state,
          pickUpWay: {
            ...state.pickUpWay,
            selfPickUp: {
              ...state.pickUpWay.selfPickUp,
              des: v
            }
          }
        });
        break;
      case 'STATION_PICK_UP'://station pick up
        let updatedStationList = [];
        v.stations.list &&
          v.stations.list.forEach(it => {
            updatedStationList.push({ station: it, announcements: [] })
          });
        setState({
          ...state,
          modifyingStationPickUp: {
            ...state.modifyingStationPickUp,
            line: v.line,
            stations: {
              ...state.modifyingStationPickUp.stations,
              list: updatedStationList,
              from: v.stations.from,
              to: v.stations.to,
            },
          }
        });
        break;
      case 'STATION_PICK_UP_FLOOR_PRICE':
        setState({
          ...state,
          modifyingStationPickUp: {
            ...state.modifyingStationPickUp,
            floorPrice: Number(v)
          }
        });
        break;
      case 'STATION_PICK_UP_DES':
        setState({
          ...state,
          pickUpWay: {
            ...state.pickUpWay,
            stationPickUp: {
              ...state.pickUpWay.stationPickUp,
              des: v
            }
          }
        });
        break;
      case 'EXPRESS_PICKUP_AREA'://express pick up
        setState({
          ...state,
          modifyingExpressPickUp: {
            ...state.modifyingExpressPickUp,
            area: v
          }
        });
        break;
      case 'EXPRESS_PICKUP_FLOOR_PRICE':
        setState({
          ...state,
          modifyingExpressPickUp: {
            ...state.modifyingExpressPickUp,
            floorPrice: Number(v)
          }
        }); break;
      case 'EXPRESS_PICKUP_DES':
        setState({
          ...state,
          pickUpWay: {
            ...state.pickUpWay,
            expressPickUp: {
              ...state.pickUpWay.expressPickUp,
              des: v
            }
          }
        });
        break;
      case 'TROGGLE_EXPRESS_PICKUP_ISABLE':
        setState({
          ...state,
          pickUpWay: {
            ...state.pickUpWay,
            expressPickUp: {
              ...state.pickUpWay.expressPickUp,
              isAble: !state.pickUpWay.expressPickUp.isAble
            }
          }
        });
        break;
      default:
        break;
    }
  }

  const handleCancel = () => {//cancel add or modify
    setOpenedDialog(null)
    setState({
      ...state,
      modifyingSelfPickUp: initState.modifyingSelfPickUp,
      modifyingStationPickUp: initState.modifyingStationPickUp,
      modifyingExpressPickUp: initState.modifyingExpressPickUp,

      currentItemIndex: initState.currentItemIndex,
    });
  }



  const handleSubmit = async (way, v = null, i = null) => {//submit add or modify
    setOpenedDialog(null)
    let updated = null;
    switch (way) {
      case 'SELF_PICK_UP':
        updated = state.pickUpWay.selfPickUp.list;
        (state.currentItemIndex === null) ?
          updated.push({
            ...state.modifyingSelfPickUp,
            id: (state.modifyingSelfPickUp.id && state.modifyingSelfPickUp.id.length > 0) ?
              state.modifyingSelfPickUp.id : math_functions.getRandomId()
          }) :
          updated.splice(state.currentItemIndex, 1, {
            ...state.modifyingSelfPickUp,
            id: (state.modifyingSelfPickUp.id && state.modifyingSelfPickUp.id.length > 0) ?
              state.modifyingSelfPickUp.id : math_functions.getRandomId()
          });
        setState({
          ...state,
          pickUpWay: {
            ...state.pickUpWay,
            selfPickUp: {
              ...state.pickUpWay.selfPickUp,
              list: updated
            }
          },
          modifyingSelfPickUp: initState.modifyingSelfPickUp,

          currentItemIndex: initState.currentItemIndex,
        });
        break;
      case 'STATION_PICK_UP':
        // let updatedStationList = [];
        // v.stations.list.forEach(it => {
        //   updatedStationList.push({ station: it, announcements: [] })
        // });
        // let updatedObj = {
        //   ...state.modifyingStationPickUp,
        //   line: v.line,
        //   stations: {
        //     ...state.modifyingStationPickUp.stations,
        //     list: updatedStationList,
        //     from: v.stations.from,
        //     to: v.stations.to,
        //   },
        // }

        updated = state.pickUpWay.stationPickUp.list;
        (state.currentItemIndex === null) ?
          updated.push({
            ...state.modifyingStationPickUp,
            id: (state.modifyingStationPickUp.id && state.modifyingStationPickUp.id.length > 0) ?
              state.modifyingStationPickUp.id : math_functions.getRandomId()
          }) :
          updated.splice(state.currentItemIndex, 1, {
            ...state.modifyingStationPickUp,
            id: (state.modifyingStationPickUp.id && state.modifyingStationPickUp.id.length > 0) ?
              state.modifyingStationPickUp.id : math_functions.getRandomId()
          });

        setState({
          ...state,
          pickUpWay: {
            ...state.pickUpWay,
            stationPickUp: {
              ...state.pickUpWay.stationPickUp,
              list: updated
            }
          },
          modifyingStationPickUp: initState.modifyingStationPickUp,

          currentItemIndex: initState.currentItemIndex,
        });
        break;
      case 'EXPRESS_PICK_UP':
        updated = state.pickUpWay.expressPickUp.list;
        (state.currentItemIndex === null) ?
          updated.push({
            ...state.modifyingExpressPickUp,
            id: (state.modifyingExpressPickUp.id && state.modifyingExpressPickUp.id.length > 0) ?
              state.modifyingExpressPickUp.id : math_functions.getRandomId(),
          }) :
          updated.splice(state.currentItemIndex, 1, {
            ...state.modifyingExpressPickUp,
            id: (state.modifyingExpressPickUp.id && state.modifyingExpressPickUp.id.length > 0) ?
              state.modifyingExpressPickUp.id : math_functions.getRandomId(),
          });
        setState({
          ...state,
          pickUpWay: {
            ...state.pickUpWay,
            expressPickUp: {
              ...state.pickUpWay.expressPickUp,
              list: updated
            }
          },
          modifyingExpressPickUp: initState.modifyingExpressPickUp,

          currentItemIndex: initState.currentItemIndex,
        });
        break;
      case '':

        break;
      default:
        break;
    }
    props.handleSave();
  }

  const handleDelete = (way = state.deleteWay, i = state.currentItemIndex) => {  //delete
    setOpenedDialog(null)
    console.log('dele', way, i);
    let updated = null;
    switch (way) {
      case 'SELF_PICK_UP':
        updated = state.pickUpWay.selfPickUp.list;
        updated.splice(i, 1);
        setState({
          ...state,
          pickUpWay: {
            ...state.pickUpWay,
            selfPickUp: {
              ...state.pickUpWay.selfPickUp,
              list: updated
            }
          },
          deleteWay: null,

          modifyingSelfPickUp: initState.modifyingSelfPickUp,
          modifyingSelfPickUpIndex: null,
          isAddingSelfPickUp: false,
        });
        break;
      case 'STATION_PICK_UP':
        updated = state.pickUpWay.stationPickUp.list;
        updated.splice(i, 1);
        setState({
          ...state,
          pickUpWay: {
            ...state.pickUpWay,
            stationPickUp: {
              ...state.pickUpWay.stationPickUp,
              list: updated
            }
          },
          deleteWay: null,

          modifyingStationPickUp: initState.modifyingStationPickUp,
          modifyingStationPickUpIndex: null,
          isAddingStationPickUp: false,
        });
        break;
      case 'EXPRESS_PICK_UP':
        updated = state.pickUpWay.expressPickUp.list;
        updated.splice(i, 1);
        setState({
          ...state,
          pickUpWay: {
            ...state.pickUpWay,
            expressPickUp: {
              ...state.pickUpWay.expressPickUp,
              list: updated
            }
          },
          deleteWay: null,

          modifyingExpressPickUp: initState.modifyingExpressPickUp,
          modifyingExpressPickUpIndex: null,
          isAddingExpressPickUp: false,
        });
        break;
      case '':

        break;
      default:
        break;
    }
  }

  const handleChoose = (way, v = null) => {
    // toggleDialog(null)
    props.handleChoose &&
      props.handleChoose(way, v)
  }

   let deleteDialog = (
    <ActionDialog
      type={1}
      isOpened={openedDialog === 'DELETE'}
      onClose={() => toggleDialog('DELETE')}
      onCancel={() => handleCancel()}
      onSubmit={() => handleDelete()}
      cancelText='取消'
      confirmText='确认'
      textCenter={true}
    >确定删除？</ActionDialog>
  );


  //self pick up
  let selfPickUpDialog = (
    <ActionDialog
      className='new_item_dialog'
      isOpened={openedDialog === 'SELF_PICK_UP'}
      closeOnClickOverlay={false}
      type={0}
      title={words.selfPickUp}
      onClose={handleCancel.bind(this)}
      onCancel={handleCancel.bind(this)}
      onSubmit={handleSubmit.bind(this, 'SELF_PICK_UP')}
      checkedItems={
        [
          {
            check: state.modifyingSelfPickUp.place.length > 0,
            toastText: '请输入'.concat(words.selfPickUp, '名称')
          },
          {
            check:
              (state.modifyingSelfPickUp.nearestStation.line.length < 1)//如果选了线路，则一定要选车站
              || (state.modifyingSelfPickUp.nearestStation.stations.from.length > 0),
            toastText: props.styleType === 2 ? null : //SolitaireContainer中使用时因为太深层了toast显示不出来！
              '请选择车站'
          },
        ]}
    >
      <View className='action_dialog_content'>
        <AtInput
          name={'selfPickUpPlaceNew'}
          type='text'
          title={words.selfPickUp}
          cursor={state.modifyingSelfPickUp.place && state.modifyingSelfPickUp.place.length}
          value={state.modifyingSelfPickUp.place}
          onChange={v => handleChange('SELF_PICK_UP_PLACE', v)}
        />
        <AtInput
          name={'selfPickUpPlaceDetailNew'}
          type='text'
          title='具体地址'
          cursor={state.modifyingSelfPickUp.placeDetail && state.modifyingSelfPickUp.placeDetail.length}
          value={state.modifyingSelfPickUp.placeDetail}
          onChange={v => handleChange('SELF_PICK_UP_PLACE_DETAIL', v)}
        />
        {/* <View className='item_input'
          style='padding-bottom:100rpx'
        >
          <View className='title'>最近车站</View>
          <TrainStationSetter
            name={'selfPickUpNearlestStationNew'}
            type={0}
            hasActionButtons={false}
            modifyingItem={state.modifyingSelfPickUp.nearestStation}
            sendValue={(newItem) => handleChange('SELF_PICK_UP_NEARLEST_STATION', newItem)}
            handleSubmit={(newItem) => handleChange('SELF_PICK_UP_NEARLEST_STATION', newItem)}
            maxItem={30}
            maxHeight={500}
          />
        </View> */}
      </View>
    </ActionDialog >
  )
   let selfPickUpList = (
    <View className='self_pick_up'>
      {!(state.mode === 'SELLER_MODIFYING') || state.isAddingSelfPickUp ||
        <View
          className='add_button'
          onClick={() => toggleDialog('SELF_PICK_UP')}
        >
          <View
            className='at-icon at-icon-add-circle'
          />
          {words.selfPickUp}
        </View>
      }
      {state.mode == 'BUYER' &&
        <View className='description'>
          {state.pickUpWay && state.pickUpWay.selfPickUp.des}
        </View>
      }
      {(state.pickUpWay && state.pickUpWay.selfPickUp && state.pickUpWay.selfPickUp.list && state.pickUpWay.selfPickUp.list.length > 0) ?
        (state.pickUpWay.selfPickUp.list.map((it, i) => {
          return (
            <View
              key={i}
              className={'item replicable_item '.concat(choosenItem ?
                (state.mode == 'BUYER' &&
                choosenItem.way === 'SELF_PICK_UP' &&
                  ((it.place == choosenItem.place.place) &&
                    (it.placeDetail == choosenItem.place.placeDetail)) ?
                  'item_choosen' : '') : ''
              )
              }
              style={(state.mode === 'SELLER_MODIFYING') ? 'border:none !important;width: auto;' : ''}
              onClick={
                (choosenItem &&
                  choosenItem.way === 'SELF_PICK_UP' &&
                  ((it.place == choosenItem.place.place) &&
                    (it.placeDetail == choosenItem.place.placeDetail))) ?
                  () => handleChoose(null) :
                  () => handleChoose('SELF_PICK_UP', it)
              }
              onLongPress={() => {
                text_functions.copyText((it.placeDetail && it.placeDetail.length > 0) ?
                  it.placeDetail : it.place)
              }}
            >
              <View
                style={'display: flex; align-items:'.concat(
                  (it.placeDetail && it.placeDetail.length > 0) ? 'center;' : 'center;'
                )}
              >
                <View className='dot_small' />
                <View
                  className='content '
                  key={i}>
                  <View className='flex items-center'>
                    <View className='place'> {it.place} </View>
                    {
                      it.placeDetail && it.placeDetail.length > 0 &&
                      <View
                        style='font-size:35rpx; color:var(--gray-3);'
                      >
                        ({it.placeDetail}）
                      </View>
                    }
                  </View>
                  {
                    it.nearestStation.line && it.nearestStation.line.length > 0 &&
                    <View> 最近车站:
                      {it.nearestStation.stations.from} ({it.nearestStation.line}) </View>
                  }
                </View>
              </View>
              {state.mode === 'SELLER_MODIFYING' &&
                <ActionButtons
                  type={0}
                  position={'RIGHT'}
                  onClickLeftButton={() => toggleDialog('SELF_PICK_UP', it, i)}
                  onClickRightButton={() => toggleDialog('DELETE', 'SELF_PICK_UP', i)}
                  leftWord='edit'
                  rightWord='trash'
                />
              }
            </View>
          )
        })) :
        (props.styleType === 0 &&
          <View className='empty_word'> {'暂无' + words.selfPickUp} </View>
        )
      }

      {
        props.styleType === 0 &&
        state.mode == 'SELLER_MODIFYING' &&
        <View className='des'>
          <View className='title'>备注：</View>
          <AtTextarea
            count={false}
            value={state.pickUpWay.selfPickUp.des}
            onChange={(v) => handleChange('SELF_PICK_UP_DES', v)}
            height={300}
            maxLength={300}
            placeholder={props.type === 'GOODS' ?
              '每天xx点从xx出发...' : '迟到5分钟以上直接发车不等人'}
          />
        </View>
      }
    </View >
  );

  let stationPickUpDialog = (
    <ActionDialog
      className='new_item_dialog'
      isOpened={openedDialog === 'STATION_PICK_UP'}
      closeOnClickOverlay={false}
      type={0}
      title={words.stationPickUp}
      onClose={handleCancel.bind(this)}
      onCancel={handleCancel.bind(this)}
      // onSubmit={() => TrainStationSetterRef.current.handleSubmit()}
      onSubmit={() => handleSubmit('STATION_PICK_UP')}
      checkedItems={[
        {
          check: state.modifyingStationPickUp.line &&
            state.modifyingStationPickUp.line.length > 0,
          toastText: '请选择电车线路'
        },
        {
          check: state.modifyingStationPickUp.stations &&//*unfinished, 未选择应该视为全选
            state.modifyingStationPickUp.stations.list &&
            state.modifyingStationPickUp.stations.list.length > 0,
          toastText: '请选择车站'
        }
      ]}
    >
      <TrainStationSetter
        name={'stationPickUpListNew'}
        ref={TrainStationSetterRef}
        type={3}
        hasActionButtons={false}
        modifyingItem={state.modifyingStationPickUp}
        sendValue={(newItem) => handleChange('STATION_PICK_UP', newItem)}
        handleSubmit={(newItem) => handleChange('STATION_PICK_UP', newItem)}
        maxItem={30}
        maxHeight={500}
      />
      {props.type === 'GOODS' &&
        <View className='flex items-center'>
          <View className='title white_space'>
            起送价:
          </View>
          <AtInput
            name={'stationPickUpFloorPriceNew'}
            type='number'
            cursor={state.modifyingStationPickUp.floorPrice && String(state.modifyingStationPickUp.floorPrice).length}
            value={state.modifyingStationPickUp.floorPrice}
            onChange={v => handleChange('STATION_PICK_UP_FLOOR_PRICE', v)}
          >¥</AtInput>
        </View>}
    </ActionDialog>
  )


  let stationPickUpList =
    props.handleChoose ?
      <View className=''>
        <View className=''>
          {state.pickUpWay && state.pickUpWay.stationPickUp.des}
        </View>
        {state.pickUpWay && state.pickUpWay.stationPickUp.list.length > 0 ?
          state.pickUpWay.stationPickUp.list.map((it, i) => {
            return (
              <View
                className=''
              >
                {it.line}
                <View className='flex flex-wrap items-center'>
                  {it.stations.list.map((item, index) => {
                    return (
                      <View
                        className={' '.concat(
                          (choosenItem && choosenItem.place &&
                            (it.line == choosenItem.place.line) &&
                            (item.station == choosenItem.place.station)) ?
                            'mie_button mie_button_choosen' : 'mie_button')}
                        onClick={(choosenItem && choosenItem.place &&
                          (it.line == choosenItem.place.line) &&
                          (item.station == choosenItem.place.station)) ?
                          () => handleChoose(null) :
                          () => handleChoose('STATION_PICK_UP',
                            { line: it.line, station: item.station })
                        }
                      >
                        {item.station}
                      </View>
                    )
                  })}
                </View>
              </View>
            )
          }) :
          (props.styleType === 0 &&
            <View className='empty_word'>暂无可送货的车站</View>
          )
        }
        {
          state.pickUpWay && state.pickUpWay.place &&
          state.pickUpWay.place.station && state.pickUpWay.place.station.length > 0 &&
          <View className=''>
            <View className=''>备注:</View>
            <AtTextarea
              name='stationPickUp_des'
              placeholder='北口, 不出站'
              cursor={state.pickUpWay.place.des && state.pickUpWay.place.des.length}
              value={state.pickUpWay.place.des ? state.pickUpWay.place.des : ''}
              onChange={(v) => handleChange('STATION_PICK_UP_DES', v)}
            />
          </View>
        }
      </View > :
      <View className='station_pick_up'>
        {!(state.mode == 'SELLER_MODIFYING') || state.isAddingStationPickUp ||
          <View
            className='add_button'
            onClick={() => toggleDialog('STATION_PICK_UP')}
          >
            <View
              className='at-icon at-icon-add-circle'
            />
            {words.stationPickUp}
          </View>
        }
        {!(state.mode == 'SELLER_MODIFYING') &&
          <View className='des'>
            {state.pickUpWay && state.pickUpWay.stationPickUp.des}
          </View>
        }
        {(state.pickUpWay && state.pickUpWay.stationPickUp.list && state.pickUpWay.stationPickUp.list.length > 0) ?
          (state.pickUpWay.stationPickUp.list.map((it, i) => {
            return (
              <View
                // className='item'
                key={i}
              >
                {state.mode == 'SELLER_MODIFYING' ?
                  <StationsCard
                    item={it}
                    mode='LARGE'
                    handleModify={() => toggleDialog('STATION_PICK_UP', it, i)}
                    handleDelete={() => toggleDialog('DELETE', 'STATION_PICK_UP', i)}
                    hasActionButotns={true}
                  />
                  :
                  <StationsCard
                    item={it}
                    mode='LARGE'
                  />
                }
                {props.type === 'GOODS' &&
                  <View className='floor_price'> 满{it.floorPrice}¥ 送货 </View>
                }
              </View>
            )
          })) :
          (props.styleType === 0 &&
            <View className='empty_word'>
              {props.type === 'GOODS' ? '暂无可送货车站' : '暂无集合车站'}
            </View>)
        }

        {props.styleType === 0 &&
          state.mode == 'SELLER_MODIFYING' &&
          <View className='des'>
            <View className='title'> 备注：</View>
            <AtTextarea
              count={false}
              value={state.pickUpWay.stationPickUp.des}
              onChange={(v) => handleChange('STATION_PICK_UP_DES', v)}
              height={200}
              maxLength={300}
              placeholder={props.type === 'GOODS' ?
                '每天xx点从xx出发...' : '统一站内集合，不用出站。'}
            />
          </View>
        }
      </View >

  let expressDialog = (
    <ActionDialog
      className='new_item_dialog'
      isOpened={openedDialog === 'EXPRESS_PICK_UP'}
      closeOnClickOverlay={!(state.modifyingExpressPickUp.area && state.modifyingExpressPickUp.area.length > 0)}
      type={0}
      title='包邮'
      onClose={handleCancel.bind(this)}
      onCancel={handleCancel.bind(this)}
      onSubmit={handleSubmit.bind(this, 'EXPRESS_PICK_UP')}
      checkedItems={[
        {
          check: state.modifyingExpressPickUp.area.length > 0,
          toastText: '请输入包邮地区'
        },
      ]}
    >
      <View className='flex items-center'>
        <AtInput
          name={'ExpressPickUpArea'}
          type='text'
          cursor={state.modifyingExpressPickUp.area && state.modifyingExpressPickUp.area.length}
          value={state.modifyingExpressPickUp.area}
          onChange={v => handleChange('EXPRESS_PICKUP_AREA', v)}
        />
        <View className='word'>地区满</View>
      </View>
      <View className='flex items-center '>
        <AtInput
          name={'ExpressPickUpFloorPrice'}
          type='number'
          cursor={state.modifyingExpressPickUp.floorPrice && String(state.modifyingExpressPickUp.floorPrice).length}
          value={state.modifyingExpressPickUp.floorPrice}
          onChange={v => handleChange('EXPRESS_PICKUP_FLOOR_PRICE', v)}
        />
        <View className='word white_space'>¥ 包邮</View>
      </View>
    </ActionDialog>
  )

  let expressPickUpList = (
    <View className='express_pick_up'>
      {state.mode == 'SELLER_MODIFYING' && props.type === 'GOODS' &&
        <View
          className='toggle_button'
          onClick={() => handleChange('TROGGLE_EXPRESS_PICKUP_ISABLE')}
        >
          <View style={state.pickUpWay.expressPickUp.isAble ?
            '' : 'color:var(--gray-2)'}>可邮寄或送货(运费另算)</View>
          <View
            className='at-icon at-icon-stop'
            style={state.pickUpWay.expressPickUp.isAble ?
              '' : 'color:var(--gray-2)'}
          >
            {state.pickUpWay && state.pickUpWay.expressPickUp.isAble &&
              <View
                className='at-icon at-icon-check'
              />
            }
          </View>
        </View>
      }
      {
        state.pickUpWay && state.pickUpWay.expressPickUp.isAble ?
          <View
            className=''
            style={(props.styleType === 1 && state.mode === 'BUYER') ? 'display:flex;flex-wrap: wrap;' : ''}
          // style={(props.styleType === 1 && state.mode === 'BUYER') ?
          //   'border:5rpx var(--gray-3) solid; border-radius:10rpx; padding: 5rpx 12rpx; margin: 10rpx 0; width: fit-content;' : ''}
          // onClick={(props.styleType === 1 && state.mode === 'BUYER') ?
          //   () => handleChoose('EXPRESS_PICK_UP') : null
          // }
          >
            {!(state.mode === 'SELLER_MODIFYING') || state.isAddingExpressPickUp ||
              <View
                className='add_button'
                onClick={() => toggleDialog('EXPRESS_PICK_UP')}
              >
                <View
                  className='at-icon at-icon-add-circle'
                />
                包邮选项
              </View>
            }
            {props.styleType === 1 && state.mode === 'BUYER' &&
              <View
                className='toggle_button'
                style='position: relative;top:0;margin-right:15rpx;'
                onClick={() => {
                  // setIfShowExpressInfoContainer(!ifShowExpressInfoContainer);
                  (choosenItem && choosenItem.way === 'EXPRESS_PICK_UP') ?
                    handleChoose(null) : handleChoose('EXPRESS_PICK_UP')
                }}
              >
                <View
                  className=''
                  style='white-space: nowrap;font-size:37rpx;color:var(--gray-5);margin:5rpx 5rpx 0 0rpx;'>
                  邮寄
                </View>
                <View
                  className='at-icon at-icon-stop'
                  style={'color:var(--gray-5)'}
                >
                  {(choosenItem && choosenItem.way === 'EXPRESS_PICK_UP') &&
                    <View
                      className='at-icon at-icon-check'
                      style={'color:var(--gray-4)'}
                    />
                  }
                </View>
              </View>
            }
            <View className=''>
              {(state.pickUpWay.expressPickUp.list && state.pickUpWay.expressPickUp.list.length > 0) ?
                (state.pickUpWay.expressPickUp.list.map((it, i) => {
                  return (
                    <View
                      className={props.styleType === 0 ? 'item' : (
                        state.mode === 'BUYER' ?
                          '' : 'flex items-center justify-between'
                      )}
                      style={(props.styleType === 1 && state.mode === 'BUYER') ?
                        'color:var(--gray-2); line-height: 1.1em;font-size:30rpx;display:flex;align-items: center;margin-right:10rpx' : ''}
                      key={i}
                    >
                      <View className={props.styleType === 0 ? 'flex wrap' : ''}>
                        {it.area} 地区满 {it.floorPrice}包邮
                      </View>
                      {
                        state.mode === 'SELLER_MODIFYING' &&
                        <ActionButtons
                          type={0}
                          position={'RIGHT'}
                          onClickLeftButton={() => toggleDialog('EXPRESS_PICK_UP', it, i)}
                          onClickRightButton={() => toggleDialog('DELETE', 'EXPRESS_PICK_UP', i)}
                          leftWord='edit'
                          rightWord='trash'
                        />

                      }
                    </View>
                  )
                })) :
                (props.styleType === 0 &&
                  <View className='empty_word'> 暂无包邮选项</View>
                )
              }
            </View>
          </View> :
          (props.styleType === 0 &&
            <View className='empty_word'>不支持邮寄</View>
          )
      }
      {props.styleType === 0 &&
        state.pickUpWay && state.pickUpWay.expressPickUp.isAble &&
        state.mode === 'BUYER' &&
        <ExpressInfoContainer
          version={'BUYER'}
          styleType={props.styleType}
          choosenItem={choosenItem && choosenItem.place}
          handleClickItem={(v) => { handleChoose('EXPRESS_PICK_UP', v) }}
        />
      }
      {props.styleType === 1 &&
        state.pickUpWay && state.pickUpWay.expressPickUp.isAble &&
        state.mode === 'BUYER' &&
        choosenItem && choosenItem.way === 'EXPRESS_PICK_UP' &&
        <ExpressInfoContainer
          version={'BUYER'}
          styleType={props.styleType}
          choosenItem={choosenItem && choosenItem.place}
          handleClickItem={(v) => { handleChoose('EXPRESS_PICK_UP', v) }}
        />
      }
      {props.styleType === 0 &&
        state.mode === 'SELLER_MODIFYING' && state.isAddingExpressPickUp &&
        <View className='des'>
          <View className='title'>备注：</View>
          <AtTextarea
            name='EXPRESS_PICKUP_DES'
            height={200}
            maxLength={300}
            cursor={state.pickUpWay.expressPickUp.des && state.pickUpWay.expressPickUp.des.length}
            value={state.pickUpWay.expressPickUp.des}
            onChange={v => handleChange('EXPRESS_PICKUP_DES', v)}
          />
        </View>
      }
    </View>
  )

  let tabList = [
    { title: props.type === 'GOODS' ? '自提点' : '集合点' },
    { title: props.type === 'GOODS' ? '车站送货' : '集合车站' }
  ]
  props.type === 'GOODS' &&
    (tabList = tabList.concat({ title: '邮寄' }))
  return (
    <View className={'pick_up_way_container '.concat(props.className)}>
      {deleteDialog}
      {(!(props.styleType === 0) || state.currentSegment === 0) && selfPickUpDialog}{/*注：<input>输入一个就失焦的原因是因为外面包了太多层元素了！！拿出来就好了！！！！！ */}
      {(!(props.styleType === 0) || state.currentSegment === 1) && stationPickUpDialog}
      {(!(props.styleType === 0) || state.currentSegment === 2) && expressDialog}
      {props.styleType === 0 &&
        <View className={(state.mode === 'SELLER_MODIFYING') ?
          'mode_modifying' : (state.mode === 'SELLER_PREVIEW') ?
            'mode_priview mode_saved' : 'mode_priview'}>
          <TabPage
            className='pick_up_way_tab_page'
            tabList={tabList}
            currentTab={state.currentSegment}
            onClick={handleClickSegment.bind(this)}
          >
            {state.currentSegment === 0 &&//自提点
              <scroll-view
                scroll-y="true"
              >
                {selfPickUpList}
              </scroll-view>
            }
            {state.currentSegment === 1 &&//车站送货
              <scroll-view
                scroll-y="true"
              >
                {stationPickUpList}
              </scroll-view>
            }
            {state.currentSegment === 2 &&//邮寄
              <scroll-view
                scroll-y="true"
              >
                {expressPickUpList}
              </scroll-view>
            }
          </TabPage>
          {state.mode === 'SELLER_PREVIEW' &&
            <View className='background' />
          }
        </View>
      }
      {props.styleType === 0 &&
        !(state.mode === 'BUYER') &&
        <ActionButtons
          type={3}
          position={'RIGHT'}
          className='pick_up_way_container_action_button'
          onClickLeftButton={() => handleActionButtons('PREVIEW')}
          onClickRightButton={() => handleActionButtons('MODIFY')}
          leftWord='预览'
          rightWord='修改'
        />
      }
      {props.styleType === 1 &&
        <View className='style_1'>
          {selfPickUpList}
          {stationPickUpList}
          {expressPickUpList}
        </View>
      }
      {
        props.styleType === 2 &&
        <View className='style_1'>
          {selfPickUpList}
        </View>
      }
    </View >
  )
}
PickUpWayContainer.defaultProps = {
  mode: 'BUYER',
  type: 'GOODS',
  styleType: 0,
};
export default forwardRef(PickUpWayContainer);