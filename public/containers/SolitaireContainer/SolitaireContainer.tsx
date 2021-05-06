import React, { Component, useState, useReducer, useEffect, useRef } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Textarea, Picker } from '@tarojs/components'
import { AtInput, AtTextarea, AtAccordion, AtToast } from 'taro-ui'
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

// import PickUpWayContainer from './PickUpWayContainer/PickUpWayContainer'

import * as tool_functions from '../../utils/functions/tool_functions'
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
        productList={productList}
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
    productList: props.productList ? props.productList : [],
    deletedProducts: [],

    solitaireOrder: props.solitaireOrder,

    ifOpenPickUpWayAcc: true,

    isExpired: false,//是否已截止

  }
  const [state, setState] = useState(initState);
  const [openedDialog, setOpenedDialog] = useState(null);//'UPLOAD'
  const [deletedImgList, setDeletedImgList] = useState([]);//要从云储存删除的图片
  const [des, setDes] = useState({ isFocused: false });
  const [content, setContent] = useState({ isFocused: false });
  const initPaymentOptions = props.paymentOptions
  const [paymentOptions, setPaymentOptions] = useState(initPaymentOptions);//所有paymentOptions(包括没被选中的)

  useEffect(() => {
    doUpdate()
  }, [props.productList, props.solitaire, props.solitaireShop, props.paymentOptions, app.$app.globalData.classifications])

  useEffect(() => {
  }, [])

  usePullDownRefresh(() => {
    doUpdate()
    Taro.stopPullDownRefresh()
  })

  const doUpdate = () => {
    console.log('p-props.solitaire', props.solitaire,
      'props.solitaireOrder', props.solitaireOrder);
    setState({
      ...state,
      solitaire: initState.solitaire,
      solitaireShop: initState.solitaireShop,
      solitaireOrder: initState.solitaireOrder,
      productList: initState.productList,
      isExpired: initState.solitaire.info.endTime.date && initState.solitaire.info.endTime.date.length > 0 &&//这里是为了让一进去不会变成已截止、和永不截止的情况
        !tool_functions.date_functions.compareDateAndTimeWithNow(
          initState.solitaire.info.endTime.date, initState.solitaire.info.endTime.time)
    });
    setPaymentOptions(initPaymentOptions);
  }

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
        console.log('handleChange-PRODUCTS', v);
        setState({
          ...state,
          productList: v.productList,
          deletedProducts: v.deletedProducts,
        });
        setDeletedImgList((v.deletedImgList.productIcons && v.deletedImgList.productIcons.length > 0) ?
          [...deletedImgList, ...v.deletedImgList.productIcons] : [])
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
              place: v_2,
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
    setOpenedDialog(null)
  }

  const toggleDialog = (dialog) => {
    (dialog === 'UPLOAD' || dialog === 'DO_PURCHASE') &&
      handleChange('PRODUCTS')
    setOpenedDialog(dialog)
  }

  const handleSubmit = async (way, v = null, i = null) => {
    setOpenedDialog(null)
    let tabBarList_solitaire = app.$app.globalData.classifications ?
      app.$app.globalData.classifications.tabBar.tabBarList_solitaire : [];
    switch (way) {
      case 'UPLOAD':
        console.log('UPLOAD-solitaire', state);
        dispatch(actions.toggleLoadingSpinner(true));

        //从云储存删除图片
        let deletedUrlList = deletedImgList.map(it => {
          return it.fileID
        })
        deletedUrlList.length > 0 &&
          databaseFunctions.img_functions.deleteImgs(deletedUrlList)

        //向云储存上传还没有fileId的图片
        let fileDir = dayjs().format('YYYY-MM');
        let updatedProductList = []
        // for (let p of state.productList) {
        // for (let p of state.solitaire.products.productList) {
        for (let p of state.productList) {
          let updatedProductIcons = [];
          if (p.icon && p.icon.length > 0) {
            for (let it of p.icon) {
              let updated = it.fileID ? it :
                await databaseFunctions.img_functions.compressAndUploadImg(it, fileDir, 'product_icons')
              if ((updated == null) || (!updated.fileID)) {
                wx.showToast({
                  title: '上传商品图片失败',
                  icon: 'none'
                })
              } else {
                updatedProductIcons.push(updated)
              }
            }
          }
          updatedProductList.push({
            ...p,
            icon: updatedProductIcons
          })
        };

        let solitaire = state.solitaire
        let solitaireShopId = userManager.userInfo && userManager.userInfo.mySolitaireShops &&
          userManager.userInfo.mySolitaireShops.length > 0 && userManager.userInfo.mySolitaireShops[0]//因为每个用户只能有一个接龙店，所以这里直接用了[0] *unfinished 要优化
        if (!(state.solitaire && state.solitaire._id && state.solitaire._id.length > 0)) {//创建接龙
          if (!(solitaireShopId && solitaireShopId.length > 0)) { //如果当前用户第一次建接龙，则先新建接龙店，再把接龙加到接龙店
            await databaseFunctions.solitaire_functions.addNewSoltaireShop(userManager.unionid, solitaire, updatedProductList)
          } else { //否则直接把新的接龙添加到该用户的接龙店
            await databaseFunctions.solitaire_functions.addNewSolitaire(userManager.unionid, solitaireShopId, solitaire, updatedProductList)
          }
        } else {//修改接龙
          await databaseFunctions.solitaire_functions.modifySolitaire(solitaire, updatedProductList, state.deletedProducts)
        }
        paymentOptions &&
          await databaseFunctions.user_functions.updatePaymentOptions(userManager.unionid, paymentOptions);
        dispatch(actions.setUser(userManager.unionid, userManager.openid));//更新用户信息

        dispatch(actions.toggleLoadingSpinner(false));

        (tabBarList_solitaire && tabBarList_solitaire.length > 0) &&
          dispatch(actions.changeTabBarTab(tabBarList_solitaire[0]));

        break;
      case 'DO_PURCHASE':
        // console.log('DO_PURCHASE-solitaire', state);
        // console.log('DO_PURCHASE-solitaire-ordersManager', ordersManager);
        dispatch(actions.toggleLoadingSpinner(true));
        let solitaireOrder = {
          ...state.solitaireOrder,
          authId: userManager.unionid,
          buyerName: userManager.userInfo.nickName,
          solitaireId: state.solitaire._id,
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          status: 'ACCEPTED',
          totalPrice: ordersManager.newOrders &&
            ordersManager.newOrders.length > 0 &&
            ordersManager.newOrders[0].totalPrice,
          productList: (ordersManager.newOrders &&
            ordersManager.newOrders.length > 0) ?
            ordersManager.newOrders[0].productList : [],//*unfinished 要优化
        }

        if (!(state.solitaireOrder && state.solitaireOrder._id && state.solitaireOrder._id.length > 0)) {//创建接龙订单
          await databaseFunctions.solitaireOrder_functions
            .doPurchase(solitaireOrder)
        } else {//修改接龙订单
          await databaseFunctions.solitaireOrder_functions
            .modifySolitaireOrder(solitaireOrder)
        }
        dispatch(actions.toggleLoadingSpinner(false));
        dispatch(actions.setUser(userManager.unionid, userManager.openid));//更新用户信息
        (tabBarList_solitaire && tabBarList_solitaire.length > 0) &&
          dispatch(actions.changeTabBarTab(tabBarList_solitaire[1]));
        break;
      case '':
        break;
      default:
        break;
    }
    handleInit()
  }
  // console.log('d-1', state.solitaireOrder);
  const handleChoose = (way, v) => {
    let productList = state.solitaire.products.productList
    switch (way) {
      case 'CHOOSE':
        productList.push({ id: v._id })
        break;
      case 'UN_CHOOSE':
        productList.splice(
          productList.findIndex(it => {
            return it.id == v._id
          }), 1
        )
        break;
      case '':
        break;
      default:
        break;
    }
    setState({
      ...state,
      solitaire: {
        ...state.solitaire,
        products: {
          ...state.solitaire.products,
          productList: productList,
        }
      },
      // productList: productList,
    });
  }

  const getCurrencyIndex = () => {
    let index = currencies.findIndex((it, i) => {
      return (it.id === state.solitaire.info.currency)
    })
    return ((index > -1) ? index : 0)
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
    <View className='date_and_time solitaire_container_item'>
      <View className='solitaire_container_item_title'>
        {props.type === 'GOODS' ? '接龙时间' : '报名时间'}
        <View className='line_horizontal_bold' />
      </View>
      <View className='date_time_item'>
        <View className='flex items-center '>
          <Picker
            mode='date'
            value={state.solitaire.info.startTime && state.solitaire.info.startTime.date}
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
              value={state.solitaire.info.startTime && state.solitaire.info.startTime.time}
              onChange={v => handleChange('START_TIME', v.detail.value)}
            >
              <View className='flex items-center'>
                <View className='at-icon at-icon-clock' />
                {state.solitaire.info.startTime.time}
              </View>
            </Picker>
          }
        </View>
        <View className='word'>开始</View>
      </View>
      <View className='date_time_item'>
        <View className='flex items-center'>
          <Picker
            mode='date'
            disabled={props.mode === 'BUYER'}
            value={state.solitaire.info.endTime && state.solitaire.info.endTime.date}
            onChange={v => handleChange('END_DATE', v.detail.value)}>
            <View className='flex items-center'>
              <View className='at-icon at-icon-calendar' />
              {(state.solitaire && state.solitaire.info && state.solitaire.info.endTime
                && state.solitaire.info.endTime.date.length > 0) ?
                <View className=''>{state.solitaire.info.endTime.date}</View> :
                <View className=''>永不截止</View>
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
        <View className='word'>截止</View>
      </View>
    </View>

  let eventDateAndTime = props.type === 'EVENT' &&
    state.solitaire &&
    <View className='date_and_time solitaire_container_item'>
      <View className='solitaire_container_item_title'>
        {'活动时间'}
        <View className='line_horizontal_bold' />
      </View>
      <View className='date_time_item'>
        <View className='flex items-center '>
          <Picker
            mode='date'
            value={state.solitaire.eventTime &&
              state.solitaire.eventTime.startTime && state.solitaire.eventTime.startTime.date}
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
        <View className='word'>开始</View>
      </View>
      <View className='date_time_item'>
        <View className='flex items-center'>
          <Picker
            mode='date'
            value={state.solitaire.eventTime &&
              state.solitaire.eventTime.endTime && state.solitaire.eventTime.endTime.date}
            disabled={props.mode === 'BUYER'}
            onChange={v => handleChange('EVENT_END_DATE', v.detail.value)}>
            <View className='flex items-center'>
              <View className='at-icon at-icon-calendar' />
              {(state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.endTime
                && state.solitaire.eventTime.endTime.date.length > 0) ?
                <View className=''>{state.solitaire.eventTime.endTime.date}</View> :
                <View className=''>永不结束</View>
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
        <View className='word'>结束</View>
      </View>
    </View>
  let info = state.solitaire &&
    <View className='info'>
      {dateAndTime}
      {eventDateAndTime}
      <View className='solitaire_container_item des_and_remarks'>
        <View className='solitaire_container_item_title '>
          描述与备注
          <View className='line_horizontal_bold' />
        </View>
        {props.mode === 'BUYER' ?
          <View className='des_and_remarks_buyer'>
            接龙描述：{state.solitaire.info && state.solitaire.info.content}
          </View> :
          <textarea
            className={'solitaire_content '.concat(content.isFocused ? 'editing' : 'not_editing')}
            type='text'
            placeholder={'描述'}
            // disabled={props.mode === 'BUYER'}
            maxlength={-1}
            value={(state.solitaire.info && state.solitaire.info.content) ?
              state.solitaire.info.content : ''}
            onFocus={() => setContent({ ...content, isFocused: true })}
            onBlur={() => setContent({ ...content, isFocused: false })}
            onInput={e => handleChange('CONTENT', e.detail.value)}
          />

        }
        {props.mode === 'BUYER' ?
          (state.solitaire.info && state.solitaire.info.des &&
            state.solitaire.info.des.length > 0 &&
            <View className='des_and_remarks_buyer'>
              备注：{state.solitaire.info.des}
            </View>
          ) : <View className='solitaire_des'>
            <textarea
              className={'solitaire_des  '.concat(des.isFocused ? 'editing' : 'not_editing')}
              type='text'
              placeholder={'备注'}
              disabled={props.mode === 'BUYER'}
              maxlength={-1}
              value={(state.solitaire.info && state.solitaire.info.des) ?
                state.solitaire.info.des : ''}
              onFocus={() => setDes({ ...des, isFocused: true })}
              onBlur={() => setDes({ ...des, isFocused: false })}
              onInput={e => handleChange('DES', e.detail.value)}
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

  let pickUpWay =
    <View className='solitaire_container_item'>
      <View className='solitaire_container_item_title'>
        <View className=''>{props.type === 'EVENT' ? '集合点' : '取货方式'}</View>
        <View className='line_horizontal_bold' />
      </View>
      {state.solitaire && //state.solitaire.pickUpWay &&
        // <View className='solitaire_pick_up_way'>
        <PickUpWayContainer
          styleType={props.type === 'EVENT' ? 2 : 1}
          type={props.type}
          ref={pickUpWayContainerRef}
          className={state.ifOpenPickUpWayAcc ? '' : 'hidden_item'}
          mode={props.mode === 'SELLER' ? 'SELLER_MODIFYING' : props.mode}
          shop={state.solitaire}
          handleSave={() => handleChange('PICK_UP_WAY')}
          handleChoose={props.mode === 'BUYER' &&
            ((way, v) => handleBuyerMode('PICK_UP_WAY', way, v))}
          choosenItem={state.solitaireOrder && state.solitaireOrder.pickUpWay}
        />
        // </View>
      }
    </View>

  let currency =
    <View className='solitaire_container_item'>
      <View className='solitaire_container_item_title'>
        <View className=''>标价币种</View>
        <View className='line_horizontal_bold' />
      </View>
      {currencies &&
        (props.mode === 'SELLER' ?
          currencies.map((it, i) => {
            return (
              <View
                className={'mie_button '.concat(
                  (state.solitaire.info && state.solitaire.info.currency === it.id) ?
                    'mie_button_choosen' : ''
                )}
                onClick={() => handleChange('CURRENCY', it.id)}
              >
                {it.name} ({it.unit})
              </View>
            )
          }) :
          <View className='' style='font-size: 28rpx;'>
            {(state.solitaire.info && state.solitaire.info.currency &&
              currencies[getCurrencyIndex()].name
            )}
          </View>
        )}
    </View>

  let products = //state.solitaire &&  //*注：这里不能加这句否则ShopProductsContainer里就不会根据shopid的改变刷新了！
    <View className='solitaire_container_item'>
      <View className='solitaire_container_item_title'>
        <View className=''>{props.type === 'GOODS' ? '接龙商品' : '报名费'}</View>
        <View className='line_horizontal_bold' />
      </View>
      <ShopProductsContainer
        ref={shopProductsContainerRef}
        type={props.type}
        mode={props.mode === 'SELLER' ? 'SOLITAIRE_SELLER' : 'SOLITAIRE_BUYER'}
        // shop={props.mode === 'SELLER' ?
        //   state.solitaireShop : state.solitaire}//如果是seller版则传入shop，否则传入单条接龙
        shop={state.solitaire}
        productList={state.productList}
        // labelList={[]}
        handleSave={() => handleChange('PRODUCTS')}
        maxProductIconsLength={1}

      // choosenProducts={props.mode === 'SELLER' ?
      //   (state.solitaire.products && state.solitaire.products.productList) : []}
      // handleChoose={(product) => handleChoose('CHOOSE', product)}
      // handleUnChoose={(product) => handleChoose('UN_CHOOSE', product)}
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

  let payments =
    <View className='pay solitaire_container_item'>
      <View className='solitaire_container_item_title'>
        支付方式
        <View className='line_horizontal_bold' />
      </View>
      <PaymentOptionsSetter
        className=''
        mode={props.mode}
        paymentOptions={//卖家模式显示自己保存的所有支付选项，买家模式只显示已被卖家选中的
          props.mode === 'SELLER' ? paymentOptions :
            (state.solitaire && state.solitaire.info && state.solitaire.info.paymentOptions)}
        sellerChoosenPaymentOptions={
          state.solitaire && state.solitaire.info &&
          state.solitaire.info.paymentOptions
        }
        //choosenPaymentOptions: 买家模式选中的solitaireOrder支付选项
        choosenPaymentOption={state.solitaireOrder && state.solitaireOrder &&
          state.solitaireOrder.paymentOption
        }
        handleChoose={props.mode === 'BUYER' ?
          (choosen, des) => handleBuyerMode('PAYMENT_OPTION', choosen, des) : null}
        handleSave={props.mode === 'SELLER' ?
          (all, choosen, des) => handleChange('PAYMENT_OPTION', all, choosen) :
          null
        }
      />
    </View>


  return (
    <View className='solitaire_container'>
      {/* <PickUpWayContainer
        styleType={props.type === 'EVENT' ? 2 : 1}
        type={props.type}
        ref={pickUpWayContainerRef}
        className={state.ifOpenPickUpWayAcc ? '' : 'hidden_item'}
        mode={props.mode === 'SELLER' ? 'SELLER_MODIFYING' : props.mode}
        shop={state.solitaire}
        handleSave={() => handleChange('PICK_UP_WAY')}
        handleChoose={props.mode === 'BUYER' &&
          ((way, v) => handleBuyerMode('PICK_UP_WAY', way, v))}
        choosenItem={state.solitaireOrder && state.solitaireOrder.pickUpWay}
      /> */}
      {loginDialog}
      {doPurchaseDialog}
      {uploadDialog}
      {info}
      {pickUpWay}
      {payments}
      {/* {currency} */}

      {/* {products} */}
      {/* *problem 商品层级太深会显示不出来,所以放出来了 */}
      <View className='solitaire_container_item_title'>
        <View className=''>{props.type === 'GOODS' ? '接龙商品' : '报名费'}</View>
        <View className='line_horizontal_bold' />
      </View>
      <ShopProductsContainer
        ref={shopProductsContainerRef}
        type={props.type}
        mode={props.mode === 'SELLER' ? 'SOLITAIRE_SELLER' : 'SOLITAIRE_BUYER'}
        // shop={props.mode === 'SELLER' ?
        //   state.solitaireShop : state.solitaire}//如果是seller版则传入shop，否则传入单条接龙
        shop={state.solitaire}
        productList={state.productList}
        // labelList={[]}
        handleSave={() => handleChange('PRODUCTS')}
        maxProductIconsLength={1}

      // choosenProducts={props.mode === 'SELLER' ?
      //   (state.solitaire.products && state.solitaire.products.productList) : []}
      // handleChoose={(product) => handleChoose('CHOOSE', product)}
      // handleUnChoose={(product) => handleChoose('UN_CHOOSE', product)}
      />

      {
        props.mode === 'SELLER' &&
        <View
          className='final_button'
          onClick={() => toggleDialog('UPLOAD')}
        >
          {state.solitaire._id ? '确定修改接龙' : '发起接龙'}
        </View>
      }
      {
        props.mode === 'BUYER' &&
        state.solitaireOrder &&
        <View className='total_price'>总价: {(ordersManager.newOrders &&
          ordersManager.newOrders.length > 0) ?
          ordersManager.newOrders[0].totalPrice : 0}</View>
      }
      {
        props.mode === 'BUYER' &&
        <View className={'final_button '.concat(state.isExpired &&
          'final_button_expired')}>
          {
            state.solitaireOrder ?
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
              >修改我参与的接龙</CheckRequiredButton> :
              (state.isExpired ?
                <View className=''>接龙已截止</View> :
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
                >参与接龙</CheckRequiredButton>
              )
          }
        </View>
      }
    </View>
  )
}
SolitaireContainer.defaultProps = {
  mode: 'BUYER',
  type: 'GOODS',
};
export default SolitaireContainer;