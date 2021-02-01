import * as actionsTypes from '../constants/ordersManager'

const db = wx.cloud.database();
const _ = db.command


export const changeProductQuantity = (product, quantity) => { //改变购物车里此商品的数量 
  return {
    type: actionsTypes.CHANGE_PRODUCT_QUANTITY,
    product: product,
    quantity: quantity
  };
};

export const initOrders = (shopId=null) => { //提交订单后从购物车删掉该店铺订单
  return {
    type: actionsTypes.INIT_ORDERS,
    shopId:shopId,
  };
};

export const toggleIsOutOfStock = (isOutOfStock = false) => { //toggle接龙里是否有超出库存的商品
  return {
    type: actionsTypes.TOGGLE_IS_OUT_OF_STOCK,
    isOutOfStock: isOutOfStock,
  }
}
