import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter ,usePullDownRefresh} from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import InsideShopPageC from '../../../../../public/pages/PublicPages/InsideShopPage/InsideShopPage'

import './InsideShopPage.scss'

const db = wx.cloud.database();
const _ = db.command

const InsideShopPage = (props) => {
  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })
    
  return (
    <InsideShopPageC
      version={'SELLER'}
    />
  )
}

export default InsideShopPage;