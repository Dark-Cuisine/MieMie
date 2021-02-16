import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import MySolitairesPageC from '../../../../../public/pages/SolitairePages/MySolitairesPage/MySolitairesPage'

import './MySolitairesPage.scss'

/**
 * 创建新接龙or修改現有接龙   
 */
const MySolitairesPage = (props) => {
  const initState = {
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  return (
    <MySolitairesPageC
      version='SOLITAIRE'
    />
  )
}

export default MySolitairesPage;