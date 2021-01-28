import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter,usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtTextarea } from 'taro-ui'

import Layout from '../../../../../public/components/Layout/Layout'
import OrdersPageC from '../../../../../public/pages/BuyerPages/OrdersPage/OrdersPage'
import './OrdersPage.scss'



const OrdersPage = (props) => {
  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  return (
    <OrdersPageC 
    version={'BUYER'}
    />
  )
}

export default OrdersPage;


