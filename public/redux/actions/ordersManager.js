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

export const initOrders = () => { //提交接龙后初始化
  return {
    type: actionsTypes.INIT_ORDERS,
  };
};

export const toggleIsOutOfStock = (isOutOfStock = false) => { //toggle接龙里是否有超出库存的商品
  return {
    type: actionsTypes.TOGGLE_IS_OUT_OF_STOCK,
    isOutOfStock: isOutOfStock,
  }
}
