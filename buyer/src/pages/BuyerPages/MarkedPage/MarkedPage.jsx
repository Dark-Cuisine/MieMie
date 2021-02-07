import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter,usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtModal } from 'taro-ui'

import Layout from '../../../../../public/components/Layout/Layout'
import MarkedPageC from '../../../../../public/pages/BuyerPages/MarkedPage/MarkedPage'

import './MarkedPage.scss'


const MarkedPage = (props) => {

  usePullDownRefresh(() => {
    // console.log('ui-2');
    Taro.stopPullDownRefresh()
  })

  return (
    <MarkedPageC
      version={'BUYER'}
    />
  )
}

export default MarkedPage;