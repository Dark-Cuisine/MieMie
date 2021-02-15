import React, { Component } from 'react'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtIcon, AtModal, AtModalHeader, AtModalAction, AtInput, AtTabs } from 'taro-ui'
import { connect } from 'react-redux'

import MyShopsPageC from '../../../../../public/pages/SellerPages/MyShopsPage/MyShopsPage'

import './MyShopsPage.scss'

const MyShopsPage = (props) => {
  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  return (
    <MyShopsPageC
      version={'SELLER'}
    />
  )
}

export default MyShopsPage;
