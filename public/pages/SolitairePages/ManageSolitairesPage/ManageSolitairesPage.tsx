import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import Layout from '../../../components/Layout/Layout'
import SolitaireContainer from '../../../containers/SolitaireContainer/SolitaireContainer'

import './ManageSolitairesPage.scss'

/**
 * 创建新接龙or修改現有接龙   
 */
const ManageSolitairesPage = (props) => {
  const router = useRouter();
  const initState = {
    mode: 'ADD',//'ADD' 'MODIFY'

    solitaireShop: {},
    solitaire: {},
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
      navBarKind={2}
      lateralBarKind={0}
      navBarTitle={state.mode === 'ADD' ? '新建接龙' : '修改接龙'}
      ifShowTabBar={false}

      initUrl={router.path}
    >
      <SolitaireContainer
        solitaire={state.solitaire}
      />
    </Layout>
  )
}
ManageSolitairesPage.defaultProps = {
  version: 'SELLER'
};
export default ManageSolitairesPage;