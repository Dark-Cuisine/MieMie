import React, { Component } from 'react'
import Taro,{useRouter,usePullDownRefresh} from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtSearchBar } from 'taro-ui'
import * as actions from "../../../../../public/redux/actions";
import dayjs from 'dayjs'

import TabBar from '../../../../../public/components/Layout/TabBar/TabBar'
import Layout from '../../../../../public/components/Layout/Layout'
import ShoppingPageC from '../../../../../public/pages/BuyerPages/ShoppingPage/ShoppingPage'
import './ShoppingPage.scss'

const ShoppingPage = (props) => {

  usePullDownRefresh(() => {
    console.log('ui-1');
     Taro.stopPullDownRefresh()
  })
     return (
       <ShoppingPageC 
       version={'BUYER'}
       />
     )
 }

export default ShoppingPage;
