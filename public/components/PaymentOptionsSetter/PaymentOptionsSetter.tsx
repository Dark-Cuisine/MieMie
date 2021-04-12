import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import MultipleChoiceButtonsBox from '../MultipleChoiceButtonsBox/MultipleChoiceButtonsBox'

import * as tool_functions from '../../utils/functions/tool_functions/math_functions'

import './PaymentOptionsSetter.scss'

const MAX_PAYMENT_OPTION_OPTION_LENGTH = 10;


/***
 * <PaymentOptionsSetter
         mode= 'BUYER',
        ifShowRequiredMark={true}
        paymentOptions={paymentOptions}
        handleSave={(items) => handleChange('PAYMENT_OPTIONS', items)}
      />
 */
const PaymentOptionsSetter = (props) => {
  const app = getApp()
  const classifications = app.$app.globalData.classifications && app.$app.globalData.classifications
  const defaultPaymentOptionList = classifications ? classifications.defaultPaymentOptionList : []

  const userManager = useSelector(state => state.userManager);

  const initState = {
    paymentOptions:
      (props.paymentOptions && props.paymentOptions.length > 0) ?
        props.paymentOptions :
        ((userManager.userInfo.paymentOptions && userManager.userInfo.paymentOptions.length > 0) ?
          userManager.userInfo.paymentOptions :
          defaultPaymentOptionList),//[{id:'',option:'',account:''}]

    choosenPaymentOptions: props.choosenPaymentOptions ? props.choosenPaymentOptions : [],//[{index:'',option:'',account:''}]
    des: '',

    ifShowOptionInput: false,
    optionInput: '',

    openedDialog: null,
    ifHideAccounts: false,
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    setState({
      ...state,
      paymentOptions: initState.paymentOptions
    });
  }, [props.paymentOptions, app.$app.globalData.classifications])

  useEffect(() => {
    // console.log('state.choosenPaymentOptions',state.choosenPaymentOptions);
    props.handleSave(state.paymentOptions, state.choosenPaymentOptions, state.des);//保存
  }, [state.choosenPaymentOptions, state.des])


  const handlePaymentOptionsOption = (way, v = null, i = null) => {
    let updatedPeymentOptions = state.paymentOptions
    let updatedChoosen = [];
    switch (way) {
      case 'CLICK_OPTION'://选择or取消选择option
        updatedChoosen = v.map((it, i) => {
          let index = state.paymentOptions.findIndex(item => {
            return it.id === item.id
          })
          return state.paymentOptions[index]
        })
        setState({
          ...state,
          // paymentOptions: updatedPeymentOptions,
          choosenPaymentOptions: updatedChoosen,

          optionInput: initState.optionInput,
          ifShowOptionInput: false,
        });
        break;
      case 'SHOW_ADD_OPTION'://显示添加新payment option的input
        setState({
          ...state,
          ifShowOptionInput: true
        });
        break;
      case 'CHANGE_OPTION_INPUT'://修改新payment option的input
        setState({
          ...state,
          optionInput: (v && v.length > MAX_PAYMENT_OPTION_OPTION_LENGTH) ?
            v.slice(0, MAX_PAYMENT_OPTION_OPTION_LENGTH) : v,
        });
        break;
      case 'SUBMIT_ADD_OPTION'://确定添加新支付方式的标签
        let newPaymentOption = { id: tool_functions.getRandomId(), option: state.optionInput, account: '' };
        setState({
          ...state,
          choosenPaymentOptions: [...state.choosenPaymentOptions, newPaymentOption],
          paymentOptions: [...state.paymentOptions, newPaymentOption],

          ifShowOptionInput: false,
          optionInput: initState.optionInput
        });
        break;
      case 'CANCEL_ADD_OPTION'://取消添加新payment option
        setState({
          ...state,
          ifShowOptionInput: false,
          optionInput: initState.optionInput,
        });
        break;
      case 'DELETE':
        updatedChoosen = state.choosenPaymentOptions;
        let index = state.paymentOptions.findIndex((it, index) => {
          return it.id == v
        })
        if (index > -1) {
          updatedChoosen.splice(index, 1)
        }
        updatedPeymentOptions.splice(i, 1)
        setState({
          ...state,
          choosenPaymentOptions: updatedChoosen,
          paymentOptions: updatedPeymentOptions,
        });
        break;
      case '':
        break;
      default:
        break;
    }
  }
  const handlePaymentOptionsAccount = (way, value = null, id = null) => {
    let updatedPeymentOptions = state.paymentOptions
    let updatedChoosen = state.choosenPaymentOptions;

    let updatedItem = null;
    let index = state.paymentOptions.findIndex(it => {
      return id == it.id
    })
    let index_2 = state.choosenPaymentOptions.findIndex(it => {
      return id == it.id
    })
    switch (way) {
      case 'CHANGE_INPUT'://改变payment account的input
        updatedItem = { ...state.paymentOptions[index], account: value }

        updatedChoosen.splice(index_2, 1, updatedItem);
        updatedPeymentOptions[index].account = value;
        setState({
          ...state,
          paymentOptions: updatedPeymentOptions,
          choosenPaymentOptions: updatedChoosen,

          optionInput: initState.optionInput,
          ifShowOptionInput: false,
        });
        break;
      case 'SET_SAME_AS_ABOVE'://payment account的input设为同上
        if ((state.choosenPaymentOptions[index_2].option === '现金') && (index_2 > 1)) {
          updatedItem = {
            ...state.choosenPaymentOptions[index_2],
            account: state.choosenPaymentOptions[index_2 - 2].account
          }
        } else {
          updatedItem = {
            ...state.choosenPaymentOptions[index_2],
            account: state.choosenPaymentOptions[index_2 - 1].account
          }
        }
        updatedPeymentOptions.splice(index, 1, updatedItem);
        updatedChoosen.splice(index_2, 1, updatedItem);
        setState({
          ...state,
          paymentOptions: updatedPeymentOptions,
          choosenPaymentOptions: updatedChoosen,

          optionInput: initState.optionInput,
          ifShowOptionInput: false,
        });
        break;
      case '':

        break;
      default:
        break;
    }
  }

  const handleBuyerMode = (way, v = null) => {
    switch (way) {
      case 'CHOOSE':
        setState({
          ...state,
          choosenPaymentOptions: [v]
        });
        break;
      case 'DES':
        setState({
          ...state,
          des: v,
        });
        break;
      case '':
        break;
      default:
        break;
    }
  }

  const toggleHideAccounts = () => {
    setState({
      ...state,
      ifHideAccounts: !state.ifHideAccounts,
    });
  }


  let options =
    <View className=''>
      <View className='flex'>
        {props.ifShowRequiredMark && <View className='required_mark'>*</View>}
        <View className='title'>支付方式：</View>
      </View>
      <MultipleChoiceButtonsBox
        itemList={state.paymentOptions.map((it) => {
          return { id: it.id, name: it.option }
        })}
        choosenList={state.choosenPaymentOptions &&
          state.choosenPaymentOptions.map((it) => {
            return { id: it.id, name: it.option }
          })}
        onChoose={(itemList) => handlePaymentOptionsOption('CLICK_OPTION', itemList)}
        isDeletable={true}
        handleDelete={(id) => handlePaymentOptionsOption('DELETE', id)}
      >
        {state.ifShowOptionInput ||//*注:这里不能用?:函数
          <View
            className='at-icon at-icon-add-circle '
            onClick={() => handlePaymentOptionsOption('SHOW_ADD_OPTION')}
          />
        }
        {state.ifShowOptionInput &&
          <View className='add_payment_option '>
            <AtInput
              name='add_payment_option_input'
              value={state.optionInput}
              cursor={state.optionInput && state.optionInput.length}
              onChange={(value) => handlePaymentOptionsOption('CHANGE_OPTION_INPUT', value)}
            />
            <View
              className='at-icon at-icon-close action_button'
              onClick={() => handlePaymentOptionsOption('CANCEL_ADD_OPTION')}
            />
            <View
              className='at-icon at-icon-check action_button'
              onClick={() => handlePaymentOptionsOption('SUBMIT_ADD_OPTION')}
            />
          </View>
        }
      </MultipleChoiceButtonsBox>
    </View>
  let accounts =
    state.choosenPaymentOptions &&
    state.choosenPaymentOptions.length > 0 &&
    <View className='accounts'>
      <View className=''>
        <View style={'color:var(--gray-2)'}>(账号只对提交订单用户可见)</View>
        <View
          className='toggle_button_arrow'
          onClick={() => toggleHideAccounts()}
        >
          <View className=''>{state.ifHideAccounts ? '收起' : '展开'}</View>
          <View className={'at-icon at-icon-chevron-'.concat(state.ifHideAccounts ? 'up' : 'down')} />
        </View>
      </View>

      {state.ifHideAccounts ||
        state.choosenPaymentOptions.map((it, i) => {
          // console.log('it.option', it.option);
          return (
            // (it.option === '现金') ?
            //   <AtInput
            //     key={i}
            //     editable={false}
            //     name={'payment_option_accout_item_input_'.concat(i)}
            //     title={it.option}
            //   /> :
            <AtInput
              key={i}
              name={'payment_option_accout_item_input_'.concat(i)}
              title={it.option}//* must warp a element witch isn't <text> around it if you use'{}' here !!!!
              placeholder={(it.option === '现金') ? '' : '账号'}
              editable={!((it.option === '现金'))}
              cursor={it.account && it.account.length}
              value={it.account}
              onChange={(value) => handlePaymentOptionsAccount('CHANGE_INPUT', value, it.id)}//* not '(value,i) =>' here!!!!
            >
              {
                ((i > 0) &&
                  !((i === 1) && (state.choosenPaymentOptions[0].option === '现金'))
                  && !(it.option === '现金')) ?
                  <View
                    className={'set_same_button mie_button'}
                    onClick={() => handlePaymentOptionsAccount('SET_SAME_AS_ABOVE', null, it.id)}
                  >
                    同上
                  </View> :
                  <View className='set_same_button mie_button set_same_button_transparent'>同上</View>
              }
            </AtInput>
          )
        })
      }

    </View >

  let options_and_accounts =
    <View className=' '>
      {state.paymentOptions && state.paymentOptions.map((it, i) => {
        return (
          <View className='flex items-center'>
            <View
              className={'item '.concat((it.option == state.choosenPaymentOptions.option) ?
                'mie_button mie_button_choosen' : 'mie_button')}
              onClick={() => handleBuyerMode('CHOOSE', it)}
            >
              {it.option}
            </View>
            {state.paymentOption && (it.option == state.paymentOption.option) &&
              (
                <View className=''>
                  (卖家账户：{it.account})
                </View>
              )}
          </View>
        )
      })}
      {
        state.choosenPaymentOptions.option && state.choosenPaymentOptions.length > 0 &&
        <AtInput
          name='payment_des'
          title='付款人信息'
          placeholder='付款账户名咩咩'
          cursor={state.des && state.des.length}
          value={state.des}
          onChange={(v) => handleBuyerMode('DES', v)}
        />
      }
    </View>

  return (
    <View className={'payment_options_setter '.concat(props.className)}>
      {props.mode === 'SELLER' && options}
      {props.mode === 'SELLER' && accounts}
      {props.mode === 'BUYER' && options_and_accounts}
    </View>
  )
}
PaymentOptionsSetter.defaultProps = {
  mode: 'BUYER',
  ifShowRequiredMark: false,
};
export default PaymentOptionsSetter;