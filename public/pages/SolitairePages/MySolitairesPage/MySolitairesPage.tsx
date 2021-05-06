import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import * as actions from '../../../redux/actions'

import SolitaireCard from '../../../components/cards/SolitaireCard/SolitaireCard'
import Layout from '../../../components/Layout/Layout'

import './MySolitairesPage.scss'

/**
 * 我发布的接龙 
 */
const MySolitairesPage = (props) => {
  const dispatch = useDispatch();
  const userManager = useSelector(state => state.userManager);
  const layoutManager = useSelector(state => state.layoutManager);
  const initState = {
    solitaires: [],
  }
  const [state, setState] = useState(initState);
  const [openedCardId, setOpenedCardId] = useState(null);

  useEffect(() => {
    doUpdate()
  }, [userManager.unionid, userManager.userInfo, layoutManager.currentTabId])

  usePullDownRefresh(() => {
    doUpdate()
    Taro.stopPullDownRefresh()
  })

  const doUpdate = () => {
    let mySolitaireShopId = userManager.userInfo.mySolitaireShops &&
      userManager.userInfo.mySolitaireShops[0]//因为每个用户只能有一个接龙店，所以这里直接用了[0] *unfinished 要优化
    if (!mySolitaireShopId) { return }
    dispatch(actions.toggleLoadingSpinner(true));
    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'solitaireShops',

        queryTerm: { _id: mySolitaireShopId },
      },
      success: (res) => {
        console.log('get-solitaireShops', res);
        if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
          dispatch(actions.toggleLoadingSpinner(false));
          return
        }
        let solitaires = res.result.data[0].solitaires;
        if (!(solitaires && solitaires.length > 0)) {
          dispatch(actions.toggleLoadingSpinner(false));
          return;
        }
        wx.cloud.callFunction({
          name: 'get_data',
          data: {
            collection: 'solitaires',

            operatedItem: '_ID',
            orderBy: 'createTime',//根据时间排序
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
      },
      fail: () => {
        console.error
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        dispatch(actions.toggleLoadingSpinner(false));
      }
    });

  }

  return (
    <Layout
      version={props.version}
      className='my_solitaires_page'
      mode='SOLITAIRE'
      navBarKind={3}
      navBarTitle='我发布的接龙'
    >
      <View className='solitaire_list'>
        {state.solitaires.map((it, i) => {
          return (
            <SolitaireCard
              solitaire={it}
              mode='SELLER'
              isOpened={it._id === openedCardId}
              onOpened={(id) => { setOpenedCardId(id) }}
              onClosed={() => { setOpenedCardId(null) }}
            />
          )
        })}
      </View>
    </Layout>
  )
}
MySolitairesPage.defaultProps = {
  version: 'SOLITAIRE',
};
export default MySolitairesPage;