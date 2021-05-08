import React, { Component } from 'react'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import { connect } from 'react-redux'
import { AtModal } from 'taro-ui'

import Layout from '../../../../../public/components/Layout/Layout'
import UserPageC from '../../../../../public/pages/PublicPages/UserPage/UserPage'
import ShoppingPage from '../../../../../public/pages/BuyerPages/ShoppingPage/ShoppingPage'
import './UserPage.scss'


const UserPage = (props) => {


  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })


  return (
    // <ShoppingPage/>
    <UserPageC
      mode='SOLITAIRE'
      version={'SOLITAIRE'}
    />
  )
}

export default UserPage;
