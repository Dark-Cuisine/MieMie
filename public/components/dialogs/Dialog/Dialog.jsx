import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import './Dialog.scss'

/***
 * <Dialog
 * isOpened={state.isOpened}
 * closeOnClickOverlay={false}
 * onClose={()=>()}
 * 
 * title='xxx'
 * 
 * textCenter={true}//是否居中文字
 * />
 */
const Dialog = (props) => {
  const initState = {
    isOpened: props.isOpened,
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    setState({
      ...state,
      isOpened: initState.isOpened,
    });
  }, [props.isOpened])

  const toggleDialog = (ifOpen = !state.isOpened) => {
    (ifOpen === false) && //关闭时如有props.onClose则调用它
      props.onClose && props.onClose();
    setState({
      ...state,
      isOpened: ifOpen,
    });
  }

  const handleClickMask = () => {
    if ((props.closeOnClickOverlay === false)) {
      return
    }
    toggleDialog(false)
  }

  return (
    state.isOpened &&
    <View className={'dialog '.concat(props.className)}>
      <View className={'dialog_content '.concat(props.textCenter ? 'dialog_content_center' : '')}>
        {props.title &&
          <View className='dialog_title'>
            <View className='line_horizontal' />
            <View className='word'>{props.title}</View>
            <View className='line_horizontal' />
          </View>
        }
        {props.children}
      </View>
      <View
        className='dialog_mask'
        onClick={() => handleClickMask()}
      />
    </View>
  )
}

Dialog.defaultProps = {
  closeOnClickOverlay: true,
};

export default Dialog;