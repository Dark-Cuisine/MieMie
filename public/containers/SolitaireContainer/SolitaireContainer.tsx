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
import CheckRequiredButton from '../../components/buttons/CheckRequiredButton/CheckRequiredButton'
import LoginDialog from '../../components/dialogs/LoginDialog/LoginDialog'

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
  const ordersManager = useSelector(state => state.ordersManager)
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

    solitaireOrder: {},

    ifOpenPickUpWayAcc: true,

  }
  const [state, setState] = useState(initState);
  const [openedDialog, setOpenedDialog] = useState(null);//'UPLOAD'
  const [des, setDes] = useState({ isFocused: false });
  const [content, setContent] = useState({ isFocused: false });
  const initPaymentOptions = props.paymentOptions
  const [paymentOptions, setPaymentOptions] = useState(initPaymentOptions);//所有paymentOptions(包括没被选中的)

  useEffect(() => {

    setState({
      ...state,
      solitaire: initState.solitaire,
      solitaireShop: initState.solitaireShop,
    });
    setPaymentOptions(initPaymentOptions);
  }, [props.solitaire, props.solitaireShop, props.paymentOptions, app.$app.globalData.classifications])

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

  const handleChange = (way, v = null, v_2 = null) => {
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
      case 'CONTENT':
        setState({
          ...state,
          solitaire: {
            ...state.solitaire,
            info: {
              ...state.solitaire.info,
              content: v,
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

      case 'START_DATE'://date and time
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

      case 'EVENT_START_DATE'://event date and time
        setState({
          ...state,
          solitaire: {
            ...state.solitaire,
            eventTime: {
              ...state.solitaire && state.solitaire.eventTime,
              startTime: {
                ...state.solitaire.eventTime && state.solitaire.eventTime.startTime,
                date: v,
                time: state.solitaire && state.solitaire.eventTime &&
                  state.solitaire.eventTime.startTime && state.solitaire.eventTime.startTime.time ?
                  state.solitaire.eventTime.startTime.time : dayjs().format('HH:mm')
              },
            }
          }
        });
        break;
      case 'EVENT_END_DATE':
        setState({
          ...state,
          solitaire: {
            ...state.solitaire,
            eventTime: {
              ...state.solitaire && state.solitaire.eventTime,
              endTime: {
                ...state.solitaire.eventTime && state.solitaire.eventTime.endTime,
                date: v,
                time: state.solitaire && state.solitaire.eventTime &&
                  state.solitaire.eventTime.endTime && state.solitaire.eventTime.endTime.time ?
                  state.solitaire.eventTime.endTime.time : dayjs().format('HH:mm')
              },
            }
          }
        });
        break;
      case 'EVENT_START_TIME':
        setState({
          ...state,
          solitaire: {
            ...state.solitaire,
            eventTime: {
              ...state.solitaire && state.solitaire.eventTime,
              startTime: {
                ...state.solitaire.info && state.solitaire.eventTime.startTime,
                time: v,
              },
            }
          }
        });
        break;
      case 'EVENT_END_TIME':
        setState({
          ...state,
          solitaire: {
            ...state.solitaire,
            eventTime: {
              ...state.solitaire && state.solitaire.eventTime,
              endTime: {
                ...state.solitaire.eventTime && state.solitaire.eventTime.endTime,
                time: v,
              },
            }
          }
        });
        break;


      case 'PAYMENT_OPTION'://
        let allPaymentOptions = v
        let choosenPaymentOptions = v_2
        setPaymentOptions(allPaymentOptions)
        setState({
          ...state,
          solitaire: {
            ...state.solitaire,
            info: {
              ...state.solitaire && state.solitaire.info,
              paymentOptions: choosenPaymentOptions,
            }
          },
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

  const handleBuyerMode = (way, v_1 = null, v_2 = null) => {
    switch (way) {
      case 'PAYMENT_OPTION':
        setState({
          ...state,
          solitaireOrder: {
            ...state.solitaireOrder,
            paymentOption: {
              ...v_1,
              des: v_2,
            }
          }
        });
        break;
      case 'PICK_UP_WAY':
        setState({
          ...state,
          solitaireOrder: {
            ...state.solitaireOrder,
            pickUpWay: {
              ...state.pickUpWay,
              way: v_1,
              ...v_2,
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

  const handleInit = () => {
    setState({
      ...state,
      openedDialog: null,
    });
  }

  const toggleDialog = (dialog) => {
    (dialog === 'UPLOAD' || dialog === 'DO_PURCHASE') &&
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
        if (!(state.solitaire && state.solitaire._id && state.solitaire._id.length > 0)) {//创建接龙
          if (!(solitaireShopId && solitaireShopId.length > 0)) { //如果当前用户第一次建接龙，则先新建接龙店，再把接龙加到接龙店
            await databaseFunctions.solitaire_functions.addNewSoltaireShop(userManager.unionid, solitaire, products)
          } else { //否则直接把新的接龙添加到该用户的接龙店
            await databaseFunctions.solitaire_functions.addNewSolitaire(userManager.unionid, solitaireShopId, solitaire, products)
          }
        } else {//修改接龙
          //await databaseFunctions.solitaire_functions.addNewSolitaire(userManager.unionid, solitaireShopId, solitaire, products)
        }
        paymentOptions &&
          await databaseFunctions.user_functions.updatePaymentOptions(userManager.unionid, paymentOptions)

        dispatch(actions.setUser(userManager.unionid, userManager.openid));//更新用户信息
        setOpenedDialog(null)

        let tabBarList_solitaire = app.$app.globalData.classifications ?
          app.$app.globalData.classifications.tabBar.tabBarList_solitaire : [];
        (tabBarList_solitaire && tabBarList_solitaire.length > 0) &&
          dispatch(actions.changeTabBarTab(tabBarList_solitaire[1]));

        break;
      case 'DO_PURCHASE':
        console.log('DO_PURCHASE-solitaire', state);
        console.log('DO_PURCHASE-solitaire-ordersManager', ordersManager);
        let solitaireOrder = {
          ...state.solitaireOrder,
          authId: userManager.unionid,
          buyerName: userManager.userInfo.nickName,
          solitaireId: state.solitaire._id,
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          status: 'ACCEPTED',
          productList: ordersManager.newOrders[0].productList,//*unfinished 要优化
        }

        if (!(state.solitaireOrder && state.solitaireOrder._id && state.solitaireOrder._id.length > 0)) {//创建接龙订单
          await databaseFunctions.solitaireOrder_functions
            .doPurchase(solitaireOrder)
        } else {//修改接龙订单
          //await databaseFunctions.solitaire_functions.addNewSolitaire(userManager.unionid, solitaireShopId, solitaire, products)
        }

        break;
      case '':
        break;
      default:
        break;
    }
    handleInit()
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
    >
      确定上传？（图片较多时上传比较慢，请耐心等待）
    </ActionDialog>



  let dateAndTime = state.solitaire &&
    <View className='date_and_time'>
      <View className='flex items-center solitaire_container_item'>
        <View className=''>{props.type === 'GOODS' ? '接龙开始时间' : '报名开始时间'}</View>
        <Picker
          mode='date'
          disabled={props.mode === 'BUYER'}
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
            disabled={props.mode === 'BUYER'}
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
        <View className=''>{props.type === 'GOODS' ? '接龙截止时间' : '报名截止时间'}</View>
        <Picker
          mode='date'
          disabled={props.mode === 'BUYER'}
          onChange={v => handleChange('END_DATE', v.detail.value)}>
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
            disabled={props.mode === 'BUYER'}
            value={state.solitaire.info.endTime.time}
            onChange={v => handleChange('END_TIME', v.detail.value)}
          >
            <View className='flex items-center'>
              <View className='at-icon at-icon-clock' />
              {state.solitaire.info.endTime.time}
            </View>
          </Picker>
        }
      </View>
    </View>

  let eventDateAndTime = props.type === 'EVENT' &&
    state.solitaire &&
    <View className='date_and_time'>
      <View className='flex items-center solitaire_container_item'>
        <View className=''>{'活动开始时间'}</View>
        <Picker
          mode='date'
          disabled={props.mode === 'BUYER'}
          onChange={v => handleChange('EVENT_START_DATE', v.detail.value)}
        >
          <View className='flex items-center'>
            <View className='at-icon at-icon-calendar' />
            {state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.startTime &&
              <View className=''>{state.solitaire.eventTime.startTime.date}</View>
            }
          </View>
        </Picker>
        {state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.startTime &&
          state.solitaire.eventTime.startTime.date &&
          <Picker
            mode='time'
            disabled={props.mode === 'BUYER'}
            value={state.solitaire.eventTime.startTime.time}
            onChange={v => handleChange('EVENT_START_TIME', v.detail.value)}
          >
            <View className='flex items-center'>
              <View className='at-icon at-icon-clock' />
              {state.solitaire.eventTime.startTime.time}
            </View>
          </Picker>
        }
      </View>
      <View className='flex items-center solitaire_container_item'>
        <View className=''>{'活动结束时间'}</View>
        <Picker
          mode='date'
          disabled={props.mode === 'BUYER'}
          onChange={v => handleChange('EVENT_END_DATE', v.detail.value)}>
          <View className='flex items-center'>
            <View className='at-icon at-icon-calendar' />
            {state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.endTime &&
              <View className=''>{state.solitaire.eventTime.endTime.date}</View>
            }
          </View>
        </Picker>
        {state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.endTime &&
          state.solitaire.eventTime.endTime.date &&
          <Picker
            mode='time'
            disabled={props.mode === 'BUYER'}
            value={state.solitaire.eventTime.endTime.time}
            onChange={v => handleChange('EVENT_END_TIME', v.detail.value)}
          >
            <View className='flex items-center'>
              <View className='at-icon at-icon-clock' />
              {state.solitaire.eventTime.endTime.time}
            </View>
          </Picker>
        }
      </View>
    </View>
  let info = state.solitaire &&
    <View className='info'>
      {dateAndTime}
      {eventDateAndTime}
      <View className='flex solitaire_container_item'>
        <View className='solitaire_container_item_title'>接龙描述:</View>
        <textarea
          className={'solitaire_content '.concat(content.isFocused ? 'editing' : 'not_editing')}
          type='text'
          disabled={props.mode === 'BUYER'}
          maxlength={-1}
          value={(state.solitaire.info && state.solitaire.info.content) ?
            state.solitaire.info.content : ''}
          onFocus={() => setContent({ ...content, isFocused: true })}
          onBlur={() => setContent({ ...content, isFocused: false })}
          onInput={e => handleChange('CONTENT', e.detail.value)}
        />
      </View>
      <View className='solitaire_container_item_title'>备注:</View>
      <textarea
        className={'solitaire_des '.concat(des.isFocused ? 'editing' : 'not_editing')}
        type='text'
        disabled={props.mode === 'BUYER'}
        maxlength={-1}
        value={(state.solitaire.info && state.solitaire.info.des) ?
          state.solitaire.info.des : ''}
        onFocus={() => setDes({ ...des, isFocused: true })}
        onBlur={() => setDes({ ...des, isFocused: false })}
        onInput={e => handleChange('DES', e.detail.value)}
      />
      {props.mode === 'SELLER' &&
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
      }
      <PaymentOptionsSetter
        className='solitaire_container_item'
        mode={props.mode}
        paymentOptions={
          props.mode === 'SELLER' ? paymentOptions ://卖家模式显示所有支付选项，买家模式只显示已选中的
            (state.solitaire && state.solitaire.info && state.solitaire.info.paymentOptions)}
        choosenPaymentOptions={state.solitaire && state.solitaire.info &&
          state.solitaire.info.paymentOptions}
        handleSave={props.mode === 'SELLER' ? (all, choosen, des) => handleChange('PAYMENT_OPTION', all, choosen) :
          (all, choosen, des) => handleBuyerMode('PAYMENT_OPTION', choosen, des)
        }
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
              mode={props.mode === 'SELLER' ? 'SELLER_MODIFYING' : props.mode}
              shop={state.solitaire}
              handleSave={() => handleChange('PICK_UP_WAY')}
              handleChoose={props.mode === 'BUYER' &&
                ((way, v) => handleBuyerMode('PICK_UP_WAY', way, v))}
              choosenItem={state.solitaireOrder.pickUpWay}
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

  let products = //state.solitaire &&  //*注：这里不能加这句否则ShopProductsContainer里就不会根据shopid的改变刷新了！
    <View className='solitaire_container_item'>
      <View className=''>
        {props.type === 'GOODS' ? '接龙商品:' : '报名选项'}
      </View>
      <ShopProductsContainer
        ref={shopProductsContainerRef}
        type={props.type}
        mode={props.mode === 'SELLER' ? 'SOLITAIRE_SELLER' : 'SOLITAIRE_BUYER'}
        shop={props.mode === 'SELLER' ?
          state.solitaireShop : state.solitaire}//如果是seller版则传入shop，否则传入单条接龙
        // productList={state.productList}
        // labelList={[]}
        handleSave={() => handleChange('PRODUCTS')}
      />
    </View>

  let loginDialog =//*problem 这里没错但是ts会报错
    <LoginDialog
      words='请先登录'
      version={'BUYER'}
      isOpened={state.openedDialog === 'LOGIN'}
      onClose={() => toggleDialog(null)}
      onCancel={() => toggleDialog(null)}
    />;
  let doPurchaseDialog =
    <ActionDialog
      type={1}
      isOpened={openedDialog === 'DO_PURCHASE'}
      cancelText='取消'
      confirmText='提交'
      onClose={() => handleInit()}
      onCancel={() => handleInit()}
      onSubmit={() => handleSubmit('DO_PURCHASE')}
    >
      确定提交接龙？
    </ActionDialog>;

  return (
    <View className='solitaire_container'>
      {loginDialog}
      {doPurchaseDialog}
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
      {
        props.mode === 'BUYER' &&
        <CheckRequiredButton
          className='final_button'
          checkedItems={[{
            check: true,
            toastText: '请选择报名项目！'
          },
          ]}
          doAction={(userManager.unionid && userManager.unionid.length > 0) ?//如果没登录就打开登录窗，否则继续提交订单
            () => toggleDialog('DO_PURCHASE') : () => toggleDialog('LOGIN')
          }
        >参与接龙/修改我参与的接龙</CheckRequiredButton>

      }
    </View>
  )
}
SolitaireContainer.defaultProps = {
  mode: 'BUYER',
  type: 'GOODS',
};
export default SolitaireContainer;