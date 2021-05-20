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

/***
 * 今天的番茄
 */
const TodayTomatoPage = (props) => {
  const dispatch = useDispatch();
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
    userManager.unionid && userManager.unionid.length > 0 &&
      userManager.userInfo && userManager.userInfo.tomatoCalendarId &&
      userManager.userInfo.tomatoCalendarId.length > 0 &&
      getTomatoDay()
  }, [userManager.unionid])

  useEffect(() => {
    if (userManager.userInfo && userManager.userInfo.tomatoCalendarId
      && userManager.userInfo.tomatoCalendarId.length > 0) {
      getTomatoCalendar(userManager.userInfo.tomatoCalendarId)
    }
  }, [userManager.unionid, userManager.userInfo && userManager.userInfo.tomatoCalendarId])

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
  const getTomatoDay = async () => {
    let tomatoDay = await databaseFunctions.tomato_functions.getTomatoDay(
      userManager.unionid, dayjs().format('YYYYMMDD'))
    if (!tomatoDay) { return }
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
    console.log('q-tomatoDay', tomatoDay, redList);
  }

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })



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