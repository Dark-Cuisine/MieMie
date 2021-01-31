import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import NavBar from './NavBar/NavBar'
import TabBar from './TabBar/TabBar'
import LateralBar from './LateralBar/LateralBar'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import UserGuide from '../../components/UserGuide/UserGuide'

import './Layout.scss'

//navbar适配机型的方法http://www.yiyongtong.com/archives/view-7592-1.html
const menuButtonBoundingClientRect = wx.getMenuButtonBoundingClientRect()
let menuButtonBoundingClientRect_top = menuButtonBoundingClientRect.top
let menuButtonBoundingClientRect_height = menuButtonBoundingClientRect.height
const systemInfoSync = wx.getSystemInfoSync()
let statusBar_height = systemInfoSync.statusBarHeight
//导航栏高度 = ((胶囊距上距离-状态栏高度) * 2 + 胶囊高度 + 状态栏高度) * 2 rpx
let NAV_BAR_HEIGHT = ((menuButtonBoundingClientRect_top - statusBar_height) * 2
  + menuButtonBoundingClientRect_height + statusBar_height) * 2;


/**
 * 整体布局，布置navbar、tabbar
 * 
 * <Layout
 * mode='BUYER'
    navBarKind={2} //0:不显示navBar, 1:位置设定--title--Msg, 2://返回--title--Msg, 3:--title--Msg ,4:返回--title--
    lateralBarKind={0} //0:不显示lateralBar, 1:ShoppingCar
    navBarTitle='创建发布'
    ifShowTabBar={true}
></Layout>
 */
const Layout = (props) => {
  const dispatch = useDispatch();
  const userManager = useSelector(state => state.userManager);
  const publicManager = useSelector(state => state.publicManager);
  const tabBarManager = useSelector(state => state.tabBarManager);
  const globalData = useSelector(state => state.globalData);
  const initState = {
  }

  const [state, setState] = useState(initState);

  useEffect(() => {
    if (!globalData.layoutData) {//设置layoutData
      dispatch(actions.setLayoutData({
        layoutData: {
          NAV_BAR_HEIGHT: NAV_BAR_HEIGHT
        }
      }))
    }

    if (!(publicManager.classifications)) {//从数据库拉取classifications
      dispatch(actions.initClassification());
    }

    if (process.env.TARO_ENV === 'weapp') {//转发
      Taro.showShareMenu({
        withShareTicket: false
      })
    }

    if (!(wx.getStorageSync('ifShowUserGuide') === false)) {//用户指南
      dispatch(actions.userGuideNextStep(1));
    }

    let openid = wx.getStorageSync('openid');//如果已经登录过，自动登录
    let unionid = wx.getStorageSync('unionid');
    if (openid && openid.length > 0 && unionid && unionid.length > 0 &&
      (!userManager.unionid || (userManager.unionid && userManager.unionid.length < 1))
    ) {
      dispatch(actions.setUser(openid, unionid));
    }
  }, [])


  return (
    <View className={'my_layout '.concat(props.className)} >
      {publicManager.userGuideIndex === null ||
        <UserGuide mode={props.mode} />
      }
      <NavBar
        version={props.version}
        navBarTitle={props.navBarTitle}
        kind={props.navBarKind}
      />

      <LateralBar
        kind={props.lateralBarKind}
      />

      <View
        className='layout_children'
        style={'margin-top:' + NAV_BAR_HEIGHT + 'rpx'}
      >
        {publicManager.ifOpenLoadingSpinner && <LoadingSpinner />}
        {props.children}
      </View>
      {/* <scroll-view   //*problrm scroll-view会阻止下拉刷新
        scroll-y={true}
        className='layout_children'
        style={'height:'.concat(
          (state.ifShowTabBar &&
            tabBarManager.horizontalBarMode === 'NORMAL') ?
            'var(--layout-children-height-1);' : 'var(--layout-children-height-2);'
        )}
      >
        {publicManager.ifOpenLoadingSpinner && <LoadingSpinner />}
        {props.children}
      </scroll-view> */}

      {!(props.ifShowTabBar === false) &&
        tabBarManager.horizontalBarMode === 'NORMAL' &&
        <View className='tab_bar_place_holder' />
      }
      {!(props.ifShowTabBar === false) &&
        <TabBar
          mode={props.version}
        //version={props.version}
        />
      }
    </View>

  )
}
Layout.defaultProps = {
  mode: 'BUYER',//'BUYER','SELLER'
  navBarKind: 1,
  lateralBarKind: 0,
  navBarTitle: 'xxx',
};
export default Layout;