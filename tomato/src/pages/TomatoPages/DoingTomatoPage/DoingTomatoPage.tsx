import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh, useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtInput } from 'taro-ui'


import Layout from '../../../../../public/components/Layout/Layout'

import * as tool_functions from '../../../../../public/utils/functions/tool_functions'

import './DoingTomatoPage.scss'

/***
 * 正在进行番茄
 */
const DoingTomatoPage = (props) => {
  const router = useRouter();
  const initState = {
    tomatoType: JSON.parse(router.params.tomatoType),//番茄种类
    quantity: Number(router.params.quantity),

    remainingQuantity: Number(router.params.quantity),//剩下的番茄数量

    // workTime: Number(JSON.parse(router.params.tomatoType).workTime),//工作时间
    // restTime: Number(JSON.parse(router.params.tomatoType).restTime),//休息时间
    workTime: Number(5),
    restTime: Number(3),
    currentType: 'WORK',//'WORK','REST'
  }
  const [state, setState] = useState(initState);
  const [isSuspended, setIsSuspended] = useState(false);//是否暂停
  const [remainingTime, setRemainingsTime] = useState(initState.workTime + initState.restTime);//还剩的时间

  useEffect(() => {
    countDown()
  }, [remainingTime])

  useReady(() => {
    console.log('router.params',router.params);
    setState({
      ...state,
      remainingQuantity: state.remainingQuantity - 1,//一进来就减少一个番茄
    });
  })


  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const countDown = () => {//倒计时
    if (isSuspended) {//暂停
      return
    } else if (remainingTime < 1) {//这一轮倒计时结束
      if (state.remainingQuantity < 1) {
        setState({//所有倒计时都已结束
          ...state,
          currentType: 'WORK',
        });
        return;
      }
      setState({//进入下一轮倒计时
        ...state,
        remainingQuantity: state.remainingQuantity - 1,
        currentType: 'WORK',
      });
      setRemainingsTime(initState.workTime)
    } else {//倒计时继续
      if ((state.currentType === 'WORK') &&//工作时间结束，进入休息时间
        ((remainingTime - 1) == state.restTime)) {
        setState({
          ...state,
          currentType: 'REST',
        });
      }
      setTimeout(() => {
        setRemainingsTime(remainingTime - 1)
      }, 1000)
    }
  }

  const changeQuantity = (way) => {
    let addedNum = Number(way === 'ADD' ? 1 : -1)
    setState({
      ...state,
      quantity: Number(state.quantity) + addedNum,
      remainingQuantity: Number(state.remainingQuantity) + addedNum,
    });
  }
  const doRestart = () => {
    setRemainingsTime(initState.workTime)
  }
  let tomatoImg =
    <View className=''>
      现在正在{state.currentType}
      <Image
        src={state.tomatoType.imgUrl}
      />
    </View>
  return (
    <Layout
      className='doing_tomato_page'
      version={props.version}
      navBarKind={4}
      lateralBarKind={0}
      navBarTitle='种番茄'
      ifShowTabBar={false}
      ifShowShareMenu={false}
    >
      <View className=''>
        <View
          className=''
          onClick={() => changeQuantity('ADD')}
        > 加一个 </View>
        <View className=''>
          还剩{state.remainingQuantity}/{state.quantity}个番茄
        </View>
        <View
          className=''
          onClick={() => changeQuantity('SUBTRACT')}
        > 减一个 </View>
      </View>
      <View className=''>
        <View className=''>倒计时</View>
        <View className=''>{tool_functions.format_functions.prefixZero(
          Math.floor(remainingTime / 60), 2)}：</View>
        <View className=''>{tool_functions.format_functions.prefixZero(
          Math.floor(remainingTime % 60), 2)}</View>
      </View>
      {tomatoImg}
      {isSuspended ?
        <View className=''>
          <View
            className=''
            onClick={() => setIsSuspended(false)}
          >开始</View>
          <View className=''>
            <View
              className=''
              onClick={() => doRestart()}
            >重新开始</View>
            <View className=''>放弃</View>
          </View>
        </View> :
        <View
          className=''
          onClick={() => setIsSuspended(true)}
        >暂停</View>
      }
    </Layout >
  )
}
DoingTomatoPage.defaultProps = {
};
export default DoingTomatoPage;