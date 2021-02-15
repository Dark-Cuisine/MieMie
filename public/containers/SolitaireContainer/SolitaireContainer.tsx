import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Textarea, Picker } from '@tarojs/components'
import { AtInput, AtTextarea } from 'taro-ui'
import dayjs from 'dayjs'

import ActionButtons from '../../components/buttons/ActionButtons/ActionButtons'
import MultipleChoiceButtonsBox from '../../components/MultipleChoiceButtonsBox/MultipleChoiceButtonsBox'
import PaymentOptionsSetter from '../../components/PaymentOptionsSetter/PaymentOptionsSetter'

import './SolitaireContainer.scss'


const SolitaireContainer = (props) => {
  const app = getApp()
  const classifications = app.$app.globalData.classifications && app.$app.globalData.classifications
  const currencies = classifications && classifications.currencies

  const initState = {
    solitaire: props.solitaire,

    paymentOptions: props.paymentOptions,

  }
  const [state, setState] = useState(initState);
  const [des, setDes] = useState({ isFocused: false, input: '' });
  useEffect(() => {
    if (!classifications) { return }
    if (!(state.paymentOptions)) {
      let paymentOptions = classifications.defaultPaymentOptionList.map((it, i) => {
        return ({ option: it, account: '' })
      })
      setState({
        ...state,
        paymentOptions: paymentOptions
      });
      // setState({
      //   ...state,
      //   solitaire: {
      //     ...state.solitaire,
      //     info: {
      //       ...state.solitaire.info,
      //       paymentOptions: paymentOptions,
      //     }
      //   }
      // });
    }
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })


  const handelChange = (way, v = null) => {
    switch (way) {
      case 'CURRENCY':
        setState({
          ...state,
          solitaire: {
            ...state.solitaire,
            info: {
              ...state.solitaire.info,
              currency: v,
            }
          }
        });
        break;
      case 'START_DATE':
        setState({
          ...state,
          solitaire: {
            ...state.solitaire,
            info: {
              ...state.solitaire && state.solitaire.info,
              startTime: {
                ...state.solitaire.info && state.solitaire.info.startTime,
                date: v,
                time: state.solitaire && state.solitaire.info &&
                  state.solitaire.info.startTime && state.solitaire.info.startTime.time ?
                  state.solitaire.info.startTime.time : dayjs().format('HH:mm')
              },
            }
          }
        });
        break;
      case 'END_DATE':
        setState({
          ...state,
          solitaire: {
            ...state.solitaire,
            info: {
              ...state.solitaire && state.solitaire.info,
              endTime: {
                ...state.solitaire.info && state.solitaire.info.endTime,
                date: v,
                time: state.solitaire && state.solitaire.info &&
                  state.solitaire.info.endTime && state.solitaire.info.endTime.time ?
                  state.solitaire.info.endTime.time : dayjs().format('HH:mm')
              },
            }
          }
        });
        break;
      case 'START_TIME':
        setState({
          ...state,
          solitaire: {
            ...state.solitaire,
            info: {
              ...state.solitaire && state.solitaire.info,
              startTime: {
                ...state.solitaire.info && state.solitaire.info.startTime,
                time: v,
              },
            }
          }
        });
        break;
      case 'END_TIME':
        setState({
          ...state,
          solitaire: {
            ...state.solitaire,
            info: {
              ...state.solitaire && state.solitaire.info,
              endTime: {
                ...state.solitaire.info && state.solitaire.info.endTime,
                time: v,
              },
            }
          }
        });
        break;
      case '':
        break;
      default:
        break;
    }
  }

  const handleFocus = (focused) => {
    console.log('f');
    setState({
      ...state,
      focusedInput: focused,
    });
  }
  const handleBlur = (way) => {
    state.focusedInput === way ?
      console.log('a') :
      console.log('b');;
  }

  const handleInit = () => {

  }

  let dateAndTime =
    <View className=''>
      <View className='flex'>
        <View className=''>开始时间： </View>
        <Picker
          mode='date'
          onChange={v => handelChange('START_DATE', v.detail.value)}
        >
          <View className='flex'>
            {state.solitaire && state.solitaire.info && state.solitaire.info.startTime &&
              <View className=''>{state.solitaire.info.startTime.date}</View>
            }
            <View className='at-icon at-icon-calendar' />
          </View>
        </Picker>
        {state.solitaire && state.solitaire.info && state.solitaire.info.startTime &&
          state.solitaire.info.startTime.date &&
          <Picker
            mode='time'
            value={state.solitaire.info.startTime.time}
            onChange={v => handelChange('START_TIME', v.detail.value)}
          >
            {state.solitaire.info.startTime.time}
          </Picker>
        }
      </View>
      <View className='flex'>
        <View className=''>截止时间：</View>
        <Picker mode='date' onChange={v => handelChange('END_DATE', v.detail.value)}>
          <View className='flex'>
            {state.solitaire && state.solitaire.info && state.solitaire.info.endTime &&
              <View className=''>{state.solitaire.info.endTime.date}</View>
            }
            <View className='at-icon at-icon-calendar' />
          </View>
        </Picker>
        {state.solitaire && state.solitaire.info && state.solitaire.info.endTime &&
          state.solitaire.info.endTime.date &&
          <Picker
            mode='time'
            value={state.solitaire.info.endTime.time}
            onChange={v => handelChange('START_TIME', v.detail.value)}
          >
            {state.solitaire.info.endTime.time}
          </Picker>
        }
      </View>
    </View>
  let info =
    <View className='info'>
      {dateAndTime}
      <View className=''>接龙描述：</View>
      <textarea
        className={'des '.concat(des.isFocused ? 'editing' : 'not_editing')}
        type='text'
        value={des.input}
        onFocus={() => setDes({ ...des, isFocused: true })}
        onBlur={() => setDes({ ...des, isFocused: false })}
        onInput={e => setDes({ ...des, input: e.detail.value })}
      />
      <View className=''>币种选择：</View>
      {currencies && currencies.map((it, i) => {
        return (
          <View
            className={'mie_button '.concat(
              (state.solitaire.info && state.solitaire.info.currency === it.id) ? 'mie_button_choosen' : ''
            )}
            onClick={() => handelChange('CURRENCY', it.id)}
          >
            {it.name} ({it.unit})
          </View>
        )
      })}
      <View className=''>支付方式：</View>
      <PaymentOptionsSetter
        paymentOptions={state.paymentOptions && state.paymentOptions.map((it, i) => {
          return it.option
        })}
        handleSave={(choosenPaymentOptions) => console.log('save', choosenPaymentOptions)}
      />
      {/* {
        state.paymentOptions &&
        <MultipleChoiceButtonsBox
          // itemList={[]}
          choosenList={[]}
          onChoose={(itemList) => console.log('itemList', itemList)}

          itemList={state.paymentOptions.map((it, i) => {
            return it.option
          })}
        // choosenList={
        //   (state.solitaire.info && state.solitaire.info.paymentOptions) ?
        //     state.solitaire.info.paymentOptions.map((it, i) => {
        //       return (
        //     return it.option
        //     )
        //   }) : []}
        // onChoose={(itemList) => handleClickShopKindsButton(itemList)}
        />
      } */}
      <View className=''>附加信息：</View>

    </View>

  let products = state.solitaire.products &&
    state.solitaire.products.map((it, i) => {
      return (
        <View className='product'>

        </View>
      )
    })
  return (
    <View className='solitaire_container'>
      {info}
    </View>
  )
}
SolitaireContainer.defaultProps = {
  version: 'SELLER'
};
export default SolitaireContainer;