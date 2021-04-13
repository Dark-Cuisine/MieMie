import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import './SwipeCard.scss'

const SHOW_ATTENTION_TEXT_TH = 30;//左右划显示attentionText的阈值
const DO_ACTION_TH = 150;//左右划执行动作的阈值
const MOVE_ACTION_TH = 30;//左右划card位置移动的阈值


/*** 可滑动的card (未完成)
 * <SwipeCard
 * mode={}//0:左移 1:右移 2:左右移
 * 
 * buttonList=[{
 * word:'修改',
 * onClick:()=>xxx(),
 * }]
 */
const SwipeCard = (props) => {
  const initState = {
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  return (
    <View
      className={'swipe_card'.concat(props.className)}
      style={
        (Math.abs(state.moveX) > MOVE_ACTION_TH) &&
        'left:'.concat(state.moveX, 'px;').concat(
          (Math.abs(state.moveX) > DO_ACTION_TH) ? 'background:var(--light-0);' : ''
        )
      } //控制左右移动
    >

    </View>
  )
}
SwipeCard.defaultProps = {
};
export default SwipeCard;