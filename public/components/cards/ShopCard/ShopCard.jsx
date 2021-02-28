import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtInput, AtModal } from 'taro-ui'
import * as actions from '../../../redux/actions'

import LoginDialog from '../../dialogs/LoginDialog/LoginDialog'
import ActionDialog from '../../dialogs/ActionDialog/ActionDialog'
import Dialog from '../../dialogs/Dialog/Dialog'

import * as databaseFunctions  from '../../../utils/functions/databaseFunctions'

import './ShopCard.scss'

 const db = wx.cloud.database();
const _ = db.command;

/**
 * 店铺card
 * <ShopCard
    shop={it}
    hasMarkDialog={false}
/>
 */
const ShopCard = (props) => {
  const dispatch = useDispatch();
  const userManager = useSelector(state => state.userManager);
  const initState = {
    isMarked: false,
    ifOpenCancelMarkDialog: false,
    openedDialog: null,//'ANNO','CANCEL_MARK'
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    if (userManager.userInfo && userManager.userInfo.markedShops) {
      let isMarked = userManager.userInfo.markedShops.indexOf(props.shop._id) > -1;
      setState({
        ...state,
        isMarked: isMarked,
      });
    }
  }, [userManager.userInfo])

  //toggle dialog
  const toggleDialog = (openedDialog = null) => {
    console.log('toggleDialog');
    setState({
      ...state,
      openedDialog: openedDialog
    });
  }
  //跳去该店铺的页面
  const navigateToInsideShopPage = () => {
    dispatch(actions.setCurrentShopId(props.shop._id));
    Taro.navigateTo({
      url: '/pages/PublicPages/InsideShopPage/InsideShopPage',
      // url: `/pages/PublicPages/InsideShopPage/InsideShopPage?shopId=${props.shop._id}`,
    });
  }

  //handle mark shop
  const handleMarkShop = (e) => {
    e && e.stopPropagation();//阻止冒泡

    props.hasMarkDialog ?
      toggleDialog('CANCEL_MARK') :
      dispatch(actions.handleMark('SHOP', userManager.unionid, props.shop._id, !state.isMarked))

  }

  //
  const handleClickAnno = (e) => {
    e && e.stopPropagation();
    setState({
      ...state,
      openedDialog: 'ANNO'
    });
  }
  let annoDialog = (
    <Dialog
      isOpened={state.openedDialog === 'ANNO'}
      onClose={() => toggleDialog()}
      title='地摊公告'
    >
      {props.shop && props.shop.announcements && props.shop.announcements.length > 0 && props.shop.announcements[0]}
    </Dialog>
  )

  let cancelMarkDialog = (
    <ActionDialog
      isOpened={state.openedDialog === 'CANCEL_MARK'}
      type={1}
      leftWord='取消'
      rightWord='确认'
      onClose={() => toggleDialog()}
      onCancel={() => toggleDialog()}
      onSubmit={() => dispatch(actions.handleMark('SHOP', userManager.unionid, props.shop._id, false))}
    >
      确定取消收藏？
    </ActionDialog>
  )
  let loginDialog =
    <LoginDialog
      words='请先登录'
      version={props.version}
      isOpened={state.openedDialog === 'LOGIN'}
      onClose={() => toggleDialog()}
      onCancel={() => toggleDialog()}
    />;

  return (
    <View className='shop_card' >
      {loginDialog}
      {annoDialog}
      {cancelMarkDialog}
      <View
        className='card'
      >
        <View
          className='flex'
        >
          <Image
            src={props.shop.shopInfo.shopIcon && props.shop.shopInfo.shopIcon.length > 0 &&
              props.shop.shopInfo.shopIcon[0].url}
            onClick={() => navigateToInsideShopPage()}
          />
          <View className='shop_content'>
            {props.shop.announcements && props.shop.announcements.length > 0 &&
              props.shop.announcements[0].length > 0 &&
              <View
                className='shop_anno'
                onClick={(e) => handleClickAnno(e)}
              >
                <View
                  className='at-icon at-icon-volume-minus'
                />
                <View className='word' >
                  {props.shop.announcements[0]}
                </View>
              </View>
            }
            <View className='shop_name'
              onClick={() => navigateToInsideShopPage()}
            >
              {props.shop.shopInfo.shopName}
            </View>
            <View className='shop_des'
              onClick={() => navigateToInsideShopPage()}
            >
              {props.shop.shopInfo.des}
            </View>
          </View>
        </View>
        <View
          className={'mark_star ' + 'at-icon at-icon-' +
            (state.isMarked ? 'star-2' : 'star')}
          onClick={(userManager.unionid && userManager.unionid.length > 0) ?//如果没登录就打开登录窗
            (e) => handleMarkShop(e) : () => toggleDialog('LOGIN')
          }
        />
      </View>

    </View>
  )
}

export default ShopCard;