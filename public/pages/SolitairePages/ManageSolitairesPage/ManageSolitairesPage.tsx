import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import * as actions from "../../../redux/actions/index";
import dayjs from 'dayjs'

import Layout from '../../../components/Layout/Layout'
import SolitaireContainer from '../../../containers/SolitaireContainer/SolitaireContainer'

import * as databaseFunctions from '../../../utils/functions/databaseFunctions'

import './ManageSolitairesPage.scss'

/**
 * 创建新接龙or修改現有接龙   
 */
const ManageSolitairesPage = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userManager = useSelector(state => state.userManager);
  const initState = {
    mode: 'ADD',//'ADD' 'MODIFY'
    type: router.params.type,//'EVENT'活动接龙,'GOODS'商品接龙

    solitaireShop: {
      pickUpWay: {
        selfPickUp: {
          list: [],//{place:'',placeDetail:',nearestStation:{line: '', stations: { list: [], from: '', to: '' }}}
          des: '',
        },
        stationPickUp: {
          list: [],//{line:'',stations:{list:[{station:'',announcements: [{date:'',list:['']}]}],from:'',to:''},floorPrice:0}
          des: '',
        },
        expressPickUp: {
          isAble: false,
          list: [], //{area:'',floorPrice: ''}//满额包邮list
          des: '',
        },
      },
    },
    solitaire: {
      info: {
        type: router.params.type,//'EVENT'活动接龙,'GOODS'商品接龙
        startTime: {
          date: dayjs().format('YYYY-MM-DD'),
          time: dayjs().format('HH:mm'),
        }, //开始时间
        endTime: {
          date: '',
          time: ''
        }, //结束时间
      },
      eventTime: { //只有活动型接龙才有
        startTime: {
          date: dayjs().format('YYYY-MM-DD'),
          time: dayjs().format('HH:mm'),
        }, //开始时间
        endTime: {
          date: '',
          time: ''
        }, //结束时间
      },
      pickUpWay: {
        selfPickUp: {
          list: [],//{place:'',placeDetail:',nearestStation:{line: '', stations: { list: [], from: '', to: '' }}}
          des: '',
        },
        stationPickUp: {
          list: [],//{line:'',stations:{list:[{station:'',announcements: [{date:'',list:['']}]}],from:'',to:''},floorPrice:0}
          des: '',
        },
        expressPickUp: {
          isAble: false,
          list: [], //{area:'',floorPrice: ''}//满额包邮list
          des: '',
        },
      },
    },


  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })



  let typeName = state.type === 'EVENT' ? '活动' : '商品'
  return (
    <Layout
      version={props.version}
      mode='SOLITAIRE'
      navBarKind={2}
      lateralBarKind={0}
      navBarTitle={(state.mode === 'ADD' ? '新建' : '修改').concat(
        typeName, '接龙'
      )}
      ifShowTabBar={false}
      hideShareMenu={true}
    >
      <SolitaireContainer
        type={state.type}
        mode={'SELLER'}
        solitaireShop={state.solitaireShop}
        solitaire={state.solitaire}
      />
    </Layout>
  )
}
ManageSolitairesPage.defaultProps = {
  version: 'SELLER'
};
export default ManageSolitairesPage;