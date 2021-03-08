import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import * as actions from '../../../redux/actions'

import SolitaireOrderList from './SolitaireOrderList/SolitaireOrderList'
 import SolitaireContainer from '../../../containers/SolitaireContainer/SolitaireContainer'
import Layout from '../../../components/Layout/Layout'

import './InsideSolitairePage.scss'


const InsideSolitairePage = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const shopsManager = useSelector(state => state.shopsManager);
  const userManager = useSelector(state => state.userManager);
  const app = getApp()
  const initState = {
    solitaire: null,
    solitaireShop: null,//当前用户为接龙创建者时才会用到这个
  }
  const [state, setState] = useState(initState);
  const [mode, setMode] = useState(props.mode ? props.mode : 'BUYER');//'BUYER','SELLER'

  useEffect(() => {

    setMode(router.params.mode);
    doUpdate()
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const doUpdate = async () => {
    dispatch(actions.toggleLoadingSpinner(true));

    let solitaire = state.solitaire
    let solitaireShop = state.solitaireShop
    let solitaireId = router.params.solitaireId;
    let res = await wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'solitaires',

        queryTerm: { _id: solitaireId },
      },
    });
    if (!(res && res.result && res.result.data && res.result.data.length > 0)) { return }
    solitaire = res.result.data[0]

    if (solitaire && (userManager.unionid === solitaire.authId)) {
      let r = await wx.cloud.callFunction({
        name: 'get_data',
        data: {
          collection: 'solitaireShops',

          queryTerm: { _id: solitaire.solitaireShopId },
        },
      });
      if (r && r.result && r.result.data && r.result.data.length > 0) {
        solitaireShop = r.result.data[0]
      }
    }

    setState({
      ...state,
      solitaire: solitaire,
      solitaireShop: solitaireShop,
    });
    dispatch(actions.toggleLoadingSpinner(false));
  }


  return (
    <Layout
      className={''.concat(props.className)}
      mode={'SOLITAIRE'}
      navBarKind={2}
      lateralBarKind={0}
      navBarTitle={'接龙'}
      ifShowTabBar={false}
      hideShareMenu={state.mode === 'SELLER'}
    >
      {
        state.solitaireShop &&
        (state.solitaireShop.authId === userManager.unionid) &&//同作者才能修改 *unfinished 以后加上能添加管理员 
        <View
          className='mie_button'
          onClick={() => setMode(state.mode === 'BUYER' ? 'SELLER' : 'BUYER')}
        >修改接龙</View>
      }
      <SolitaireOrderList
        solitaireOrders={state.solitaire && state.solitaire.solitaireOrders}
      />
      <SolitaireContainer
        type={state.solitaire && state.solitaire.info && state.solitaire.info.type}
        mode={mode}
        solitaireShop={state.solitaireShop}
        solitaire={state.solitaire}
        paymentOptions={userManager.userInfo && userManager.userInfo.paymentOptions}
      // handleUpload={(solitaire, products) => handleUpload(solitaire, products)}
      /> 
    </Layout>
  )
}
InsideSolitairePage.defaultProps = {
};
export default InsideSolitairePage;