import dayjs from 'dayjs'
import * as product_functions from './product_functions'
import * as user_functions from './user_functions'
import * as msg_functions from './user_functions'
import * as order_functions from './order_functions'
import * as shop_functions from './shop_functions'

//和solitaire\solitaireShop有关的 database functions


//添加新solitaireShop。现在每个user只能有一个solitaireShop，所以这个函数只在第一次创建接龙时使用。
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
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        solitaires: [],
      }
    },
  });
  if (!(res && res.result)) {
    return
  }
  let solitaireShopId = res.result._id
  addNewSolitaire(authId, solitaireShopId, newSolitaire, newProducts)
  await user_functions.addShopToUser('SOLITAIRE', solitaireShopId, authId);
}

export const addNewSolitaire = async (authId, solitaireShopId, solitaire, newProductList) => { //添加接龙
  let res = await wx.cloud.callFunction({ //添加新接龙
    name: 'add_data',
    data: {
      collection: 'solitaires',
      newItem: {
        ...solitaire,
        authId: authId,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        solitaireShopId: solitaireShopId,
      }
    }
  });
  if (!(res && res.result)) {//*注：这里不是res.result.data
    return
  }
  console.log("添加solitaire成功", res);
  let solitaireId = res.result._id

  addSolitaireToSolitaireShop(solitaireId, solitaireShopId)
  product_functions.addNewProducts('SOLITAIRE', newProductList, solitaireShopId, '接龙店', authId, solitaireId)

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
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
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

//改接龙
//（products是已经剔除过deletedProducts的list）
export const modifySolitaire = async (solitaire, products, deletedProducts) => {

  let solitaireId = solitaire._id; //* don't forget to save _id first!!!!
  delete solitaire._id; //* must delete '_id', or you can't update successfully!!

  let existingProducts = []
  let newProducts = []
  products &&
    products.forEach(it => {
      (it._id || it.id) ?
        existingProducts.push(it) :
        newProducts.push(it)
    })
  let res_1 = wx.cloud.callFunction({
    name: 'update_data',
    data: {
      collection: 'solitaires',
      queryTerm: {
        _id: solitaireId
      },
      updateData: Object.assign({
        ...solitaire,
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
        (existingProducts.length > 0) &&
        {
          products: {
            ...solitaire.products,
            productList: existingProducts.map(it => { return { id: it._id ? it._id : it.id } }),
          }
        }
      ),
    },
  });

  let res_2 = wx.cloud.callFunction({
    name: 'update_data',
    data: {
      collection: 'solitaireShops',
      queryTerm: {
        _id: solitaire.solitaireShopId
      },
      updateData: Object.assign({
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }, (existingProducts.length > 0) && {
        products: {
          // *unfinished 要优化，最好先取店然后用...products
          productList: existingProducts.map(it => { return { id: it._id ? it._id : it.id } }),
        }
      })
    },
  });


  if (existingProducts.length > 0) {
    for (let it of existingProducts) {
      await product_functions.modifyProduct(it)
    }
  }
  newProducts.length > 0 &&
    await product_functions.addNewProducts('SOLITAIRE', newProducts,
      solitaire.solitaireShopId, '接龙店', solitaire.authId, solitaireId);
  deletedProducts && deletedProducts.length > 0 &&
    await product_functions.deleteProducts(deletedProducts);


}

//改接龙店
export const modifySolitaireShop = async (solitaireShopId, products, deletedProducts = null) => {
  // let shopId = shop._id; //* don't forget to save _id first!!!!
  // delete shop._id; //* must delete '_id', or you can't update successfully!!

}

//把接龙加进接龙店
export const addSolitaireToSolitaireShop = async (solitaireId, solitaireShopId) => {
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

//把接龙订单加进接龙
export const addSolitaireOrderToSolitaire = async (orderId, solitaireId) => {
  console.log('addSolitaireOrderToSolitaire', orderId, solitaireId);
  if (!(solitaireId && solitaireId.length > 0)) { return }
  wx.cloud.callFunction({
    name: 'push_data',
    data: {
      collection: 'solitaires',
      queryTerm: {
        _id: solitaireId
      },
      operatedItem: 'SOLITAIRE_ORDERS',
      updateData: [orderId],
    },
    success: (res) => { },
    fail: () => {
      wx.showToast({
        title: '添加接龙订单到接龙失败',
      })
      console.error
    }
  });
}

//删接龙
export const deleteSolitaire = async (solitaireId, solitaireShopId) => {
  console.log('p-deleteSolitaire', solitaireId, solitaireShopId);
  let res_1 = await wx.cloud.callFunction({
    name: 'remove_data',
    data: {
      collection: 'solitaires',
      removeOption: 'SINGLE',
      queryTerm: { _id: solitaireId },
    },
  })
  let res_2 = await wx.cloud.callFunction({
    name: 'pull_data',
    data: {
      collection: 'solitaireShops',
      queryTerm: { _id: solitaireShopId },
      operatedItem: 'SOLITAIRE',
      updateData: solitaireId
    },
  })
}

//删用户里的该接龙id
export const deleteSolitaireIdFromUser = async (userId, solitaireId) => {
  console.log('deleteSolitaireIdFromUser', userId, solitaireId);
  let res = await wx.cloud.callFunction({
    name: 'pull_data',
    data: {
      collection: 'users',
      queryTerm: { unionid: userId },
      operatedItem: 'SOLITAIRE_ORDER',
      updateData: solitaireId
    }
  });
}