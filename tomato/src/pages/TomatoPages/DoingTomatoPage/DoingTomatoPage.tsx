import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import './DoingTomatoPage.scss'

/***
 * 正在进行番茄
 */
const DoingTomatoPage = (props) => {
  const initState = {
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  return (
    <View className={' '.concat(props.className)}>

    </View>
  )
}
DoingTomatoPage.defaultProps = {
};
export default DoingTomatoPage;