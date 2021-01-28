import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter ,usePullDownRefresh} from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import MarkedStationsPageC from '../../../../../../public/pages/PublicPages/UserPage/MarkedStationsPage/MarkedStationsPage'
import './MarkedStationsPage.scss'

const db = wx.cloud.database();
const _ = db.command


const MarkedStationsPage = (props) => {
  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })
  return (
       <MarkedStationsPageC 
       version={'BUYER'}
       />
   )
}

export default MarkedStationsPage;