import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import Layout from '../../../../../public/components/Layout/Layout'

import './TomatoCalendarPage.scss'

/***
 * 番茄日历
 */
const TomatoCalendarPage = (props) => {
  const initState = {
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  return (
    <Layout
      version={'TOMATO'}
      className='today_tomato_page'
      mode='TOMATO'
      navBarKind={3}
      navBarTitle='番茄日历'
    >

    </Layout>
  )
}
TomatoCalendarPage.defaultProps = {
};
export default TomatoCalendarPage;