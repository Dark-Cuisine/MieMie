import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { usePageScroll, useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtInput, AtModal } from 'taro-ui'
import * as actions from '../../../../redux/actions'

import jpg_1 from "../../../../resource/Animation/lottery/1.png";
import jpg_2 from "../../../../resource/Animation/lottery/2.png";
import jpg_3 from "../../../../resource/Animation/lottery/3.png";
import jpg_4 from "../../../../resource/Animation/lottery/4.png";
import jpg_5 from "../../../../resource/Animation/lottery/5.png";
import jpg_6 from "../../../../resource/Animation/lottery/6.png";
import jpg_7 from "../../../../resource/Animation/lottery/7.png";
import jpg_8 from "../../../../resource/Animation/lottery/8.png";
import lotteryDraw_blue from '../../../../resource/icons/lotteryDraw_blue.svg'
import lotteryDraw_white from '../../../../resource/icons/lotteryDraw_white.svg'


import ShopCard from '../../../../components/cards/ShopCard/ShopCard'
import Dialog from '../../../../components/dialogs/Dialog/Dialog'

import './LotteryDraw.scss'

const jpgList = [jpg_1, jpg_2, jpg_3, jpg_4, jpg_5, jpg_6, jpg_7, jpg_8];


const LotteryDraw = (props) => {
  const shopsManager = useSelector(state => state.shopsManager);
  const initState = {
    shopList: shopsManager.shopList,//所有符合当前筛选条件的店铺
    drawnShops: [],//被抽中的店铺

    jpgIndex: null,//循环到第几张图片
    currentTime: 0,//当前循环次数
    maxTimes: 3,//总循环次数
  }
  const [state, setState] = useState(initState);
  const [ifOpen, setIfOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setState({
      ...state,
      shopList: initState.shopList,
    });
  }, [shopsManager.shopList])

  useEffect(() => {
    (!(state.jpgIndex === null) && !(state.currentTime === 0)) &&
      setTimeout(() => {
        let newJpgIndex = state.jpgIndex;
        let updatedTimes = state.currentTime;
        if (state.jpgIndex < (jpgList.length - 1)) {
          newJpgIndex = state.jpgIndex + 1;
        } else {
          newJpgIndex = 0;
          updatedTimes = (state.currentTime < state.maxTimes) ? (state.currentTime + 1) : 0;
        }
        ifOpen &&
          setState({
            ...state,
            jpgIndex: newJpgIndex,
            currentTime: updatedTimes,
          })
      }, 125)
  }, [state.jpgIndex, state.currentTime])

  const toggleDialog = (ifOpen = false) => {
    setIfOpen(ifOpen)
    !ifOpen &&//关掉时初始化
      setState({
        ...state,
        jpgIndex: null,
        currentTime: 0,
      });
  }

  const doLottery = () => {//开始抽选
    let maxNum = state.shopList.length;//选取两个不大于shoplist长度的随机数
    let r_1 = Math.floor(Math.random() * maxNum);//这里不用+1因为上面length没有-1
    let r_2 = Math.floor(Math.random() * maxNum);
    while (state.shopList.length > 1 && (r_2 == r_1)) {//去重
      r_2 = Math.floor(Math.random() * maxNum);
    }
    toggleDialog(true)
    setState({
      ...state,
      currentTime: 1,
      jpgIndex: 0,
      drawnShops: state.shopList.length > 0 ? (
        state.shopList.length > 1 ?
          [state.shopList[r_1], state.shopList[r_2],] :
          [state.shopList[r_1]]
      ) : [],
    })
  }

  return (
    <View className='lottery_draw'>
      <Image
        className='toggle_botton'
        src={lotteryDraw_blue}
        onClick={() => doLottery()}
      />
      <Dialog
        isOpened={ifOpen}
        onClose={() => toggleDialog(false)}
        className={!(state.currentTime === 0) && 'is_drawing'}
        title={state.currentTime === 0 ? '你套到的地摊' :
          '正在抓获摊子'.concat
            ((state.jpgIndex % 4 === 1) ? ('.') : (//*jsx插入空格的方法:'\xa0'
              (state.jpgIndex % 4 === 2) ? ('..') :
                ((state.jpgIndex % 4 === 3) ? '...' : ''
                )))
        }
      >
        {state.currentTime === 0 ?
          <View className=''>
            {
              state.drawnShops.length > 0 ?
                state.drawnShops.map((it, i) => {
                  return (
                    <ShopCard
                      key={i}
                      shop={it}
                    />
                  )
                }) :
                <View className='empty_word'> 无符合条件的地摊 </View>
            }
            <View className='flex justify-center' >
              <View className='lottery_again_button'>
                <View
                  className='at-icon at-icon-repeat-play '
                  onClick={() => doLottery()}
                />
                <View onClick={() => doLottery()} >换一批</View>
              </View>
            </View>
          </View> :
          <Image
            className='image'
            src={jpgList[state.jpgIndex]} />
        }
      </Dialog>
    </View>
  )
}

export default LotteryDraw;