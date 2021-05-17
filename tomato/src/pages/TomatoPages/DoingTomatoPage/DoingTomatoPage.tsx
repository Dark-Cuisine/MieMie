import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh, useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtInput } from 'taro-ui'


import Layout from '../../../../../public/components/Layout/Layout'

import * as tool_functions from '../../../../../public/utils/functions/tool_functions'

import './DoingTomatoPage.scss'

const app = getApp()
const marco = app.$app.globalData.macro
const tomatoTypes = app.$app.globalData.tomatoTypes

/***
 * 正在进行番茄
 */
const DoingTomatoPage = (props) => {
  const router = useRouter();
  const initState = {
    tomatoType: tomatoTypes[router.params.tomatoTypeIndex],//番茄种类
    quantity: Number(router.params.quantity),

    remainingQuantity: Number(router.params.quantity),//剩下的番茄数量

    // workTime: Number(tomatoTypes[router.params.tomatoTypeIndex].workTime),//工作时间
    // restTime: Number(tomatoTypes[router.params.tomatoTypeIndex].restTime),//休息时间
    workTime: Number(5),
    restTime: Number(6),
    currentType: 'WORK',//'WORK','TRANS','REST'
  }
  const [state, setState] = useState(initState);
  const [isSuspended, setIsSuspended] = useState(false);//是否暂停
  const initRemainingTime = initState.workTime + initState.restTime
  const [remainingTime, setRemainingTime] = useState(initRemainingTime);//还剩的时间
  const [aniState, setAniState] = useState({
    currentImgIndex: 1,//
    currentImgUrl: initState.tomatoType.animationImgUrls &&
      initState.tomatoType.animationImgUrls.work.length > 0 &&
      initState.tomatoType.animationImgUrls.work[0],
  });
  const [waitForAni, setWaitForAni] = useState(true);//控制播完一组动画再播下一组


  useEffect(() => {
    countDown()
  }, [remainingTime, state.remainingQuantity])
  useEffect(() => {
    if (!(aniState.currentImgUrl && aniState.currentImgUrl.length > 0)) { return }
    let newIndex: number = aniState.currentImgIndex + 1
    let newUrl: string = ''
    let newRemainingQuantity = state.remainingQuantity
    if (newRemainingQuantity < 0) { return }
    setTimeout(() => {
      if (state.currentType === 'WORK') {
        if (newIndex > (marco.ANI_WORK_LENGTH - 1)) {
          newIndex = 0;
        }
        newUrl = state.tomatoType.animationImgUrls.work[newIndex]
      } else if (state.currentType === 'TRANS') {
        if (!(newIndex === marco.ANI_WORK_LENGTH) && waitForAni) {//把work一个循环播完再播trans
          newUrl = state.tomatoType.animationImgUrls.work[newIndex]
        } else {
          if (newIndex === marco.ANI_WORK_LENGTH && waitForAni) {
            newIndex = 0;
          }
          waitForAni && setWaitForAni(false)
          if (newIndex > (marco.ANI_TRANS_LENGTH - 1)) {
            newIndex = 0;
            setState({
              ...state,
              currentType: 'REST'
            });
            newUrl = state.tomatoType.animationImgUrls.rest[newIndex]
          } else {
            newUrl = state.tomatoType.animationImgUrls.trans[newIndex]
          }
        }
      } else {
        if (newIndex > (marco.ANI_REST_LENGTH - 1)) {
          newIndex = 0;
        }
        newUrl = state.tomatoType.animationImgUrls.rest[newIndex]
      }
      // if (newIndex > (marco.ANI_TRANS_LENGTH - 1)) {
      //   newIndex = 0;
      // }
      // newUrl = state.tomatoType.animationImgUrls.trans[newIndex]

      setAniState({
        ...aniState,
        currentImgIndex: newIndex,
        currentImgUrl: newUrl
      })
    }, 180)
  }, [aniState, state.remainingQuantity])
  // console.log('currentImgUrl', aniState.currentImgUrl);
  useReady(() => {
    // console.log('router.params', router.params);
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
      setWaitForAni(true)
      if (state.remainingQuantity < 1) {//所有番茄都已结束
        setState({
          ...state,
          currentType: 'WORK',
          remainingQuantity: -1,
        });
        setAniState({
          ...aniState,
          currentImgIndex: 0,
          currentImgUrl: state.tomatoType.animationImgUrls.rest[marco.ANI_REST_LENGTH - 1]
        })
        return;
      }
      setState({//还剩番茄，进入下一轮倒计时
        ...state,
        remainingQuantity: state.remainingQuantity - 1,
        currentType: 'WORK',
      });
      console.log('q-initRemainingTime', initRemainingTime);
      setRemainingTime(initRemainingTime)
      return;
    } else {//倒计时继续
      if ((state.currentType === 'WORK') &&//工作时间结束，进入休息时间
        ((remainingTime - 1) == state.restTime)) {
        setState({
          ...state,
          currentType: 'TRANS',
        });
      }
      setTimeout(() => {
        setRemainingTime(remainingTime - 1)
      }, 1000)
    }
  }

  const changeQuantity = (way) => {
    let addedNum = Number(way === 'ADD' ? 1 : -1)
    let newQuantity = Number(state.quantity) + addedNum
    if (newQuantity < 0) { return }//不能减为复数

    if (state.remainingQuantity < 1 && remainingTime < 1) {//如果原本已经循环完了所有番茄，再加番茄时重启倒计时
      setRemainingTime(initRemainingTime)
    }
    setState({
      ...state,
      quantity: newQuantity,
      remainingQuantity: Number(state.remainingQuantity) + addedNum,
    });
  }
  const doRestart = () => {
    setRemainingTime(initRemainingTime)
  }
  let tomatoImg =
    <View className='tomato_img'>
      现在正在{state.currentType}
      <Image
        src={aniState.currentImgUrl}
      // src={state.tomatoType.animationImgUrls.trans[4]}
      />
    </View>
  // console.log('q-remainingTime', remainingTime);
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
          还剩{state.remainingQuantity > 0 ? state.remainingQuantity : 0}
          /{state.quantity}个番茄
        </View>
        <View
          className=''
          onClick={() => changeQuantity('SUBTRACT')}
        > 减一个 </View>
      </View>
      <View className=''>
        <View className=''>倒计时</View>
        {(state.currentType === 'WORK' && state.remainingQuantity > -1) ?
          <View className=''>{tool_functions.format_functions.prefixZero(
            Math.floor((remainingTime - initState.restTime) / 60), 2)}：
            {tool_functions.format_functions.prefixZero(
              Math.floor((remainingTime - initState.restTime) % 60), 2)}</View> :
          <View className=''>{tool_functions.format_functions.prefixZero(
            Math.floor(remainingTime / 60), 2)}：
            {tool_functions.format_functions.prefixZero(
              Math.floor(remainingTime % 60), 2)}</View>
        }
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