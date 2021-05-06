import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import './SwipeCard.scss'



/*** 可滑动的card (未完成)
 * <SwipeCard
 * canMoveLeft={true}//能左移
 * canMoveRight={true}
 * disabled={false}//是否禁止移动
 * 
 * startingPosition={}//起始位置
 * 
 *  attentionTextLeft='左划拒单'    //左划右划
    attentionTextRight='右划接单'

    SHOW_ATTENTION_TEXT_TH = {30}//左右划显示attentionText的阈值
    DO_ACTION_TH = 150;//左右划执行动作的阈值
    MOVE_ACTION_TH = 30;//左右划card位置移动的阈值

ifChangeColor={}//达到DO_ACTION_TH时卡片是否变色
 * 
 */
const SwipeCard = (props) => {
  const initState = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    moveX: 0,
    attentionText: '',
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })
  const handleTouchStart = (e) => {
    setState({
      ...state,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
    });
  }
  const handleTouchMove = (e) => {
    let moveX = e.touches[0].clientX - state.startX
    let attentionText = '';
    if (props.attentionTextRight || props.attentionTextLeft) {
      (moveX > props.SHOW_ATTENTION_TEXT_TH) &&
        (attentionText = props.attentionTextRight || '');//右移显示attentionTextLeft
      (moveX < -props.SHOW_ATTENTION_TEXT_TH) &&
        (attentionText = props.attentionTextLeft || '');//左移显示attentionTextLeft
    }
    setState({
      ...state,
      endX: e.touches[0].clientX,
      endY: e.touches[0].clientY,
      moveX: moveX,
      attentionText: attentionText,
    });
  }
  const handleTouchEnd = () => {  //移动结束时判断是否执行动作
    if (state.moveX > props.DO_ACTION_TH) {
      console.log('-->');
      props.handleClickButtonRight && props.handleClickButtonRight();
    } else if (state.moveX < -props.DO_ACTION_TH) {
      console.log('<--');
      props.handleClickButtonLeft && props.handleClickButtonLeft();
    }

    setState({
      ...state,
      startX: initState.startX,
      startY: initState.startY,
      endX: initState.endX,
      endY: initState.endY,
      moveX: initState.moveX,
      attentionText: initState.attentionText,
    });
  }

  let moveLeft =
    !props.disabled &&
    ((props.canMoveLeft && state.moveX < 0) ||
      (props.canMoveRight && state.moveX > 0)
    ) && state.moveX
  let changedColor =
    !props.disabled &&
    props.ifChangeColor &&
    props.DO_ACTION_TH &&
    (Math.abs(state.moveX) > props.DO_ACTION_TH) &&
    ((props.canMoveLeft && state.moveX < 0) ||
      (props.canMoveRight && state.moveX > 0)
    ) && 'background:var(--light-0);'

  let style =
    !props.disable &&
    (Math.abs(state.moveX) > props.MOVE_ACTION_TH) &&
    (
      'left:'.concat((props.startingPosition + moveLeft),
        'PX;', changedColor)
    );
  // console.log('m-0', state.moveX, moveLeft,
  //   props.startingPosition, moveLeft,
  //   props.startingPosition + moveLeft);
  return (
    <View
      className={'swipe_card '.concat(props.className)}
      style={style}
      onTouchStart={handleTouchStart.bind(this)}
      onTouchMove={handleTouchMove.bind(this)}
      onTouchEnd={handleTouchEnd.bind(this)}
      onClick={() => props.onClick()}
    >
      {props.children}
    </View>
  )
}
SwipeCard.defaultProps = {
  SHOW_ATTENTION_TEXT_TH: 30,//左右划显示attentionText的阈值
  DO_ACTION_TH: 0,//左右划执行动作的阈值
  MOVE_ACTION_TH: 30,//左右划card位置移动的阈值

  startingPosition: 0,

  canMoveLeft: true,
  canMoveRight: true,
  disabled: false,

  ifChangeColor: false,

};
export default SwipeCard;