import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtModal } from 'taro-ui'

import Layout from '../../../../components/Layout/Layout'
import ExpressInfoContainer from '../../../../containers/ExpressInfoContainer/ExpressInfoContainer'

import './ExpressInfoPage.scss'

const db = wx.cloud.database();
const _ = db.command


const ExpressInfoPage = (props) => {
  const initState = {
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])


  return (
    <Layout
    version={props.version}
    navBarKind={2}
      lateralBarKind={0}
      navBarTitle='我的邮寄地址'
      ifShowTabBar={false}
      >
      <ExpressInfoContainer
        version={props.version}
      />
    </Layout>
  )
}

export default ExpressInfoPage;