import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import * as actions from '../../../redux/actions'

import Layout from '../../../components/Layout/Layout'
import ShopProductsContainer from '../../../containers/ShopProductsContainer/ShopProductsContainer'
import ShopInfoContainer from '../../../containers/ShopInfoContainer/ShopInfoContainer'
import PickUpWayContainer from '../../../containers/PickUpWayContainer/PickUpWayContainer'

import './InsideShopPage.scss'

const db = wx.cloud.database();
const _ = db.command

const InsideShopPage = (props) => {
  const dispatch = useDispatch();
  const initState = {
    shop: null,

   }
  const [state, setState] = useState(initState);
  const shopsManager = useSelector(state => state.shopsManager);

  useEffect(() => {
    dispatch(actions.toggleHideMode('NORMAL', 'HIDED', 'NORMAL'));
    dispatch(actions.toggleLoadingSpinner(true));

    if (shopsManager.currentShopId && shopsManager.currentShopId.length > 0) {
      wx.cloud.callFunction({
        name: 'get_data',
        data: {
          collection: 'shops',

          queryTerm: { _id: shopsManager.currentShopId },
        },
        success: (res) => {
          dispatch(actions.toggleLoadingSpinner(false));
          res && res.result && res.result.data && res.result.data.length > 0 &&
            setState({
              ...state,
              shop: res.result.data[0]//*别忘了【0】
            });
        },
        fail: () => {
          dispatch(actions.toggleLoadingSpinner(false));
          console.error
        }
      });

    }
  }, [])

 

  return (
    <Layout
      className='inside_shop_page'
      version={props.version}
      navBarKind={2}
      lateralBarKind={1}
      navBarTitle={state.shop ? state.shop.shopInfo.shopName : ''}
      ifShowTabBar={false}
    >
      <View className='header'>
        {state.shop &&
          <ShopInfoContainer
            mode='BUYER'
            shop={state.shop}
           />
        }
      </View>

      <ShopProductsContainer
        mode='BUYER'
        shop={state.shop}
      />
    </Layout>
  )
}

export default InsideShopPage;