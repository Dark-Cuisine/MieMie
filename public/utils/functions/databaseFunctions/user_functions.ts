import dayjs from 'dayjs'
import * as product_functions from './product_functions'
import * as solitaire_functions from './solitaire_functions'
import * as msg_functions from './msg_functions'
import * as order_functions from './order_functions'
import * as shop_functions from './shop_functions'
import * as login_functions from './login_functions'


//把shop id或solitaireShop id添加到用户
export const addShopToUser = async (way, shopId, userId) => {
  console.log('addShopToUser', shopId, userId);

  let res = await wx.cloud.callFunction({
    name: 'push_data',
    data: {
      collection: 'users',
      queryTerm: {
        unionid: userId
      },
      operatedItem: (way === 'SHOP') ?
        'MY_SHOPS' : 'MY_SOLITAIRE_SHOPS',
      updateData: [shopId],
    },
  });

  //  wx.cloud.callFunction({
  //   name: 'push_data',
  //   data: {
  //     collection: 'users',
  //     queryTerm: {
  //       unionid: userId
  //     },
  //     operatedItem: (way === 'SHOP') ?
  //       'MY_SHOPS' : 'MY_SOLITAIRE_SHOPS',
  //     updateData: [shopId],
  //   },
  //   success: (res) => {
  //   },
  //   fail: () => {
  //     wx.showToast({
  //       title: (way === 'SHOP') ?
  //         '添加地摊到用户失败' : '添加接龙店铺到用户失败',
  //       icon: 'none'
  //     })
  //     console.error
  //   }
  // });
}


export const addOrderToUser = async (orderId, userId) => { //把单号加到用户
  let res = await wx.cloud.callFunction({
    name: 'push_data',
    data: {
      collection: 'users',
      queryTerm: {
        unionid: userId
      },
      operatedItem: 'ORDERS',
      updateData: [orderId]
    },
  });
  // wx.cloud.callFunction({
  //   name: 'push_data',
  //   data: {
  //     collection: 'users',
  //     queryTerm: {
  //       unionid: userId
  //     },
  //     operatedItem: 'ORDERS',
  //     updateData: [orderId]
  //   },
  //   success: (res) => { },
  //   fail: () => {
  //     wx.showToast({
  //       title: '添加单号失败',
  //       icon: 'none'
  //     })
  //     console.error
  //   }
  // });
}

export const addSolitaireToUser = async (orderId, userId) => { //把单号加到用户
  let res = await wx.cloud.callFunction({
    name: 'push_data',
    data: {
      collection: 'users',
      queryTerm: {
        unionid: userId
      },
      operatedItem: 'SOLITAIRE_ORDERS',
      updateData: [orderId]
    },
  });
  // wx.cloud.callFunction({
  //   name: 'push_data',
  //   data: {
  //     collection: 'users',
  //     queryTerm: {
  //       unionid: userId
  //     },
  //     operatedItem: 'SOLITAIRE_ORDERS',
  //     updateData: [orderId]
  //   },
  //   success: (res) => { },
  //   fail: () => {
  //     wx.showToast({
  //       title: '添加单号失败',
  //       icon: 'none'
  //     })
  //     console.error
  //   }
  // });
}

export const addMsgToUsers = async (msgId, formId, toId) => { //把msg的_id添加到发送者和接受者
  let res = await wx.cloud.callFunction({
    name: 'push_data',
    data: {
      collection: 'users',
      queryTerm: {
        unionid: formId
      },
      operatedItem: 'MSG_SENT',
      updateData: [msgId]
    },
  });

  // wx.cloud.callFunction({
  //   name: 'push_data',
  //   data: {
  //     collection: 'users',
  //     queryTerm: {
  //       unionid: formId
  //     },
  //     operatedItem: 'MSG_SENT',
  //     updateData: [msgId]
  //   },
  //   success: (res) => { },
  //   fail: () => {
  //     wx.showToast({
  //       title: '发送信息失败',
  //       icon: 'none'
  //     })
  //     console.error
  //   }
  // });
  let res_2 = await wx.cloud.callFunction({
    name: 'push_data',
    data: {
      collection: 'users',
      queryTerm: {
        unionid: toId
      },
      operatedItem: 'MSG_RECEIVED',
      updateData: [msgId]
    },
  });

  // wx.cloud.callFunction({
  //   name: 'push_data',
  //   data: {
  //     collection: 'users',
  //     queryTerm: {
  //       unionid: toId
  //     },
  //     operatedItem: 'MSG_RECEIVED',
  //     updateData: [msgId]
  //   },
  //   success: (res) => { },
  //   fail: () => {
  //     wx.showToast({
  //       title: '发送信息失败',
  //       icon: 'none'
  //     })
  //     console.error
  //   }
  // });
}