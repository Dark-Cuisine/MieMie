import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import * as actions from '../../../../public/redux/actions'

import { initClassifications } from '../../../../public/utils/functions/config_functions'

import './Index.scss'


const Index = (props) => {
  const dispatch = useDispatch();
  const initState = {
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    doInit()
  }, [])

  const doInit = async () => {
    await initClassifications()

    let app = getApp()
    // dispatch(actions.changeTabBarTab(//跳进主页
    //   app.$app.globalData.classifications.tabBar.tabBarList_solitaire[1]))
      dispatch(actions.changeTabBarTab(//跳进主页
        app.$app.globalData.classifications.tabBar.tabBarList_solitaire[0]))
        
    // Taro.switchTab({
    //   // url: '/pages/SellerPages/MyOrdersPage/MyOrdersPage',
    //   // url: '/pages/SellerPages/MyShopsPage/MyShopsPage',
    //   url: '/pages/SellerPages/DeliveryPage/DeliveryPage',
    //   // url: '/pages/PublicPages/UserPage/UserPage',
    // });
    // Taro.navigateTo({
    // url: '/pages/PublicPages/MessagesPage/MessagesPage',
    // });
  }
  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })



  return (
    <View>
      {/* 正在进入首页.... */}
    </View>
  )
}

export default Index;