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

import classification from '../../public/classification'

import './Layout.scss'

const tabBarList_buyer = classification.tabBar.tabBarList_buyer;

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
  const initState = {
    // navBarKind: props.navBarKind === null ? 1 : props.navBarKind,
    // lateralBarKind: props.lateralBarKind === null ? 0 : props.lateralBarKind,
    // navBarTitle: props.navBarTitle === null ? 'xxx' : props.navBarTitle,
    ifShowTabBar: (props.ifShowTabBar === false) ? false : true,

    ifOpenLoadingSpinner: publicManager.ifOpenLoadingSpinner,

    ifShowUserGuide: (publicManager.userGuideIndex === null) ? false : true,

  }
  const [state, setState] = useState(initState);

  useEffect(() => {

    if (process.env.TARO_ENV === 'weapp') {
      Taro.showShareMenu({
        withShareTicket: false
      })
    }
  }, [])
  useEffect(() => {
    let openid = wx.getStorageSync('openid');
    let unionid = wx.getStorageSync('unionid');
    console.log('openid', openid, 'unionidunionid', unionid);
    if (openid && openid.length > 0 &&
      unionid && unionid.length > 0 &&
      (!userManager.unionid ||
        (userManager.unionid && userManager.unionid.length < 1))
    ) {
      dispatch(actions.setUser(openid, unionid));
    }
  }, [])

  useEffect(() => {
    setState({
      ...state,
      ifShowTabBar: initState.ifShowTabBar
    });
  }, [props.ifShowTabBar])

  useEffect(() => {
    let value = wx.getStorageSync('ifShowUserGuide');

    if (!(value === false) && !(state.ifShowUserGuide)) {
      dispatch(actions.userGuideNextStep(1));
    }

    setState({
      ...state,
      ifShowUserGuide: initState.ifShowUserGuide,
    });
  }, [publicManager.userGuideIndex]);

  useEffect(() => {
    setState({
      ...state,
      ifOpenLoadingSpinner: initState.ifOpenLoadingSpinner,
    });
  }, [publicManager.ifOpenLoadingSpinner])

  return (
    <View
      className={'my_layout '.concat(props.className ?
        props.className : ''
      )}
    >

      {state.ifShowUserGuide &&
        <UserGuide mode={props.mode} />
      }
      <LateralBar
        kind={props.lateralBarKind}
      />

      <NavBar
        version={props.version}
        navBarTitle={props.navBarTitle}
        kind={props.navBarKind}
      />
      {/* <View className='nav_bar_place_holder' /> */}

      <scroll-view
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
      </scroll-view>

      {state.ifShowTabBar &&
        tabBarManager.horizontalBarMode === 'NORMAL' &&
        <View className='tab_bar_place_holder' />
      }
      {/* {state.ifShowTabBar &&
        <TabBar
          mode={props.version}
        //version={props.version}
        />
      } */}
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