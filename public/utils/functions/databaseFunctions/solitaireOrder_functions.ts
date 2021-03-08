import dayjs from 'dayjs'
import * as product_functions from './product_functions'
import * as user_functions from './user_functions'
import * as msg_functions from './msg_functions'
import * as solitaire_functions from './solitaire_functions'
import * as shop_functions from './shop_functions'

export const doPurchase = async (order) => { //确定提交订单  
  console.log('doPurchase-solitaire', order);
  let r = await wx.cloud.callFunction({
    name: 'add_data',
    data: {
      collection: 'solitaireOrders',
      newItem: order
    },
  });
  order && order.productList &&
    order.productList.forEach((it) => {
      !(it.product.stock === null) &&
        product_functions.updateProductStock(it);
    })
  let orderId = r.result._id
  await user_functions.addSolitaireOrderToUser(orderId, order.solitaireId, order.authId);
  solitaire_functions.addSolitaireOrderToSolitaire(orderId, order.solitaireId);

}



