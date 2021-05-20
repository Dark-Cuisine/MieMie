import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter ,usePullDownRefresh} from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtSegmentedControl, AtModal } from 'taro-ui'

import MessagesPageC from '../../../../../public/pages/PublicPages/MessagesPage/MessagesPage'
import './MessagesPage.scss'


const db = wx.cloud.database();
const _ = db.command


const MessagesPage = (props) => {

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })
    
  return (
       <MessagesPageC 
       version={'TOMATO'}
       />
   )
}

export default MessagesPage;

