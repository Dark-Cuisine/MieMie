import React, { Component, useState, useReducer, createContext, useEffect, useContext, useImperativeHandle, useRef } from 'react'
import Taro, { useRouter ,usePullDownRefresh} from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import Layout from '../../../../../public/components/Layout/Layout'
import { connect } from 'react-redux'
import * as actions from '../../../../../public/redux/actions/index'
import { AtModal, AtButton, AtIcon } from "taro-ui"

import PurchasePageC from '../../../../../public/pages/BuyerPages/PurchasePage/PurchasePage'


import './PurchasePage.scss'


const PurchasePage = (props) => {
  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  return (
      <PurchasePageC 
      version={'BUYER'}
      />
  )
}



export default PurchasePage;
