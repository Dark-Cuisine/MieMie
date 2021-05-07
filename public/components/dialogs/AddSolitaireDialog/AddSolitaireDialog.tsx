import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtInput } from 'taro-ui'


import Dialog from '../Dialog/Dialog'
import './AddSolitaireDialog.scss'

const eventPNG_Ids = [
  'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/1.png',
  'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/2.png',
  'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/3.png',
  'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/4.png',
  'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/5.png',
  'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/6.png',
  'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/7.png',
  'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/8.png',
]
const goodsPNG_Ids = [
  'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/camelWalking/1.png',
  'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/camelWalking/2.png',
  'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/camelWalking/3.png',
  'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/camelWalking/4.png',
  'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/camelWalking/5.png',
  'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/camelWalking/6.png',
]
const defaultEventPNG = 4;
const defaultGoodsPNG = 5;


/***
 * <AddSolitaireDialog
 * isOpened={state.isOpened}
  * onClose={()=>()}
  * />
 */
const AddSolitaireDialog = (props) => {
  const initState = {
    eventPNG_urls: [],
    goodsPNG_urls: [],

    startTime: null,//用来控制播放下一张

    lastClickTime: null,//用来判断是否长按
    currentType: null,//'EVENT',GOODS' 正在播放的动画按钮
  }
  const [state, setState] = useState(initState);
  const [eventPNG, setEventPNG] = useState(defaultEventPNG);
  const [goodsPNG, setGoodsPNG] = useState(defaultGoodsPNG);

  useEffect(() => {
    initImg()
  }, [])

  useEffect(() => {
    console.log('g-0', state.currentType);
    if (!(state.currentType === null)) {
      setTimeout(() => {
        state.currentType === 'EVENT' ?
          setEventPNG(((eventPNG + 1) < (eventPNG_Ids && eventPNG_Ids.length)) ?
            (eventPNG + 1) : 0
          ) :
          setGoodsPNG(((goodsPNG + 1) < (goodsPNG_Ids && goodsPNG_Ids.length)) ?
            (goodsPNG + 1) : 0
          );
      }, 200)
    }else{
      setEventPNG(defaultEventPNG)
      setGoodsPNG(defaultGoodsPNG)
    }
  }, [state.currentType, eventPNG,goodsPNG])


  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const handleTouchStart = (way, e) => {
    if (state.currentType === null) {
      setState({
        ...state,
        lastClickTime: e.timeStamp,
        currentType: way,
      });
    } else {
      setState({
        ...state,
        lastClickTime: e.timeStamp,
      });
    }

  }


  const handleTouchEnd = (e) => {
    let gap = e.timeStamp - state.lastClickTime
    if (gap < 400) {
      navigateTo(state.currentType)
    }
    setState({
      ...state,
      lastClickTime: null,
      startTime: null,
      currentType: null,
    });
  }

  const initImg = async () => {
    let r_1 = await wx.cloud.callFunction({
      name: 'get_temp_file_url',
      data: {
        fileList: eventPNG_Ids,
      }
    });
    let r_2 = await wx.cloud.callFunction({
      name: 'get_temp_file_url',
      data: {
        fileList: goodsPNG_Ids,
      }
    });
    let eventPNG_urls = r_1.result || []
    let goodsPNG_urls = r_2.result || []
    console.log('g-goodsPNG_urls',goodsPNG_urls);
    setState({
      ...state,
      eventPNG_urls: eventPNG_urls,
      goodsPNG_urls: goodsPNG_urls,
    });
  }

  const navigateTo = (way) => {
    switch (way) {
      case 'EVENT':
        Taro.navigateTo({
          url: `/pages/SolitairePages/InsideSolitairePage/InsideSolitairePage?type=${'EVENT'}&mode=${'SELLER'}`,
        });
        break;
      case 'GOODS':
        Taro.navigateTo({
          url: `/pages/SolitairePages/InsideSolitairePage/InsideSolitairePage?type=${'GOODS'}&mode=${'SELLER'}`,
        });
        break;
      case '':
        break;
      default:
        break;
    }
    props.onClose()
  }

  console.log('g-3', eventPNG, goodsPNG);
  return (
    <Dialog
      className='add_solitaire_dialog'
      isOpened={props.isOpened}
      onClose={props.onClose}
      title='发布接龙'
    >
      <View className='content'>
        <View
          className='img_button'
          onClick={() => navigateTo('EVENT')}
          onTouchStart={(e) => handleTouchStart('EVENT', e)}
          onTouchEnd={(e) => handleTouchEnd(e)}
        >
          <View className='word'>活动接龙</View>
          {state.eventPNG_urls && state.eventPNG_urls.length > 0 &&
            <Image
              src={state.eventPNG_urls[eventPNG]}
            />
          }
        </View>
        <View className='line_vertical'></View>
        <View
          className='img_button'
          onClick={() => navigateTo('GOODS')}
          onTouchStart={(e) => handleTouchStart('GOODS', e)}
          onTouchEnd={(e) => handleTouchEnd(e)}
        >
          <View className='word'>商品接龙</View>
          {state.goodsPNG_urls && state.goodsPNG_urls.length > 0 &&
            <Image
              src={state.goodsPNG_urls[goodsPNG]}
            />
          }
        </View>
      </View>
    </Dialog >
  )
}
AddSolitaireDialog.defaultProps = {
};
export default AddSolitaireDialog;