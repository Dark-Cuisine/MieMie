import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import SwipeCard from '../SwipeCard/SwipeCard'

import './SwipeActionCard.scss'

const FIXED_POSITION = -180;//固定时的位置

/***
 * <SwipeActionCard
 * onClick = {(e) => handleActionButton(e)}//返回被点击option的id
isOpened = { isOpened }
onOpened = {() => { setIsOpened(true); }}
onClosed = {() => { setIsOpened(false); }}
options = {[
    {
      id: 'edit',
      text: '修改',
      style: {
        backgroundColor: 'var(--light-2)'
      }
    }
  ]}
 * disabled={}
 *
 * />
 */
const SwipeActionCard = (props) => {
  const initState = {
  }
  const [state, setState] = useState(initState);
  const [isOpened, setOpened] = useState(props.isOpened);

  useEffect(() => {
    setOpened(props.isOpened)
  }, [props.isOpened])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })


  return (
    <View className={'swipe_action_card '.concat(props.className)}>
      <SwipeCard
        className={'swipe_action_card_content '.concat(isOpened && 'fixed')}
        canMoveRight={isOpened || false}
        disabled={props.disabled}
        DO_ACTION_TH={isOpened ? 30 : 50}
        ifChangeColor={false}
        handleClickButtonLeft={() => props.onOpened()}
        handleClickButtonRight={() => props.onClosed()}
        startingPosition={isOpened && FIXED_POSITION}
        onClick={isOpened ?
          () => props.onClosed() :
          () => props.onClick()
        }
        onLongPress={!props.disabled && props.onLongPress}
      >
        {props.children}
      </SwipeCard>
      <View className='swipe_action_card_options'>
        {props.options &&
          props.options.map((it, i) => {
            return (
              <View
                className='option_button'
                style={it.style}
                onClick={() => props.onClick(it)}
              >
                {it.text && it.text.length < 3 ?
                  it.text :
                  <View className=''>
                    <View className=''>{it.text && it.text.slice(0, 2)}</View>
                    <View className=''>{it.text && it.text.slice(2, it.text.length)}</View>
                  </View>
                }
              </View>
            )
          })}
      </View>
    </View >
  )
}
SwipeActionCard.defaultProps = {
  disabled: false,
  onClick: () => { },
};
export default SwipeActionCard;