import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'


import Dialog from '../Dialog/Dialog'
import './AddSolitaireDialog.scss'

/***
 * <AddSolitaireDialog
 * isOpened={state.isOpened}
  * onClose={()=>()}
  * />
 */
const AddSolitaireDialog = (props) => {
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
      className='add_solitaire_dialog'
      isOpened={props.isOpened}
      onClose={props.onClose} 
      title='发布接龙'
    >
      <View className='content'>
        <View className=''>活动接龙</View>
        <View className='line_vertical'></View>
        <View className=''>商品接龙</View>
      </View>
    </Dialog >
  )
}
AddSolitaireDialog.defaultProps = {
};
export default AddSolitaireDialog;