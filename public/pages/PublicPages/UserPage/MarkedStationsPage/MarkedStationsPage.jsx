import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter ,usePullDownRefresh} from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import Layout from '../../../../components/Layout/Layout'
import MarkedStationsContainer from '../../../../containers/MarkedStationsContainer/MarkedStationsContainer'

import './MarkedStationsPage.scss'

const db = wx.cloud.database();
const _ = db.command


const MarkedStationsPage = (props) => {
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
    version={props.version}
    navBarKind={2}
      lateralBarKind={0}
      navBarTitle='我保存的车站'
      ifShowTabBar={false}
      >
      <MarkedStationsContainer
        version={props.version}
      />
    </Layout>
  )
}

export default MarkedStationsPage;