import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import * as actions from "../../../redux/actions/index";

import Layout from '../../../components/Layout/Layout'
import SolitaireContainer from '../../../containers/SolitaireContainer/SolitaireContainer'

import * as databaseFunctions from '../../../utils/functions/databaseFunctions'

import './ManageSolitairesPage.scss'

/**
 * 创建新接龙or修改現有接龙   
 */
const ManageSolitairesPage = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userManager = useSelector(state => state.userManager);
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

  const handleUpload = async (solitaire, products) => {
    console.log('handleUpload-solitaire', solitaire);
    let solitaireShopId = userManager.userInfo && userManager.userInfo.mySolitaireShops &&
      userManager.userInfo.mySolitaireShops.length > 0 && userManager.userInfo.mySolitaireShops[0]//因为每个用户只能有一个接龙店，所以这里直接用了[0] *unfinished 要优化
    if (state.mode === 'ADD') {//创建接龙
      if (!(solitaireShopId && solitaireShopId.length > 0)) { //如果当前用户第一次建接龙，则先新建接龙店，再把接龙加到接龙店
        await databaseFunctions.solitaire_functions.addNewSoltaireShop(userManager.unionid, solitaire, products)
       } else { //否则直接把新的接龙添加到该用户的接龙店
        await databaseFunctions.solitaire_functions.addNewSolitaire(userManager.unionid, solitaireShopId, solitaire, products)
      }
    } else {//修改接龙
      await databaseFunctions.solitaire_functions.addNewSolitaire(userManager.unionid, solitaireShopId, solitaire, products)
    }
     dispatch(actions.setUser(userManager.unionid, userManager.openid));//更新用户信息


  }

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
        handleUpload={(solitaire, products) => handleUpload(solitaire, products)}
      />
    </Layout>
  )
}
ManageSolitairesPage.defaultProps = {
  version: 'SELLER'
};
export default ManageSolitairesPage;