import dayjs from 'dayjs'
import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import Layout from '../../../../../public/components/Layout/Layout'
import * as databaseFunctions from '../../../../../public/utils/functions/databaseFunctions'
import * as tool_functions from '../../../../../public/utils/functions/tool_functions'

import './TomatoCalendarPage.scss'

const app = getApp()
const tomatoTypes = app.$app.globalData.tomatoTypes



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
    // databaseFunctions.tomato_functions.changeTomatoQuantity(//*这里是测试时控制番茄数量用的
    //   userManager.unionid, '20210312', 'red', 25)
    initDays()
  }, [userManager, date.month])

  usePullDownRefresh(() => {
    initDays()
    Taro.stopPullDownRefresh()
  })

  const initDays = async () => {
    let days = []
    let dateList = []
    for (let i = 0; i < date.daysNum; ++i) {
      let formatedDate = date.year.concat(date.month,
        tool_functions.format_functions.prefixZero(i + 1, 2))
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


  const changeMonth = (way, v = null, i = null) => {
    let newYear = date.year
    let newMonth = date.month
    switch (way) {
      case 'LAST':
        if ((Number(newMonth) - 1) < 1) {
          newMonth = '12'
          newYear = String(Number(newYear) - 1)
        } else {
          newMonth = String(tool_functions.format_functions.prefixZero(Number(newMonth) - 1, 2))
        }
        break;
      case 'NEXT':
        if ((Number(newMonth) + 1) > 12) {
          newMonth = '01'
          newYear = String(Number(newYear) + 1)
        } else {
          newMonth = String(tool_functions.format_functions.prefixZero(Number(newMonth) + 1, 2))
        }
        break;
      default:
        break;
    }
    setDate({
      ...date,
      year: newYear,
      month: newMonth,
    })
  }

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
        <View className='control_button'>
          <View
            className='at-icon at-icon-chevron-up'
            onClick={() => changeMonth('LAST')}
          />
          <View
            className='at-icon at-icon-chevron-down'
            onClick={() => changeMonth('NEXT')}
          />
        </View>
      </View>
      <scroll-view
        className=''
        scroll-x={true}
      >
        <View className='day_list' >
          {date.days && date.days.length > 0 &&
            date.days.map((it, i) => {
              return (
                <View className='day_item'>
                  <View className='day_string'>{it.dayString}</View>
                  <View className='tomatos'>
                    <View className='a_list'>
                      {it.tomatoDay && it.tomatoDay.redList.map((it, i) => {
                        return (
                          <Image src={tomatoTypes[0].iconUrl} />
                        )
                      })}
                    </View>
                    <View className='a_list'>
                      {it.tomatoDay && it.tomatoDay.yellowList.map((it, i) => {
                        return (
                          <Image src={tomatoTypes[1].iconUrl} />
                        )
                      })}
                    </View>
                    <View className='a_list'>
                      {it.tomatoDay && it.tomatoDay.blueList.map((it, i) => {
                        return (
                          <Image src={tomatoTypes[2].iconUrl} />
                        )
                      })}
                    </View>
                    <View className='a_list'>
                      {it.tomatoDay && it.tomatoDay.whiteList.map((it, i) => {
                        return (
                          <Image src={tomatoTypes[3].iconUrl} />
                        )
                      })}
                    </View>

                  </View>
                </View>
              )
            })}
        </View>
      </scroll-view>
    </Layout>
  )
}
TomatoCalendarPage.defaultProps = {
};
export default TomatoCalendarPage;