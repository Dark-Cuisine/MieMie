import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Navigator } from '@tarojs/components'
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
  const router = useRouter();
  const shopsManager = useSelector(state => state.shopsManager);
  const userManager = useSelector(state => state.userManager);
  const initState = {
    shop: null,

  }
  const [state, setState] = useState(initState);
  const [mode, setMode] = useState('BUYER');//'BUYER','SELLER'

  useEffect(() => {
    let currentShopId = null;

    if (router.params.shopId) {//此时是从卖家版app进来
      currentShopId = router.params.shopId
    } else if (shopsManager.currentShopId && shopsManager.currentShopId.length > 0) {//此时是从买家版app进来
      currentShopId = shopsManager.currentShopId
    } else {
      return
    }

    dispatch(actions.toggleHideMode('NORMAL', 'HIDED', 'NORMAL'));
    dispatch(actions.toggleLoadingSpinner(true));

    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'shops',

        queryTerm: { _id: currentShopId },
      },
      success: (res) => {
        dispatch(actions.toggleLoadingSpinner(false));
        if (!(res && res.result && res.result.data && res.result.data.length > 0)) { return }
        setState({
          ...state,
          shop: res.result.data[0]//*别忘了【0】
        });
        if (router.params.shopId &&
          userManager.unionid && (userManager.unionid == res.result.data[0].shopInfo.ownerId)
        ) {//*可优化 这里用来判断是否是从卖家版打开的
          setMode('SELLER')
        }
      },
      fail: () => {
        dispatch(actions.toggleLoadingSpinner(false));
        console.error
      }
    });

  }, [])

  const handleClickBackButton = () => {
    dispatch(actions.toggleHideMode('NORMAL', 'NORMAL', 'NORMAL'))
  }

  let shopName = state.shop ? state.shop.shopInfo.shopName : ''
  return (
    <Layout
      className='inside_shop_page'
      // version={props.version}
      // version={mode}
      mode={'BUYER'}
      navBarKind={2}
      lateralBarKind={1}
      // navBarTitle={state.shop ? state.shop.shopInfo.shopName : ''}
      navBarTitle={shopName}
      ifShowTabBar={false}

      handleClickBackButton={() => handleClickBackButton()}

      siwtchTabUrl={(router.params.shopId && mode === 'BUYER') ?
        '/pages/BuyerPages/ShoppingPage/ShoppingPage' : null}
      ifClickBackExit={mode === 'SELLER'}
    >
      <View className='header'>
        {state.shop &&
          <ShopInfoContainer
            // mode={mode === 'BUYER' ? 'BUYER' : 'SELLER_PREVIEW'}
            mode={'BUYER'}//*unfinished
            shop={state.shop}
          />
        }
      </View>

      <ShopProductsContainer
        // mode={mode === 'BUYER' ? 'BUYER' : 'SELLER_PREVIEW'}
        mode={'BUYER'}
        shop={state.shop}
      />
    </Layout>
  )
}
InsideShopPage.defaultProps = {
  mode: 'BUYER',
};
export default InsideShopPage;