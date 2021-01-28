import React, { Component, useState, useReducer, useEffect, useRef } from 'react'
import Taro, { useRouter ,usePullDownRefresh} from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'

import ManageShopPageC from '../../../../../../public/pages/SellerPages/MyShopsPage/ManageShopPage/ManageShopPage'

import './ManageShopPage.scss'



const ManageShopPage = () => {
  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  return (
    <ManageShopPageC 
    version={'SELLER'}
 />
  )
}


export default ManageShopPage;
