import React, { Component, useState, useReducer, createContext, useEffect, useContext, useImperativeHandle, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actions/index'
import { AtModal, AtButton, AtIcon } from "taro-ui"

import { useSelector, useDispatch } from 'react-redux'

import Layout from '../../../components/Layout/Layout'
import ActionDialog from '../../../components/dialogs/ActionDialog/ActionDialog'
import PurchaseCard from '../../../components/cards/PurchaseCard/PurchaseCard'
import LoginDialog from '../../../components/dialogs/LoginDialog/LoginDialog'

const databaseFunction = require('../../../public/databaseFunction');
//export const Context = createContext();//*别写成React.createContext了啊啊啊啊！
import { Context } from '../../../public/context'

import './PurchasePage.scss'

//*unfinished 应可选要提交接龙的order

/**
 * 提交接龙页面(现在只能单个店铺提交接龙)
 */
const PurchasePage = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ordersManager = useSelector(state => state.ordersManager);
  const initState = {
    orders: [],

    // ifOpenLoginDialog: false,
    // ifOpenPurchaseDialog: false,

    currentShopId: router.params.shopId,
  }
  const [state, setState] = useState(initState);

  const userManager = useSelector(state => state.userManager);

  useEffect(() => {
    // console.log('neww', ordersManager.newOrders);
    if (ordersManager.newOrders && ordersManager.newOrders.length > 0) {
      if (state.currentShopId) {//用router传当前接龙的店铺id
        let orderIndex = ordersManager.newOrders.findIndex(order => {
          return (order.shopId == state.currentShopId)
        });
        setState({
          ...state,
          orders: (orderIndex > -1) ? [ordersManager.newOrders[orderIndex]] : [],
        });
      }
      else {//*保留，以后有可能支持多选提交接龙
        setState({
          ...state,
          orders: ordersManager.newOrders,
        });
      }
    } else {
      setState({
        ...state,
        orders: initState.newOrders,
      });
    }
  }, [ordersManager])//*不知为何ordersManager.newOrders会不生效

  /*
  init
  const handleInit = () => {
    setState({
      ...state,
      ifOpenLoginDialog: false,
      ifOpenPurchaseDialog: false,
    });
  }
  toggle dialog
  const toggleDialog = (way, ifOpen = null) => {
    switch (way) {
      case 'LOGIN':
        setState({
          ...state,
          ifOpenLoginDialog: ifOpen,
        });
        break;
      case 'PURCHASE':
        setState({
          ...state,
          ifOpenPurchaseDialog: ifOpen,
        });
        break;
      default:
        break;
    }
  }

  
  const handlePurchaseButton = (props) => {//如果没登录就打开登录窗，否则继续提交接龙
    // toggleDialog('LOGIN',true);//*for test
    (userManager.unionid) ?
      toggleDialog('LOGIN', true) :
      toggleDialog('PURCHASE', true);
  };


  const doPurchase = () => {//提交接龙
    toggleDialog('PURCHASE', false);

    databaseFunction.doPurchase(state.orders, userManager.unionid);
    dispatch(actions.initOrders());

    Taro.navigateTo({
      url: '/pages/BuyerPages/OrdersPage/OrdersPage',
    });
  }

  const handleSubmitPurchaseCard = (way, v = null, i = null) => {
    let updatedOrders = state.orders;
    let updated = null;
    switch (way) {
      case 'WAY_AND_PLACE':
        updated = {
          ...state.orders[i],
          pickUpWay: {
            ...state.orders[i].pickUpWay,
            ...v,
          }
        }
        updatedOrders.splice(i, 1, updated);
        setState({
          ...state,
          orders: updatedOrders
        });
        break;
      case 'DATE':
        updated = {
          ...state.orders[i],
          pickUpWay: {
            ...state.orders[i].pickUpWay,
            date: v,
          }
        }
        updatedOrders.splice(i, 1, updated);
        setState({
          ...state,
          orders: updatedOrders
        });
        break;
      case 'PAYMENT':
        updated = {
          ...state.orders[i],
          paymentOption: v
        }
        updatedOrders.splice(i, 1, updated);
        setState({
          ...state,
          orders: updatedOrders
        });
        break;
      case 'DES':
        updated = {
          ...state.orders[i],
          des: v
        }
        updatedOrders.splice(i, 1, updated);
        setState({
          ...state,
          orders: updatedOrders
        });
        break;

      case '':
        break;
      default:
        break;
    }
  }

  let loginDialog =
    <LoginDialog
            version={props.version}
isOpened={state.ifOpenLoginDialog}
      onClose={() => handleInit()}
      onCancel={() => toggleDialog('LOGIN', false)}
    />;


  let doPurchaseDialog = (
    <ActionDialog
      isOpened={state.ifOpenPurchaseDialog}
      type={1}
      leftWord='取消'
      rightWord='提交接龙'
      onClose={() => handleInit()}
      onCancel={() => toggleDialog('PURCHASE', false)}
      onConfirm={() => doPurchase()}
    >
      <View className=''>
        你确定真的要提交接龙吗？？？？不会后悔吗？
      </View>
    </ActionDialog>
  );
*/

  let purchaseCards = (state.orders && state.orders.length > 0) ?
    state.orders.map((it, i) => {
      return (
        <PurchaseCard
          version={props.version}
          key={it.shopId}
          order={it}
          shopId={state.currentShopId}
          // handleSubmit={(way, v) => handleSubmitPurchaseCard(way, v, i)}
        />
      )
    }) : null;

  return (
    <Layout
      version={props.version}
      mode='BUYER'
      navBarKind={2}
      lateralBarKind={0}
      navBarTitle='提交接龙'
      ifShowTabBar={false}
    >
      {/* {loginDialog}
      {doPurchaseDialog} */}
      {purchaseCards}
      {/* <Button
        onClick={() => handlePurchaseButton()}>purchase
            </Button> */}
    </Layout>
  )
}



export default PurchasePage;
