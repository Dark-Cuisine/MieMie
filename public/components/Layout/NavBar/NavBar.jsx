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


/**
 * 页面头上的导航栏
 * <NavBar
    navBarTitle={props.navBarTitle}
    kind={props.navBarKind} //0:不显示navBar, 1:位置设定--title--Msg, 2://返回--title--Msg, 3:--title--Msg ,4:返回--title--
/>
 * 
 */
const NavBar = (props) => {
  const dispatch = useDispatch();
  const shopsManager = useSelector(state => state.shopsManager);
  const publicManager = useSelector(state => state.publicManager);
  const userManager = useSelector(state => state.userManager);
  const initState = {
    navBarTitle: props.navBarTitle ? props.navBarTitle : 'xxx',
    ifMarkMsgButton: publicManager.ifMarkMsgButton,
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    setState({
      ...state,
      navBarTitle: initState.navBarTitle
    });
  }, [props.navBarTitle])

  useEffect(() => {
     dispatch(actions.judgeIfMarkMsgButton(userManager.unionid))
  }, [userManager.unionid])

  useEffect(() => { 
    console.log('publicManager.ifMarkMsgButton',publicManager.ifMarkMsgButton);
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
      {state.ifMarkMsgButton &&
        <View className='nav_bar_msg_mark' />}
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

  let titleClass = (state.navBarTitle && state.navBarTitle.length > 2) ?
    'nav_bar_title' : 'nav_bar_title title_short';
  let navBar = null;
  switch (props.kind) {
    case (0): {//不显示navBar
      break;
    }
    case (1): {//位置设定--title--Msg

      navBar = (
        <View className='bar'>
          <View className='left_icon'>
            <LocationSettingDialog
              version={props.version}
            />
          </View>
          <View className={titleClass}>{state.navBarTitle}</View>
          {Msg}
        </View>
      );
      break;
    }
    case (2): {//返回--title--Msg
      navBar = (
        <View className='bar'>
          <View className='left_icon'
            onClick={() => handleClickBackButton()}
          >
            <View className='at-icon at-icon-chevron-left '
            />
          </View>
          <View className={titleClass}>{state.navBarTitle}</View>
          {Msg}
        </View>

      );
      break;
    }
    case (3): {//--title--Msg
      navBar = (
        <View className='bar' >
          <View className={titleClass}>{state.navBarTitle}</View>
          {Msg}
        </View>
      );
      break;
    }
    case 4: {//返回--title--
      navBar = (
        <View className='bar'>
          <View className='left_icon'
            onClick={() => handleClickBackButton()}
          >
            <View className='at-icon at-icon-chevron-left '
            />
          </View>
          <View className={titleClass}>{state.navBarTitle}</View>
          <View className='right_icon' />{/*占位*/}
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
      <View className='nav_bar_header'>
        {navBar}
      </View>
      {props.children}
    </View>
  )
}

export default NavBar;