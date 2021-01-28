import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'


import Layout from '../../../../components/Layout/Layout'

import './UserInfoSettingPage.scss'

const db = wx.cloud.database();
const _ = db.command

const UserInfoSettingPage = (props) => {
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
      navBarTitle='个人信息设置'
    >

    </Layout>
  )
}

export default UserInfoSettingPage;