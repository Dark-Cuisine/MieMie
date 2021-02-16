import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter ,usePullDownRefresh} from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
import { AtInput, AtTextarea, AtModal } from 'taro-ui'

import FeedBackPageC from '../../../../../../public/pages/PublicPages/UserPage/FeedBackPage/FeedBackPage'
import './FeedBackPage.scss'

const FeedBackPage = () => {

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })
    

  return (
    <FeedBackPageC
      version={'SELLER'}
    />
  )
}

export default FeedBackPage;