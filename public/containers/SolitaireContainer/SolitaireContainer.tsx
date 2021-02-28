import React, { Component, useState, useReducer, useEffect, useRef } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Textarea, Picker } from '@tarojs/components'
import { AtInput, AtTextarea, AtAccordion } from 'taro-ui'
import dayjs from 'dayjs'
import * as actions from "../../redux/actions/index";

import ActionDialog from '../../components/dialogs/ActionDialog/ActionDialog'
import ShopProductsContainer from '../../containers/ShopProductsContainer/ShopProductsContainer'
import PickUpWayContainer from '../../containers/PickUpWayContainer/PickUpWayContainer'
import ActionButtons from '../../components/buttons/ActionButtons/ActionButtons'
import MultipleChoiceButtonsBox from '../../components/MultipleChoiceButtonsBox/MultipleChoiceButtonsBox'
import PaymentOptionsSetter from '../../components/PaymentOptionsSetter/PaymentOptionsSetter'

import * as databaseFunctions from '../../utils/functions/databaseFunctions'

import './SolitaireContainer.scss'

/***
 * 
 * <SolitaireContainer
        type={state.type} //'EVENT'活动接龙,'GOODS'商品接龙
        mode={mode} //'BUYER','SELLER'
        solitaire={state.solitaire}
        solitaireShop={state.solitaireShop} //mode==='SELLER'时才需要这个
        paymentOptions={}
      />
 */

const SolitaireContainer = (props) => {
  const dispatch = useDispatch();
  const app = getApp()
  const userManager = useSelector(state => state.userManager);
  const classifications = app.$app.globalData.classifications && app.$app.globalData.classifications
  const currencies = classifications && classifications.currencies
  const pickUpWayContainerRef = useRef();
  const shopProductsContainerRef = useRef();

  const initState = {
    solitaireShop: props.solitaireShop,
    solitaire: props.solitaire,
    // productList: [{
    //   icon: [],
    //   des: "aaaa",
    //   labels: ["All"],
    //   name: "羊头",
    //   price: "22",
    //   unit: '个',
    //   status: 'LAUNCHED',
    //   updatedStock: {
    //     way: '', //'ADD','SUBTRACT'
    //     quantity: ''
    //   },
    // }],
    productList: [],
    deletedProducts: [],


    ifOpenPickUpWayAcc: true,

  }
  const [state, setState] = useState(initState);
  const [openedDialog, setOpenedDialog] = useState(null);//'UPLOAD'
  const [des, setDes] = useState({ isFocused: false });
  const [paymentOptions, setPaymentOptions] = useState(props.paymentOptions);//所有paymentOptions(包括没被选中的)

  useEffect(() => {
    setState({
      ...state,
      solitaire: initState.solitaire,
      solitaireShop: initState.solitaireShop,
    });
    if (!(props.paymentOptions)) {
      if (!classifications) { return }
      setPaymentOptions(classifications.defaultPaymentOptionList);
    } else {
      setPaymentOptions(props.paymentOptions);
    }
  }, [props.solitaire, props.solitaireShop, props.paymentOptions,app.$app.globalData.classifications])

  useEffect(() => {
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const toggleAcc = (way, v = null, i = null) => {
    switch (way) {
      case 'PICK_UP_WAY':
        setState({
          ...state,
          ifOpenPickUpWayAcc: !state.ifOpenPickUpWayAcc,
        });
        break;
      case '':
        break;
      default:
        break;
    }
  }

  const handleChange = (way, v = null) => {
    switch (way) {
      case 'PICK_UP_WAY'://取货方式
        v = pickUpWayContainerRef.current.getValue();
        setState({
          ...state,
          solitaire: {
            ...state.solitaire,
            pickUpWay: {
              ...state.solitaire.pickUpWay,
              ...v,
            }
          },
        });
        break;
      case 'CURRENCY'://币种
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
      case 'DES':
        setState({
          ...state,
          solitaire: {
            ...state.solitaire,
            info: {
              ...state.solitaire.info,
              des: v,
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
      case 'PAYMENT_OPTION':
        setState({
          ...state,
          solitaire: {
            ...state.solitaire,
            info: {
              ...state.solitaire && state.solitaire.info,
              paymentOptions: v,
            }
          }
        });
        break;
      case 'PRODUCTS':
        v = shopProductsContainerRef.current.getValue();
        // console.log('handleChange-PRODUCTS', v);
        setState({
          ...state,
          productList: v.productList,
          deletedProducts: v.deletedProducts,
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
    setState({
      ...state,
      openedDialog: null,
    });
  }

  const toggleDialog = (dialog) => {
    dialog === 'UPLOAD' &&
      handleChange('PRODUCTS')
    setOpenedDialog(dialog)
  }

  const handleSubmit = async (way, v = null, i = null) => {
    switch (way) {
      case 'UPLOAD':
        console.log('UPLOAD-solitaire', state);
        let solitaire = state.solitaire
        let products = state.productList
        let solitaireShopId = userManager.userInfo && userManager.userInfo.mySolitaireShops &&
          userManager.userInfo.mySolitaireShops.length > 0 && userManager.userInfo.mySolitaireShops[0]//因为每个用户只能有一个接龙店，所以这里直接用了[0] *unfinished 要优化
        if (state.mode === 'ADD') {//创建接龙
          if (!(solitaireShopId && solitaireShopId.length > 0)) { //如果当前用户第一次建接龙，则先新建接龙店，再把接龙加到接龙店
            await databaseFunctions.solitaire_functions.addNewSoltaireShop(userManager.unionid, solitaire, products)
          } else { //否则直接把新的接龙添加到该用户的接龙店
            await databaseFunctions.solitaire_functions.addNewSolitaire(userManager.unionid, solitaireShopId, solitaire, products)
          }
        } else {//修改接龙
          await databaseFunctions.solitaire_functions.addNewSolitaire(userManager.unionid, solitaireShopId, solitaire, products)
        }
        dispatch(actions.setUser(userManager.unionid, userManager.openid));//更新用户信息
        setOpenedDialog(null)

        let tabBarList_solitaire = app.$app.globalData.classifications ?
          app.$app.globalData.classifications.tabBar.tabBarList_solitaire : [];
        (tabBarList_solitaire && tabBarList_solitaire.length > 0) &&
          dispatch(actions.changeTabBarTab(tabBarList_solitaire[1]));

        break;
      case '':
        break;
      default:
        break;
    }
  }

  let uploadDialog =
    <ActionDialog
      type={1}
      isOpened={openedDialog === 'UPLOAD'}
      cancelText='取消'
      confirmText='上传'
      onClose={() => handleInit()}
      onCancel={() => handleInit()}
      onSubmit={() => handleSubmit('UPLOAD')}
    >确定上传？（图片较多时上传比较慢，请耐心等待）</ActionDialog>
  console.log('k-paymentOptions', paymentOptions);
  let dateAndTime = state.solitaire &&
    <View className='date_and_time'>
      <View className='flex items-center solitaire_container_item'>
        <View className=''>开始时间:</View>
        <Picker
          mode='date'
          onChange={v => handleChange('START_DATE', v.detail.value)}
        >
          <View className='flex items-center'>
            <View className='at-icon at-icon-calendar' />
            {state.solitaire && state.solitaire.info && state.solitaire.info.startTime &&
              <View className=''>{state.solitaire.info.startTime.date}</View>
            }
          </View>
        </Picker>
        {state.solitaire && state.solitaire.info && state.solitaire.info.startTime &&
          state.solitaire.info.startTime.date &&
          <Picker
            mode='time'
            value={state.solitaire.info.startTime.time}
            onChange={v => handleChange('START_TIME', v.detail.value)}
          >
            <View className='flex items-center'>
              <View className='at-icon at-icon-clock' />
              {state.solitaire.info.startTime.time}
            </View>
          </Picker>
        }
      </View>
      <View className='flex items-center solitaire_container_item'>
        <View className=''>截止时间:</View>
        <Picker mode='date' onChange={v => handleChange('END_DATE', v.detail.value)}>
          <View className='flex items-center'>
            <View className='at-icon at-icon-calendar' />
            {state.solitaire && state.solitaire.info && state.solitaire.info.endTime &&
              <View className=''>{state.solitaire.info.endTime.date}</View>
            }
          </View>
        </Picker>
        {state.solitaire && state.solitaire.info && state.solitaire.info.endTime &&
          state.solitaire.info.endTime.date &&
          <Picker
            mode='time'
            value={state.solitaire.info.endTime.time}
            onChange={v => handleChange('START_TIME', v.detail.value)}
          >
            <View className='flex items-center'>
              <View className='at-icon at-icon-clock' />
              {state.solitaire.info.endTime.time}
            </View>
          </Picker>
        }
      </View>
    </View>
  let info = state.solitaire &&
    <View className='info'>
      {dateAndTime}
      <View className='flex solitaire_container_item'>
        <View className='solitaire_container_item_title'>接龙描述:</View>
        <textarea
          className={'solitaire_des '.concat(des.isFocused ? 'editing' : 'not_editing')}
          type='text'
          maxlength={-1}
          value={(state.solitaire.info && state.solitaire.info.des) ?
            state.solitaire.info.des : ''}
          onFocus={() => setDes({ ...des, isFocused: true })}
          onBlur={() => setDes({ ...des, isFocused: false })}
          onInput={e => handleChange('DES', e.detail.value)}
        />
      </View>
      <View className='flex items-center solitaire_container_item'>
        <View className=''>币种选择：</View>
        {currencies && currencies.map((it, i) => {
          return (
            <View
              className={'mie_button '.concat(
                (state.solitaire.info && state.solitaire.info.currency === it.id) ? 'mie_button_choosen' : ''
              )}
              onClick={() => handleChange('CURRENCY', it.id)}
            >
              {it.name} ({it.unit})
            </View>
          )
        })}
      </View>
      <PaymentOptionsSetter
        className='solitaire_container_item'
        paymentOptions={paymentOptions}
        choosenPaymentOptions={state.solitaire && state.solitaire.info &&
          state.solitaire.info.paymentOptions}
        handleSave={(choosenPaymentOptions) => handleChange('PAYMENT_OPTION', choosenPaymentOptions)}
      />
      <View className='solitaire_container_item'>
        <View className='flex items-center justify-between'>
          <View className=''>{props.type === 'EVENT' ? '集合点' : '取货方式'}</View>
          <View
            className='toggle_button_arrow'
            onClick={toggleAcc.bind(this, 'PICK_UP_WAY')}
          >
            <View className=''>{state.ifOpenPickUpWayAcc ? '展开' : '收起'}</View>
            <View className={'at-icon at-icon-chevron-'.concat(
              state.ifOpenPickUpWayAcc ? 'down' : 'up'
            )} />
          </View>
        </View>
        {state.solitaire && state.solitaire.pickUpWay &&
          <View className='solitaire_pick_up_way'>
            <PickUpWayContainer
              type={props.type}
              ref={pickUpWayContainerRef}
              className={state.ifOpenPickUpWayAcc ? '' : 'hidden_item'}
              mode='SELLER_MODIFYING'
              shop={state.solitaire}
              handleSave={() => handleChange('PICK_UP_WAY')}
            />
          </View>
        }

      </View>
      {/* <View className='solitaire_container_item'> //*unfinished 
        买家信息：（可选是否填写）
        <View className=''>【电话】</View>
        <View className=''>【名字】</View>
      </View> */}
    </View>

  let products = state.solitaire &&
    <View className='solitaire_container_item'>
      <View className=''>接龙商品:</View>
      <ShopProductsContainer
        ref={shopProductsContainerRef}
        mode={'SOLITAIRE_SELLER'}
        shop={props.mode === 'SELLER' ?
          state.solitaireShop : state.solitaire}//如果是seller版则传入shop，否则传入单条接龙
        productList={state.productList}
        labelList={[]}
        handleSave={() => handleChange('PRODUCTS')}
      />
      {state.solitaire.products && state.solitaire.products.map((it, i) => {
        return (
          <View className='product'>
            【商品列表】
          </View>
        )
      })}
    </View>


  return (
    <View className='solitaire_container'>
      {uploadDialog}
      {info}
      {products}
      {
        props.mode === 'SELLER' &&
        <View
          className='final_button'
          onClick={() => toggleDialog('UPLOAD')}
        >发起接龙/确定修改接龙</View>
      }
    </View>
  )
}
SolitaireContainer.defaultProps = {
  mode: 'BUYER',
  type: 'GOODS',
};
export default SolitaireContainer;