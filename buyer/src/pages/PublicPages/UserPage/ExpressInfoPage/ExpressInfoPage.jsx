import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter,usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtModal } from 'taro-ui'

 import ExpressInfoPageC from '../../../../../../public/pages/PublicPages/UserPage/ExpressInfoPage/ExpressInfoPage'

import './ExpressInfoPage.scss'

const db = wx.cloud.database();
const _ = db.command


const ExpressInfoPage = (props) => {
 
  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })
    return (
            <ExpressInfoPageC
            version={'BUYER'}
            />
    )
}

export default ExpressInfoPage;