import React, { Component, useState, useReducer, createContext, useContext, useEffect, useImperativeHandle, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Button, Input, Form } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtInput, AtTextarea, AtCalendar } from "taro-ui"
import * as actions from '../../../redux/actions'
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'

import CheckRequiredButton from '../../buttons/CheckRequiredButton/CheckRequiredButton'
import ActionDialog from '../../dialogs/ActionDialog/ActionDialog'
import LoginDialog from '../../dialogs/LoginDialog/LoginDialog'
import ActionButtons from '../../buttons/ActionButtons/ActionButtons'
import ShopProductCard from '../ShopProductCard/ShopProductCard'
import ExpressInfoContainer from '../../../containers/ExpressInfoContainer/ExpressInfoContainer'
import Dialog from '../../dialogs/Dialog/Dialog'

import './PurchaseCard.scss'

const databaseFunction = require('../../../public/databaseFunction');

const db = wx.cloud.database();
const _ = db.command;

/** 订单卡（用于确认下单时）
 * <PurchaseCard
    order={it}
    handleSubmit={(way, v) => handleSubmitPurchaseCard(way, v, i)}
/>
 */
const PurchaseCard = (props) => {
  const dispatch = useDispatch();
  const userManager = useSelector(state => state.userManager)
  const ordersManager = useSelector(state => state.ordersManager)
  const initState = {
    order: props.order,
    productList: [],
    shop: null,

    //用于change和init
    pickUpWay: {
      way: '',
      place: {},
      date: '',
      time: '',
      des: '',
    },
    paymentOption: {
      option: '',
      account: '', //卖家账户
      des: '',
    },

    //dialog-tabs
    currentPickUpWayTab: props.order.pickUpWay && props.order.pickUpWay.way.length > 0 ? props.order.pickUpWay.way : 'SELF_PICKUP',
    currentTrainLineTab: props.order.pickUpWay && props.order.pickUpWay.place.line ? props.order.pickUpWay.place.line : null,

    //toggle dialogs
    ifOpenLoginDialog: false,
    ifOpenDoPurchaseDialog: false,
    ifOpenWayAndPlaceDialog: false,
    ifOpenCalendar: false,
    ifOpenPaymentDialog: false,
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    if (!(props.shopId && props.shopId.length > 0)) { return }
    if (props.order) {
      dispatch(actions.toggleLoadingSpinner(true));
      wx.cloud.callFunction({
        name: 'get_data',
        data: {
          collection: 'shops',

          queryTerm: { _id: props.order.shopId },
        },
        success: async (res) => {
          if (res && res.result && res.result.data && res.result.data.length > 0) {
            let isOutOfStock = false;
            let productList = props.order.productList;
            console.log('productListproductList', productList);
            for (let item of productList) {//更新最新库存，再次检查是否有货 *unfinished 更新完后应该把order里的productList也更新了
              if (!(item.product.stock === null)) {
                let updatedStock = await getUpdatedStock(item);
                console.log('updatedStock-updatedStock', updatedStock);
                isOutOfStock = !(updatedStock === null) ? (item.quantity > updatedStock) : null;
                item.isOutOfStock = isOutOfStock;
                item.product.stock = updatedStock;
              }
            }
            setState({
              ...state,
              order: initState.order,
              shop: res.result.data[0],
              productList: productList,
            });
            dispatch(actions.toggleLoadingSpinner(false));
            dispatch(actions.toggleIsOutOfStock(isOutOfStock))
          } else {
            dispatch(actions.toggleLoadingSpinner(false));
          }
        },
        fail: () => {
          dispatch(actions.toggleLoadingSpinner(false));
          wx.showToast({
            title: '获取信息失败',
            icon: 'none'
          })
          console.error
        }
      });
      // db.collection('shops').where({
      //   _id: props.order.shopId
      // }).get().then(async (res) => {
      //   if (res.data) {
      // let isOutOfStock = false;
      // let productList = props.order.productList;
      // for (let item of productList) {//更新最新库存，再次检查是否有货
      //   let updatedStock = await getUpdatedStock(item);
      //   isOutOfStock = (item.quantity > updatedStock);
      //   item.isOutOfStock = isOutOfStock;
      //   item.product.stock = updatedStock;
      // }

      // setState({
      //   ...state,
      //   order: initState.order,
      //   shop: res.data[0],
      //   productList: productList,
      // });
      //   dispatch(actions.toggleLoadingSpinner(false));
      //   dispatch(actions.toggleIsOutOfStock(isOutOfStock))
      // }
      // })
    } else {
      setState({
        ...state,
        order: initState.order,
        shop: initState.shop,
        productList: initState.productList,
      });
    }
  }, [props.shopId]);

  useEffect(() => {
    if (!(props.order && props.order.productList && props.order.productList.length > 0)) { return }
    console.log('---2', props.order);
    setState({
      ...state,
      order: {
        ...props.order,
        pickUpWay: state.pickUpWay,//这里是为了不要改了商品数量后连提货方式也init掉
        paymentOption: state.paymentOption,
      },
      productList: props.order.productList
    });
  }, [props.order]);


  const getUpdatedStock = async (it) => {//返回最新库存
    const res = await wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'products',

        queryTerm: { _id: it.product._id },
      }
    });

    if (res && res.result && res.result.data && res.result.data.length > 0) {
      return (res.result.data[0].stock);
    }
  }

  //init
  const handleInit = (way = null) => {
    setState({
      ...state,
      pickUpWay: {
        ...state.pickUpWay,
        way: (way === 'WAY_AND_PLACE') ? initState.pickUpWay.way : state.pickUpWay.way,
        place: (way === 'WAY_AND_PLACE') ? initState.pickUpWay.place : state.pickUpWay.place,
        date: (way === 'DATE') ? initState.pickUpWay.date : state.pickUpWay.date,
      },
      paymentOption: (way === 'PAYMENT') ? initState.paymentOption : state.paymentOption,

      ifOpenLoginDialog: false,
      ifOpenDoPurchaseDialog: false,
      ifOpenWayAndPlaceDialog: false,
      ifOpenCalendar: false,
      ifOpenPaymentDialog: false,

    });
  }

  //toggle dialogs
  const toggleDialog = (way, ifOpen = null) => {
    switch (way) {
      case 'LOGIN':
        setState({
          ...state,
          ifOpenLoginDialog: (ifOpen === null) ? !state.ifOpenLoginDialog : ifOpen,
        });
        break;
      case 'DO_PURCHASE':
        setState({
          ...state,
          ifOpenDoPurchaseDialog: (ifOpen === null) ? !state.ifOpenDoPurchaseDialog : ifOpen,
        });
        break;
      case 'WAY_AND_PLACE':
        setState({
          ...state,
          ifOpenWayAndPlaceDialog: (ifOpen === null) ? !state.ifOpenWayAndPlaceDialog : ifOpen,
        });
        break;
      case 'DATE':
        setState({
          ...state,
          ifOpenCalendar: (ifOpen === null) ? !state.ifOpenCalendar : ifOpen,
        });
        break;
      case 'PAYMENT':
        setState({
          ...state,
          ifOpenPaymentDialog: (ifOpen === null) ? !state.ifOpenPaymentDialog : ifOpen,
        });
        break;
      case '':
        break;
      default:
        break;
    }
  }



  //
  const handleChange = (way, v = null, i = null) => {
    switch (way) {
      case 'PICK_UP_WAY_TAB'://tabs
        setState({
          ...state,
          currentPickUpWayTab: v,
        });
        break;
      case 'SELF_PICK_UP'://self pick up
        setState({
          ...state,
          pickUpWay:
            ((v.place == state.pickUpWay.place.place) && (v.placeDetail == state.pickUpWay.place.placeDetail)) ?
              initState.pickUpWay :
              {
                ...state.pickUpWay,
                way: 'SELF_PICK_UP',
                place: {
                  place: v.place,
                  placeDetail: v.placeDetail
                }
              },
        });
        break;
      case 'LINE_AND_STATION'://station pick up
        setState({
          ...state,
          pickUpWay:
            (v.station == state.pickUpWay.place.station) ?
              initState.pickUpWay :
              {
                ...state.pickUpWay,
                way: 'STATION_PICK_UP',
                place: {
                  line: v.line,
                  station: v.station,
                  des: state.pickUpWay.place.des,
                },
              }
        });
        break;
      case 'STATION_PICK_UP_DES':
        setState({
          ...state,
          pickUpWay: {
            ...state.pickUpWay,
            way: 'STATION_PICK_UP',
            place: {
              line: state.pickUpWay.place.line,
              station: state.pickUpWay.place.station,
              des: v,
            }
          }
        });
        break;
      case 'EXPRESS_PICK_UP'://express pick up
        console.log('EXPRESS_PICK_UP', v);
        setState({
          ...state,
          pickUpWay: (v == state.pickUpWay.place) ?
            initState.pickUpWay :
            {
              ...state.pickUpWay,
              way: 'EXPRESS_PICK_UP',
              place: v
            }
        });
        break;
      case 'DATE'://date
        setState({
          ...state,
          pickUpWay: {
            ...state.pickUpWay,
            date: v
          }
        });
        break;
      case 'PAYMENT_OPTION'://payment option
        setState({
          ...state,
          paymentOption:
            (v.option == state.paymentOption.option) ?
              initState.paymentOption :
              {
                ...state.paymentOption,
                option: v.option,
                account: v.account
              }
        });
        break;
      case 'PAYMENT_DES':
        setState({
          ...state,
          paymentOption:

          {
            ...state.paymentOption,
            des: v
          }
        });
        break;
      case 'DES'://
        setState({
          ...state,
          order: {
            ...state.order,
            des: v
          }
        });
        break;
      default:
        break;
    }
  }

  const handleSubmit = (way, v = null, i = null) => {
    switch (way) {
      case 'WAY_AND_PLACE':
        setState({
          ...state,
          order: {
            ...state.order,
            pickUpWay: state.pickUpWay,
          },
          ifOpenLoginDialog: false,
          ifOpenDoPurchaseDialog: false,
          ifOpenWayAndPlaceDialog: false,
          ifOpenCalendar: false,
          ifOpenPaymentDialog: false,
        });
        break;
      case 'DATE':
        setState({
          ...state,
          order: {
            ...state.order,
            pickUpWay: state.pickUpWay,
          },
          ifOpenLoginDialog: false,
          ifOpenDoPurchaseDialog: false,
          ifOpenWayAndPlaceDialog: false,
          ifOpenCalendar: false,
          ifOpenPaymentDialog: false,
        });
        break;
      case 'PAYMENT':
        setState({
          ...state,
          order: {
            ...state.order,
            paymentOption: state.paymentOption,
          },
          ifOpenLoginDialog: false,
          ifOpenDoPurchaseDialog: false,
          ifOpenWayAndPlaceDialog: false,
          ifOpenCalendar: false,
          ifOpenPaymentDialog: false,
        });
        break;
      case 'DO_PURCHASE':

        databaseFunction.doPurchase([state.order], userManager.unionid, userManager.userInfo.nickName);
        toggleDialog('DO_PURCHASE', false);
        dispatch(actions.initOrders());
        Taro.navigateTo({
          url: '/pages/BuyerPages/OrdersPage/OrdersPage',
        });
        break;
      default:
        break;
    }
  }

  let loginDialog =
    <LoginDialog
      words='请先登录'
      version={props.version}
      isOpened={state.ifOpenLoginDialog}
      onClose={() => handleInit()}
      onCancel={() => toggleDialog('LOGIN', false)}
    />;

  let doPurchaseDialog = (
    <ActionDialog
      isOpened={state.ifOpenDoPurchaseDialog}
      type={1}
      leftWord='取消'
      rightWord='下单'
      onClose={() => handleInit()}
      onCancel={() => handleInit()}
      onSubmit={() => handleSubmit('DO_PURCHASE')}
    >
      <View className=''>
        你确定真的要下单吗？？？？不会后悔吗？
        </View>
    </ActionDialog>
  );


  let pickUpWayDialogContent = null;
  switch (state.currentPickUpWayTab) {
    case 'SELF_PICKUP':
      pickUpWayDialogContent = state.shop && (
        <View className=''>
          <View className=''>
            {state.shop.pickUpWay.selfPickUp.des}
          </View>
          {state.shop.pickUpWay.selfPickUp.list.map((it, i) => {
            return (
              <View className='flex items-center'>
                <View
                  className={'item '.concat(((it.place == state.pickUpWay.place.place) && (it.placeDetail == state.pickUpWay.place.placeDetail)) ? 'mie_button mie_button_choosen' : 'mie_button')}
                  onClick={() => handleChange('SELF_PICK_UP', it)}
                >
                  {it.place}
                </View>
                <View className=''>
                  ({it.placeDetail})
                </View>
              </View>

            )
          })}
        </View>
      )
      break;
    case 'STATION_PICK_UP':
      pickUpWayDialogContent = state.shop && (
        <View className=''>
          <View className=''>
            {state.shop.pickUpWay.stationPickUp.des}
          </View>
          {state.shop.pickUpWay.stationPickUp.list.map((it, i) => {
            return (
              <View
                className=''
              //onClick={() => handleChange('STATION_PICK_UP_LINE', it.line)}
              >
                {it.line}
                <View className='flex flex-wrap items-center'>
                  {it.stations.list.map((item, index) => {
                    return (
                      <View
                        className={'item '.concat(((it.line == state.pickUpWay.place.line) && (item.station == state.pickUpWay.place.station)) ?
                          'mie_button mie_button_choosen' : 'mie_button')}
                        onClick={() => handleChange('LINE_AND_STATION', { line: it.line, station: item.station })}
                      >
                        {item.station}
                      </View>
                    )
                  })}
                </View>

              </View>
            )
          })}
          {state.pickUpWay.place.station && state.pickUpWay.place.station.length > 0 &&
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
        </View>
      )
      break;
    case 'EXPRESS_PICK_UP':
      pickUpWayDialogContent = state.shop && (
        <View className='pick_up_way_dialog_content'>
          {state.shop.pickUpWay.expressPickUp.isAble ?
            <View className=''>
              <View>
                {state.shop.pickUpWay.expressPickUp.list.map((item, index) => {
                  return (
                    <View>{item.area}地区满{item.floorPrice}包邮</View>
                  )
                })}
              </View>
              <View className=''>
                {state.shop.pickUpWay.stationPickUp.des}
              </View>
              <ExpressInfoContainer
                version={props.version}
                choosenItem={state.pickUpWay.place}
                handleClickItem={(v) => { handleChange('EXPRESS_PICK_UP', v) }}
              />
            </View>
            :
            <View className=''>
              <View>本店不支持邮寄</View>
            </View>
          }
        </View>
      )
      break;
    default:
      break;
  }

  let pickUpWayDialog = (
    <Dialog
      isOpened={state.ifOpenWayAndPlaceDialog}
      closeOnClickOverlay={false}
      onClose={() => toggleDialog('WAY_AND_PLACE', false)}
    >
      <View className='pick_up_way_dialog purchase_card_dialog'>
        <View className='pick_up_way_tab'>
          <View
            className={(state.currentPickUpWayTab === 'SELF_PICKUP') ?
              'mie_button mie_button_choosen' : 'mie_button'}
            onClick={() => handleChange('PICK_UP_WAY_TAB', 'SELF_PICKUP')}
          >自提点</View>
          <View className={(state.currentPickUpWayTab === 'STATION_PICK_UP') ?
            'mie_button mie_button_choosen' : 'mie_button'}
            onClick={() => handleChange('PICK_UP_WAY_TAB', 'STATION_PICK_UP')}
          >车站取货</View>
          <View className={(state.currentPickUpWayTab === 'EXPRESS_PICK_UP') ?
            'mie_button mie_button_choosen' : 'mie_button'}
            onClick={() => handleChange('PICK_UP_WAY_TAB', 'EXPRESS_PICK_UP')}
          >邮寄</View>
        </View>
        <scroll-view
          className='content'
          style='z-index:101;'
          scroll-y={true}
        >
          {pickUpWayDialogContent}
        </scroll-view>
        <ActionButtons
          type={0}
          style='z-index:100;'
          position={'MIDDLE'}
          onClickLeftButton={() => handleInit('WAY_AND_PLACE')}
          onClickRightButton={() => handleSubmit('WAY_AND_PLACE')}
        />
      </View>
    </Dialog>
  )

  let calendarDialog = (
    <Dialog
      isOpened={state.ifOpenCalendar}
      onClose={() => handleInit()}
    >
      <AtCalendar //*problem 套太多层时AtCalendar会报一堆套多一层非<text>元素的warning
        minDate={dayjs().format('YYYY-MM-DD')}
        currentDate={state.order.pickUpWay.date}
        onDayClick={(v) => handleChange('DATE', v.value)}
      />
      <ActionButtons
        type={0}
        position={'MIDDLE'}
        onClickLeftButton={() => handleInit()}//*problem 这里不handleInit('DATE')是因为AtCalendar的currentDate返回值不会更新
        onClickRightButton={() => handleSubmit('DATE')}
      />
    </Dialog >
  )

  let paymentDialog = (
    <Dialog
      isOpened={state.ifOpenPaymentDialog}
      closeOnClickOverlay={!(state.paymentOption.des && state.paymentOption.des.length > 0)}
      onClose={() => handleInit()}
    >
      <View className='purchase_card_dialog payment_dialog'>
        {state.shop && state.shop.shopInfo.paymentOptions.map((it, i) => {
          return (
            <View className='flex items-center'>
              <View
                className={'item '.concat((it.option == state.paymentOption.option) ?
                  'mie_button mie_button_choosen' : 'mie_button')}
                onClick={() => handleChange('PAYMENT_OPTION', it)}
              >
                {it.option}
              </View>
              {state.paymentOption && (it.option == state.paymentOption.option) &&
                (
                  <View className=''>
                    (卖家账户：{it.account})
                  </View>
                )}
            </View>
          )
        })}
        {
          state.paymentOption.option && state.paymentOption.option.length > 0 &&
          <AtInput
            name='payment_des'
            title='付款人信息'
            placeholder='付款账户名咩咩'
            cursor={state.paymentOption.des && state.paymentOption.des.length}
            value={state.paymentOption.des}
            onChange={(v) => handleChange('PAYMENT_DES', v)}
          />
        }
        <ActionButtons
          type={0}
          position={'MIDDLE'}
          onClickLeftButton={() => handleInit('PAYMENT')}
          onClickRightButton={() => handleSubmit('PAYMENT')}
        />

      </View>
    </Dialog >
  )

  let pickUpWay = null;
  switch (state.order.pickUpWay.way) {
    case 'SELF_PICK_UP':
      pickUpWay = (
        <View className='content'>
          <View>{state.order.pickUpWay.place.place} </View>
          {state.order.pickUpWay.place.placeDetail.length > 0 &&
            <View>{state.order.pickUpWay.place.placeDetail} </View>
          }
        </View>
      )
      break;
    case 'STATION_PICK_UP':
      pickUpWay = (
        <View className='content'>
          <View className='flex'>
            <View>{state.order.pickUpWay.place.station} </View>
            <View> ({state.order.pickUpWay.place.line})</View>
          </View>
          {
            state.order.pickUpWay.place.des && state.order.pickUpWay.place.des.length > 0 &&
            <View>(备注:{state.order.pickUpWay.place.des} )</View>
          }
        </View>
      )
      break;
    case 'EXPRESS_PICK_UP':
      pickUpWay = (
        <View className='content'>
          <View>收件人: {state.order.pickUpWay.place.name} </View>
          <View>联系电话: {state.order.pickUpWay.place.tel} </View>
          <View>地址: {state.order.pickUpWay.place.address} </View>
          {state.order.pickUpWay.place.des && state.order.pickUpWay.place.des.length > 0 &&
            <View>备注: {state.order.pickUpWay.place.des} </View>
          }
        </View>
      )
      break;
    default:
      break;
  }

  return (
    <View className='purchase_card'>
      {loginDialog}
      {doPurchaseDialog}
      {pickUpWayDialog}
      {calendarDialog}
      {paymentDialog}
      <View className='purchase_card_item shop_name'>摊名:{state.shop && state.shop.shopInfo.shopName}</View>
      <View className='purchase_card_item products'>
        {state.productList.map((it, i) => {
          return (
            <ShopProductCard
              key={i}
              product={it.product}
              isOutOfStock={it.isOutOfStock}
            />
          )
        })}
        <View className='totle_price'>总价：{state.order.totalPrice} JYP</View>
      </View>
      <View className='pick_up'>
        <View className='purchase_card_item flex'>
          <View className=''>
            <View className='title'>提货方式: </View>
          </View>
          <View className=''>
            <Button
              className='toggle_dialog_button'
              onClick={() => toggleDialog('WAY_AND_PLACE')}
            >
              {
                state.order.pickUpWay.way === 'SELF_PICK_UP' ?
                  '自提点' : (
                    state.order.pickUpWay.way === 'STATION_PICK_UP' ?
                      '车站取货' : (
                        state.order.pickUpWay.way === 'EXPRESS_PICK_UP' ?
                          '邮寄' : '选择'
                      )
                  )
              }
            </Button>
            {pickUpWay}
          </View>
        </View>


        <View className='purchase_card_item flex '>
          <View className='title'>选择提货日期: </View>
          {state.pickUpWay.way == 'EXPRESS_PICK_UP' ?
            <View className=''>邮寄暂不支持日期选择 </View> :
            <View className='flex '>
              <View className='date'>{state.order.pickUpWay.date} </View>
              <View
                className='at-icon at-icon-calendar'
                onClick={() => toggleDialog('DATE')}
              />
            </View>
          }
        </View>


        <View className='purchase_card_item'>
          <View className='flex'>
            <View className='title'>选择付款方式: </View>
            <View className=''>
              <Button
                className='toggle_dialog_button'
                onClick={() => toggleDialog('PAYMENT')}
              >
                {
                  (state.paymentOption.option && state.paymentOption.option.length > 0) ?
                    state.paymentOption.option : '选择'
                }
              </Button>
              <View className='content'>
                {
                  state.order.paymentOption.account && state.order.paymentOption.account.length > 0 &&
                  <View>(卖家账户: {state.order.paymentOption.account})</View>
                }
                {state.order.paymentOption.des && state.order.paymentOption.des.length > 0 &&
                  <View className='title'>付款备注: {state.order.paymentOption.des} </View>
                }
              </View>
            </View>
          </View>
        </View>
        <View className=''>备注</View>
        <AtTextarea
          className='purchase_card_item'
          name='order_des'
          placeholder='其他备注'
          cursor={state.order.des && state.order.des.length}
          value={state.order.des}
          onChange={(v) => handleChange('DES', v)}
        />
      </View>

      <CheckRequiredButton
        checkedItems={[
          {
            check: !ordersManager.isOutOfStock,
            toastText: '库存不足'
          },
          {
            check: state.order.pickUpWay.way.length > 0,
            toastText: '请选择取货方式'
          },
          {
            check: (state.order.pickUpWay.way === 'EXPRESS_PICK_UP') ||
              (state.order.pickUpWay.date.length > 0),
            toastText: '请选择取货日期'
          },
          {
            check: state.order.paymentOption.option.length > 0,
            toastText: '请选择支付方式'
          },
        ]}
        doAction={(userManager.unionid && userManager.unionid.length > 0) ?//如果没登录就打开登录窗，否则继续下单
          () => toggleDialog('DO_PURCHASE', true) : () => toggleDialog('LOGIN', true)
        }
      >下单</CheckRequiredButton>
    </View>
  )
}



export default PurchaseCard;
