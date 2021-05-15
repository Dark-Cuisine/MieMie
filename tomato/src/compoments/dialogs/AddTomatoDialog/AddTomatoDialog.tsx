import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'


import Dialog from '../../../../../public/components/dialogs/Dialog/Dialog'


import './AddTomatoDialog.scss'


const AddTomatoDialog = (props) => {
  const initState = {
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  return (
    <Dialog
      className='add_tomato_dialog'
      isOpened={props.isOpened}
      onClose={props.onClose}
      title='种番茄'
    >
      <View className=''>红番茄</View>
      <View className=''>黄番茄</View>
      <View className=''>蓝番茄</View>
      <View className=''>白番茄</View>
    </Dialog >
  )
}
AddTomatoDialog.defaultProps = {
};
export default AddTomatoDialog;