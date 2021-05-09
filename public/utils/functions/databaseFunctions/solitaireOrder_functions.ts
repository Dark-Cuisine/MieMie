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


export const modifySolitaireOrder = async (solitaireOrder) => {
  console.log('p-modifySolitaireOrder', solitaireOrder);

  let old = null //用来在修改接龙时调整数据库商品数量
  let res_2 = await wx.cloud.callFunction({
    name: 'get_data',
    data: {
      collection: 'solitaireOrders',

      queryTerm: { _id: solitaireOrder._id },
    },
  });
  if ((res_2 && res_2.result && res_2.result.data && res_2.result.data.length > 0)) {
    old = res_2.result.data[0]
  }

  let les = wx.cloud.callFunction({
    name: 'update_data',
    data: {
      collection: 'solitaireOrders',
      queryTerm: {
        _id: solitaireOrder._id
      },
      updateData: {
        ...solitaireOrder,
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }
    },
  })
  old && old.productList &&//先加回库存
    old.productList.forEach((it) => {
      !(it.product.stock === null) &&
        product_functions.updateProductStock({
          ...it,
          quantity: Number(-it.quantity),
        });
    })
  solitaireOrder && solitaireOrder.productList &&//再减库存
    solitaireOrder.productList.forEach((it) => {
      !(it.product.stock === null) &&
        product_functions.updateProductStock(it);
    })
}

export const cancelSolitaireOrder = async (solitaireOrderId) => {
  console.log('p-cancelSolitaireOrder', solitaireOrderId);

  let solitaireOrder = null
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

  solitaireOrder && solitaireOrder.productList &&//加回库存
    solitaireOrder.productList.forEach((it) => {
      !(it.product.stock === null) &&
        product_functions.updateProductStock({
          ...it,
          quantity: Number(-it.quantity),
        });
    })

  let res_3 = wx.cloud.callFunction({//从数据库删除
    name: 'remove_data',
    data: {
      collection: 'solitaireOrders',
      removeOption: 'SINGLE',
      queryTerm: {
        _id: solitaireOrderId
      },
    }
  });

  if (!(solitaireOrder && solitaireOrder.authId)) { return }

  let res_4 = await wx.cloud.callFunction({//从用户删除
    name: 'pull_data',
    data: {
      collection: 'users',
      queryTerm: {
        unionid: solitaireOrder.authId
      },
      operatedItem: 'SOLITAIRE_ORDER',
      updateData: solitaireOrder.solitaireId
    },
  })
  let res_5 = wx.cloud.callFunction({//从接龙删除
    name: 'pull_data',
    data: {
      collection: 'solitaires',
      queryTerm: {
        _id: solitaireOrder.solitaireId
      },
      operatedItem: 'SOLITAIRE_ORDER',
      updateData: solitaireOrderId
    },
  })


}
