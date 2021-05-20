import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh, useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtInput, AtInputNumber } from 'taro-ui'

import Dialog from '../../../../../public/components/dialogs/Dialog/Dialog'

import './AddTomatoDialog.scss'



const app = getApp()
const tomatoTypes = app.$app.globalData.tomatoTypes
const marco = app.$app.globalData.macro
const beginTomatoButton = {
  fileUrl: '',
  fileId: 'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/images/text/beginTomatoButton.png'
}

/***
 * <AddTomatoDialog
 * isOpened={state.isOpened}
  * onClose={()=>()}
  * />
 */
const AddTomatoDialog = (props) => {
  const initState = {
    tomatoType: tomatoTypes && tomatoTypes[0],
    quantity: 1,//即将开始的番茄数量

    beginTomatoButton: ''
  }
  const [state, setState] = useState(initState);
  const [isNumInputFocused, setIsNumInputFocused] = useState(false);

  useEffect(() => {
    initImg()
  }, [])


  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })
  const initImg = async () => {//*注: 记得要用fileId换取真实路径！！！！
    let r_1 = await wx.cloud.callFunction({
      name: 'get_temp_file_url',
      data: {
        fileList: tomatoTypes.map((it, i) => {//番茄图标
          return it.icon_fileId
        }).concat([beginTomatoButton.fileId])//开始按钮图标
      }
    });
    let urls = r_1.result || []
    // console.log('urls', urls);
    tomatoTypes.map((it, i) => {
      it.iconUrl = urls[i]
    })
    beginTomatoButton.fileUrl = urls[urls.length - 1]
    setState({//如果不setState就无法刷新页面
      ...state,
    });
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
  return (
    <Dialog
      className='add_tomato_dialog'
      isOpened={props.isOpened}
      onClose={props.onClose}
      title={state.tomatoType.name}
      textCenter={true}
    >
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