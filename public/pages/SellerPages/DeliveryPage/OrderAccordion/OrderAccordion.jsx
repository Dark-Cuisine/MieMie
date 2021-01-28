import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtAccordion } from 'taro-ui'

import OrderCard from '../../../../components/cards/OrderCard/OrderCard'

import './OrderAccordion.scss'

/****
  <OrderAccordion
  title='xxx'
  type={0}  //两种类型。0:普通的Accordion，1:特别针对orderCard的Accordion

  notEmpty={true}

  orderList=[]

  buttonTextRight='完成订单' //传给orderCard
  handleClickButtonRight={handleBeforeSubmit.bind(this, 'FINISH_ORDER', item)}
 */
const OrderAccordion = (props) => {
  const initState = {
    ifOpen: props.notEmpty
  }
  const [state, setState] = useState(initState);

  // useEffect(() => {
  //   console.log('orderList', props.orderList);
  // }, [props.orderList])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const handleClick = (v) => {
    setState({
      ...state,
      ifOpen: v
    });
  }

  // const finishOrder =async()=>{//* unfinished 以后加上完成订单的功能
  //   let c1 = new wx.cloud.Cloud({//*不知为何云函数update不了
  //     resourceAppid: 'wx8d82d7c90a0b3eda',
  //     resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
  //   })

  //   await c1.init({
  //     secretId: 'AKIDwiHc09xCF3cwDFrESWOHxNZXLCfvRL2W',
  //     secretKey: 'XZfka5K83yeKnAcBCShS4SgS3cBXfXBs',
  //     env: 'miemie-buyer-7gemmgzh05a6c577'
  //   })
  //   let db_1 = c1.database({
  //     env: 'miemie-buyer-7gemmgzh05a6c577'
  //   });
  // }

  return (
    <AtAccordion
      open={state.ifOpen}
      isAnimation={false}
      className={'order_accordion '.concat(
        props.notEmpty ? '' : 'order_accordion_empty '
      ).concat(props.className)}
      title={props.title}
      onClick={(v) => handleClick(v)}
    >
      {props.type == 0 &&
        state.ifOpen &&
        <View className=''>
          {props.children}
        </View>
      }
      {props.type == 1 &&
        state.ifOpen &&
        <View className='order_accordion_content'>
          {props.children}
          {props.orderList.map((it, i) => {
            return (
              <OrderCard
                mode='SELLER'
                detail={2}
                key={it._id}
                order={it}
              // buttonTextRight={'完成订单'}
              // beforeRightButtonText={'确定完成订单？'}
              // handleClickButtonRight={()=>finishOrder()}
              />
            )
          })}
        </View>

      }

    </AtAccordion>
  )
}
OrderAccordion.defaultProps = {
   type: 0,
};
export default OrderAccordion;