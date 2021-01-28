import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import * as actions from '../../../../redux/actions'

import './SearchBar.scss'

const db = wx.cloud.database();
const _ = db.command


/****
 * <SearchBar
toggleSearchBar={(ifOpen) => this.toggleSearchBar(ifOpen)}
/>
 */
const SearchBar = (props) => {
  const dispatch = useDispatch();
  const initState = {
    searchBarValue: '',
  }
  const [state, setState] = useState(initState);
  useEffect(() => {
    if (state.searchBarValue && state.searchBarValue.length > 0) {
      doSearch();
    } else {
      dispatch(actions.setSearchedShopList([]));
      dispatch(actions.setSearchedProductList([]));
      // dispatch(actions.toggleLoadingSpinner(false));
    }
  }, [state.searchBarValue])


  const doSearch = async () => {
    dispatch(actions.toggleLoadingSpinner(true));
    let c1 = new wx.cloud.Cloud({
      resourceAppid: 'wx8d82d7c90a0b3eda',
      resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
    })

    await c1.init({
      secretId: 'AKIDwiHc09xCF3cwDFrESWOHxNZXLCfvRL2W',
      secretKey: 'XZfka5K83yeKnAcBCShS4SgS3cBXfXBs',
      env: 'miemie-buyer-7gemmgzh05a6c577'
    })
    let db_1 = c1.database({
      env: 'miemie-buyer-7gemmgzh05a6c577'
    });
    let patt = new RegExp(state.searchBarValue, 'i');// /input/i

    // wx.cloud.callFunction({
    //   name: 'get_data',
    //   data: {
    //     collection: 'shops',

    //     queryTerm: {
    //       shopInfo: { shopName: patt }
    //     },//*problem RegExp对象好像传不进云函数
    //   },
    //   success: (res) => {
    //     dispatch(actions.setSearchedShopList((res && res.result && res.result.data) ?
    //       res.result.data : []));
    //     dispatch(actions.toggleLoadingSpinner(false));//*unfinished, 应该让两个都查询完再关掉loading spinner
    //   },
    //   fail: () => {
    //     console.error
    //     dispatch(actions.toggleLoadingSpinner(false));
    //   }
    // });
    db_1.collection('shops').where({
      shopInfo: {
        shopName: patt
      }
    }).get().then((res) => {
      dispatch(actions.setSearchedShopList((res && res.data) ? res.data : []));
      dispatch(actions.toggleLoadingSpinner(false));//*unfinished, 应该让两个都查询完再关掉loading spinner
    });
    // wx.cloud.callFunction({
    //   name: 'get_data',
    //   data: {
    //     collection: 'products',

    //     queryTerm: { name: patt },
    //   },
    //   success: (res) => {
    //     dispatch(actions.setSearchedProductList((res && res.result && res.result.data) ?
    //       res.result.data : []));
    //     dispatch(actions.toggleLoadingSpinner(false));
    //   },
    //   fail: () => {
    //     console.error
    //     dispatch(actions.toggleLoadingSpinner(false));
    //   }
    // });
    db_1.collection('products').where({
      name: patt
    }).get().then((res) => {
      dispatch(actions.setSearchedProductList(res && res.data ? res.data : []));
      dispatch(actions.toggleLoadingSpinner(false));
    });
  }

  const handleChangeSearchBar = (v) => {
    //console.log('onchange');
    setState({
      ...state,
      searchBarValue: v
    });
    v.length > 0 ?
      props.toggleSearchBar(true) :
      props.toggleSearchBar(false);
  }

  const handleBlur = () => {
    //console.log('onb');
    state.searchBarValue.length < 1 &&
      props.toggleSearchBar(false);
  }

  const handleFocus = () => {
    //console.log('onFocus');
    props.toggleSearchBar(true)
  }



  return (
    <View className='shopping_page_search_bar'>
      <AtSearchBar
        value={state.searchBarValue}
        onChange={handleChangeSearchBar.bind(this)}
        onFocus={() => handleFocus()}
        onBlur={() => handleBlur()}
      />
    </View>
  )
}

export default SearchBar;