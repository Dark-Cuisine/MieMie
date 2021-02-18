import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import Layout from '../../../components/Layout/Layout'
import SolitaireContainer from '../../../containers/SolitaireContainer/SolitaireContainer'

import './ManageSolitairesPage.scss'

/**
 * 创建新接龙or修改現有接龙   
 */
const ManageSolitairesPage = (props) => {
  const router = useRouter();
  const initState = {
    mode: 'ADD',//'ADD' 'MODIFY'
    kind: router.params.kind,//'EVENT'活动接龙,'GOODS'商品接龙

    solitaireShop: {
      pickUpWay: {
        selfPickUp: {
          list: [],//{place:'',placeDetail:',nearestStation:{line: '', stations: { list: [], from: '', to: '' }}}
          des: '',
        },
        stationPickUp: {
          list: [],//{line:'',stations:{list:[{station:'',announcements: [{date:'',list:['']}]}],from:'',to:''},floorPrice:0}
          des: '',
        },
        expressPickUp: {
          isAble: false,
          list: [], //{area:'',floorPrice: ''}//满额包邮list
          des: '',
        },
      },
    },
    solitaire: {
      pickUpWay: {
        selfPickUp: {
          list: [],//{place:'',placeDetail:',nearestStation:{line: '', stations: { list: [], from: '', to: '' }}}
          des: '',
        },
        stationPickUp: {
          list: [],//{line:'',stations:{list:[{station:'',announcements: [{date:'',list:['']}]}],from:'',to:''},floorPrice:0}
          des: '',
        },
        expressPickUp: {
          isAble: false,
          list: [], //{area:'',floorPrice: ''}//满额包邮list
          des: '',
        },
      },
    },
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })


  let kindName = state.kind === 'EVENT' ? '活动' : '商品'
  return (
    <Layout
      version={props.version}
      navBarKind={2}
      lateralBarKind={0}
      navBarTitle={(state.mode === 'ADD' ? '新建' : '修改').concat(
        kindName, '接龙'
      )}
      ifShowTabBar={false}

      initUrl={router.path}
    >
      <SolitaireContainer
        kind={state.kind}
        solitaireShop={state.solitaireShop}
        solitaire={state.solitaire}
      />
    </Layout>
  )
}
ManageSolitairesPage.defaultProps = {
  version: 'SELLER'
};
export default ManageSolitairesPage;