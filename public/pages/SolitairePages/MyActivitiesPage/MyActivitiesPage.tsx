import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import * as actions from '../../../redux/actions'

import Layout from '../../../components/Layout/Layout'

import './MyActivitiesPage.scss'

/**
 * 我参与的接龙 
 */
const MyActivitiesPage = (props) => {
  const dispatch = useDispatch();
  const userManager = useSelector(state => state.userManager);
  const initState = {
    solitaires: [],
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    doUpdate()
  }, [userManager.unionid])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const doUpdate = () => {
    let solitaireOrders = userManager.userInfo.solitaireOrders
    if (!(solitaireOrders && solitaireOrders.length > 0)) { return }
    let solitaires = solitaireOrders.map(it => {
      return it.solitaireId
    })

    dispatch(actions.toggleLoadingSpinner(true));
    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'solitaires',

        operatedItem: '_ID',
        orderBy: 'createTime',//根据时间排序  *unfinished 这里应该用客户下单时间来排序
        desc: 'desc',//新前旧后
        queriedList: solitaires,
      },
      success: (r) => {
        dispatch(actions.toggleLoadingSpinner(false));
        if (!(r && r.result && r.result.data && r.result.data.length > 0)) {
          return
        }
        setState({
          ...state,
          solitaires: r.result.data
        });
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


  }
  const goToInsideSolitairePage = (mode, solitaire) => {
    Taro.navigateTo({
      url: `/pages/SolitairePages/InsideSolitairePage/InsideSolitairePage?solitaireId=${solitaire._id}&mode=${mode}`
    });
  }
  return (
    <Layout
      version={props.version}
      className='my_activities_page'
      mode='SOLITAIRE'
      navBarKind={3}
      navBarTitle='我参与的接龙'
    >
      {state.solitaires.map((it, i) => {
        return (
          <View className='solitaire_item'>
            <View
              className=''
              onClick={() => goToInsideSolitairePage('BUYER', it)}
            >
              接龙号：{it._id}
              <View className='solitaire_des'>
                {it.info && it.info.des}
              </View>
            </View>
          </View>
        )
      })}    </Layout>
  )
}
MyActivitiesPage.defaultProps = {
  version: 'SOLITAIRE',
};
export default MyActivitiesPage;