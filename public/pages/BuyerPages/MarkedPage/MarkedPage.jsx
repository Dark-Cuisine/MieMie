import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtModal } from 'taro-ui'
import * as actions from '../../../redux/actions'
import { connect } from 'react-redux'

import Layout from '../../../components/Layout/Layout'
import ShopCard from '../../../components/cards/ShopCard/ShopCard'

import './MarkedPage.scss'

const db = wx.cloud.database();
const _ = db.command;


const MarkedPage = (props) => {
  const dispatch = useDispatch();
  const userManager = useSelector(state => state.userManager);
  const initState = {
    markedShops: [],
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    doUpdate()
  }, [userManager])

  usePullDownRefresh(() => {
    doUpdate();
    Taro.stopPullDownRefresh()
  })
  const doUpdate = () => {
    if (userManager.userInfo && userManager.userInfo.markedShops && userManager.userInfo.markedShops.length > 0) {
      dispatch(actions.toggleLoadingSpinner(true));
      wx.cloud.callFunction({
        name: 'get_data',
        data: {
          collection: 'shops',
          operatedItem: '_ID',
          queriedList: userManager.userInfo.markedShops,
        },
        success: (res) => {
          dispatch(actions.toggleLoadingSpinner(false));
          if (res && res.result && res.result.data) {
            setState({
              ...state,
              markedShops: res.result.data
            });
          }
        },
        fail: () => {
          dispatch(actions.toggleLoadingSpinner(false));
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          })
          console.error
        }
      });
    } else {
      setState({
        ...state,
        markedShops: initState.markedShops,
      });
    }
  }
  return (
    <Layout
      version={props.version}
      className='marked_page'
      mode='BUYER'
      navBarKind={3}
      lateralBarKind={0}
      navBarTitle='我的收藏'
    >
      {state.markedShops.length > 0 ?
        state.markedShops.map((it, i) => {
          return (
            <ShopCard
              key={i}
              shop={it}
              hasMarkDialog={true}
            />
          )
        }) :
        <View className='empty_word'>暂无收藏</View>
      }
    </Layout>
  )
}

export default MarkedPage;