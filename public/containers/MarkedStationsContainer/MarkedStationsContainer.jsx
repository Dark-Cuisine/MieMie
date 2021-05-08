import React, { Component, useState, useReducer, useImperativeHandle, forwardRef, useEffect, useRef } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtModal } from 'taro-ui'
import * as actions from '../../../public/redux/actions'

import LoginDialog from '../../components/dialogs/LoginDialog/LoginDialog'
import ActionButtons from '../../components/buttons/ActionButtons/ActionButtons'
import ActionDialog from '../../components/dialogs/ActionDialog/ActionDialog'
import StationsCard from '../../components/cards/StationsCard/StationsCard'
import TrainStationSetter from '../../components/TrainStationSetter/TrainStationSetter'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'

import './MarkedStationsContainer.scss'

const db = wx.cloud.database();
const _ = db.command

/****
 * < MarkedStationsContainer
handleClickItem = {(it) => handleClickMarkedStations(it)}   //可选。点击其中一个item的操作
 ifShowActionButtons={false}
 ref={markedStationsContainerRef}
/>
 */

const MarkedStationsContainer = (props, ref) => {
  const dispatch = useDispatch();
  const userManager = useSelector(state => state.userManager);
  const initState = {
    markedStations: [],//{line:'',stations:{list:[],from:'',to:''}}

    currentItem: props.currentItem ? props.currentItem :
      { line: '', stations: { list: [], from: '', to: '' } },
    currentIndex: null,

    openedDialog: null,//'LOGIN','DELETE','INPUT','ACTION_BUTTON'

    ifShowActionButtons: (props.ifShowActionButtons === false) ? false : true,
    mode: props.mode ? props.mode : 'LARGE',//'LARGE' ,'MINI' 
  }
  const [state, setState] = useState(initState);
  const [loadingWord, setLoadingWord] = useState(null);

  const TrainStationSetterRef = useRef();

  useEffect(() => {
    setState({
      ...state,
      currentItem: initState.currentItem,
    });
  }, [props.currentItem])

  useEffect(() => {
    doUpdate()
  }, [userManager])
  useImperativeHandle(ref, () => ({
    handleSave: () => {
      handleSubmit('CHANGE_ITEM', state.currentItem)
    },
  }));
  usePullDownRefresh(() => {
    // console.log('ui-4');
    doUpdate()
    Taro.stopPullDownRefresh()
  })
  const doUpdate = () => {
    setLoadingWord('加载中...')
    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'users',

        queryTerm: { unionid: userManager.unionid },
      },
      success: (r) => {
        setLoadingWord(null)
        if (r && r.result && r.result.data && r.result.data.length > 0) {
          setState({
            ...state,
            markedStations: (r.result.data[0].markedStations) ?
              r.result.data[0].markedStations : []
          });
        }
      },
      fail: () => {
        setLoadingWord(null)
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        console.error
      }
    });
  }
  const toggleDialog = (openedDialog = null, i = null, e = null) => {
    e && e.stopPropagation();//点击action buttons时不算点击该item
    setState({
      ...state,
      openedDialog: openedDialog,
      currentItem: (i === null) ? initState.currentItem : state.markedStations[i],
      currentIndex: i,
    });

  }

  const handelChange = (way, v = null, i = null) => {
    switch (way) {
      case 'STATION':
        TrainStationSetterRef.current && TrainStationSetterRef.current.handleSubmit();
        break;
      case '':
        break;
      default:
        break;
    }
  }
  const handleCancel = () => {
    TrainStationSetterRef.current && TrainStationSetterRef.current.handleCancel();
    setState({
      ...state,
      currentItem: initState.currentItem,
      currentIndex: initState.currentIndex,

      openedDialog: null,
    });
  }
  const handleSubmit = (way, v = null) => {
    let updated = state.markedStations;
     let updateStations = []
    v.stations.list &&
      v.stations.list.forEach(it => {
        updateStations.push({ station: it, announcements: [] })
      });
    switch (way) {
      case 'CHANGE_ITEM':
        if (state.currentIndex === null) {
          updated.push({
            ...v,
            stations: {
              ...v.stations,
              list: updateStations,
            }
          })
        } else {
          updated.splice(state.currentIndex, 1, v);
        }
        props.handleClickItem && (props.handleClickItem(v));//把新增or刚修改的设为被选中的
        break;
      case 'DELETE':
        updated.splice(state.currentIndex, 1);
        break;
      default:
        break;
    }

    wx.cloud.callFunction({ //保存
      name: 'update_data',
      data: {
        collection: 'users',
        queryTerm: { unionid: userManager.unionid },
        updateData: { markedStations: updated }
      },
      success: (res) => {
      },
      fail: () => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        console.error
      }
    });

    setState({
      ...state,
      markedStations: updated,
      currentItem: initState.currentItem,
      currentIndex: null,
      openedDialog: null,
    });
  }

  const handleClickItem = (it) => {
    if (props.handleClickItem) {
      if (it == state.currentItem) {
        props.handleClickItem({ line: '', stations: { list: [], from: '', to: '' } })
      } else {
        props.handleClickItem(it)
      }
    }
  }


  let deleteDialog = (
    <ActionDialog
      type={1}
      isOpened={state.openedDialog === 'DELETE'}
      onClose={() => toggleDialog()}
      onCancel={() => toggleDialog()}
      onSubmit={() => handleSubmit('DELETE')}
      cancelText='取消'
      confirmText='确认'
      textCenter={true}
    >确定删除？</ActionDialog>
  );

  let inputDialog = (
    <ActionDialog
      type={0}
      className='input_dialog'
      title='选择车站'
      isOpened={state.openedDialog === 'INPUT'}
      closeOnClickOverlay={false}
      onClose={() => handleCancel()}
      onCancel={() => handleCancel()}
      onSubmit={() => handelChange('STATION')}
    >
      <TrainStationSetter
        type={3}
        ref={TrainStationSetterRef}
        name='markedStationsContainerInput'
        handleSubmit={(newItem) => handleSubmit('CHANGE_ITEM', newItem)}
        modifyingItem={state.currentItem}
        hasActionButtons={false}
        maxItem={30}
        maxHeight={500}
      />
    </ActionDialog>
  )
  // console.log('state.markedStations', state.markedStations, 'state.currentItem', state.currentItem);
  return (
    <View className={'marked_stations_container '.concat(
      'marked_stations_container_'.concat(
        state.mode == 'LARGE' ? 'mode_large' : 'mode_mini'
      )
    )}>
      {deleteDialog}
      {inputDialog}
      <LoginDialog
        words='请先登录'
        version={props.version}
        isOpened={state.openedDialog === 'LOGIN'}
        onClose={() => handleCancel()}
        onCancel={() => handleCancel()}
        onSubmit={() => handleCancel()}
      />
      {state.ifShowActionButtons &&
        <View className='add_new_button'>
          <View
            className='at-icon at-icon-add-circle'
            onClick={(userManager.unionid && userManager.unionid.length > 0) ?
              () => toggleDialog('INPUT') : () => toggleDialog('LOGIN')}
          >
            <View className='word'>添加车站</View>
          </View>
        </View>
      }
      {
        loadingWord ? (
          state.mode == 'LARGE' ?
            <LoadingSpinner /> :
            <View className='grey_word'><View className=''>{loadingWord}</View></View>
        ) :
          ((state.markedStations && state.markedStations.length > 0) ?
            state.markedStations.map((it, i) => {
              return (
                <>
                  <View
                    className={'item '.concat((it == state.currentItem) ? 'item_choosen' : '')}
                    onClick={() => handleClickItem(it)}
                  >
                    <StationsCard
                      item={it}
                      hasActionButotns={state.ifShowActionButtons}
                      handleModify={(e) => toggleDialog('INPUT', i, e)}
                      handleDelete={(e) => toggleDialog('DELETE', i, e)}
                      mode={state.ifShowActionButtons ? 'LARGE' : 'MINI'}
                    />
                  </View>
                  {state.mode == 'LARGE' &&
                    <View className='line_horizontal' />
                  }
                </>
              )

            }) :
            <View className='grey_word'><View className=''>暂无保存的车站</View></View>
          )
      }
    </View>
  )
}

export default forwardRef(MarkedStationsContainer);