import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image, Swiper, SwiperItem } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import ProductQuantityController from '../../ProductQuantityController/ProductQuantityController'
import ActionButtons from '../../buttons/ActionButtons/ActionButtons'
import Dialog from '../../dialogs/Dialog/Dialog'

import './ShopProductCard.scss'


/**
 * <ShopProductCard
    product={it}
    type={state.type} //'EVENT'活动,'GOODS'商品
mode={state.mode}
    isOutOfStock={checkStock(it)}
    
    handleModify={() => handleModify('PRODUCT', i)}
    handleDelete={() => handleDelete('PRODUCT', i)}
    handleAddStock={() => handleModify('ADD_STOCK', i)}
    handleSubtractStock={() => handleModify('SUBTRACT_STOCK', i)}
    handleStatus={() => handleModify('PRODUCT_STATUS', i)}

    hasDeleteDialog={false} //数量0时是否打开删除对话框

    // doChoose={} //when mode === 'SOLITAIRE_SELLER'
    // doUnChoose={} 
    />
 * 
 */
const ShopProductCard = (props) => {
  const ordersManager = useSelector(state => state.ordersManager);
  const initState = {
    product: props.product,
    isOutOfStock: props.isOutOfStock,

    openedDialog: null,//'PREVIEW'

    mode: props.mode ? props.mode : 'BUYER',//'BUYER','SELLER_MODIFYING','SELLER_PREVIEW','SOLITAIRE_BUYER','SOLITAIRE_SELLER'
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    setState({
      ...state,
      mode: initState.mode,
      product: initState.product,
    });
  }, [props.mode, props.product])

  const toggleDialog = (openedDialog) => {
    setState({
      ...state,
      openedDialog: openedDialog
    });
  }



  let actionButtonList = [
    {
      word: '修改',
      onClick: () => props.handleModify(),
    },
    {
      word: '删除',
      onClick: () => props.handleDelete(),
    }
  ];
  state.mode === 'SELLER_MODIFYING' &&
    (state.product.status === 'LAUNCHED' ?
      actionButtonList.push(
        {
          word: '暂时下架',
          onClick: () => props.handleStatus(),
        },
      ) :
      actionButtonList.push(
        {
          word: '重新上架',
          onClick: () => props.handleStatus(),
        },
      )
    )

  let nameAndPrice = (
    <View
      className='name_and_price'
      onClick={() => toggleDialog('PREVIEW')}
    >
      <View className='product_name '>{state.product.name}</View>
      <View className='flex items-center '>
        <View className='product_price '>¥{state.product.price}</View>
        <View className='product_unit'> /{state.product.unit}</View>
      </View>
    </View>
  )

  let cardRight = (
    <View className='card_right'>
      <View className='flex'>
        {props.isOutOfStock &&
          <View className='under_stock '>
            {props.type === 'GOODS' ? '库存不足' : '满员啦'}
          </View>
        }
        <View className='quantity_controller_and_stock'>
          <ProductQuantityController
            product={state.product}
            hasDeleteDialog={props.hasDeleteDialog}
          />
          {(state.product.stock || state.product.stock === 0) &&
            <View
              className={'product_stock '}
              style={state.product.stock === 0 ? 'color:var(--red-1);' : ''}
            >

              (还剩
              {state.product.stock}
              {props.type === 'GOODS' ? '份' : '个名额'}
              )
            </View>
          }
        </View>
      </View>
    </View>
  )

  let productDes = (
    <View
      className='product_des '
      onClick={() => toggleDialog('PREVIEW')}
    >
      {state.product.des}
    </View>
  )

  let previewDialog = (
    <Dialog
      className='preview_dialog'
      isOpened={state.openedDialog === 'PREVIEW'}
      onClose={() => toggleDialog(null)}
    >
      {state.product.icon && state.product.icon.length > 0 &&
        <Swiper
          className='product_icons'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          indicatorDots
        >
          {
            state.product.icon.map((it, i) => {
              return (
                <SwiperItem>
                  <Image
                    className='product_icon'
                    src={it.url}
                  />
                </SwiperItem>
              )
            })
          }
        </Swiper>
      }
      <View className='flex'>
        {nameAndPrice}
        {state.mode == 'BUYER' && cardRight}
      </View>
      {productDes}
    </Dialog>
  )


  return (
    <View className={'shop_product_card '.concat(
      (state.mode === 'SOLITAIRE_SELLER') ?
        'shop_product_card_solitaire '.concat(state.product.status === 'LAUNCHED' ?
          '' : 'shop_product_card_solitaire_unchoosen ') : '',
      props.className)}
    >
      {previewDialog}
      {
        state.product.icon && state.product.icon.length > 0 &&
        <Image
          className='product_icon_small '
          src={state.product.icon[0].url}
          onClick={() => toggleDialog('PREVIEW')}
        />
      }
      <View className='part_right'
        style={state.product.icon && state.product.icon.length > 0 && 'width:80%;'}>
        <View className='part_2'>
          {nameAndPrice}
          {
            (state.mode === 'BUYER' || state.mode === 'SOLITAIRE_BUYER') ?
              cardRight :
              (
                <View className='card_right'>
                  {(state.mode == 'SELLER_MODIFYING' || state.mode === 'SOLITAIRE_SELLER') &&
                    <ActionButtons
                      type={2}
                      position={'LEFT'}
                      actionButtonList={actionButtonList}
                    />
                  }
                  <View className='product_stock '>
                    <View className=''>{props.type === 'GOODS' ? '库存:' : '人数:'}</View>
                    <View className=''>
                      {(state.product.stock || state.product.stock === 0) ?
                        state.product.stock : '不限'
                      }
                    </View>
                    <View className=''> {state.product.unit}</View>
                  </View>
                  {state.product.updatedStock.way.length > 0 &&
                    !(state.product.updatedStock.quantity == 0) &&
                    <View className='updated_stock'>
                      ( {state.product.updatedStock.way === 'ADD' ? '+' : '-'}
                      {state.product.updatedStock.quantity})
                    </View>
                  }
                  <View className='footer'>
                    {props.type === 'GOODS' &&
                      (state.mode == 'SELLER_MODIFYING' || state.mode === 'SOLITAIRE_SELLER')
                      && state.product._id && //有id的商品才显示更新库存button
                      !(state.product.stock === null) && !(state.product.status === 'DISCONTINUED') &&
                      <ActionButtons
                        type={1}
                        position={'RIGHT'}
                        onClickLeftButton={() => props.handleSubtractStock()}
                        onClickRightButton={() => props.handleAddStock()}
                        leftWord='减少库存'
                        rightWord='添加库存'
                      />
                    }
                  </View>
                </View>
              )}
          {/* {state.mode === 'SOLITAIRE_SELLER' &&
            <View
              className={'solitaire_toggle_choosen_button '.concat(
                props.ifChoosen ?
                  'solitaire_toggle_choosen_button_choosen' : '')}
              onClick={props.ifChoosen ?
                () => props.doUnChoose() :
                () => props.doChoose()}
            />
          } */}
        </View>
        {productDes}
      </View>
    </View>
  )
}
ShopProductCard.defaultProps = {
  hasDeleteDialog: true,
  type: 'GOODS',
};
export default ShopProductCard;