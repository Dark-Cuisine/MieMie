import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Navigator } from '@tarojs/components'
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
    navBarTitle={title}
    kind={props.navBarKind} //0:不显示navBar, 1:位置设定--title--Msg, 2://返回--title--Msg, 3:--title--Msg ,4:返回--title--

    handleClickBackButton={props.handleClickBackButton}

    siwtchTabUrl={mode === 'BUYER' ? '/pages/BuyerPages/ShoppingPage/ShoppingPage' : null}
    fClickBackExit={mode === 'SELLER'}

    />
 */
const NavBar = (props) => {
  const dispatch = useDispatch();
  const shopsManager = useSelector(state => state.shopsManager);
  const publicManager = useSelector(state => state.publicManager);
  const userManager = useSelector(state => state.userManager);
  const app = getApp()
  const layoutManager = useSelector(state => state.layoutManager);
  const initState = {
    ifMarkMsgButton: layoutManager.ifMarkMsgButton,//未读消息的mark
    siwtchTabUrl:props.siwtchTabUrl,//siwtchTabUrl要写在state不然会随着props消失掉！！！！
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
  }, [layoutManager.ifMarkMsgButton])

  const handleClickBackButton = () => {
    props.handleClickBackButton && props.handleClickBackButton()
    // dispatch(actions.toggleHideMode('NORMAL', 'NORMAL', 'NORMAL'))
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
  let title = props.navBarTitle.length >6 ?
    (props.navBarTitle.slice(0, 3) + '...' + props.navBarTitle.slice(-2)) : props.navBarTitle
  let titleClass = 'nav_bar_title '.concat(props.navBarTitle.length > 5 ?
    'nav_bar_title_long' : (props.navBarTitle.length > 3 ? 'nav_bar_title_middle' : ''))
  let style = 'padding-right:' + app.$app.globalData.layoutData.NAV_BAR_PADDING_RIGHT + 'rpx;'
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
            <View className={titleClass}>{title}</View>
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
          <Navigator
            // openType={props.ifClickBackExit ? 'exit' : (//注: exit只有真机调试才有效
            //   props.siwtchTabUrl ? 'switchTab' : 'navigateBack'
            // )}   
            openType={(
              state.siwtchTabUrl ? 'switchTab' : 'navigateBack'
            )}
            url={state.siwtchTabUrl}
            onClick={() => handleClickBackButton()}
          >
            <View className='at-icon at-icon-chevron-left ' />
          </Navigator>
          <View className='part_right'>
            <View className={titleClass}>{title}</View>
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
          <View className='place_holder' />
          <View className='part_right'>
            <View className={titleClass}>{title}</View>
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
          <Navigator
            // openType={props.ifClickBackExit ? 'exit' : (//注: exit只有真机调试才有效 *不能这样写！不然退出卖家版进入买家版时会保留卖家版进入时的页面和参数
            //   props.siwtchTabUrl ? 'switchTab' : 'navigateBack'
            // )}   
            openType={(
              state.siwtchTabUrl ? 'switchTab' : 'navigateBack'
            )}
            url={state.siwtchTabUrl}
            onClick={() => handleClickBackButton()}
          >
            <View className='at-icon at-icon-chevron-left ' />
          </Navigator>
          <View className='part_right'>
            <View className={titleClass}>{title}</View>
            <View className='place_holder' />{/*占位*/}
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
          (app.$app.globalData.layoutData && app.$app.globalData.layoutData.NAV_BAR_HEIGHT) + 'rpx;'}
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