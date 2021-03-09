import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import * as actions from '../../../../redux/actions'

import './SolitaireOrderList.scss'

/***
 *<SolitaireOrderList
        solitaireOrders={state.solitaire.solitaireOrders}
      /> 
 */
const SolitaireOrderList = (props) => {
  const dispatch = useDispatch();
  const initState = {
    solitaireOrders: [],
  }

  const [state, setState] = useState(initState);

  useEffect(() => {
    doUpdate()
  }, [props.solitaireOrders])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const doUpdate = async () => {
    dispatch(actions.toggleLoadingSpinner(true));

    if (!(props.solitaireOrders && props.solitaireOrders.length > 0)) {
      dispatch(actions.toggleLoadingSpinner(false));
      return
    }
    let res = await wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'solitaireOrders',

        operatedItem: '_ID',
        queriedList: props.solitaireOrders,
      },
    });

    if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
      dispatch(actions.toggleLoadingSpinner(false));
      return
    }
    setState({
      ...state,
      solitaireOrders: res.result.data,
    });

    dispatch(actions.toggleLoadingSpinner(false));
  }

  console.log('j-0', state.solitaireOrders);
  return (
    <View className={'solitaire_orders_list '.concat(props.className)}>
      <View className=''>接龙:</View>
      {state.solitaireOrders.map((it, i) => {
        return (
          < View
            className=''
          >
            <View className=''>{i}</View>
            <View className=''>
              <View className=''>创建时间:</View>
              <View className=''>{it.createTime}</View>
            </View>
            <View className=''>
              <View className=''>创建者:</View>
              <View className=''>{it.buyerName}</View>
            </View>
          </View>
        )
      })}
    </View >
  )
}
SolitaireOrderList.defaultProps = {
};
export default SolitaireOrderList;