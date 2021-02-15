import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import MultipleChoiceButtonsBox from '../MultipleChoiceButtonsBox/MultipleChoiceButtonsBox'

import './PaymentOptionsSetter.scss'

const MAX_PAYMENT_OPTION_OPTION_LENGTH = 10;


/***
 * <PaymentOptionsSetter
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
    paymentOptions: props.paymentOptions ? props.paymentOptions :
      (userManager.userInfo.paymentOptions ? userManager.userInfo.paymentOptions :
        defaultPaymentOptionList.map((it, i) => {
          return ({ option: it, account: '' })
        })),//[{index:'',option:'',account:''}]

    choosenPaymentOptions: props.choosenPaymentOptions ? props.choosenPaymentOptions : [],//[{index:'',option:'',account:''}]

    ifShowOptionInput: false,
    optionInput: '',

    openedDialog: null,
    ifHideAccounts: false,
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    initIndex()
  }, [])

  useEffect(() => {
    props.handleSave(state.choosenPaymentOptions);//保存
  }, [state.choosenPaymentOptions])

  const initIndex = (paymentOptions = state.paymentOptions) => {
    setState({
      ...state,
      paymentOptions: paymentOptions.map((it, i) => {//加一个index,用来连接choosenPaymentOptions
        return { ...it, index: i }
      })
    });
  }

  const handlePaymentOptionsOption = (way, v = null, i = null) => {
    let updatedPeymentOptions = state.paymentOptions
    let updatedChoosen = [];
    switch (way) {
      case 'CLICK_OPTION'://选择or取消选择option
        updatedChoosen = v.map((it, i) => {
          return state.paymentOptions[it.index]
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
      case 'SUBMIT_ADD_OPTION'://确定添加新付款方式的标签
        let newPaymentOption = { index: state.paymentOptions.length, option: state.optionInput, account: '' };
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
        updatedPeymentOptions.splice(i, 1)
        initIndex(updatedPeymentOptions)
        break;
      case '':
        break;
      default:
        break;
    }
  }
  const handlePaymentOptionsAccount = (way, value = null, i = null) => {
    let updatedPeymentOptions = state.paymentOptions
    let updatedChoosen = state.choosenPaymentOptions;

    let updatedItem = null;
    switch (way) {
      case 'CHANGE_INPUT'://改变payment account的input
        updatedItem = { ...state.choosenPaymentOptions[i], account: value }
        // updated = state.choosenPaymentOptions;
        // updated.splice(i, 1, updatedItem);
        updatedChoosen.splice(i, 1, updatedItem);
        updatedPeymentOptions[state.choosenPaymentOptions[i].index].account = value;
        setState({
          ...state,
          paymentOptions: updatedPeymentOptions,
          choosenPaymentOptions: updatedChoosen,

          optionInput: initState.optionInput,
          ifShowOptionInput: false,
        });
        break;
      case 'SET_SAME_AS_ABOVE'://payment account的input设为同上
        if ((state.choosenPaymentOptions[i - 1].option === '现金') && (i > 1)) {
          updatedItem = { ...state.choosenPaymentOptions[i], account: state.choosenPaymentOptions[i - 2].account }
        } else {
          updatedItem = { ...state.choosenPaymentOptions[i], account: state.choosenPaymentOptions[i - 1].account }
        }
        updatedChoosen.splice(i, 1, updatedItem);
        updatedPeymentOptions.splice(state.choosenPaymentOptions[i].index, 1, updatedItem);
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
        <View className='title flex'> 付款方式：
        <View style={'color:var(--gray-2)'}>(账号只对提交订单用户可见)</View>
        </View>
      </View>
      <MultipleChoiceButtonsBox
        itemList={state.paymentOptions.map((it) => {
          return { index: it.index, name: it.option }
        })}
        choosenList={state.choosenPaymentOptions.map((it) => {
          return { index: it.index, name: it.option }
        })}
        onChoose={(itemList) => handlePaymentOptionsOption('CLICK_OPTION', itemList)}
        isDeletable={true}
        handleDelete={(i) => handlePaymentOptionsOption('DELETE', null, i)}
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
      {(
        state.ifHideAccounts ?
          <View
            className='toggle_accounts_button'
            onClick={() => toggleHideAccounts()}
          >
            <View className=''>展开</View>
            <View className='at-icon at-icon-chevron-down' />
          </View> :
          <View className=''>
            <View
              className='toggle_accounts_button'
              onClick={() => toggleHideAccounts()}
            >
              <View className=''>收起</View>
              <View className='at-icon at-icon-chevron-up' />
            </View>
            {
              state.choosenPaymentOptions.map((it, i) => {
                return (
                  (it.option === '现金') ?
                    <AtInput
                      key={i}
                      editable={false}
                      name={'payment_option_accout_item_input_'.concat(i)}
                      title={it.option}
                    /> :
                    <AtInput
                      key={i}
                      name={'payment_option_accout_item_input_'.concat(i)}
                      title={it.option}//* must warp a element witch isn't <text> around it if you use'{}' here !!!!
                      placeholder={it.option + '账号'}
                      cursor={it.account && it.account.length}
                      value={it.account}
                      onChange={(value) => handlePaymentOptionsAccount('CHANGE_INPUT', value, i)}//* not '(value,i) =>' here!!!!
                    >
                      {
                        ((i > 0) &&
                          !((i === 1) && (state.choosenPaymentOptions[0].option === '现金'))) ?
                          <View
                            className={'set_same_button mie_button'}
                            onClick={() => handlePaymentOptionsAccount('SET_SAME_AS_ABOVE', null, i)}
                          >
                            同上
                     </View> :
                          <View className='set_same_button mie_button set_same_button_transparent'>同上</View>
                      }
                    </AtInput>
                )
              })
            }
          </View>
      )}

    </View >
  return (
    <View className='payment_options_setter'>
      {options}
      {accounts}
    </View>
  )
}
PaymentOptionsSetter.defaultProps = {
  ifShowRequiredMark: false,
};
export default PaymentOptionsSetter;