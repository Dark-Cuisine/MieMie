import React, { Component, useState, useReducer, forwardRef, useImperativeHandle, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import * as actions from '../../redux/actions'

import './SearchBar.scss'

const db = wx.cloud.database();
const _ = db.command

/****
 * <SearchBar
    itemList={[]}
    beginSearching={() => toggleSearching(true)}
    stopSearching={() => toggleSearching(false)}

    getMatchedList={(matched) => setSearchedOrders(matched)}
/>
 */
const SearchBar = (props, ref) => {
  const dispatch = useDispatch();
    const app = getApp()
  const initState = {
    searchBarInput: '',
  }
  const [state, setState] = useState(initState);
  const [isSearching, setIsSearching] = useState(false);


  // useEffect(() => {
  //   setIsSearching(props.isSearching)
  // }, [props.isSearching])

  useEffect(() => {
    if (state.searchBarInput.length > 0) {
      let matched = filterMachedItems(props.itemList, state.searchBarInput)
      props.getMatchedList(matched);
    } else {
    }
  }, [state.searchBarInput])


  const filterMachedItems = (list, matchValue) => {
    let patt = props.patt ? props.patt :
      (new RegExp(matchValue, 'i'));// /input/i
    let matched = [];
    list && list.length > 0 && list.forEach((it) => {
      let index = it._id.search(patt);
      (index > -1) && matched.push(it);
    });
    return matched;
  }

  const handleChangeSearchBar = (v) => {
    setState({
      ...state,
      searchBarInput: v,
    });
    setIsSearching(v.length < 1)
      (v.length < 1) ?
      props.stopSearching() :
      props.beginSearching()
  }


  const handleBlur = () => {
    console.log('blur');
    if (state.searchBarInput.length < 1) {
      props.stopSearching()
      setIsSearching(false)
    }
  }
  const handleFocus = () => {
    setIsSearching(true)
    props.beginSearching()
  }

  return (
    // <View className={'search_bar '.concat(isSearching ?
    //   'search_bar_searching' : ''
    // )}>
    <View className={'search_bar '}>
      <AtSearchBar
        focus={state.isSearching}
        value={state.searchBarInput}
        onChange={handleChangeSearchBar.bind(this)}
        onFocus={() => handleFocus()}
        onBlur={() => handleBlur()}
        style={'top:' + app.$app.globalData.layoutData.NAV_BAR_HEIGHT + 'rpx'}//* must use () outside ..&&.. or it will trow an err when app.$app.globalData.layoutData==null
      />
      <View className='search_bar_place_holder' />
    </View>
  )
}

export default forwardRef(SearchBar);