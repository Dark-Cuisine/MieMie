import React, { Component, useState, useReducer, useEffect, useRef } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import dayjs from 'dayjs'

import * as actions from '../../../redux/actions'

import * as databaseFunctions from '../../../utils/functions/databaseFunctions'
import * as tool_functions from '../../../utils/functions/tool_functions'


// import ShopProductsContainer from '../../../containers/ShopProductsContainer/ShopProductsContainer'
import ActionDialog from '../../../components/dialogs/ActionDialog/ActionDialog'
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
  const shopProductsContainerRef = useRef();
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
      pickUpWay: {
        selfPickUp: {
          list: [],
          des: ''
        },
        stationPickUp: {
          list: [],
          des: ''
        },
        expressPickUp: {
          isAble: false,
          list: [],
          des: ''
        }
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
    isExpired: false,//是否已截止
  }
  const [state, setState] = useState(initState);
  const [mode, setMode] = useState(router.params.mode ? router.params.mode : props.mode);//'BUYER','SELLER'
  const [productList, setProductList] = useState([]);
  const [openedDialog, setOpenedDialog] = useState(null);

  useEffect(() => {
    setMode(router.params.mode);
    doUpdate()
  }, [userManager.userInfo])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })
  const getSolitaireOrderId = (solitaireId) => {
     if (!(userManager.userInfo && userManager.userInfo.solitaireOrders)) { return }
    let index = userManager.userInfo.solitaireOrders.findIndex(it => {
      return (it.solitaireId == solitaireId)
    })
    return index < 0 ? null :
      userManager.userInfo.solitaireOrders[index].orderId
  }
  const doUpdate = async () => {
    dispatch(actions.toggleLoadingSpinner(true));
    console.log('router', router);

    let solitaire = state.solitaire
    let solitaireShop = state.solitaireShop
    let solitaireOrder = state.solitaireOrder
    let solitaireId = router.params.solitaireId;
    let solitaireOrderId = getSolitaireOrderId(router.params.solitaireId);
    let copySolitaireId = router.params.copySolitaireId;
    if (solitaireId) {
      let res = await wx.cloud.callFunction({
        name: 'get_data',
        data: {
          collection: 'solitaires',

          queryTerm: { _id: solitaireId },
        },
      });
      if ((res && res.result && res.result.data && res.result.data.length > 0)) { solitaire = res.result.data[0] }
    }
    if (copySolitaireId) {//复制接龙
      let res = await wx.cloud.callFunction({
        name: 'get_data',
        data: {
          collection: 'solitaires',

          queryTerm: { _id: copySolitaireId },
        },
      });
      if ((res && res.result && res.result.data && res.result.data.length > 0)) {
        Object.assign(solitaire, res.result.data[0])//*深拷贝，否则改newCopy时res.result.data[0]也会改变
        delete solitaire._id
        delete solitaire.createTime
        delete solitaire.updateTime

        let copyProductsIds = solitaire.products.productList &&
          solitaire.products.productList.slice()
        if (copyProductsIds && copyProductsIds.length > 0) {
          let res_2 = await wx.cloud.callFunction({
            name: 'get_data',
            data: {
              collection: 'products',

              operatedItem: '_ID',
              queriedList: copyProductsIds.map(it => { return it.id }),
            },
          });
          if ((res_2 && res_2.result && res_2.result.data && res_2.result.data.length > 0)) {
            let copyProducts = res_2.result.data.slice(0)
            copyProducts.forEach(p => {
              delete p._id
              delete p.createTime
              delete p.updateTime
            })
            setProductList(copyProducts)
          }
        }
      }
    }

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

    if (mode === 'BUYER' && solitaireOrderId) {
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
      //初始化为订单数量
      dispatch(actions.setSolitaireOrders(solitaireOrder));
    }else{
      dispatch(actions.initOrders());
    }

    // console.log('c-0', solitaire);
    //  console.log('solitaireShop', solitaireShop);
    setState({
      ...state,
      solitaire: solitaire,
      solitaireShop: solitaireShop,
      solitaireOrder: solitaireOrder,

      isExpired: solitaire.info.endTime.date &&
        solitaire.info.endTime.date.length > 0 && !tool_functions.date_functions.compareDateAndTimeWithNow(
          solitaire.info.endTime.date, solitaire.info.endTime.time)
      ,
    });
    dispatch(actions.toggleLoadingSpinner(false));
  }

  const handleSubmit = async (way, v = null, i = null) => {
    switch (way) {
      case 'CUT_OFF':
        dispatch(actions.toggleLoadingSpinner(true));

        let newSolitaire = {
          ...state.solitaire,
          info: {
            ...state.solitaire.info,
            endTime: {
              ...state.solitaire.info.endTime,
              date: dayjs().format('YYYY-MM-DD'),
              time: dayjs().format('HH:mm'),
            }
          }
        }
        await databaseFunctions.solitaire_functions.modifySolitaire(newSolitaire, null, null)

        dispatch(actions.toggleLoadingSpinner(false));

        break;
      case '':
        break;
      default:
        break;
    }
    setOpenedDialog(null)
    doUpdate()
  }

  console.log('p-2', state.solitaireOrder);
  let dialogWord = (openedDialog === 'CUT_OFF') ? '截单' : '';
  let dialogs =
    <ActionDialog
      type={1}
      isOpened={!(openedDialog === null)}
      cancelText='取消'
      confirmText={dialogWord}
      onClose={() => setOpenedDialog(null)}
      onCancel={() => setOpenedDialog(null)}
      onSubmit={() => handleSubmit(openedDialog)}
      textCenter={true}
    >确定{dialogWord}？</ActionDialog>

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

      ifShowShareMenu={mode === 'BUYER'}
    // siwtchTabUrl={}
    >
      {dialogs}
      {
        state.solitaireShop &&
        (state.solitaireShop.authId === userManager.unionid) &&//同作者才能修改 *unfinished 以后加上能添加管理员 
        <View
          className='edit_button'
          onClick={() => {
            setMode(mode === 'BUYER' ? 'SELLER' : 'BUYER')
            mode === 'SELLER' &&
              doUpdate()//取消修改
          }}
        >
          {mode === 'BUYER' &&
            <View
              className='at-icon at-icon-edit'
            />
          }
          <View
            className=''
          >{mode === 'BUYER' ? '修改接龙' : '取消修改'}</View>
        </View>
      }
      {
        state.solitaireShop.authId === userManager.unionid && !state.isExpired &&
        <View className='cut_off_button'>
          <View
            className='mie_button '
            onClick={() => setOpenedDialog('CUT_OFF')}
          >截单</View>
        </View>
      }

      <SolitaireContainer
        type={state.solitaire && state.solitaire.info && state.solitaire.info.type}
        solitaireOrder={state.solitaireOrder}
        mode={mode}
        solitaireShop={state.solitaireShop}
        solitaire={state.solitaire}
        paymentOptions={userManager.userInfo && userManager.userInfo.paymentOptions}
        productList={productList}
      // handleUpload={(solitaire, products) => handleUpload(solitaire, products)}
      />

      {/* *problem 商品层级太深会显示不出来,所以放出来了 */}
      {/* <View className='solitaire_container_item_title'>
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
      /> */}

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