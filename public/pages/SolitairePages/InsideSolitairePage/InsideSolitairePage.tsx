import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import dayjs from 'dayjs'

import * as actions from '../../../redux/actions'

import SolitaireOrderList from './SolitaireOrderList/SolitaireOrderList'
import SolitaireContainer from '../../../containers/SolitaireContainer/SolitaireContainer'
import Layout from '../../../components/Layout/Layout'

import './InsideSolitairePage.scss'

/***
 * mode='BUYER','SELLER' 卖家模式用于新建or修改
 */
const InsideSolitairePage = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const shopsManager = useSelector(state => state.shopsManager);
  const userManager = useSelector(state => state.userManager);
  const app = getApp()
  const initState = {
    solitaire: {
      info: {
        type: router.params.type,//新建接龙时，会从router传此参数进来。'EVENT'活动接龙,'GOODS'商品接龙
        startTime: {
          date: dayjs().format('YYYY-MM-DD'),
          time: dayjs().format('HH:mm'),
        }, //开始时间
        endTime: {
          date: '',
          time: ''
        }, //结束时间
        currency: 'jpy',//默认为日元
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
    },
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
    },//当前用户为接龙创建者时才会用到这个
    solitaireOrder: null,
  }
  const [state, setState] = useState(initState);
  const [mode, setMode] = useState(router.params.mode ? router.params.mode : props.mode);//'BUYER','SELLER'

  useEffect(() => {
    setMode(router.params.mode);
    doUpdate()
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const doUpdate = async () => {
    dispatch(actions.toggleLoadingSpinner(true));

    let solitaire = state.solitaire
    let solitaireShop = state.solitaireShop
    let solitaireOrder = state.solitaireOrder
    let solitaireId = router.params.solitaireId;
    let solitaireOrderId = router.params.solitaireOrderId;
    let res = await wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'solitaires',

        queryTerm: { _id: solitaireId },
      },
    });
    if (!(res && res.result && res.result.data && res.result.data.length > 0)) { return }
    solitaire = res.result.data[0]

    if (solitaire && (userManager.unionid === solitaire.authId)) {
      let r = await wx.cloud.callFunction({
        name: 'get_data',
        data: {
          collection: 'solitaireShops',

          queryTerm: { _id: solitaire.solitaireShopId },
        },
      });
      if (r && r.result && r.result.data && r.result.data.length > 0) {
        solitaireShop = r.result.data[0]
      }
    }

    if (mode === 'BUYER') {
      let res_2 = await wx.cloud.callFunction({
        name: 'get_data',
        data: {
          collection: 'solitaireOrders',

          queryTerm: { _id: solitaireOrderId },
        },
      });
      if ((res_2 && res_2.result && res_2.result.data && res_2.result.data.length > 0)) {
        solitaireOrder = res_2.result.data[0]
      }
    }

    //  console.log('solitaireShop', solitaireShop);
    setState({
      ...state,
      solitaire: solitaire,
      solitaireShop: solitaireShop,
      solitaireOrder: solitaireOrder,
    });
    dispatch(actions.toggleLoadingSpinner(false));
  }


  return (
    <Layout
      className={'inside_solitaire_page '.concat(props.className)}
      mode={'SOLITAIRE'}
      navBarKind={2}
      lateralBarKind={0}
      navBarTitle={mode === 'SELLER' ?
        (state.solitaire._id ? '修改' : '新建').concat(
          state.solitaire && state.solitaire.info && state.solitaire.info.type === 'EVENT' ?
            '活动' : '商品', '接龙'
        )
        : '参与接龙'}
      ifShowTabBar={false}
      ifShowShareMenu={mode === 'SELLER'}
    >
      {
        state.solitaireShop && mode === 'BUYER' &&
        (state.solitaireShop.authId === userManager.unionid) &&//同作者才能修改 *unfinished 以后加上能添加管理员 
        <View
          className='edit_button'
          onClick={() => setMode(mode === 'BUYER' ? 'SELLER' : 'BUYER')}
        >
          {mode === 'BUYER' &&
            <View
              className='at-icon at-icon-edit'
            />
          }
          <View
            className=''
          >{mode === 'BUYER' ? '修改接龙' : '预览'}</View>
        </View>
      }
      <SolitaireContainer
        type={state.solitaire && state.solitaire.info && state.solitaire.info.type}
        solitaireOrder={state.solitaireOrder}
        mode={mode}
        solitaireShop={state.solitaireShop}
        solitaire={state.solitaire}
        paymentOptions={userManager.userInfo && userManager.userInfo.paymentOptions}
      // handleUpload={(solitaire, products) => handleUpload(solitaire, products)}
      />
      {mode === 'BUYER' &&
        <SolitaireOrderList
          solitaireOrders={state.solitaire && state.solitaire.solitaireOrders}
          mode={(state.solitaireShop && (state.solitaireShop.authId === userManager.unionid)) ?
            'SELLER' : 'BUYER'}//同作者才能看到买家账户
        />
      }
    </Layout>
  )
}
InsideSolitairePage.defaultProps = {
  mode: 'BUYER',
};
export default InsideSolitairePage;