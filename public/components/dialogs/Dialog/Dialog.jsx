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

  const toggleDialog = (ifOpen) => {
    (ifOpen === false) && props.onClose &&
      props.onClose();
    setState({
      ...state,
      isOpened: (ifOpen === null) ? !state.isOpened : ifOpen,
    });
  }

  const handleClickMask = () => {
    (props.closeOnClickOverlay === false) ?
      (() => { return }) : toggleDialog(false);
  }

  return (
    state.isOpened &&
    <View className={'dialog '.concat(props.className)}>
      <View className='dialog_content'>
        {props.title &&
          <View className='dialog_title'>
            <View className='line_horizontal' />
               {props.title}
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