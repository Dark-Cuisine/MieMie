import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import Layout from '../../../components/Layout/Layout'

import './MySolitairesPage.scss'

/**
 * 我发布的接龙 
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
    <Layout
      version={props.version}
      className='my_solitaires_page'
      mode='SOLITAIRE'
      navBarKind={3}
      navBarTitle='我发布的接龙'
    >
      我发布的接龙
    </Layout>
  )
}
MySolitairesPage.defaultProps = {
  version:'SOLITAIRE',
};
export default MySolitairesPage;