import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtToast } from 'taro-ui'

import './CheckRequiredButton.scss'

/***
 * 
 * <CheckRequiredButton
  checkedItems={[ //越靠前的item优先级越高（越先显示它的toase）
    {
      check: !ordersManager.isOutOfStock,
      toastText: '库存不足！'
    },
    {
      check: state.order.pickUpWay.way.length > 0,
      toastText: '请选择取货方式！'
    },
  ]}
  doAction={()=>xxx()}
>下单</CheckRequiredButton>
 */
const CheckRequiredButton = (props) => {
  const initState = {
    toastText: null,
    ifOpenToast: false,
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])

  const toggleToast = (ifOpen) => {
    setState({
      ...state,
      ifOpenToast: ifOpen,
    });
  }

  const checkRequired = (ifChangeToast = false) => {//检查必选项。ifChangeToast用来决定是否改变state（为应对直接调用的情况）
    let ifLegitimate = true;
    let toastText = null;

    for (let it of props.checkedItems) {
      if (!it.check) {
        toastText = it.toastText;
        ifLegitimate = false;
        break;
      }
    }

    ifChangeToast && toastText &&
      setState({
        ...state,
        toastText: toastText,
        ifOpenToast: true
      });
    return ifLegitimate
  }
  return (
    <View className={'check_required_button '.concat(props.className)}>
      <AtToast
        className='toast'
        isOpened={state.ifOpenToast}
        text={state.toastText}
        onClose={() => toggleToast(false)}
        duration={1500}
      />
      <View
        className={checkRequired() ? 'button' : 'button disable'}
        onClick={() => checkRequired(true) && props.doAction()}
      >
        {props.children}
      </View>

    </View>
  )
}


CheckRequiredButton.defaultProps = {
  checkedItems: [],
};
export default CheckRequiredButton;