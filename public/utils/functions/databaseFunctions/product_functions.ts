import dayjs from 'dayjs'

export const addNewProducts = async (way, newProductList, shopId, shopName, authId, solitaireId = null) => { //添加新商品
  console.log('addNewProducts', way, newProductList, shopId, shopName, authId);
  // newProductList && newProductList.forEach((porduct) => {
  for (let porduct of newProductList) {
    let updatedProduct = {
      ...porduct,
      authId: authId,
      shopId: shopId,
      shopName: shopName,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    let res = await wx.cloud.callFunction({
      name: 'add_data',
      data: {
        collection: 'products',
        newItem: updatedProduct
      }
    });
    if (!(res && res.result)) {
      wx.showToast({
        title: '添加商品失败',
      })
      return null
    } else {
      let productId = res.result._id;
      if (way === 'RETURN_ID') {//此时返回id，不添加到店铺或接龙
        return productId
      }
      addProductIdToShop(way, productId, shopId);
      way === 'SOLITAIRE' &&
        addProductIdToSolitaire(way, productId, solitaireId);
    }

    // wx.cloud.callFunction({
    //   name: 'add_data',
    //   data: {
    //     collection: 'products',
    //     newItem: updatedProduct
    //   },
    //   success: (res) => {
    //     if (!(res && res.result)) {
    //       return null
    //     }
    //     let productId = res.result._id;
    //     if (way === 'RETURN_ID') {//此时返回id，不添加到店铺或接龙
    //       return productId
    //     }
    //     addProductIdToShop(way, productId, shopId);
    //     way === 'SOLITAIRE' &&
    //       addProductIdToSolitaire(way, productId, solitaireId);
    //   },
    //   fail: () => {
    //     wx.showToast({
    //       title: '添加商品失败',
    //     })
    //     console.error
    //   }
    // });
  }
  //);
}

export const addProductIdToShop = (way, productId, shopId) => { //把商品id添加到所属店铺
  console.log('addProductIdToShop', way, productId, shopId);
  wx.cloud.callFunction({
    name: 'push_data',
    data: {
      collection: (way === 'SHOP') ? 'shops' : 'solitaireShops',
      queryTerm: {
        _id: shopId
      },
      operatedItem: 'PRODUCT_ID_LIST',
      updateData: [{
        id: productId
      }]
    },
    success: (res) => { },
    fail: () => {
      wx.showToast({
        title: '添加商品失败',
      })
      console.error
    }
  });
}
export const addProductIdToSolitaire = (way, productId, solitaireId) => { //把商品id添加到所属接龙
  console.log('addProductIdToSolitaire', way, productId, solitaireId);
  wx.cloud.callFunction({
    name: 'push_data',
    data: {
      collection: 'solitaires',
      queryTerm: {
        _id: solitaireId
      },
      operatedItem: 'PRODUCT_ID_LIST',
      updateData: [{
        id: productId
      }]
    },
    success: (res) => { },
    fail: () => {
      wx.showToast({
        title: '添加商品失败',
      })
      console.error
    }
  });
}

export const modifyProduct = async (product) => {
  let c1 = new wx.cloud.Cloud({
    resourceAppid: 'wx8d82d7c90a0b3eda',
    resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
  })
  await c1.init({
    resourceAppid: 'wx8d82d7c90a0b3eda',
    resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
    secretId: 'AKIDwiHc09xCF3cwDFrESWOHxNZXLCfvRL2W',
    secretKey: 'XZfka5K83yeKnAcBCShS4SgS3cBXfXBs',
    env: 'miemie-buyer-7gemmgzh05a6c577'
  })
  const db_1 = c1.database({
    env: 'miemie-buyer-7gemmgzh05a6c577'
  });
  const _ = db_1.command;
  const $ = db_1.command.aggregate;

  // console.log('modifyProduct,pro', product);
  let productId = product._id;
  delete product._id; //* must delete '_id', or you can't update successfully!!

  let newStock = (product.stock === null) ? {
    stock: null
  } :
    (product.updatedStock.way == 'ADD' ? {
      stock: _.inc(Number(product.updatedStock.quantity)),
    } :
      (product.updatedStock.way == 'SUBTRACT' ? {
        stock: _.inc(Number(-product.updatedStock.quantity)),
      } : {
        stock: Number(product.stock)
      })
    );
  // console.log('newStock', newStock, '==', (product.stock));


  let updatedProduct = {
    ...product,
    ...newStock,
    updatedStock: {
      way: '',
      quantity: 0
    }
  };

  // console.log('modifyProduct-updatedProduct', updatedProduct);

  // wx.cloud.callFunction({//*problem 带_command的好像传不进云函数
  //   name: 'update_data',
  //   data: {
  //     collection: 'products',
  //     queryTerm: {
  //       _id: productId
  //     },
  //     updateData: updatedProduct
  //   },
  //   success: (res) => {},
  //   fail: console.error
  // });

  // if(product.stock === null){return}
  // wx.cloud.callFunction({
  //   name: 'inc_data',
  //   data: {
  //     collection: 'products',
  //     operatedItem: 'STOCK',
  //     queryTerm: {
  //       _id: productId
  //     },
  //     incNum: Number(product.updatedStock.way == 'ADD' ?
  //       product.updatedStock.quantity : -product.updatedStock.quantity)
  //   },
  //   success: (res) => {},
  //   fail: console.error
  // });

  db_1.collection('products')
    .where({
      _id: productId
    })
    .update({
      data: updatedProduct
    })
}

export const deleteProducts = async (deletedProducts) => {
  if (!(deletedProducts && deletedProducts.length > 0)) { return }
  for (let it of deletedProducts) {
    let res = wx.cloud.callFunction({
      name: 'remove_data',
      data: {
        collection: 'products',
        removeOption: 'SINGLE',
        queryTerm: {
          _id: it._id
        },
      }
    });
  }

  // deletedProducts && deletedProducts.forEach((it, i) => {
  //   wx.cloud.callFunction({
  //     name: 'remove_data',
  //     data: {
  //       collection: 'products',
  //       removeOption: 'SINGLE',
  //       queryTerm: {
  //         _id: it._id
  //       },
  //     },
  //     success: (res) => { },
  //     fail: () => {
  //       wx.showToast({
  //         title: '删除商品失败',
  //         icon: 'none'
  //       })
  //       console.error
  //     }
  //   });
  // })
}

export const updateProductStock = (item) => { //提交交订单后减少库存
  console.log('updateProductStock', item);
  wx.cloud.callFunction({
    name: 'inc_data',
    data: {
      collection: 'products',
      operatedItem: 'STOCK',
      queryTerm: {
        _id: item.product._id
      },
      incNum: Number(-item.quantity)
    },
    success: (res) => { },
    fail: console.error
  });

}