import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import ManageSolitairesPageC from '../../../../../public/pages/SolitairePages/ManageSolitairesPage/ManageSolitairesPage'

import './ManageSolitairesPage.scss'

/**
 * 创建新接龙or修改現有接龙   
 */
const ManageSolitairesPage = (props) => {
  const initState = {
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  return (
    <ManageSolitairesPageC
      version='SOLITAIRE'
    />
  )
}

export default ManageSolitairesPage;