import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh, useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtInput, AtInputNumber } from 'taro-ui'

import * as actions from '../../../../../public/redux/actions'
import * as databaseFunctions from '../../../../../public/utils/functions/databaseFunctions'

import Dialog from '../../../../../public/components/dialogs/Dialog/Dialog'

import './AddTomatoDialog.scss'



const app = getApp()
const tomatoTypes = app.$app.globalData.tomatoTypes
const beginTomatoButton = app.$app.globalData.imgs.beginTomatoButton
const marco = app.$app.globalData.macro


/***
 * <AddTomatoDialog
 * isOpened={state.isOpened}
  * onClose={()=>()}
  * />
 */
const AddTomatoDialog = (props) => {
  const dispatch = useDispatch();
  const userManager = useSelector(state => state.userManager);
  const initState = {
    tomatoType: tomatoTypes && tomatoTypes[0],
    quantity: 1,//即将开始的番茄数量

  }
  const [state, setState] = useState(initState);
  const [isNumInputFocused, setIsNumInputFocused] = useState(false);

  useEffect(() => {
    // initImg()
  }, [])
  useEffect(() => {
    //如果该用户还没番茄日历，则新建番茄番茄日历
    if (
      userManager.unionid && userManager.unionid.length > 0 &&
      !(userManager && userManager.userInfo && userManager.userInfo.tomatoCalendarId &&
        userManager.userInfo.tomatoCalendarId.length > 0)) {
      userManager.unionid && userManager.unionid.length > 0 &&
        newTomatoCalendar()
    }
  }, [userManager.unionid])


  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })
  const newTomatoCalendar = async () => {
    await databaseFunctions.tomato_functions.newTomatoCalendar(userManager.unionid)
    dispatch(actions.setUser(userManager.unionid, userManager.openid));//更新用户信息
  }




  const handleChangeQuantity = (e) => {
    setState({
      ...state,
      quantity: e,
    });
  }
  const changeTomatoTypes = (typeNum) => {
    setState({
      ...state,
      tomatoType: tomatoTypes[typeNum]
    });
  }
  let timeString = ''
  let index = tomatoTypes.findIndex(it => {
    return state.tomatoType.id === it.id
  })
  if (index > -1) {
    timeString = '专注'.concat(
      String(Math.floor((tomatoTypes[index].workTime) / 60)), '分钟  休息',
      String(Math.floor((tomatoTypes[index].restTime) / 60)), '分钟')
  }

  return (
    <Dialog
      className='add_tomato_dialog'
      isOpened={props.isOpened}
      onClose={props.onClose}
      title={state.tomatoType.name}
      textCenter={true}
    >
      <View className='time_string'>
        {timeString}
      </View>
      <View className='tomato_imgs'>
        {tomatoTypes.map((it, i) => {
          return (
            <View className='tomato_img'>
              <Image
                className={(state.tomatoType.id === it.id) && 'choosen'}
                src={it.iconUrl}
                onClick={() => changeTomatoTypes(it.index)}
              />
            </View>
          )
        })
        }
      </View>
      <AtInputNumber
        min={1}
        max={10}
        step={1}
        value={state.quantity}
        disabledInput={true}//*problem 一删除所有字符就变1导致无法输入所以这里直接禁止了输入
        onChange={(e) => handleChangeQuantity(e)}
      />
      <View className='flex justify-center'>
        <View className='begin_button'>
          <Image
            className=''
            onClick={() => {
              Taro.navigateTo({//路由传递object参数的方法:JSON.stringify(obj),然后用JSON.parse(string)解开
                url: `/pages/TomatoPages/DoingTomatoPage/DoingTomatoPage?tomatoTypeIndex=${state.tomatoType.index}&quantity=${state.quantity}`
              });
              props.onClose()
            }}
            src={beginTomatoButton.fileUrl}
          />
        </View>
      </View>

    </Dialog >
  )
}
AddTomatoDialog.defaultProps = {
};
export default AddTomatoDialog;