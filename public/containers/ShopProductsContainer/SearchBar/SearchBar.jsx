import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import * as actions from '../../../redux/actions'

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
    productList: props.productList,

    searchBarValue: '',
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    setState({
      ...state,
      productList: initState.productList,
    });
  }, [props.productList])

  useEffect(() => {
    doUpdate()
  }, [state.searchBarValue])

  const doUpdate = () => {
    if (state.searchBarValue.length > 0) {
      dispatch(actions.toggleLoadingSpinner(true));

      let patt = new RegExp(state.searchBarValue, 'i');// /input/i
      let matched = [];
      state.productList && state.productList.length > 0 &&
        state.productList.forEach((it) => {
          let matchIndex = it.name.search(patt);
          if (matchIndex > -1) {
            matched.push(it);
          }
        });

      dispatch(actions.setSearchedProductList(matched));
      dispatch(actions.toggleLoadingSpinner(false));
    } else {
      dispatch(actions.setSearchedProductList(state.productList));
      dispatch(actions.toggleLoadingSpinner(false));
    }
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
    doUpdate()
    props.toggleSearchBar(true)
  }



  return (
    <View className='shop_products_container_search_bar'>
      <AtSearchBar
        value={state.searchBarValue}
        onChange={handleChangeSearchBar.bind(this)}
        onFocus={() => handleFocus()}
        onBlur={() => handleBlur()}
      />
      <View className='search_ba_place_holder' />
    </View>
  )
}

export default SearchBar;