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

import { initClassifications } from '../../utils/functions/config_functions'

import './Layout.scss'

/**
 * 整体布局，布置navbar、tabbar
 * 
 * <Layout
 * mode='BUYER'
    navBarKind={2} //0:不显示navBar, 1:位置设定--title--Msg, 2://返回--title--Msg, 3:--title--Msg ,4:返回--title--
    lateralBarKind={0} //0:不显示lateralBar, 1:ShoppingCar
    navBarTitle='创建发布'
    ifShowTabBar={true}

    ifShowShareMenu={}//是否允许转发
 
    handleClickBackButton={() => handleClickBackButton()}
    initUrl=  //应对app.$app.globalData为空(小程序被转发时)进入除了tabpag外的页面
    siwtchTabUrl={mode === 'BUYER' ? '/pages/BuyerPages/ShoppingPage/ShoppingPage' : null}//navbar点击返回时回去的页面
    ifClickBackExit={mode === 'SELLER'}

></Layout>
 */
const Layout = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userManager = useSelector(state => state.userManager);
  const publicManager = useSelector(state => state.publicManager);
  const layoutManager = useSelector(state => state.layoutManager);
  const app = getApp()
  const initState = {
  }


  const [state, setState] = useState(initState);

  useEffect(() => {
    console.log();
    if (!(process.env.TARO_ENV === 'weapp')) { return }
    if ((props.ifShowShareMenu)) {//允许转发
      Taro.showShareMenu({
        withShareTicket: false
      })
    } else {
      Taro.hideShareMenu({
      })
    }
  }, [props.ifShowShareMenu])

  useEffect(() => {
    if (!(app && app.$app.globalData.classifications)) {
      doInitClassifications()
      return
    }

    if (!(wx.getStorageSync('ifShowUserGuide') === false)
      && (layoutManager.userGuideIndex === null)) {//用户指南
      let tabUrlList = app.$app.globalData.classifications.tabBar.tabBarList_buyer.map(it => { return it.url })
      tabUrlList = tabUrlList.concat(app.$app.globalData.classifications.tabBar.tabBarList_seller.map(it => { return it.url }))
      tabUrlList = tabUrlList.concat(app.$app.globalData.classifications.tabBar.tabBarList_solitaire.map(it => { return it.url }))
      let index = tabUrlList.indexOf(router.path)
      // console.log('a-tabUrlList', tabUrlList, 'router.path', router.path, 'index', index);
      if (index < 0) {//如果初始页面不为tabpage，则不显示用户指南(应对从转发小程序的链接打开的情况)
        return
      }
      dispatch(actions.userGuideNextStep(1));
    }

    let openid = wx.getStorageSync('openid');//如果已经登录过，自动登录
    let unionid = wx.getStorageSync('unionid');
    if (openid && openid.length > 0 && unionid && unionid.length > 0 &&
      (!userManager.unionid || (userManager.unionid && userManager.unionid.length < 1))
    ) {
      console.log('已经登录过，自动登录', openid, unionid);
      dispatch(actions.setUser(unionid, openid));
    }
  }, [app.$app.globalData])

  const doInitClassifications = async () => {
    console.log('a-initUrl', props.initUrl);
    await initClassifications()

    props.initUrl ?
      Taro.navigateTo({ url: props.initUrl, }) :
      dispatch(actions.changeTabBarTab(//跳进主页
        props.version === 'BUYER' ?
          app.$app.globalData.classifications.tabBar.tabBarList_buyer[1] :
          (props.version === 'SOLITAIRE' ?
            app.$app.globalData.classifications.tabBar.tabBarList_solitaire[1] :
            app.$app.globalData.classifications.tabBar.tabBarList_seller[1])))
  }


  return (
    <View className={'my_layout '.concat(props.className)} >
      {props.mode === 'SOLITAIRE' ||
        layoutManager.userGuideIndex === null ||
        <UserGuide mode={props.mode} />
      }
      {app && app.$app.globalData.classifications && <NavBar
        version={props.version}
        mode={props.mode}
        navBarTitle={props.navBarTitle}
        kind={props.navBarKind}

        handleClickBackButton={props.handleClickBackButton}

        siwtchTabUrl={props.siwtchTabUrl}
        ifClickBackExit={props.ifClickBackExit}
      />}

      <LateralBar
        kind={props.lateralBarKind}
      />

      <View
        className='layout_children'
        style={'margin-top:' + app.$app.globalData.layoutData.NAV_BAR_HEIGHT + 'rpx;'}
      >
        {layoutManager.ifOpenLoadingSpinner && <LoadingSpinner />}
        {props.children}
      </View>
      {/* <scroll-view   //*problrm scroll-view会阻止下拉刷新
        scroll-y={true}
        className='layout_children'
        style={'height:'.concat(
          (state.ifShowTabBar &&
            layoutManager.horizontalBarMode === 'NORMAL') ?
            'var(--layout-children-height-1);' : 'var(--layout-children-height-2);'
        )}
      >
        {layoutManager.ifOpenLoadingSpinner && <LoadingSpinner />}
        {props.children}
      </scroll-view> */}

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
  ifShowShareMenu: true,//是否允许转发
};
export default Layout;