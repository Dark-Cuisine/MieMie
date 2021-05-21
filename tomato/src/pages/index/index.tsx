import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import * as actions from '../../../../public/redux/actions'

import { initClassifications } from '../../../../public/utils/functions/config_functions'

import './Index.scss'

const app = getApp()
const tomatoTypes = app.$app.globalData.tomatoTypes
const marco = app.$app.globalData.macro

const MAX_TRY_TIME = 3;

const Index = (props) => {
  const dispatch = useDispatch();
  const initState = {
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    doInit()
    initIcons()
    initAnimations()//*unfinished 有时会获取失败，如果失败得再后面找个地方重新获取
  }, [])

  const doInit = async () => {
    await initClassifications()

    dispatch(actions.changeTabBarTab(//跳进主页
      // app.$app.globalData.classifications.tabBar.tabBarList_tomato[0]
      app.$app.globalData.classifications.tabBar.tabBarList_tomato[1]
    ))

    // Taro.switchTab({
    //   // url: '/pages/SellerPages/MyOrdersPage/MyOrdersPage',
    //   // url: '/pages/SellerPages/MyShopsPage/MyShopsPage',
    //   url: '/pages/SellerPages/DeliveryPage/DeliveryPage',
    //   // url: '/pages/PublicPages/UserPage/UserPage',
    // });
    // Taro.navigateTo({
    //   url: `/pages/TomatoPages/DoingTomatoPage/DoingTomatoPage?tomatoType=` + JSON.stringify(
    //     {
    //       id: 'tomato001', index: '0', color: 'RED', name: '红番茄',
    //       workTime: Number(2700), restTime: Number(900),
    //       icon_fileId: 'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/images/tomatos/red.png',
    //       iconUrl: '',
    //     }
    //   ) + `&quantity=${5}`
    // });
  }
  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })
  const initIcons = async () => {//*注: 记得要用fileId换取真实路径！！！！
    let r_1 = await wx.cloud.callFunction({
      name: 'get_temp_file_url',
      data: {
        fileList: tomatoTypes.map((it, i) => {//番茄图标
          return it.icon_fileId
        }).concat([app.$app.globalData.imgs.beginTomatoButton.fileId],//开始按钮图标
          [app.$app.globalData.imgs.alphaChannel.fileId])
      }
    });
    let urls = r_1.result || []
    // console.log('urls', urls);
    tomatoTypes.map((it, i) => {
      it.iconUrl = urls[i]
    })
    app.$app.globalData.imgs.beginTomatoButton.fileUrl = urls[urls.length - 2]
    app.$app.globalData.imgs.alphaChannel.fileUrl = urls[urls.length - 1]
  }

  const initAnimations = async () => {
    let animationFileIds: string[] = []
    for (let it of tomatoTypes) {
      for (let i = 0; i < marco.ANI_WORK_LENGTH; ++i) {
        animationFileIds.push(
          'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/growingTomato/'
          + it.color + '/work_' + (i + 1) + '.png'
        )
      }
      for (let i = 0; i < marco.ANI_TRANS_LENGTH; ++i) {
        animationFileIds.push(
          'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/growingTomato/'
          + it.color + '/trans_' + (i + 1) + '.png'
        )
      }
      for (let i = 0; i < marco.ANI_REST_LENGTH; ++i) {
        animationFileIds.push(
          'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/growingTomato/'
          + it.color + '/rest_' + (i + 1) + '.png'
        )
      }
    }
    // console.log('animationFileIds',animationFileIds);
    if (animationFileIds && animationFileIds.length > 0) {
      try {
        let r_1 = await wx.cloud.callFunction({
          name: 'get_temp_file_url',
          data: {
            fileList: animationFileIds.slice(0,//一次最多只能拿50个所以分开拿
              2 * (marco.A_TOTAL_LENGTH))
          }
        });
        let r_2 = await wx.cloud.callFunction({
          name: 'get_temp_file_url',
          data: {
            fileList: animationFileIds.slice(
              2 * (marco.A_TOTAL_LENGTH))
          }
        });
        if (!(r_1 && r_1.result && r_1.result.length > 0 &&
          r_2 && r_2.result && r_2.result.length > 0)) { console.log('读取出错'); return; }
        let urls = r_1.result.concat(r_2.result)
        // console.log('',urls);
        tomatoTypes.map((it, i) => {
          it.animationImgUrls.work = urls.slice(i * (marco.A_TOTAL_LENGTH), i * (marco.A_TOTAL_LENGTH) + marco.ANI_WORK_LENGTH)
          it.animationImgUrls.trans = urls.slice(i * (marco.A_TOTAL_LENGTH) + marco.ANI_WORK_LENGTH, i * (marco.A_TOTAL_LENGTH) + marco.ANI_WORK_LENGTH + marco.ANI_TRANS_LENGTH)
          it.animationImgUrls.rest = urls.slice(i * (marco.A_TOTAL_LENGTH) + marco.ANI_WORK_LENGTH + marco.ANI_TRANS_LENGTH, i * (marco.A_TOTAL_LENGTH) + marco.ANI_WORK_LENGTH + marco.ANI_TRANS_LENGTH + marco.ANI_REST_LENGTH)
        })
      }
      catch (err) {
        console.log('c-get_temp_file_url-err', err);
        wx.showToast({
          title: '获取动画图片失败',
          icon: 'none',
        })
        return err;
      }
      // console.log('-tomatoTypes', tomatoTypes);
    }
  }


  return (
    <View>
      {/* 正在进入首页.... */}
    </View>
  )
}

export default Index;