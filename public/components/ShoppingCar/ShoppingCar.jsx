import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtInput, AtDrawer } from 'taro-ui'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import ShopProductCard from '../../components/cards/ShopProductCard/ShopProductCard'
import shoppingCarPNG from '../../resource/illustration/shoppingCar.png'
import ProductQuantityController from '../ProductQuantityController/ProductQuantityController'

import './ShoppingCar.scss'

/**
 * 购物车
 */
const ShoppingCar = (props) => {
  const dispatch = useDispatch();
  const ordersManager = useSelector(state => state.ordersManager);
  const userManager = useSelector(state => state.userManager);
  const layoutManager = useSelector(state => state.layoutManager);

  const initState = {
    ifOpenShoppingCar: false,
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [layoutManager])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const toggleShoppingCar = (ifOpen = !state.ifOpenShoppingCar) => {
    setState({
      ...state,
      ifOpenShoppingCar: ifOpen,
    });
  }

  const handleClickShopName = (shopId) => {//点击店名跳到该店铺
    dispatch(actions.setCurrentShopId(shopId));
    Taro.navigateTo({
      url: '/pages/PublicPages/InsideShopPage/InsideShopPage',
    });
  }

  const handlePurchaseButton = (shopId) => {//提交订单
    Taro.navigateTo({  //*注意是`不是‘ ！！！！
      url: `/pages/BuyerPages/PurchasePage/PurchasePage?shopId=${shopId}`//***别忘了url中最前面那个 / 啊啊啊啊啊
    });
  }
  // const handlePurchaseAllButton =()=>{
  //   Taro.navigateTo({
  //     url: `/pages/BuyerPages/PurchasePage/PurchasePage`
  //   });
  // }
  let orderList = (
    <View className='order_list'>
      {ordersManager.newOrders && ordersManager.newOrders.length > 0 ?
        ordersManager.newOrders.map((it, i) => {
          return (
            <View
              className='order_item'
              key={i}>
              <View className='shop_name'>
                <View className='name'
                  onClick={() => handleClickShopName(it.shopId)}
                >
                  {it.shopName}
                </View>
                <View className='line_horizontal' />
              </View>
              <View className='products'>
                {it.productList.map((item, index) => {
                  return (
                    <View className=''>
                      <ShopProductCard
                        product={item.product}
                      />
                      {(index < it.productList.length - 1) &&
                        <View className='line_horizontal' />
                      }
                    </View>
                  )
                })}
              </View>
              <View className='total_price'> ¥{it.totalPrice} JYP</View>
              <View
                className='button_purchase_one'
                onClick={handlePurchaseButton.bind(this, it.shopId)}
              > 提交订单 </View>
            </View>
          )
        }) : <View className='empty_word' style={'margin-top: 500rpx;'} >购物车里冷冷清清</View>
      }
    </View>
  )
  let className = 'shopping_car_button ';
  switch (layoutManager.shoppingCarMode) {
    case 'NORMAL':
      className = className.concat('mode_normal')
      break;
    case 'HIDED':
      className = className.concat('mode_hide')
      break;
    case 'NONE':
      className = className.concat('mode_none')
      break;
    default:
      break;
  }

  return (
    <View className='shopping_car'>
      <AtDrawer
        show={state.ifOpenShoppingCar}
        onClose={toggleShoppingCar.bind(this, false)}
        right
        mask
      >
        <View
          className='drawer_content'
        >
          {orderList}
          {/* <Button
            className='button_purchase_all'
            onClick={handlePurchaseAllButton.bind(this)}
          >全部提交订单</Button> */}
        </View>
      </AtDrawer>
      <Image
        className={className}
        src={shoppingCarPNG}
        onClick={toggleShoppingCar.bind(this)} />
    </View>
  )
}

export default ShoppingCar;