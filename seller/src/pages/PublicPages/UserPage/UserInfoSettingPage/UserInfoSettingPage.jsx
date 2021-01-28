import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter,usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import UserInfoSettingPageC from '../../../../../../public/pages/PublicPages/UserPage/UserInfoSettingPage/UserInfoSettingPage'
import './UserInfoSettingPage.scss'

const db = wx.cloud.database();
const _ = db.command

const UserInfoSettingPage = (props) => {
  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })
    

  return (
       <UserInfoSettingPageC />
   )
}

export default UserInfoSettingPage;