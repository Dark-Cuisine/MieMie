import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import dayjs from 'dayjs'
import * as actions from '../../../../../public/redux/actions'

import Layout from '../../../../../public/components/Layout/Layout'
import * as databaseFunctions from '../../../../../public/utils/functions/databaseFunctions'

import './TodayTomatoPage.scss'

const app = getApp()
const tomatoTypes = app.$app.globalData.tomatoTypes
const marco = app.$app.globalData.macro

/***
 * 今天的番茄
 */
const TodayTomatoPage = (props) => {
  const dispatch = useDispatch();
  const layoutManager = useSelector(state => state.layoutManager);
  const userManager = useSelector(state => state.userManager);
  const initState = {
    tomatoDay: null,
    redList: [],//用于后面列出番茄图标
    yellowList: [],
    blueList: [],
    whiteList: [],
  }
  const [state, setState] = useState(initState);
  const [tomatoCalendar, setTomatoCalendar] = useState(null);
  useEffect(() => {

  }, [])
  useEffect(() => {//应对index页拿取图片失败//*unfinished 要和index页的函数合起来别copy两次
    if (!(tomatoTypes && tomatoTypes[0].iconUrl.length > 0)) {
      initIcons()
    }
    if (!(tomatoTypes &&
      tomatoTypes[0].animationImgUrls.work.length > 0)) {
      initAnimations()
    }
  }, [layoutManager.currentTabId]);
  const initIcons = async () => {//*注: 记得要用fileId换取真实路径！！！！
    let r_1 = await wx.cloud.callFunction({
      name: 'get_temp_file_url',
      data: {
        fileList: tomatoTypes.map((it, i) => {//番茄图标
          return it.icon_fileId
        }).concat([app.$app.globalData.imgs.beginTomatoButton.fileId],//开始按钮图标
          [app.$app.globalData.imgs.alphaChannel.fileId],
          [app.$app.globalData.bgms.sheep_voice_1.fileId, app.$app.globalData.bgms.sheep_voice_2.fileId]//bgm
        ),
      }
    });
    let urls = r_1.result || []
    // console.log('urls', urls);
    tomatoTypes.map((it, i) => {
      it.iconUrl = urls[i]
    })
    app.$app.globalData.imgs.beginTomatoButton.fileUrl = urls[urls.length - 4]
    app.$app.globalData.imgs.alphaChannel.fileUrl = urls[urls.length - 3]
    app.$app.globalData.bgms.sheep_voice_1.fileUrl = urls[urls.length - 2]
    app.$app.globalData.bgms.sheep_voice_2.fileUrl = urls[urls.length - 1]
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

  useEffect(() => {
    userManager.unionid && userManager.unionid.length > 0 &&
      userManager.userInfo && userManager.userInfo.tomatoCalendarId &&
      userManager.userInfo.tomatoCalendarId.length > 0 &&
      getTomatoDays()
  }, [userManager])

  useEffect(() => {
    if (userManager.userInfo && userManager.userInfo.tomatoCalendarId
      && userManager.userInfo.tomatoCalendarId.length > 0) {
      getTomatoCalendar(userManager.userInfo.tomatoCalendarId)
    }
  }, [userManager.unionid, userManager.userInfo && userManager.userInfo.tomatoCalendarId])

  usePullDownRefresh(() => {
    userManager.unionid && userManager.unionid.length > 0 &&
      userManager.userInfo && userManager.userInfo.tomatoCalendarId &&
      userManager.userInfo.tomatoCalendarId.length > 0 &&
      getTomatoDays()

    Taro.stopPullDownRefresh()
  })

  const getTomatoCalendar = async (tomatoCalendarId) => {
    let res = await wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'tomatoCalendars',

        queryTerm: { _id: tomatoCalendarId },
      },
    })
    if ((!res && res.result && res.result.data && res.result.data.length > 0)) { return }
    let tomatoCalendar = res.result.data[0]
    setTomatoCalendar(
      tomatoCalendar //*unfinished tomatoCalendar对象越来越大时取回来的数据太大，不知道能不能分开取回
    );
  }
  const getTomatoDays = async () => {
    let tomatoDays = await databaseFunctions.tomato_functions.getTomatoDays(
      userManager.unionid, [dayjs().format('YYYYMMDD')])
    if (!(tomatoDays && tomatoDays.length > 0)) { return }
    let tomatoDay = tomatoDays[0]
    let redList = new Array(tomatoDay.redQuantity).fill('xx');
    let yellowList = new Array(tomatoDay.yellowQuantity).fill('xx');;
    let blueList = new Array(tomatoDay.blueQuantity).fill('xx');;
    let whiteList = new Array(tomatoDay.whiteQuantity).fill('xx');;
    setState({
      ...state,
      tomatoDay: tomatoDay,
      redList: redList,
      yellowList: yellowList,
      blueList: blueList,
      whiteList: whiteList,
    });
  }





  return (
    <Layout
      version={'TOMATO'}
      className='today_tomato_page'
      mode='TOMATO'
      navBarKind={3}
      navBarTitle='今天的番茄'
    >
      {tomatoCalendar && tomatoCalendar.tomatoNames &&
        tomatoCalendar.tomatoNames.map((it, i) => {
          return (
            <View className='a_tomato_type'>
              <View className='name'>{it.name}</View>
              {it.id === 'red' &&
                <View className='tomato_icon_list'>
                  {(state.redList && state.redList.length > 0) ?
                    state.redList.map((it, i) => {
                      return (
                        <View className='tomato_icon_wrap'>
                          <Image src={tomatoTypes[0].iconUrl} />
                        </View>
                      )
                    }) :
                    <View className='empty'>无</View>
                  }
                </View>
              }
              {it.id === 'yellow' &&
                <View className='tomato_icon_list'>
                  {(state.yellowList && state.yellowList.length > 0) ?
                    state.yellowList.map((it, i) => {
                      return (
                        <View className='tomato_icon_wrap'>
                          <Image src={tomatoTypes[1].iconUrl} />
                        </View>
                      )
                    }) :
                    <View className='empty'>无</View>
                  }
                </View>
              }
              {it.id === 'blue' &&
                <View className='tomato_icon_list'>
                  {(state.blueList && state.blueList.length > 0) ?
                    state.blueList.map((it, i) => {
                      return (
                        <View className='tomato_icon_wrap'>
                          <Image src={tomatoTypes[2].iconUrl} />
                        </View>
                      )
                    }) :
                    <View className='empty'>无</View>
                  }
                </View>
              }
              {it.id === 'white' &&
                <View className='tomato_icon_list'>
                  {(state.whiteList && state.whiteList.length > 0) ?
                    state.whiteList.map((it, i) => {
                      return (
                        <View className='tomato_icon_wrap'>
                          <Image src={tomatoTypes[3].iconUrl} />
                        </View>
                      )
                    }) :
                    <View className='empty'>无</View>
                  }
                </View>
              }
            </View>
          )
        })
      }
    </Layout>
  )
}
TodayTomatoPage.defaultProps = {
};
export default TodayTomatoPage;