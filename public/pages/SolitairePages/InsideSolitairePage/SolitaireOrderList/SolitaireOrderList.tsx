import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import * as actions from '../../../../redux/actions'

import * as tool_functions from '../../../../utils/functions/tool_functions'

import './SolitaireOrderList.scss'

/***
 *<SolitaireOrderList
        solitaireOrders={state.solitaire.solitaireOrders}
        mode={}//'SELLER','BUYER'
        type={}//'GOODS','EVENT'
      /> 
 */
//*unfinished 最好给每个solitaireOrder弄个个位数的接龙号
const SolitaireOrderList = (props) => {
  const dispatch = useDispatch();
  const userManager = useSelector(state => state.userManager);
  const initState = {
    solitaireOrders: [],
  }

  const [state, setState] = useState(initState);

  useEffect(() => {
    doUpdate()
  }, [props.solitaireOrders])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const doUpdate = async () => {
    dispatch(actions.toggleLoadingSpinner(true));
     if (!(props.solitaireOrders && props.solitaireOrders.length > 0)) {
      dispatch(actions.toggleLoadingSpinner(false));
      return
    }
    let res = await wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'solitaireOrders',

        operatedItem: '_ID',
        orderBy: 'createTime',//根据时间排序
        desc: 'asc',//新后旧前（后面map出来时会翻转）
        queriedList: props.solitaireOrders,
      },
    });

    if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
      dispatch(actions.toggleLoadingSpinner(false));
      return
    }
    setState({
      ...state,
      solitaireOrders: res.result.data,
    });

    dispatch(actions.toggleLoadingSpinner(false));
  }

  return (
    <View className={'solitaire_orders_list '.concat(props.className)}>
      <View className='solitaire_orders_list_item_title'>
        <View className='line_horizontal_bold' />
        接龙中的伙伴们
        <View className='line_horizontal_bold' />
      </View>
      <View className='' style='display:flex;flex-direction:column-reverse;'>
        {state.solitaireOrders.map((it, i) => {
          return (
            < View className='solitaire_order_card' >
              <View className='card_head'>
                <View className='flex items-center'>
                  <View className='number'>{i}.</View>
                  <View className=''>{it.buyerName}</View>
                </View>
                <View className='update_time'>{it.updateTime ? it.updateTime : it.createTime}</View>
              </View>
              <View className='product_list'>
                {
                  it.productList && it.productList.map((product, i) => {
                    return (
                      <View className='product'>
                        <View className='' >{product.product.name}</View>
                        <View className='multiplication'>x</View>
                        <View className=''>{product.quantity}{product.product.unit}</View>
                        <View className='' style='margin-left:5rpx;'>(¥{product.product.price})</View>
                      </View>
                    )
                  })
                }
              </View>
              {it.pickUpWay && it.pickUpWay.place &&
                it.pickUpWay.way && it.pickUpWay.way.length > 0 &&
                <View className={'pick_up_way flex '.concat(it.pickUpWay.way === 'EXPRESS_PICK_UP' ? '' : 'items-center')}>
                  <View className='mie_button' style='border-color:var(--gray-4);color:var(--gray-4);margin: 5rpx 10rpx 5rpx 0;'>
                    {it.pickUpWay.way === 'SELF_PICK_UP' ? (props.type === 'GOODS' ? '自提点' : '集合点') :
                      (it.pickUpWay.way === 'STATION_PICK_UP' ? (
                        props.type === 'GOODS' ? '车站取货' : '集合车站') : '邮寄')}</View>
                  {(it.pickUpWay.way === 'SELF_PICK_UP' && it.pickUpWay.place && it.pickUpWay.place.place) ?
                    <View className='flex items-center'>
                      <View className='replicable_item'
                        onLongPress={() => {
                          tool_functions.text_functions.copyText(it.pickUpWay.place.place)
                        }}
                      >
                        {it.pickUpWay.place.place}
                      </View>
                      {it.pickUpWay.place.placeDetail && it.pickUpWay.place.placeDetail.length > 0 &&
                        <View className='replicable_item'
                          onLongPress={() => {
                            tool_functions.text_functions.copyText(it.pickUpWay.place.placeDetail)
                          }}
                        >（{it.pickUpWay.place.placeDetail}）</View>
                      }

                    </View> :
                    (it.pickUpWay.way === 'STATION_PICK_UP' ?
                      <View className='replicable_item'
                        onLongPress={() => {
                          tool_functions.text_functions.copyText(it.pickUpWay.place.station)
                        }}>
                        {it.pickUpWay.place.station}（{it.pickUpWay.place.line}）
                        {it.pickUpWay.place.des &&
                          <View className=''>{it.pickUpWay.place.des}</View>
                        }
                      </View> :
                      ((props.mode === 'SELLER' ||
                        it.authId === userManager.unionid) &&
                        <View className=''>
                          <View
                            className='replicable_item'
                            onLongPress={() => {
                              tool_functions.text_functions.copyText(it.pickUpWay.place.name)
                            }}
                          >姓名：{it.pickUpWay.place.name}</View>
                          <View className='replicable_item'
                            onLongPress={() => {
                              tool_functions.text_functions.copyText(it.pickUpWay.place.tel)
                            }}
                          >电话：{it.pickUpWay.place.tel}</View>
                          <View className='replicable_item'
                            onLongPress={() => {
                              tool_functions.text_functions.copyText(it.pickUpWay.place.address)
                            }}
                          >地址：{it.pickUpWay.place.address}</View>
                        </View>
                      )
                    )}
                </View>
              }
              {it.paymentOption &&
                <View className='payment'>
                  <View className='flex items-center'>
                    <View className=''>支付方式：{it.paymentOption.option}</View>
                    {
                      (props.mode === 'SELLER' ||
                        it.authId === userManager.unionid) &&
                      it.paymentOption.account && it.paymentOption.account.length > 0 &&
                      <View className=''>（{it.paymentOption.account}）</View>
                    }
                  </View>
                  {
                    (props.mode === 'SELLER' ||
                      it.authId === userManager.unionid) &&
                    it.paymentOption.des && it.paymentOption.des.length > 0 &&
                    <View className=''>支付备注：{it.paymentOption.des}</View>
                  }
                </View>
              }
              {it.des && it.des.length > 0 &&
                <View className='des'>(备注：{it.des})</View>
              }
              {(props.mode === 'SELLER') &&//卖家才显示总价
                <View className='total_price'>总价: {Number(it.totalPrice)}</View>}
            </View>
          )
        })}
      </View>
    </View >
  )
}
SolitaireOrderList.defaultProps = {
  mode: 'BUYER'
};
export default SolitaireOrderList;