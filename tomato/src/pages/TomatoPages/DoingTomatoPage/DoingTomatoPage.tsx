import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh, useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image, Canvas } from '@tarojs/components'
import { AtInput } from 'taro-ui'


import Layout from '../../../../../public/components/Layout/Layout'
import ActionDialog from '../../../../../public/components/dialogs/ActionDialog/ActionDialog'

import * as tool_functions from '../../../../../public/utils/functions/tool_functions'

import './DoingTomatoPage.scss'

const app = getApp()
const marco = app.$app.globalData.macro
const tomatoTypes = app.$app.globalData.tomatoTypes


//测试用图片路径：
let testImg = 'https://6d69-miemie-buyer-7gemmgzh05a6c577-1304799026.tcb.qcloud.la/resources/animations/growingTomato/red/work_2.png'


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
    workTime: Number(5),//*for test
    restTime: Number(6),
    currentType: 'WORK',//'WORK','TRANS','REST'
  }
  const [state, setState] = useState(initState);
  const [dialog, setDialog] = useState(null);//'GIVE_UP','RE_START'
  const [currentStatus, setCurrentStatus] = useState('ACTIVE');//现在的状态 'ACTIVE':正在倒计时, 'SUSPENDED':暂停, 'END':结束
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
  }, [remainingTime, state.remainingQuantity, currentStatus])
  useEffect(() => {
    if (!(aniState.currentImgUrl && aniState.currentImgUrl.length > 0)) { return }
    if (currentStatus === 'SUSPENDED') { return } //暂停
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

      setAniState({
        ...aniState,
        currentImgIndex: newIndex,
        currentImgUrl: newUrl
      })
    }, 180)
  }, [aniState, state.remainingQuantity,currentStatus])

  useReady(() => {

    setState({
      ...state,
      remainingQuantity: state.remainingQuantity - 1,//一进来就减少一个番茄
    });
  })


  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const countDown = () => {//倒计时
    if (currentStatus === 'SUSPENDED') {//暂停
      return
    } else if (remainingTime < 1) {//这一轮倒计时结束
      setWaitForAni(true)
      if (state.remainingQuantity < 1) {//所有番茄都已结束
        setCurrentStatus('END')
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
      setCurrentStatus('ACTIVE')
    }
    setState({
      ...state,
      quantity: newQuantity,
      remainingQuantity: Number(state.remainingQuantity) + addedNum,
    });
  }
  const handleSubmit = (way, v = null, i = null) => {
    setDialog(null)
    switch (way) {
      case 'GIVE_UP':
        setRemainingTime(state.remainingQuantity < 1 ?
          0 : initRemainingTime)//如果已经循环完了所有番茄，初始化为0，否则为initRemainingTime
        setState({
          ...state,
          currentType: 'WORK',
          remainingQuantity: currentStatus === 'END' ?
            state.remainingQuantity : (state.remainingQuantity - 1),
          quantity: state.quantity - 1,
        });
        break;
      case 'RE_START':
        setRemainingTime(initRemainingTime)
        setCurrentStatus('ACTIVE')
        setState({
          ...state,
          currentType: 'WORK',
          remainingQuantity: currentStatus === 'END' ?
            (state.remainingQuantity + 1) : state.remainingQuantity,
        });
        break;
      case '':
        break;
      default:
        break;
    }
  }


  let quantityController =
    <View className='quantity_controller'>
      <View className='img_wrapper'>
        <Image
          src={state.tomatoType.iconUrl}
        />
      </View>
      <View className='quantity_num'>
        {state.remainingQuantity > 0 ? state.remainingQuantity : 0}
        /{state.quantity}
      </View>
      <View
        className='at-icon at-icon-subtract-circle'
        style={state.remainingQuantity < 1 ? 'color:var(--gray-2);' : ''}
        onClick={state.remainingQuantity > 0 ?
          () => changeQuantity('SUBTRACT') : () => { }}
      />
      <View
        className='at-icon at-icon-add-circle'
        onClick={() => changeQuantity('ADD')}
      />
    </View>

  let timeCounter = currentStatus === 'END' ?
    <View className='time_counter'>
      <View className='timer' style='border-color: transparent;'>已结束</View>
    </View> :
    <View className={'time_counter time_counter'.concat(
      state.currentType === 'WORK' ? '' : '_resting'
    )}>
      <View className='title'>
        {state.currentType === 'WORK' ? '工作时间' : '休息时间'}
      </View>
      <View className='timer'>
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
    </View>


  let tomatoImg =
    <View className='tomato_img'>
      <Image
        src={aniState.currentImgUrl}
      />
    </View>


  // let allImgUrls = state.tomatoType.animationImgUrls.work.concat(
  //   state.tomatoType.animationImgUrls.trans,
  //   state.tomatoType.animationImgUrls.rest)
  // let aniImages = allImgUrls.map((it, i) => {//*problem 这种方式预加载也会闪屏
  //   return (
  //     <Image
  //       className='ani_image'
  //       src={aniState.currentImgUrl}
  //       style={!(it == aniState.currentImgUrl) ? 'display:none;' : ''
  //       } />
  //   )
  // })
  let deleteDialog = (
    <ActionDialog
      type={1}
      isOpened={dialog === 'GIVE_UP' || dialog === 'RE_START'}
      onClose={() => setDialog(null)}
      onCancel={() => setDialog(null)}
      onSubmit={() => handleSubmit(dialog)}
      cancelText='取消'
      confirmText={dialog === 'GIVE_UP' ? '放弃' : '重新开始'}
      textCenter={true}
    >确定{dialog === 'GIVE_UP' ? '放弃' : '重新开始'}这个番茄？</ActionDialog>
  );

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
      {deleteDialog}
      {quantityController}
      {timeCounter}
      {tomatoImg}
      {state.quantity > 0 && (
        currentStatus === 'SUSPENDED' ?
          <View className='tomato_action_buttons'>
            <View className='tomato_action_button'>
              <View
                className='at-icon at-icon-play main_button'
                onClick={() => setCurrentStatus('ACTIVE')}
              >开始</View>
            </View>
            <View className='sub_buttons'>
              <View
                className=''
                style='color:var(--red-1);'
                onClick={() => setDialog('RE_START')}
              >重新开始</View>
              <View
                className=''
                style='color:var(--gray-3);'
                onClick={() => setDialog('GIVE_UP')}
              >放弃</View>
            </View>
          </View> :
          currentStatus === 'END' ?
            <View className='tomato_action_buttons'>
              {/* <View className='tomato_action_button'>
                <View
                  className='at-icon at-icon-play main_button'
                  style='visibility: hidden;'
                >place holder</View>
              </View> */}
              <View className='sub_buttons'>
                <View
                  className=''
                  style='color:var(--red-1);'
                  onClick={() => setDialog('RE_START')}
                >重新开始</View>
                <View
                  className=''
                  style='color:var(--gray-3);'
                  onClick={() => setDialog('GIVE_UP')}
                >放弃</View>
              </View>
            </View> :
            <View className='tomato_action_buttons'>
              <View className='tomato_action_button'>
                <View
                  className='at-icon at-icon-pause main_button'
                  onClick={() => setCurrentStatus('SUSPENDED')}
                >暂停</View>
              </View>
              <View className='sub_buttons' style='visibility: hidden;'>
                <View className=''>place holder</View>
              </View>
            </View>
      )}
    </Layout >
  )
}
DoingTomatoPage.defaultProps = {
};
export default DoingTomatoPage;