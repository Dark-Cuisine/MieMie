import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import * as actions from '../../../../public/redux/actions'

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
    let app = getApp()

    //从数据库拿classifications
    let res = await wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'classifications',
      },
    })
    if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      })
      console.error
      return
    }
    app.$app.globalData.classifications = res.result.data[0]

    //适配机型
    //navbar适配机型的方法http://www.yiyongtong.com/archives/view-7592-1.html
    const menuButtonBoundingClientRect = wx.getMenuButtonBoundingClientRect()
    let menuButtonBoundingClientRect_top = menuButtonBoundingClientRect.top
    let menuButtonBoundingClientRect_height = menuButtonBoundingClientRect.height
    let menuButtonBoundingClientRect_right = menuButtonBoundingClientRect.right
    let menuButtonBoundingClientRect_width = menuButtonBoundingClientRect.width
    const systemInfoSync = wx.getSystemInfoSync()
    let statusBar_height = systemInfoSync.statusBarHeight
    let screenWidth = systemInfoSync.screenWidth
    //导航栏高度 = ((胶囊距上距离-状态栏高度) * 2 + 胶囊高度 + 状态栏高度) * 2 rpx
    let NAV_BAR_HEIGHT = ((menuButtonBoundingClientRect_top - statusBar_height) * 2
      + menuButtonBoundingClientRect_height + statusBar_height) * 2;
    //给胶囊空出的位置 = (( 屏幕宽度 - 胶囊距右距离 ) * 2 + 胶囊宽度 ) * 2 rpx
    let NAV_BAR_PADDING_RIGHT = ((screenWidth - menuButtonBoundingClientRect_right) * 2
      + menuButtonBoundingClientRect_width) * 2;
    app.$app.globalData.layoutData.NAV_BAR_HEIGHT = NAV_BAR_HEIGHT
    app.$app.globalData.layoutData.NAV_BAR_PADDING_RIGHT = NAV_BAR_PADDING_RIGHT

    if (!(app.$app.globalData.classifications && app.$app.globalData.layoutData)) {
      wx.showToast({
        title: '初始化数据失败',
        icon: 'none'
      })
      console.error
      return
    }
    console.log('app-globalData', app.$app.globalData);

    // dispatch(actions.changeTabBarTab(//跳进主页
    //   app.$app.globalData.classifications.tabBar.tabBarList_buyer[1]))

    Taro.navigateTo({
      url: '/pages/PublicPages/MessagesPage/MessagesPage',
    });

  }
  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })



  return (
    <View>

    </View>
  )
}

export default Index;