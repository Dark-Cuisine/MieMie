import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { usePageScroll, useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import * as actions from '../../../../../redux/actions'


import './PickUpWayChooser.scss'


const PickUpWayChooser = (props) => {
  const dispatch = useDispatch();
  const shopsManager = useSelector(state => state.shopsManager);
  const app = getApp()
  let classifications = app.$app.globalData.classifications && app.$app.globalData.classifications
  let pickUpWayList = classifications && classifications.pickUpWayList;
  const initState = {
    choosenWayList: pickUpWayList ? pickUpWayList.slice(0) : [], //默认全选//*这里必须要复制数组而不能直接用‘choosenWayList: pickUpWayList’否则会直接改变原数组
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    let classifications = app.$app.globalData.classifications && app.$app.globalData.classifications
    let pickUpWayList = classifications && classifications.pickUpWayList;
    setState({
      ...state,
      choosenWayList: initState.choosenWayList
    });
  }, [app.$app.globalData.classifications])



  const handleClickWay = (it) => {
    let index = state.choosenWayList.indexOf(it);
    let updated = state.choosenWayList;
    (index > -1) ?
      updated.splice(index, 1) :
      updated.push(it);
    setState({
      ...state,
      choosenWayList: updated
    });

    dispatch(actions.filterShops('PICK_UP_WAY',
      shopsManager.filterOptions.shopKind, updated, shopsManager.filterOptions.stations,
      app.$app.globalData.classifications));
  }

  return (
    <View className='pick_up_way_chooser'>
      {pickUpWayList &&
        pickUpWayList.map((it, i) => {
          return (
            <View
              className='item'
              key={i}
              onclick={handleClickWay.bind(this, it)}
            >
              <View>{it}</View>
              <View
                className='check_box'
              >
                {(state.choosenWayList.indexOf(it) > -1) &&
                  <View
                    className='at-icon at-icon-check'
                  />
                }
              </View>

            </View>
          )
        })}
    </View>
  )
}

export default PickUpWayChooser;