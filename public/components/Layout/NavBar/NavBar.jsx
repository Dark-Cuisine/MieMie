import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actions'

import LocationSettingDialog from '../../dialogs/LocationSettingDialog/LocationSettingDialog'
import LoginDialog from '../../dialogs/LoginDialog/LoginDialog'

import './NavBar.scss'

const db = wx.cloud.database();
const _ = db.command

const menuButtonBoundingClientRect = wx.getMenuButtonBoundingClientRect()
let menuButtonBoundingClientRect_right = menuButtonBoundingClientRect.right
let menuButtonBoundingClientRect_width = menuButtonBoundingClientRect.width
const systemInfoSync = wx.getSystemInfoSync()
let screenWidth = systemInfoSync.screenWidth
//给胶囊空出的位置 = (( 屏幕宽度 - 胶囊距右距离 ) * 2 + 胶囊宽度 ) * 2 rpx
let NAV_BAR_PADDING_RIGHT = ((screenWidth - menuButtonBoundingClientRect_right) * 2
  + menuButtonBoundingClientRect_width) * 2;
console.log('systemInfoSync,', systemInfoSync);

/**
 * 页面头上的导航栏
 * <NavBar
    navBarTitle={props.navBarTitle}
    kind={props.navBarKind} //0:不显示navBar, 1:位置设定--title--Msg, 2://返回--title--Msg, 3:--title--Msg ,4:返回--title--
/>
 */
const NavBar = (props) => {
  const dispatch = useDispatch();
  const shopsManager = useSelector(state => state.shopsManager);
  const publicManager = useSelector(state => state.publicManager);
  const userManager = useSelector(state => state.userManager);
  const globalData = useSelector(state => state.globalData);
  const initState = {
    ifMarkMsgButton: publicManager.ifMarkMsgButton,//未读消息的mark
  }
  const [state, setState] = useState(initState);


  useEffect(() => {
    dispatch(actions.judgeIfMarkMsgButton(userManager.unionid))
  }, [userManager.unionid])

  useEffect(() => {
    setState({
      ...state,
      ifMarkMsgButton: initState.ifMarkMsgButton
    });
  }, [publicManager.ifMarkMsgButton])

  const handleClickBackButton = () => {
    Taro.navigateBack({
      delta: 1 // 返回上一级页面
    });
    dispatch(actions.toggleHideMode('NORMAL', 'NORMAL', 'NORMAL'))
  }

  const handleClickMsgButton = () => {
    Taro.navigateTo({
      url: '/pages/PublicPages/MessagesPage/MessagesPage',
    });
  }

  const toggleDialog = (openedDialog) => {
    setState({
      ...state,
      openedDialog: openedDialog
    });
  }


  let Msg = (
    <View className='right_icon'>
      <View className='at-icon at-icon-message'
        onClick={(userManager.unionid && userManager.unionid.length > 0) ?
          handleClickMsgButton.bind(this) : () => toggleDialog('LOGIN')}
      />
      {state.ifMarkMsgButton && <View className='nav_bar_msg_mark' />}
    </View>
  );

  let loginDialog =
    <LoginDialog
      words='请先登录'
      version={props.version}
      isOpened={state.openedDialog === 'LOGIN'}
      onClose={() => toggleDialog(null)}
      onCancel={() => toggleDialog('LOGIN')}
    />;

  let navBar = null;
  let titleClass = 'nav_bar_title '.concat(props.navBarTitle.length > 4 ? 'nav_bar_title_long' : '')
  let style = 'padding-right:' + NAV_BAR_PADDING_RIGHT + 'rpx;'
  switch (props.kind) {
    case (0): {//不显示navBar
      break;
    }
    case (1): {//位置设定--title--Msg
      navBar = (
        <View
          className='bar_content'
          style={style}
        >
          <LocationSettingDialog
            version={props.version}
          />
          <View className='part_right'>
            <View className={titleClass}>{props.navBarTitle}</View>
            {Msg}
          </View>
        </View>
      );
      break;
    }
    case (2): {//返回--title--Msg
      navBar = (
        <View
          className='bar_content'
          style={style}
        >
          <View className='left_icon'
            onClick={() => handleClickBackButton()}
          >
            <View className='at-icon at-icon-chevron-left '
            />
          </View>
          <View className='part_right'>
            <View className={titleClass}>{props.navBarTitle}</View>
            {Msg}
          </View>
        </View>

      );
      break;
    }
    case (3): {//--title--Msg
      navBar = (
        <View
          className='bar_content'
          style={style}
        >
          <View className='part_right'>
            <View className={titleClass}>{props.navBarTitle}</View>
            {Msg}
          </View>
        </View>
      );
      break;
    }
    case 4: {//返回--title--
      navBar = (
        <View
          className='bar_content'
          style={style}
        >
          <View className='left_icon'
            onClick={() => handleClickBackButton()}
          >
            <View className='at-icon at-icon-chevron-left '
            />
          </View>
          <View className='part_right'>
            <View className={titleClass}>{props.navBarTitle}</View>
            <View className='right_icon_place_holder' />{/*占位*/}
          </View>
        </View>
      );
    }
      break;
    default:
      break;
  }

  return (
    <View className='nav_bar'>
      {loginDialog}
      <View
        className='bar'
        style={'height:' +
          (globalData.layoutData && globalData.layoutData.NAV_BAR_HEIGHT) + 'rpx;'}
      >
        {navBar}
      </View>
    </View>
  )
}
NavBar.defaultProps = {
  navBarTitle: 'xxx',
};
export default NavBar;