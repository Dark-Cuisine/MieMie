import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import * as tool_functions from '../../../utils/functions/tool_functions'

import './SolitaireCard.scss'

/****
 * 接龙card
 * <SolitaireCard
 * solitaire={}
 
 />
 */
const SolitaireCard = (props) => {
  const initState = {
    solitaire: props.solitaire,
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    setState({
      ...state,
      solitaire: initState.solitaire,
    });
  }, [props.solitaire])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const goToInsideSolitairePage = (mode, e = null) => {
    e && e.stopPropagation();
    Taro.navigateTo({
      url: `/pages/SolitairePages/InsideSolitairePage/InsideSolitairePage?solitaireId=${state.solitaire._id}&mode=${mode}`
    });
  }



  let claseName = (state.solitaire.info.endTime.date &&
    state.solitaire.info.endTime.date.length > 0 &&
    !tool_functions.date_functions.compareDateAndTimeWithNow(
      state.solitaire.info.endTime.date, state.solitaire.info.endTime.time)) ?
    'solitaire_card_expired' : ''

  console.log('claseName', tool_functions.date_functions.compareDateAndTimeWithNow(
    state.solitaire.info.endTime.date, state.solitaire.info.endTime.time));

  // console.log('state.solitaire', state.solitaire);
  return (
    <View
      className={'solitaire_card '.concat(props.className, ' ', claseName)}
      onClick={() => goToInsideSolitairePage('BUYER')}
    >
      <View className='date_and_time'>
        <View className='date_and_time'>
          <View className='date'>{state.solitaire.info.startTime.date}</View>
          <View className='time'>{state.solitaire.info.startTime.time}</View>
        </View>
        {(state.solitaire.info.endTime.date &&
          state.solitaire.info.endTime.date.length > 0) ?
          <View className='date_and_time'>
            <View className='to'>~</View>
            <View className='date'>{state.solitaire.info.endTime.date}</View>
            <View className='time'>{state.solitaire.info.endTime.time}</View>
          </View> :
          <View className='word'>开始</View>
        }
      </View>
      <View className='solitaire_content'>{state.solitaire.info.content}</View>
      <View className='modify_button'>
        <View
          className='mie_button '
          onClick={(e) => goToInsideSolitairePage('SELLER', e)}
        >修改</View>
      </View>
    </View>
  )
}
SolitaireCard.defaultProps = {
};
export default SolitaireCard;