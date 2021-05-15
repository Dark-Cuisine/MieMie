import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import Layout from '../../../../../public/components/Layout/Layout'

import './TodayTomatoPage.scss'

/***
 * 今天的番茄
 */
const TodayTomatoPage = (props) => {
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
      navBarTitle='今天的番茄'
    >
    </Layout>
  )
}
TodayTomatoPage.defaultProps = {
};
export default TodayTomatoPage;