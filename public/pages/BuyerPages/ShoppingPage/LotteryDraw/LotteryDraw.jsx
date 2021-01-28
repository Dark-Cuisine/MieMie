import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { usePageScroll, useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtInput, AtModal } from 'taro-ui'
import * as actions from '../../../../redux/actions'

import png_1 from "../../../../resource/Animation/lottery/1.png";
import png_2 from "../../../../resource/Animation/lottery/2.png";
import png_3 from "../../../../resource/Animation/lottery/3.png";
import png_4 from "../../../../resource/Animation/lottery/4.png";
import png_5 from "../../../../resource/Animation/lottery/5.png";
import png_6 from "../../../../resource/Animation/lottery/6.png";
import png_7 from "../../../../resource/Animation/lottery/7.png";
import png_8 from "../../../../resource/Animation/lottery/8.png";
import lotteryDraw_blue from '../../../../resource/icons/lotteryDraw_blue.svg'
import lotteryDraw_white from '../../../../resource/icons/lotteryDraw_white.svg'


import ShopCard from '../../../../components/cards/ShopCard/ShopCard'
import Dialog from '../../../../components/dialogs/Dialog/Dialog'

import './LotteryDraw.scss'

const pngList = [png_1, png_2, png_3, png_4, png_5, png_6, png_7, png_8];


const LotteryDraw = (props) => {
  const shopsManager = useSelector(state => state.shopsManager);
  const initState = {
    shopList: shopsManager.shopList,
    drawnShops: [],

    ifOpenLotteryDialog: false,

    pngIndex: null,
    times: null,
    maxTimes: 2,
  }
  const [state, setState] = useState(initState);
  const dispatch = useDispatch();

  useEffect(() => {
    setState({
      ...state,
      shopList: initState.shopList,
    });
  }, [shopsManager.shopList])

  useEffect(() => {//*problem 动画途中无法关闭对话框（关闭的setstate被覆盖了
    (!(state.pngIndex === null) && !(state.times === null)) &&
      setTimeout(() => {
        let updatedPngIndex = state.pngIndex;
        let updatedTimes = state.times;
        if (state.pngIndex < (pngList.length - 1)) {
          updatedPngIndex = state.pngIndex + 1;
        } else {
          updatedPngIndex = 0;
          updatedTimes = (state.times < state.maxTimes) ? (state.times + 1) : null;
        }
        setState({
          ...state,
          pngIndex: updatedPngIndex,
          times: updatedTimes,
        })
      }, 125)
  }, [state.pngIndex, state.times])

  const toggleDialog = (ifOpen = false) => {
    setState({
      ...state,
      ifOpenLotteryDialog: ifOpen,
    });
  }

  const doLottery = () => {
    let maxNum = state.shopList.length;
    let r_1 = Math.floor(Math.random() * maxNum);//这里别+1因为上面length没有-1
    let r_2 = Math.floor(Math.random() * maxNum);
    while (state.shopList.length > 1 && (r_2 == r_1)) {
      r_2 = Math.floor(Math.random() * maxNum);
    }
    setState({
      ...state,
      times: 0,
      pngIndex: 0,
      drawnShops: state.shopList.length > 0 ? (
        state.shopList.length > 1 ?
          [state.shopList[r_1], state.shopList[r_2],] :
          [state.shopList[r_1]]
      ) : [],
      ifOpenLotteryDialog: true,
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
        isOpened={state.ifOpenLotteryDialog}
        onClose={() => toggleDialog(false)}
        title={state.times === null ? '你套到的地摊' :
          '正在抓获摊子'.concat
            ((state.pngIndex === 1 || state.pngIndex === 5) ? ('.' + '\xa0\xa0') : (//*jsx插入空格的方法
              (state.pngIndex === 2 || state.pngIndex === 6) ? ('..' + '\xa0') :
                ((state.pngIndex === 3 || state.pngIndex === 7) ? '...' : '\xa0\xa0\xa0'
                )))
        }
      >
        {state.times === null
          ?
          <View className=''>
            {
              state.drawnShops.length > 0 ? state.drawnShops.map((it, i) => {
                return (
                  <ShopCard
                    key={i}
                    shop={it}
                  />
                )
              }) :
                <View className='empty_word'> 无符合条件的地摊 </View>
            }
            <View
              className='lottery_again_button'
              onClick={() => doLottery()}
            >
              <View
                className='at-icon at-icon-repeat-play '
              />
              <View className=''>换一批</View>
            </View>
          </View> :
          <View className=''>
            <Image
              className='image'
              src={pngList[state.pngIndex]} />
          </View>
        }
      </Dialog>
    </View>
  )
}

export default LotteryDraw;