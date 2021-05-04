import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import './PickUpWayContainer.scss'

/***
 * <PickUpWayContainer
 * type={} //'GOODS''EVENT'
 * mode={}//'BUYER''SELLER'
 />
 */
const PickUpWayContainer = (props) => {
  const initState = {
    //正在修改的项目,同时也用作init新项目
    modifyingSelfPickUp: { place: '', placeDetail: '', nearestStation: { line: '', stations: { list: [], from: '', to: '' } }, announcements: [], dates: [] },

  }
  const [state, setState] = useState(initState);
  const words = props.type === 'GOODS' ? {
    selfPickUp: '自提点',
    stationPickUp: '送货车站',
  } : {
    selfPickUp: '集合点',
    stationPickUp: '集合车站',
  }

  useEffect(() => {
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const handleChange = (way, v = null, i = null) => {
    switch (way) {
      case 'SELF_PICK_UP_PLACE'://self pick up
        setState({
          ...state,
          modifyingSelfPickUp: {
            ...state.modifyingSelfPickUp,
            place: v
          }
        });
        break;
      case 'SELF_PICK_UP_PLACE_DETAIL':
        setState({
          ...state,
          modifyingSelfPickUp: {
            ...state.modifyingSelfPickUp,
            placeDetail: v
          }
        });
        break;
      case '':
        break;
      default:
        break;
    }
  }

  let inputForm =
    <View className=''>
      <AtInput
        name={'selfPickUpPlaceNew'}
        type='text'
        title={words.selfPickUp}
        cursor={state.modifyingSelfPickUp.place && state.modifyingSelfPickUp.place.length}
        value={state.modifyingSelfPickUp.place}
        onChange={v => handleChange('SELF_PICK_UP_PLACE', v)}
      />
      <AtInput
        name={'selfPickUpPlaceDetailNew'}
        type='text'
        title='详细地址'
        cursor={state.modifyingSelfPickUp.placeDetail && state.modifyingSelfPickUp.placeDetail.length}
        value={state.modifyingSelfPickUp.placeDetail}
        onChange={v => handleChange('SELF_PICK_UP_PLACE_DETAIL', v)}
      />
    </View>

  return (
    <View className={''.concat(props.className)}>
      {inputForm}
    </View>
  )
}
PickUpWayContainer.defaultProps = {
  mode: 'BUYER',
  type: 'GOODS',
};
export default PickUpWayContainer;