import React, { Component, useState, useRef, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtTextarea } from 'taro-ui'
import * as actions from "../../../redux/actions/index";

import SearchBar from '../../../components/SearchBar/SearchBar'
import TabPage from '../../../components/formats/TabPage/TabPage'
import ActionButtons from '../../../components/buttons/ActionButtons/ActionButtons'
import Layout from '../../../components/Layout/Layout'
import OrderCard from '../../../components/cards/OrderCard/OrderCard'
import classification from '../../../public/classification'
import ActionDialog from '../../../components/dialogs/ActionDialog/ActionDialog'

import './OrdersPage.scss'

const databaseFunction = require('../../../public/databaseFunction')
const db = wx.cloud.database();
const _ = db.command;

const cancelOrderReasons = classification.cancelOrderReasons

/****
 * 我的订单页面
 * --未完成-- --已完成--
 * 
 */
const OrdersPage = (props) => {
  const dispatch = useDispatch();
  const ordersManager = useSelector(state => state.ordersManager)
  const userManager = useSelector(state => state.userManager)
  const publicManager = useSelector(state => state.publicManager)
  const layoutManager = useSelector(state => state.layoutManager);
  const app = getApp()
  const initState = {
    orders: {
      allOrders: [],
      unfinished: [],//'UN_PROCESSED','ACCEPTED'
      finished: []//'REJECTED','FINISHED'
    },

    currentTab: 0,
    currentOrder: null,

    isSearching: false,
    searchedOrders: [],

    ifOpenCancelOrderDialog: false,
    cancelReason: {
      reason: '',
      des: ''
    },

  }
  const [state, setState] = useState(initState);

  // useEffect(() => {  //*这样刷新会很卡，要想别的办法
  //   console.log('eff');
  //   updateOrders();
  // }, [state.currentTab])

  // useEffect(() => {
  //   if (!(layoutManager.currentTabId == app.$app.globalData.classifications.tabBar.tabBarList_buyer[2].id)) { return }
  //   updateOrders();
  // }, [userManager.unionid, layoutManager.currentTabId])//切换tab时也刷新
  useEffect(() => {
    updateOrders();
  }, [userManager.unionid])

  usePullDownRefresh(() => {
    updateOrders();
    Taro.stopPullDownRefresh()
  })

  const updateOrders = () => {
    dispatch(actions.toggleLoadingSpinner(true));

    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'users',

        queryTerm: { unionid: userManager.unionid },
      },
      success: (res) => {
        console.log('orderspage-getdata,res', res);
        if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
          dispatch(actions.toggleLoadingSpinner(false));
          return
        }
        let orderIdList = res.result.data[0].orders;
        // if (true) {//* for test
        //   let orderIdList = ['0288fce75fb61c23000af94f39aed374', 'e62469b25fb73a4a0017716e5ec74b17', '2a7b532a5fb73df50017099e2d5afb63']
        if (!(orderIdList && orderIdList.length > 0)) {
          dispatch(actions.toggleLoadingSpinner(false));
          return;
        }
        wx.cloud.callFunction({
          name: 'get_data',
          data: {
            collection: 'orders',

            operatedItem: '_ID',
            orderBy: 'createTime',//根据时间排序
            desc: 'desc',//新前旧后
            queriedList: orderIdList,
          },
          success: (r) => {
            dispatch(actions.toggleLoadingSpinner(false));
            if (r && r.result && r.result.data && r.result.data.length > 0) {
              classifyOrders(r.result.data);
            }
          },
          fail: () => {
            dispatch(actions.toggleLoadingSpinner(false));
            wx.showToast({
              title: '获取数据失败',
              icon: 'none'
            })
            console.error
          }
        });
      },
      fail: () => {
        console.error
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        dispatch(actions.toggleLoadingSpinner(false));
      }
    });
    // db.collection('users').where({
    //   unionid: userManager.unionid
    // }).get().then(r => {
    //   if (r.data && r.data.length > 0) {
    //     let orderIdList = r.data[0].orders;
    //     db.collection('orders').where({
    //       _id: _.in(orderIdList)
    //     }).get().then((res) => {
    //       classifyOrders(res.data);
    //     })
    //   }
    //   dispatch(actions.toggleLoadingSpinner(false));
    // })
  }

  const classifyOrders = (orders) => {
    let unfinished = [];
    let finished = [];
    orders && orders.length > 0 && orders.forEach((it) => {
      switch (it.status) {
        case 'UN_PROCESSED':
        case 'ACCEPTED':
          unfinished.push(it);
          break;
        case 'REJECTED':
        case 'FINISHED':
        case 'CANCELED':
          finished.push(it);
          break;
        default:
          break;
      }
    });
    setState({
      ...state,
      orders: {
        ...state.orders,
        allOrders: orders,
        unfinished: unfinished,
        finished: finished,
      }
    });
  }

  const handleClickTab = (value) => {
    setState({
      ...state,
      currentTab: value
    })
  }

  const handleCancel = () => {
    setState({
      ...state,
      currentOrder: initState.currentOrder,

      ifOpenCancelOrderDialog: initState.ifOpenCancelOrderDialog,
      cancelReason: initState.cancelReason,
    });
  }

  const toggleDialog = (way, index = null, order = null) => {
    switch (way) {
      case 'CANCEL_ORDER':
        setState({
          ...state,
          ifOpenCancelOrderDialog: !state.ifOpenCancelOrderDialog,
          currentOrder: index,
        });
        break;

      case '':
        break;
      default:
        break;
    }
  }

  const toggleSearching = (isSearching) => {
    setState({
      ...state,
      isSearching: isSearching
    });
  }

  const handleSubmit = (way, v = null, i = null) => {
    switch (way) {
      case 'FINISH':
        if (!(v && v._id && v._id.length > 0)) { return }
        wx.cloud.callFunction({
          name: 'update_data',
          data: {
            collection: 'orders',
            queryTerm: {
              _id: v._id
            },
            operatedItem: 'STATUS',
            updateData: {
              status: 'FINISHED'
            },
          },
          success: (res) => { },
          fail: () => {
            wx.showToast({
              title: '获取数据失败',
            })
            console.error
          }
        });

        // db.collection('orders').where({
        //   _id: v._id
        // }).update({
        //   data: {
        //     status: 'FINISHED'
        //   }
        // })
        break;
      case 'CANCEL_ORDER':
        //if (!(v && v._id && v._id.length > 0)) { return }
        let order = state.orders.unfinished[state.currentOrder]
        console.log('cancel', order);
        wx.cloud.callFunction({
          name: 'update_data',
          data: {
            collection: 'orders',
            queryTerm: {
              _id: order._id
            },
            operatedItem: 'STATUS',
            updateData: {
              status: 'CANCELED',
              cancelReason: state.cancelReason
            },
          },
          success: (res) => {
          },
          fail: () => {
            wx.showToast({
              title: '获取数据失败',
            })
            console.error
          }
        });

        break;
      case 'DELETE':
        if (!(v && v._id && v._id.length > 0)) { return }
        wx.cloud.callFunction({
          name: 'pull_data',
          data: {
            // userId: userManager.unionid,
            // authId: v.authId,
            collection: 'users',
            queryTerm: {
              unionid: userManager.unionid
            },
            operatedItem: 'ORDERS',
            updateData: v._id,
          },
          success: (res) => { },
          fail: () => {
            wx.showToast({
              title: '获取数据失败',
            })
            console.error
          }
        });

        break;
      case '':
        break;
      default:
        break;
    }

    let updated_unfinished = state.orders.unfinished;
    let updated_finished = state.orders.finished;
    switch (way) {//* 要简化
      case 'FINISH':
      case 'CANCEL_ORDER':
        updated_unfinished.splice(state.currentOrder, 1);
        updated_unfinished.length > 0 &&
          updated_finished.push(state.orders.unfinished[state.currentOrder]);
        break;
      case 'DELETE':
        updated_finished.splice(i, 1)
        break;
      default:
        break;
    }

    setState({
      ...state,
      orders: {
        ...state.orders,
        unfinished: updated_unfinished,
        finished: updated_finished,
      },
      cancelReason: {
        reason: '',
        des: ''
      },
      currentOrder: null,
      ifOpenCancelOrderDialog: false,
    });

  }



  const handleSetCancelReason = (it) => {
    setState({
      ...state,
      cancelReason: {
        ...state.cancelReason,
        reason: it,
      }
    });
  }
  const handleSetCancelReasonDes = (v) => {
    setState({
      ...state,
      cancelReason: {
        ...state.cancelReason,
        des: v,
      }
    });
  }



  const setSearchedOrders = (searchedOrders) => {
    setState({
      ...state,
      searchedOrders: searchedOrders
    });
  }

  const tabList = [{ title: '未完成' }, { title: '已完成' }]

  let unfinished = (state.orders.unfinished && state.orders.unfinished.length > 0)
    || layoutManager.ifOpenLoadingSpinner ?
    state.orders.unfinished.map((it, i) => {
      return (
        <OrderCard
          key={i}
          order={it}
          ifShowAnnos={true}
          buttonTextLeft='取消订单'
          buttonTextRight='完成订单'
          detail={1}
          ifToggleDetil={true}
          handleClickButtonLeft={() => toggleDialog('CANCEL_ORDER', i)}
          handleClickButtonRight={() => handleSubmit('FINISH', it)}
          beforeRightButtonText={'点击完成后，该单在商家处也会标记为已完成，请确保交易已结束。你确定要现在完成该订单?'}
        />
      )
    }) : <View className='empty_word'>暂无订单</View>
    ;

  let finished = (state.orders.finished && state.orders.finished.length > 0)
    || layoutManager.ifOpenLoadingSpinner ?
    state.orders.finished.map((it, i) => {
      return (
        <OrderCard
          key={'finished'.concat(i)}
          order={it}
          ifToggleDetil={true}
          detail={0}

          buttonTextRight='删除订单'
          beforeRightButtonText={'确定删除该订单?'}
          handleClickButtonRight={() => handleSubmit('DELETE', it, i)}
        />
      )
    }) : <View className='empty_word'>暂无订单</View>
    ;


  let cancelOrderDialog = (
    <ActionDialog
      type={0}
      closeOnClickOverlay={!(state.cancelReason.des && state.cancelReason.des.length > 0)}
      isOpened={state.ifOpenCancelOrderDialog}
      onClose={() => handleCancel()}
      onCancel={() => handleCancel()}
      onSubmit={() => handleSubmit('CANCEL_ORDER')}
      title='取消原因'
    >
      <View className='cancel_reason_buttons'>
        {cancelOrderReasons.map((it, i) => {
          return (
            <View
              key={i}
              className={it == state.cancelReason.reason ? 'button choosen' : 'button'}
              onClick={handleSetCancelReason.bind(this, it)}//* no '(it)=> 'here !!!!
            >
              {it}
            </View>
          )
        })}
      </View>
      <View className='cancel_reason_des'>
        <View className='title'> 补充说明： </View>
        <AtTextarea
          value={state.cancelReason.des}
          onChange={handleSetCancelReasonDes.bind(this)}//* not '(v) => handleSetCancelReasonDes.bind(this, v)' here !!!!
          height={300}//*AtTextarea只能在这里改输入框高度
          maxLength={500}
          count={true}
        />
      </View>

    </ActionDialog>
  );

  // console.log('state.allOrders,state.allOrders', state.orders.allOrders);
  return (
    <Layout
      version={props.version}
      className='orders_page'
      mode='BUYER'
      navBarKind={3}
      lateralBarKind={0}
      navBarTitle='我的订单'
    >
      {cancelOrderDialog}
      <SearchBar
        itemList={state.orders.allOrders}
        isSearching={state.isSearching}

        beginSearching={() => toggleSearching(true)}
        stopSearching={() => toggleSearching(false)}
        getMatchedList={(matched) => setSearchedOrders(matched)}
      />
      {state.isSearching ?
        <View className=''>
          {
            state.searchedOrders.map((it, i) => {
              return (
                (it.status === 'UN_PROCESSED' || it.status === 'ACCEPTED') ?
                  <OrderCard
                    key={'searched'.concat(i)}
                    order={it}
                    ifShowAnnos={true}
                    buttonTextLeft='取消订单'
                    buttonTextRight='完成订单'
                    detail={1}
                    ifToggleDetil={true}
                    handleClickButtonLeft={() => toggleDialog('CANCEL_ORDER', i)}
                    handleClickButtonRight={() => handleSubmit('FINISH', it)}
                    beforeRightButtonText={'点击完成后，该单在商家处也会标记为已完成，请确保交易已结束。你确定要现在完成该订单?'}
                  /> :
                  <OrderCard
                    key={'searched'.concat(i)}
                    order={it}
                    ifToggleDetil={true}
                    detail={0}

                    buttonTextRight='删除订单'
                    beforeRightButtonText={'确定删除该订单?'}
                    handleClickButtonRight={() => handleSubmit('DELETE', it, i)}
                  />
              )
            })
          }
        </View>
        :
        <TabPage
          tabList={tabList}
          currentTab={state.currentTab}
          onClick={i => handleClickTab(i)}
        >
          {state.currentTab === 0 &&
            unfinished
          }
          {state.currentTab === 1 &&
            finished
          }
        </TabPage>
      }

    </Layout>
  )
}

export default OrdersPage;


