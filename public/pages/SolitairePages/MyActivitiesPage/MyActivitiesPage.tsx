import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import Layout from '../../../components/Layout/Layout'

import './MyActivitiesPage.scss'

/**
 * 我参与的接龙 
 */
const MyActivitiesPage = (props) => {
  const initState = {
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  return (
    <Layout
      version={props.version}
      className='my_activities_page'
      mode='SOLITAIRE'
      navBarKind={3}
      navBarTitle='我参与的接龙'
    >
      我参与的接龙
    </Layout>
  )
}
MyActivitiesPage.defaultProps = {
  version: 'SOLITAIRE',
};
export default MyActivitiesPage;