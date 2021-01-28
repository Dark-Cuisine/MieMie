import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import * as actions from '../../redux/actions'

import ActionDialog from '../../components/dialogs/ActionDialog/ActionDialog'

import './ProductQuantityController.scss'

/** 商品数量控制器
<ProductProductQuantityController
    product={props.product}
    hasDeleteDialog={false} //数量0时是否打开删除对话框
/>
 */
const ProductQuantityController = (props) => {
  const ordersManager = useSelector(state => state.ordersManager);
  const dispatch = useDispatch();
  const initState = {
    quantity: 0,
    inputValue: 0,
    ifDeleteDialogOpen: false
  }
  const [state, setState] = useState(initState);
  const [ifInputFocused, setIfInputFocused] = useState(false);

  useEffect(() => {
    // console.log('quan eff', props.product);
    // console.log(' ordersManager.newOrders', ordersManager.newOrders);
    if (props.product) {
      let shopIndex = (ordersManager.newOrders.findIndex((it) => {
        return it.shopId == props.product.shopId;
      }));
      if (shopIndex > -1) {
        let productIndex = (ordersManager.newOrders[shopIndex].productList.findIndex((it) => {
          return it.product._id == props.product._id;
        }));
        if (productIndex > -1) {//如果已有此商品，则初始化为该商品数量
          setState({
            ...state,
            quantity: ordersManager.newOrders[shopIndex].productList[productIndex].quantity,
            inputValue: ordersManager.newOrders[shopIndex].productList[productIndex].quantity,
          });
        } else {//否则初始化为0
          setState({
            ...state,
            quantity: initState.quantity,
            inputValue: initState.inputValue,
          });
        }
      } else {
        setState({
          ...state,
          quantity: initState.quantity,
          inputValue: initState.inputValue,
        });
      }
    } else {
      setState({
        ...state,
        quantity: initState.quantity,
        inputValue: initState.inputValue,
      });
    }
  }, [props.product, ordersManager])

  const handleFocus = () => {
    setIfInputFocused(true)
  }
  //console.log('render');
  const handleChangeQuantity = (changeWay, value = 0) => {//控制商品数量
    let updatedQuantity = state.quantity;
    switch (changeWay) {
      case ('ADD'): {
        if (state.inputValue < props.product.stock ||
          props.product.stock === null) {
          updatedQuantity++;
          setState({
            ...state,
            quantity: updatedQuantity,
            inputValue: updatedQuantity
          });
          dispatch(actions.changeProductQuantity(props.product, updatedQuantity));
        }
        break;
      }
      case ('SUBTRACT'): {
        if (state.inputValue > 0) {
          updatedQuantity--;
          if (props.hasDeleteDialog &&
            ((updatedQuantity === 0) || (updatedQuantity === '0'))) {//打开删除前提示框
            setState({
              ...state,
              ifDeleteDialogOpen: true,
              inputValue: updatedQuantity
            });
          } else {
            setState({
              ...state,
              quantity: updatedQuantity,
              inputValue: updatedQuantity
            });
            dispatch(actions.changeProductQuantity(props.product, updatedQuantity));
          }
          break;
        }
      }
      case ('CHANGE'): {
        // console.log('value', value, 'ifInputFocused', ifInputFocused);
        if (ifInputFocused) {//*注：onblur时会自动调用一次onchange,这里是为了过滤掉onblur导致的onchange
          updatedQuantity = parseInt(value, 10);
          if (!(props.product.stock === null) &&
            value > props.product.stock) {
            updatedQuantity = props.product.stock
          }
          setState({
            ...state,
            inputValue: updatedQuantity
          });
        }
        break;
      }
      default:
        break;
    };

  }
  const handleBlur = () => {
    setIfInputFocused(false)
    // console.log('blur', state.inputValue, 'quantity', state.quantity, 'stock', props.product.stock,
    // 'ifInputFocused', ifInputFocused);
    if (state.inputValue ||
      (state.inputValue === 0) || (state.inputValue === '0')) {
      if (props.hasDeleteDialog &&
        (state.inputValue === 0) || (state.inputValue === '0')) {
        setState({
          ...state,
          ifDeleteDialogOpen: true,
          inputValue: updatedQuantity
        });
      } else {
        setState({
          ...state,
          quantity: state.inputValue,
        });
        dispatch(actions.changeProductQuantity(props.product, state.inputValue));
      }
    } else {//如果失焦时输入框为空，则初始化为原来的数字
      // console.log('如果失焦时输入框为空，则初始化为原来的数字', state.quantity);
      setState({
        ...state,
        inputValue: state.quantity,
      });
    }
  }
  const handleDeleteProduct = () => {//确定删除
    setState({
      ...state,
      quantity: 0,
      inputValue: 0,
      ifDeleteDialogOpen: false
    });
    dispatch(actions.changeProductQuantity(props.product, 0));
  };
  const handleCancelDeleteDialog = () => {//取消删除
    setState({
      ...state,
      ifDeleteDialogOpen: false,
      inputValue: state.quantity//input设为当前商品数量
    });
  };

  let deleteDialog = (
    <ActionDialog
      isOpened={state.ifDeleteDialogOpen}
      leftWord='取消'
      rightWord='删除'
      onClose={handleCancelDeleteDialog.bind(this)}
      onCancel={handleCancelDeleteDialog.bind(this)}
      onSubmit={handleDeleteProduct.bind(this)}
    >
      <View className=''> 确定从购物车里删除{props.product.name}？ </View>
    </ActionDialog>
  );

  let ProductQuantityController = (
    <View
      className='quantity_controller'>

      {(state.quantity > 0) &&
        <View
          className={'at-icon at-icon-subtract '.concat(
            (state.inputValue == 1) ? 'disable' : ''
          )}
          onClick={handleChangeQuantity.bind(this, 'SUBTRACT')}
        />}
      {(state.quantity > 0) &&
        <AtInput
          className='input'
          focus={ifInputFocused}
          placeholderClass='input_place_holder'
          name={'ProductQuantityController'.concat(props.product._id)}
          type='number'
          cursor={state.inputValue && String(state.inputValue).length}
          value={state.inputValue}
          onFocus={() => handleFocus()}
          onChange={value => handleChangeQuantity('CHANGE', value)}
          onBlur={() => handleBlur()}
        />}
      <View
        className={'at-icon at-icon-add '.concat(
          (state.inputValue < props.product.stock) ? '' : 'disable'
        )}
        onClick={handleChangeQuantity.bind(this, 'ADD')}
      />
    </View>
  );
  return (
    <View className='product_quantity_controller'>
      {deleteDialog}
      {ProductQuantityController}
    </View>
  )
}

ProductQuantityController.defaultProps = {
  hasDeleteDialog: true,
};
export default ProductQuantityController;