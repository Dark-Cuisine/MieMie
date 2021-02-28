import dayjs from 'dayjs'
import * as product_functions from './product_functions'
import * as user_functions from './user_functions'
import * as msg_functions from './user_functions'
import * as order_function from './order_function'
import * as shop_functions from './shop_functions'

//和solitaire\solitaireShop有关的 database functions


//添加新solitaireShop
//authId:创建者unionid
//newSolitaire:{} ,新的solitaire(*注：是solitaire不是solitaireShop)
//newProducts:[]
export const addNewSoltaireShop = async (authId, newSolitaire = null, newProducts = null) => {
  console.log('addNewSoltaireShop-' + newSolitaire, newProducts);

  let res = await wx.cloud.callFunction({
    name: 'add_data',
    data: {
      collection: 'solitaireShops',
      newItem: {
        authId: authId,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        solitaires: [],
      }
    },
  });
  console.log("i-3", res);
  if (!(res && res.result)) {
    return
  }
  let solitaireShopId = res.result._id
  addNewSolitaire(authId, solitaireShopId, newSolitaire, newProducts)
  await user_functions.addShopToUser('SOLITAIRE', solitaireShopId, authId);
  console.log("i-4", res);
  // wx.cloud.callFunction({
  //   name: 'add_data',
  //   data: {
  //     collection: 'solitaireShops',
  //     newItem: {
  //       authId: authId,
  //       createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  //       solitaires: [],
  //     }
  //   },
  //   success: (res) => {
  //     console.log("添加接龙店铺成功", res);
  //     if (!(res && res.result)) {
  //       return
  //     }
  //     let solitaireShopId = res.result._id
  //     addNewSolitaire(authId, solitaireShopId, newSolitaire, newProducts)
  //     user_functions.addShopToUser('SOLITAIRE', solitaireShopId, authId);
  //   },
  //   fail: () => {
  //     wx.showToast({
  //       title: '添加接龙店铺失败',
  //     })
  //     console.error
  //   }
  // });
}

export const addNewSolitaire = async (authId, solitaireShopId, solitaire, newProductList) => { //添加接龙
  wx.cloud.callFunction({ //添加新接龙
    name: 'add_data',
    data: {
      collection: 'solitaires',
      newItem: {
        ...solitaire,
        authId: authId,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        solitaireShopId: solitaireShopId,
      }
    },
    success: (res) => {
      if (!(res && res.result)) {//*注：这里不是res.result.data
        return
      }
      console.log("添加solitaire成功", res);
      let solitaireId = res.result._id

      addSolitaireToSolitaireShop(solitaireId, solitaireShopId)
      product_functions.addNewProducts('SOLITAIRE', newProductList, solitaireShopId, '接龙店', authId)
    },
    fail: () => {
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      })
      console.error
    }
  });
}

//新建接龙订单
export const addSolitaireOrder = async (solitaireOrder, userId, userName) => {
  let updatedOrder = {
    ...solitaireOrder,
    authId: userId,
    status: 'UN_PROCESSED',
    buyerId: userId,
    buyerName: userName,
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };
  let collection = 'solitaireOrders'
  wx.cloud.callFunction({
    name: 'add_data',
    data: {
      collection: collection,
      newItem: updatedOrder
    },
    success: (r) => {
      solitaireOrder && solitaireOrder.productList &&
        solitaireOrder.productList.forEach((it) => {
          !(it.product.stock === null) &&
            product_functions.updateProductStock(it);
        })
      user_functions.addOrderToUser(r.result._id, userId);
      shop_functions.addOrderToShop(r.result._id, solitaireOrder.solitaireId);
    },
    fail: () => {
      wx.showToast({
        title: '提交订单失败',
        icon: 'none'
      })
      console.error
    }
  });
}

export const modifySolitaire = async (solitaire, products, deletedProducts) => { //改接龙
}
export const addSolitaireToSolitaireShop = async (solitaireId, solitaireShopId) => { //把接龙加进接龙店
  console.log('addSolitaireToSolitaireShop', solitaireId, solitaireShopId);
  wx.cloud.callFunction({
    name: 'push_data',
    data: {
      collection: 'solitaireShops',
      queryTerm: {
        _id: solitaireShopId
      },
      operatedItem: 'SOLITAIRES',
      updateData: [solitaireId],
    },
    success: (res) => { },
    fail: () => {
      wx.showToast({
        title: '添加接龙到接龙店铺失败',
      })
      console.error
    }
  });
}