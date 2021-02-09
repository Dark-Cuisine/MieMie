import React, { Component, useState, useReducer, useEffect, useRef } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtTextarea } from 'taro-ui'
import * as actions from '../../../redux/actions'
import dayjs from 'dayjs'

import TabPage from '../../../components/formats/TabPage/TabPage'
import ActionDialog from '../../../components/dialogs/ActionDialog/ActionDialog'
import Dialog from '../../../components/dialogs/Dialog/Dialog'
import Layout from '../../../components/Layout/Layout'
import DatePicker from '../../../components/DatePicker/DatePicker'
import OrderCard from '../../../components/cards/OrderCard/OrderCard'
import OrderAccordion from './OrderAccordion/OrderAccordion'

import './DeliveryPage.scss'

const databaseFunction = require('../../../public/databaseFunction');
const db = wx.cloud.database();
const _ = db.command


//*unfinished 发了新公告后不会刷新
//*unfinished 已被店家删除(但还有订单但)的自提点的公告还不能显示
const DeliveryPage = (props) => {
  const dispatch = useDispatch();
  const userManager = useSelector(state => state.userManager);
  const layoutManager = useSelector(state => state.layoutManager);
  const ymd = dayjs().format('YYYY-MM-DD');
  const app = getApp()
  const initState = {
    markedDates: [{ value: ymd }, { value: '1999-01-03' }],

    selfPickUp: [],//{place:'',orders:[],announcements: '' }
    stationPickUp: [],//{line:'',stations:[{station:'',orders:[],announcements: ''}]}
    expressPickUp: [],//{}

    oldPlace: { //这里是为了应对提交订单后店家修改了地点的那些订单
      selfPickUp: [],
      stationPickUp: [],
    },

    cuurentTab: 0,
    currentDate: ymd,

    ifAnnounceDialogOpen: false,
    announceType: null,//'SELF_PICK_UP','STATION_PICK_UP_LINE','STATION_PICK_UP_STATION','EXPRESS_PICK_UP'
    announcePlace: null,
    //announcingIndex: null,
    announcingOrders: [],
    announceInput: '',

  }
  const initState_2 = {
    openedDialog: null,//'FINISH_ORDER'
    currentItem: null,
  }
  const [state, setState] = useState(initState);
  const [state_2, setState_2] = useState(initState_2);

  // useEffect(() => {
  //   if (!(layoutManager.currentTabId == app.$app.globalData.classifications.tabBar.tabBarList_seller[2].id)) { return }
  //   doUpdate()
  // }, [userManager.unionid, layoutManager.currentTabId])
  useEffect(() => {
    doUpdate()
  }, [userManager.unionid])

  usePullDownRefresh(() => {
    console.log('usePullDownRefresh');
    doUpdate()
    Taro.stopPullDownRefresh()
  })
  const doUpdate = () => {
    dispatch(actions.toggleLoadingSpinner(true));
    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'shops',

        queryTerm: { shopInfo: { ownerId: userManager.unionid } },
      },
      success: (res) => {
        console.log('get-shop');
        if (!(res && res.result && res.result.data && res.result.data.length > 0)) { return }
        let myShops = res.result.data;
        let selfPickUp = [];
        let stationPickUp = [];
        let expressPickUp = [];
        let oldPlace = { selfPickUp: [], stationPickUp: [], }
        let updatedMarkedDates = [];
        let myOrders = []
        myShops && myShops.forEach((shop, i) => {
          myOrders.concat(shop.orders)
          shop.pickUpWay.selfPickUp.list &&
            shop.pickUpWay.selfPickUp.list.forEach((itt) => {
              selfPickUp.findIndex((it) => {
                return ((it.place == itt.place) && (it.placeDetail == itt.placeDetail))//合并多个店铺的同一自提点
              }) < 0 &&
                selfPickUp.push({//如还没有则加进去
                  place: { place: itt.place, placeDetail: itt.placeDetail },
                  orders: [],
                  announcements: itt.announcements
                })
            })
          shop.pickUpWay.stationPickUp.list &&
            shop.pickUpWay.stationPickUp.list.forEach((itt) => {
              //*problem 不知为何这样写会报错
              // let stationList = itt.stations.list.map(station => { 
              //   return ({
              //     station: station.station,
              //     orders: [],
              //     announcements: station.announcements
              //   })
              // })
              let stationList = [];
              itt.stations.list &&
                itt.stations.list.forEach((station) => {
                  stationList.push({
                    station: station.station,
                    orders: [],
                    announcements: station.announcements
                  })
                });

              let lineIndex = stationPickUp.findIndex((it) => {
                return (it.line == itt.line)
              });
              (lineIndex > -1) ?
                stationPickUp[lineIndex].stations.push(...stationList) :
                stationPickUp.push({ line: itt.line, stations: stationList });
            })
        })

        dispatch(actions.toggleLoadingSpinner(true));//这里不开的话好像经常会被getuserinfo关掉
        wx.cloud.callFunction({
          name: 'get_data',
          data: {
            collection: 'orders',
            orderBy: 'createTime',//根据时间排序
            desc: 'asc',//新后旧前
            operatedItem: '_ID_AND_STATUS',
            queriedList: myOrders,
            queryTerm: {
              status: 'ACCEPTED' //只放入ACCEPTED的订单
            },
          },
          success: (r) => {
            console.log('get-orders');
            if (!(r && r.result && r.result.data)) { return }
            r.result.data.forEach((order) => {
              state.markedDates.findIndex((date) => {//如markedDates里还没该日期，则加入
                return (order.pickUpWay.date == date.value)
              }) < 0 &&
                updatedMarkedDates.push({ value: order.pickUpWay.date });

              let itemIndex = null;
              switch (order.pickUpWay.way) {//这里又循环一次是为了店家改了自提点后不丢失选了旧自提点的订单
                case 'SELF_PICK_UP':
                  itemIndex = selfPickUp.findIndex((anItem) => {
                    return ((order.pickUpWay.place.place == anItem.place.place) &&
                      (order.pickUpWay.place.placeDetail == anItem.place.placeDetail))//*这里不能直接item.pickUpWay.place == anItem.place，因为对象间的对比就算两个是一样的会返回false
                  });
                  itemIndex < 0 ?
                    oldPlace.selfPickUp.push({
                      place: {
                        place: order.pickUpWay.place.place,
                        placeDetail: order.pickUpWay.place.placeDetail
                      },
                      orders: [order],
                    }) :
                    selfPickUp[itemIndex].orders.push(order);


                  break;
                case 'STATION_PICK_UP':
                  itemIndex = stationPickUp.findIndex((anItem) => {//查找是否添加过此线
                    return (order.pickUpWay.place.line == anItem.line)
                  });
                  let i_0 = itemIndex > -1 ?//查找是否添加过此线此站
                    stationPickUp[itemIndex].stations.findIndex(it => {
                      return (it.station == order.pickUpWay.place.station)
                    }) : -1;
                   if (itemIndex > -1 && i_0 > -1) {//如有同线同站，放进去
                    stationPickUp[itemIndex].stations[i_0].orders.push(order);
                  } else {//如无，放入oldPlace
                    let i_1 = oldPlace.stationPickUp.findIndex(it => {//查找oldPlace是否添加过这条线
                      return (order.pickUpWay.place.line == it.line)
                    })
                    if (i_1 < 0) {//oldPlace无此线，则加此线此站此order
                      oldPlace.stationPickUp.push({
                        line: order.pickUpWay.place.line,
                        stations: [{
                          station: order.pickUpWay.place.station,
                          orders: [order],
                          announcements: [],
                        }],
                      });
                    } else {//oldPlace有此线，找是否有此站
                      let i_2 = oldPlace.stationPickUp[i_1].stations.findIndex(itt => {
                        return (order.pickUpWay.place.station == itt.station)
                      })
                      i_2 < 0 ?
                        oldPlace.stationPickUp[i_1].stations.push({//无此站，则加此站此order
                          station: order.pickUpWay.place.station,
                          orders: [order],
                          announcements: [],
                        }) ://有此站，则加此order
                        oldPlace.stationPickUp[i_1].stations[i_2].orders.push(order)
                    }
                  }
                  break;
                case 'EXPRESS_PICK_UP':
                  expressPickUp.push(order);
                  break;
                default:
                  break;
              }
            })
            // console.log('res', res, 'r', r,
            //   'selfPickUp', selfPickUp, 'stationPickUp', stationPickUp,
            //   'oldPlace,', oldPlace,'updatedMarkedDates', updatedMarkedDates);
            setState({
              ...state,
              selfPickUp: selfPickUp,
              stationPickUp: stationPickUp,
              expressPickUp: expressPickUp,
              oldPlace: oldPlace,
              markedDates: [...initState.markedDates, ...updatedMarkedDates],
            });
            dispatch(actions.toggleLoadingSpinner(false));
          },
          fail: () => {
            wx.showToast({
              title: '获取orders数据失败',
            })
            console.error
          }
        });
        dispatch(actions.toggleLoadingSpinner(false));
      },
      fail: () => {
        wx.showToast({
          title: '获取shops数据失败',
          icon: 'none'
        })
        console.error
        dispatch(actions.toggleLoadingSpinner(false));
      }

    });


  }
  const filterOrdersByDate = (orders) => {
    let returnOrders = [];
    orders && orders.forEach((it) => {
      (it.pickUpWay.date == state.currentDate) && returnOrders.push(it)
    })
    return returnOrders;
  }
  const filterAnnouncements = (annos, date = state.currentDate) => {
    let returnV = [];
    annos && annos.forEach((it) => {
      if (it.date == date) {
        returnV = it.list;
      }
    })
    //console.log('filterAnnouncements',returnV);
    return returnV;
  }

  const handleClickTab = (v) => {
    setState({
      ...state,
      cuurentTab: v
    });
  }

  const handleClickDate = (date) => {
    setState({
      ...state,
      currentDate: date
    });
  }

  //handle announce
  const handleAnnounceDialog = async (way) => {
    console.log('handleAnnounceDialog');
    switch (way) {
      case 'TROGGLE':
        setState({
          ...state,
          ifAnnounceDialogOpen: !state.ifAnnounceDialogOpen,
        });
        break;
      case 'CANCEL':
        setState({
          ...state,
          ifAnnounceDialogOpen: !state.ifAnnounceDialogOpen,
          announcePlace: null,
          announceType: initState.announceType,
          //announcingIndex: initState.announcingIndex,
          announcingOrders: initState.announcingOrders,
          announceInput: initState.announceInput,
        });
        break;
      case 'SUBMIT':
        await sendAnnounce();

        setState({
          ...state,
          ifAnnounceDialogOpen: !state.ifAnnounceDialogOpen,
          announceType: initState.announceType,
          announcePlace: null,
          //announcingIndex: initState.announcingIndex,
          announcingOrders: initState.announcingOrders,
          announceInput: initState.announceInput,
        });
        break;
      default:
        break;
    }
  }

  const handleAnnounce = (way, i = null, i_2 = null, announcePlace = null) => {
    console.log('handleAnnounce-announcePlace', announcePlace);
    let orders = [];
    switch (way) {
      case 'SELF_PICK_UP':
        setState({
          ...state,
          ifAnnounceDialogOpen: true,
          announceType: 'SELF_PICK_UP',
          announcePlace: announcePlace,
          //announcingIndex: i,
          announcingOrders: filterOrdersByDate(state.selfPickUp[i].orders).slice(0),
        });
        break;
      case 'SELF_PICK_UP_OLD':
        setState({
          ...state,
          ifAnnounceDialogOpen: true,
          announceType: 'SELF_PICK_UP',
          announcePlace: announcePlace,
          //announcingIndex: i,
          announcingOrders: filterOrdersByDate(state.oldPlace.selfPickUp[i].orders).slice(0),
        });
        break;
      case 'STATION_PICK_UP_LINE':
        state.stationPickUp[i].stations &&
          state.stationPickUp[i].stations.forEach((station) => {
            filterOrdersByDate(station.orders).length > 0 &&
              orders.push(...filterOrdersByDate(station.orders))
          })
        setState({
          ...state,
          ifAnnounceDialogOpen: true,
          announceType: 'STATION_PICK_UP_LINE',
          announcePlace: announcePlace,
          // announcingIndex: i,
          announcingOrders: orders,
        });
        break;
      case 'STATION_PICK_UP_LINE_OLD'://*unfinished 要简化，而且现在旧自提点的公告加不到店铺上
        state.oldPlace.stationPickUp[i].stations &&
          state.oldPlace.stationPickUp[i].stations.forEach((station) => {
            filterOrdersByDate(station.orders).length > 0 &&
              orders.push(...filterOrdersByDate(station.orders))
          })
        setState({
          ...state,
          ifAnnounceDialogOpen: true,
          announceType: 'STATION_PICK_UP_LINE',
          announcePlace: announcePlace,
          // announcingIndex: i,
          announcingOrders: orders,
        });
        break;
      case 'STATION_PICK_UP_STATION':
        setState({
          ...state,
          ifAnnounceDialogOpen: true,
          announceType: 'STATION_PICK_UP_STATION',
          announcePlace: announcePlace,
          //  announcingIndex: [i, i_2],
          announcingOrders: filterOrdersByDate(state.stationPickUp[i].stations[i_2].orders).slice(0),
        });
        break;
      case 'STATION_PICK_UP_STATION_OLD':
        setState({
          ...state,
          ifAnnounceDialogOpen: true,
          announceType: 'STATION_PICK_UP_STATION',
          announcePlace: announcePlace,
          //  announcingIndex: [i, i_2],
          announcingOrders: filterOrdersByDate(state.oldPlace.stationPickUp[i].stations[i_2].orders).slice(0),
        });
        break;
      case 'EXPRESS_PICK_UP':
        setState({
          ...state,
          ifAnnounceDialogOpen: true,
          announceType: 'EXPRESS_PICK_UP',
          announcePlace: announcePlace,
          //announcingIndex: i,
          announcingOrders: [state.expressPickUp[i]],
        });
        break;
      case '':
        break;
      default:
        break;
    }
  }
  const handleChangeAnnounceInput = (v) => {
    setState({
      ...state,
      announceInput: v
    });
  }
  const sendAnnounce = async () => {
    if (!(state.announcingOrders && state.announcingOrders.length > 0)) { return }
    // console.log('state.announcingOrders', state.announcingOrders);
    let currentShopId = null;
    let currentStation = null;
    state.announcingOrders.forEach((order) => {
      if (state.announceType === 'EXPRESS_PICK_UP') {
        databaseFunction.addAnnoToOrder(order, state.announceInput);//只有邮寄才把公告直接加到订单上
      } else if (state.announceType == 'STATION_PICK_UP_LINE') {
        console.log('11', order.pickUpWay.place.station);
        if (!(currentStation == order.pickUpWay.place.station) ||
          !(currentShopId == order.shopId)) {//*unfinished 同下，这里应该改进
          console.log('22', order.pickUpWay.place.station);
          currentShopId = order.shopId;
          currentStation = order.pickUpWay.place.station;
          databaseFunction.addOrderAnnoToShop(currentShopId, state.announceInput,
            order.pickUpWay.way, order.pickUpWay.place, order.pickUpWay.date);
        }
      } else {
        if (!(currentShopId == order.shopId)) {//因为订单可能分属不同店铺所以必须分别加到所有店铺里
          currentShopId = order.shopId;//*unfinished 这里应该改进，不然如果order不是以shopid排序就会重复addOrderAnnoToShop
          databaseFunction.addOrderAnnoToShop(currentShopId, state.announceInput,
            order.pickUpWay.way, order.pickUpWay.place, order.pickUpWay.date);
        }
      }

      let content = '您的订单' + order._id + '有新公告: ' + state.announceInput;
      let msg = {
        from: {
          unionid: userManager.unionid,
          nickName: userManager.userInfo.nickName,
        },
        to: {
          unionid: order.buyerId,
        },
        type: 'ORDER_ANNOUNCEMENT',
        title: '订单公告',
        content: content,
      };
      console.log('发公告：', { msg });
      databaseFunction.sendMessage(msg, userManager.unionid);
      return
    })
  }

  const handleInit = () => {
    setState_2({
      ...state_2,
      openedDialog: null,
      currentItem: null,
    });
  }
  const handleBeforeSubmit = (way, item = null) => {
    switch (way) {
      case 'FINISH_ORDER':
        setState_2({
          ...state_2,
          openedDialog: 'FINISH_ORDER',
          currentItem: item,
        });
        break;
      case '':
        break;
      default:
        break;
    }
  }
  const handleSubmit = async (way) => {

    let c1 = new wx.cloud.Cloud({//*不知为何云函数update不了
      resourceAppid: 'wx8d82d7c90a0b3eda',
      resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
    })

    await c1.init({
      secretId: 'AKIDwiHc09xCF3cwDFrESWOHxNZXLCfvRL2W',
      secretKey: 'XZfka5K83yeKnAcBCShS4SgS3cBXfXBs',
      env: 'miemie-buyer-7gemmgzh05a6c577'
    })
    let db_1 = c1.database({
      env: 'miemie-buyer-7gemmgzh05a6c577'
    });
    switch (way) {
      case 'FINISH_ORDER':
        let order = state_2.currentItem;
        handleInit()

        db_1.collection('orders').where({
          _id: order._id
        }).update({
          data: {
            status: 'FINISHED'
          },
          success: (res) => {
            doUpdate()
          },
          fail: () => {
            console.error
          }

        });


        let title = '摊主已完成订单';
        let content = '您的订单' + order._id + '已被摊主完成。';
        let msg = {
          from: {
            unionid: userManager.unionid,
            nickName: userManager.userInfo.nickName,
          },
          to: {
            unionid: order.buyerId,
          },
          type: 'ORDER_FINISHED',
          title: title,
          content: content,
        }
        databaseFunction.sendMessage(msg, userManager.unionid);


        break;
      case '':
        break;
      default:
        break;
    }
  }


  let finishOrderDialog = (
    <ActionDialog
      isOpened={state_2.openedDialog === 'FINISH_ORDER'}
      onClose={() => handleInit()}
      onCancel={() => handleInit()}
      onSubmit={() => handleSubmit('FINISH_ORDER')}
    >
      <View>点击完成后，该单在买家处也会标记为已完成，请确保交易已结束。你确定要现在完成该订单?</View>
    </ActionDialog>
  )

  let announcePlace = '';
  switch (state.announceType) {
    case 'SELF_PICK_UP':
      announcePlace = state.announcePlace.place +
        (state.announcePlace.placeDetail.length > 0 ? (
          '(' + state.announcePlace.placeDetail + ')'
        ) : '')
      break;
    case 'STATION_PICK_UP_LINE':
      announcePlace = state.announcePlace.line
      break;
    case 'STATION_PICK_UP_STATION':
      announcePlace = state.announcePlace.station
      break;
    case 'EXPRESS_PICK_UP':
      announcePlace = state.announcePlace.id
      break;
    default:
      break;
  }
  let announceDialog = (
    <ActionDialog
      type={1}
      title='公告'
      isOpened={state.ifAnnounceDialogOpen}
      closeOnClickOverlay={!(state.announceInput && state.announceInput.length > 0)}
      cancelText='取消'
      confirmText='确定发送'
      onClose={() => handleAnnounceDialog('TROGGLE')}//这里不能用'CANCEL'不然在sendAnnounce时announcingOrders就被init掉了
      onCancel={() => handleAnnounceDialog('CANCEL')}
      onSubmit={() => handleAnnounceDialog('SUBMIT')}
    >
      {
        ((state.announceType == 'SELF_PICK_UP') ||
          (state.announceType == 'STATION_PICK_UP_LINE') ||
          (state.announceType == 'STATION_PICK_UP_STATION')) &&
        <View className=''>
          <View className='break_all'>给{announcePlace}的订单发公告：</View>
          <AtTextarea
            name='announce'
            type='text'
            height={200}
            maxLength={300}
            placeholder={(state.announceType == 'SELF_PICK_UP') ? '预计13:00送到' :
              ((state.announceType == 'STATION_PICK_UP_LINE') ? '13:00点从xx站出发' :
                '预计13:00送到北口')
            }
            value={state.announceInput}
            onChange={handleChangeAnnounceInput.bind(this)}
          />
        </View>
      }
      {
        state.announceType == 'EXPRESS_PICK_UP' &&
        <View className=''>
          <View className='break_all'>给订单号{announcePlace}发公告：</View>
          <AtTextarea
            name='announce_2'
            type='text'
            height={200}
            maxLength={300}
            placeholder='已发货, 快递单号为...'
            value={state.announceInput}
            onChange={handleChangeAnnounceInput.bind(this)}
          />
        </View>
      }
    </ActionDialog>
  )

  // console.log('se', state);
  const tabList = [{ title: '自提点' }, { title: '车站送货' }, { title: '邮寄' }]
  return (
    <Layout
      version={props.version}
      className='delivery_page'
      mode='SELLER'
      navBarKind={3}
      navBarTitle='发货助手'
    >
      {finishOrderDialog}
      {announceDialog}
      <View className='delivery_page_header'>
        <DatePicker
          currentDate={state.currentDate}
          validDates={state.markedDates}
          handleClickDate={(date) => handleClickDate(date)}
        />
      </View>
      <TabPage
        currentTab={state.cuurentTab}
        tabList={tabList}
        onClick={i => handleClickTab(i)}
      >
        {
          state.cuurentTab === 0 &&
          state.selfPickUp.map((it, i) => {
            return (
              <OrderAccordion
                type={1}
                key={i}
                title={it.place.place +
                  (it.place.placeDetail && it.place.placeDetail.length > 0 ?
                    ('(' + it.place.placeDetail + ')') : '')}
                notEmpty={filterOrdersByDate(it.orders).length > 0}
                orderList={filterOrdersByDate(it.orders)}
              >
                {filterOrdersByDate(it.orders).length > 0 &&
                  <View
                    className='anno_button'
                    onClick={() => handleAnnounce('SELF_PICK_UP', i, null,
                      { place: it.place.place, placeDetail: it.place.placeDetail })}
                  >
                    <View className='at-icon at-icon-volume-minus' />
                    <View className=''>发公告</View>
                  </View>
                }
                {
                  filterAnnouncements(it.announcements).length > 0 &&
                  <View className='announcements'>

                    {filterAnnouncements(it.announcements).map((anno, i) => {
                      return (
                        <View
                          key={i}
                          className='announcement'
                        >
                          {anno}
                        </View>
                      )
                    })}
                  </View>
                }
              </OrderAccordion>
            )
          })
        }
        {
          state.cuurentTab === 0 &&
          state.oldPlace.selfPickUp.map((it, i) => {
            return (
              filterOrdersByDate(it.orders).length > 0 &&
              <View className=''>
                <View className='old_orders_word'>
                  <View className='line_horizontal' />
                  <View className='white_space'>以下是旧自提点的订单</View>
                  <View className='line_horizontal' />
                </View>
                <View style='font-size:30rpx;color:var(--gray-2);'>(测试版中，旧地点的公告成功发送后还无法在这里显示)</View>
                <OrderAccordion
                  type={1}
                  key={i}
                  title={it.place.place + '(' + it.place.placeDetail + ')'}
                  notEmpty={filterOrdersByDate(it.orders).length > 0}
                  orderList={filterOrdersByDate(it.orders)}
                >
                  {filterOrdersByDate(it.orders).length > 0 &&
                    <View
                      className='anno_button'
                      onClick={() => handleAnnounce('SELF_PICK_UP_OLD', i, null,
                        { place: it.place.place, placeDetail: it.place.placeDetail })}
                    >
                      <View className='at-icon at-icon-volume-minus' />
                      <View className=''>发公告</View>
                    </View>
                  }
                  {
                    filterAnnouncements(it.announcements).length > 0 &&
                    <View className='announcements'>
                      {filterAnnouncements(it.announcements).map((anno, i) => {
                        return (
                          <View
                            key={i}
                            className='announcement'
                          >
                            {anno}
                          </View>
                        )
                      })}
                    </View>
                  }
                </OrderAccordion>
              </View>
            )
          })
        }
        {state.cuurentTab === 1 &&
          state.stationPickUp.map((it, i) => {
            return (
              <OrderAccordion
                type={0}
                key={i}
                title={it.line}
                notEmpty={it.stations && it.stations.length > 0 &&
                  it.stations.findIndex((station) => {
                    return (filterOrdersByDate(station.orders).length > 0)
                  }) > -1}
              >
                {/* {it.stations && it.stations.length > 0 && it.stations.findIndex((station) => {//*problem 现在发整条线公告还有问题
                  return (filterOrdersByDate(station.orders).length > 0)
                }) > -1 &&
                  <View
                    className='at-icon at-icon-volume-minus'
                    onClick={() => handleAnnounce('STATION_PICK_UP_LINE', i, null, { line: it.line })}
                  />
                } */}
                {it.stations.map((item, index) => {
                  return (
                    <OrderAccordion
                      type={1}
                      key={'station' + i}
                      className='orderaccordion_station'
                      title={item.station}
                      notEmpty={filterOrdersByDate(item.orders).length > 0}
                      orderList={filterOrdersByDate(item.orders)}
                    >
                      {filterOrdersByDate(item.orders).length > 0 &&
                        <View
                          className='anno_button'
                          onClick={() => handleAnnounce('STATION_PICK_UP_STATION', i, index,
                            { line: item.line, station: item.station })}
                        >
                          <View className='at-icon at-icon-volume-minus' />
                          <View className=''>发公告</View>
                        </View>
                      }
                      {filterAnnouncements(item.announcements).length > 0 &&
                        <View className='announcements'>
                          {filterAnnouncements(item.announcements).map((anno, i) => {
                            return (
                              <View
                                key={i}
                                className='announcement'>
                                {anno}
                              </View>
                            )
                          })}
                        </View>
                      }
                    </OrderAccordion>
                  )
                })}
              </OrderAccordion>
            )
          })
        }
        {
          state.cuurentTab === 1 &&
          state.oldPlace.stationPickUp.map((it, i) => {
            return (
              <View className=''>
                {it.stations.findIndex((station) => {
                  return (filterOrdersByDate(station.orders).length > 0)
                }) > -1 &&
                  <View className=''>
                    <View className='old_orders_word'>
                      <View className='line_horizontal' />
                      <View className='white_space'>以下是旧车站的订单</View>
                      <View className='line_horizontal' />
                    </View>
                    <View style='font-size:30rpx;color:var(--gray-2);'>(测试版旧旧车站的公告还无法显示在这里)</View>
                  </View>
                }
                <OrderAccordion
                  type={0}
                  key={i}
                  title={it.line}
                  notEmpty={it.stations && it.stations.length > 0 &&
                    it.stations.findIndex((station) => {
                      return (filterOrdersByDate(station.orders).length > 0)
                    }) > -1
                  }
                >
                  {it.stations && it.stations.length > 0 && it.stations.findIndex((station) => {
                    return (filterOrdersByDate(station.orders).length > 0)
                  }) > -1 &&
                    <View className='anno_button'
                      onClick={() => handleAnnounce('STATION_PICK_UP_LINE_OLD', i, null,
                        { line: it.line })}
                    >
                      <View className='at-icon at-icon-volume-minus' />
                      <View className=''>发公告</View>
                    </View>
                  }
                  {it.stations.map((item, index) => {
                    return (
                      <OrderAccordion
                        type={1}
                        key={'station' + i}
                        className='orderaccordion_station'
                        title={item.station}
                        notEmpty={filterOrdersByDate(item.orders).length > 0}
                        orderList={filterOrdersByDate(item.orders)}
                      >
                        {filterOrdersByDate(item.orders).length > 0 &&
                          <View
                            className='anno_button'
                            onClick={() => handleAnnounce('STATION_PICK_UP_STATION_OLD', i, index,
                              { line: item.line, station: item.station })}
                          >
                            <View className='at-icon at-icon-volume-minus' />
                            <View className=''>发公告</View>
                          </View>}
                        {filterAnnouncements(item.announcements).length > 0 &&
                          <View className='announcements'>
                            {filterAnnouncements(item.announcements).map((anno, i) => {
                              return (
                                <View
                                  key={i}
                                  className='announcement'>
                                  {anno}
                                </View>
                              )
                            })}
                          </View>
                        }
                      </OrderAccordion>
                    )
                  })}
                </OrderAccordion>
              </View>
            )
          })
        }
        {state.cuurentTab === 2 &&
          <View className=''>
            <View className='flex justify-center'>(邮寄订单暂无筛选日期功能)</View>
            {
              state.expressPickUp.map((it, i) => {
                return (
                  <View
                    key={i}
                  >
                    <View
                      className='anno_button'
                      onClick={() => handleAnnounce('EXPRESS_PICK_UP', i, null, { id: it._id })}
                    >
                      <View className='at-icon at-icon-volume-minus' />
                      <View className=''>发公告</View>
                    </View>
                    <OrderCard
                      mode='SELLER'
                      key={i}
                      order={it}
                    />
                    {it.announcements && it.announcements.length > 0 &&
                      <View className='announcements'>
                        {it.announcements.map((anno, i) => {
                          return (
                            <View
                              key={i}
                              className=''>
                              {anno}
                            </View>
                          )
                        })}
                      </View>
                    }
                  </View>
                )
              })}
          </View>
        }
      </TabPage>
    </Layout >
  )
}

export default DeliveryPage;