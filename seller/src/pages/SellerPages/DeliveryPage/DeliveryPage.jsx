import React, { Component, useState, useReducer, useEffect, useRef } from 'react'
import Taro, { useRouter,usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtTabs, AtTabsPane, AtModal, AtCalendar } from 'taro-ui'
import dayjs from 'dayjs'

import Layout from '../../../../../public/components/Layout/Layout'
import DeliveryPageC from '../../../../../public/pages/SellerPages/DeliveryPage/DeliveryPage'

import './DeliveryPage.scss'

const db = wx.cloud.database();
const _ = db.command


const DeliveryPage = (props) => {
  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })
  
  return (
     <DeliveryPageC 
     version={'SELLER'}
  />
   )
}

export default DeliveryPage;