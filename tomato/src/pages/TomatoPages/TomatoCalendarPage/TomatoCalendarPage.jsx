import dayjs from 'dayjs'
import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import Layout from '../../../../../public/components/Layout/Layout'
import * as databaseFunctions from '../../../../../public/utils/functions/databaseFunctions'
import * as tool_functions from '../../../../../public/utils/functions/tool_functions'

import './TomatoCalendarPage.scss'

/***
 * 番茄日历
 */
const TomatoCalendarPage = (props) => {
  const dispatch = useDispatch();
  const userManager = useSelector(state => state.userManager);
  const initState = {
  }
  const [state, setState] = useState(initState);
  const initYear = dayjs().format('YYYY')
  const initMon = dayjs().format('MM')
  const initDay = dayjs().format('DD')
  const initDate = {
    year: initYear,
    month: initMon,
    day: initDay,

    daysNum: new Date(initYear, initMon, 0).getDate(),//这个月总天数
    days: [],
  }
  const [date, setDate] = useState(initDate);

  useEffect(() => {
    initDays()
  }, [userManager.unionid])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const initDays = async () => {
    let days = []
    let dateList = []
    for (let i = 0; i < date.daysNum; ++i) {
      let formatedDate = date.year.concat(date.month,
        tool_functions.format_functions.prefixZero(i, 2))
      days.push({
        formatedDate: formatedDate,
        dayString: (i + 1) + '日',
      })
      dateList.push(formatedDate)
    }
    let tomatoDays = await getTomatoDays(dateList)
    if ((tomatoDays && tomatoDays.length > 0)) {
      tomatoDays.forEach(it => {
        let index = days.findIndex(itt => {
          return itt.formatedDate == it.date
        })
        if (index > -1) {
          days[index].tomatoDay = it
        }
      })
    }
    console.log('q-days', days);
    setDate({
      ...date,
      days: days,
    })
  }

  //dateList:['YYYYMMDD']
  const getTomatoDays = async (dateList) => {
    if (!(userManager.unionid && userManager.unionid.length > 0)) { return }
    let tomatoDays = await databaseFunctions.tomato_functions.getTomatoDays(
      userManager.unionid, dateList)
    if (!(tomatoDays && tomatoDays.length > 0)) { return }
    tomatoDays.forEach(it => {
      it.redList = new Array(it.redQuantity).fill('xx');
      it.yellowList = new Array(it.yellowQuantity).fill('xx');;
      it.blueList = new Array(it.blueQuantity).fill('xx');;
      it.whiteList = new Array(it.whiteQuantity).fill('xx');;
    })

    return tomatoDays
  }

  console.log('q-date', date);

  return (
    <Layout
      version={'TOMATO'}
      className='tomato_calendar_page'
      mode='TOMATO'
      navBarKind={3}
      navBarTitle='番茄日历'
    >
      <View className='year_month'>
        <View className='string'>{date.year + '年' + date.month + '月'} </View>
        <View className='line_horizontal' />
      </View>
      <View className='day_lists'>
        <View className='day_list'>
          {date.days && date.days.length > 0 &&
            date.days.slice(0, 15).map((it, i) => {//分成两半
              return (
                <View className='day_string'>{it.dayString}</View>
              )
            })}
        </View>
        <View className='day_list'>
          {date.days && date.days.length > 0 &&
            date.days.slice(15, date.days.length).map((it, i) => {
              return (
                <View className=''>{it.dayString}</View>
              )
            })}
        </View>
      </View>
    </Layout>
  )
}
TomatoCalendarPage.defaultProps = {
};
export default TomatoCalendarPage;