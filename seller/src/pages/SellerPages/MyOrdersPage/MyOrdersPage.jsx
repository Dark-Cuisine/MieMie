import React, { Component, useState, useReducer, useEffect, useRef } from 'react'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtIcon, AtModal, AtModalHeader, AtModalAction, AtInput, AtTabs } from 'taro-ui'
import { connect } from 'react-redux'

import Layout from '../../../../../public/components/Layout/Layout'
import MyOrdersPageC from '../../../../../public/pages/SellerPages/MyOrdersPage/MyOrdersPage'

import './MyOrdersPage.scss'


const MyOrdersPage = (props) => {
  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })
  return (
    <MyOrdersPageC
      version={'SELLER'}
    />
  )
}

export default MyOrdersPage;
