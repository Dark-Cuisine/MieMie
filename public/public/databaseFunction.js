import dayjs from "dayjs";

// const db = wx.cloud.database();
// const _ = db.command;
// const $ = db.command.aggregate;

//** .update需要设置_openid,or改一下云数据库里权限=所有人可读可写才能生效！！！

/**
 * 放和数据库相关的函数
 */
// export const addNewShop = async (authId, newShop, newProductList) => { //添加新店
//   //console.log('addNewShop,', newShop, newProductList);
//   wx.cloud.callFunction({
//     name: 'add_data',
//     data: {
//       collection: 'shops',
//       newItem: {
//         authId: authId,
//         createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
//         ...newShop
//       }
//     },
//     success: (res) => {
//       console.log("添加shop成功", res);
//       if (!(res && res.result)) {
//         return
//       }
//       let shopId = res.result._id
//       addNewProducts('SHOP', newProductList, shopId, newShop.shopInfo.shopName, authId);
//       if (newShop.shopInfo.ownerId && newShop.shopInfo.ownerId.length > 0) {
//         addShopToUser('SHOP', shopId, newShop.shopInfo.ownerId);
//       }
//     },
//     fail: () => {
//       wx.showToast({
//         title: '添加地摊失败',
//         icon: 'none'
//       })
//       console.error
//     }
//   });

// }

// export const modifyShop = async (shop, products, deletedProducts) => { //改店
//   let shopId = shop._id; //* don't forget to save _id first!!!!
//   delete shop._id; //* must delete '_id', or you can't update successfully!!

//   let updatedProductIdList = [];
//   shop && shop.products && shop.products.productList &&
//     shop.products.productList.forEach((it) => { //去掉被删除的product
//       let index = deletedProducts.findIndex((item) => {
//         return (it.id == item._id)
//       });
//       index < 0 && updatedProductIdList.push(it)
//     })
//   let updatedShop = {
//     ...shop,
//     updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
//     products: {
//       ...shop.products,
//       productList: updatedProductIdList,
//     }
//   }

//   wx.cloud.callFunction({
//     name: 'update_data',
//     data: {
//       collection: 'shops',
//       queryTerm: {
//         _id: shopId
//       },
//       updateData: updatedShop
//     },
//     success: (res) => {
//       console.log('modifyShop-products', products);
//       products && products.forEach((it) => {
//         it._id ?
//           modifyProduct(it) :
//           addNewProducts('SHOP', [it], shopId, shop.shopInfo.shopName, shop.authId);
//       });
//       deleteProducts(deletedProducts);
//     },
//     fail: () => {
//       wx.showToast({
//         title: '更新店铺失败',
//       })
//       console.error
//     }
//   });
// }

// export const deleteShop = async (shop, ownerId) => {
//   console.log('deleteShop', shop);
//   // return
//   if (shop.products.productList.length > 0) {
//     let idList = []
//     shop.products.productList.forEach(it => {
//       idList.push(it.id)
//     })

//     wx.cloud.callFunction({
//       name: 'remove_data',
//       data: {
//         collection: 'products',
//         removeOption: 'MULTIPLE',
//         operatedItem: '_ID',
//         removeList: idList,
//       },
//       success: (res) => {},
//       fail: () => {
//         wx.showToast({
//           title: '删除商品失败',
//           icon: 'none'
//         })
//         console.error
//       }
//     });

//   }

//   wx.cloud.callFunction({
//     name: 'remove_data',
//     data: {
//       collection: 'shops',
//       removeOption: 'SINGLE',
//       queryTerm: {
//         _id: shop._id
//       },
//     },
//     success: (res) => {},
//     fail: () => {
//       wx.showToast({
//         title: '删除地摊失败',
//         icon: 'none'
//       })
//       console.error
//     }
//   });

//   wx.cloud.callFunction({
//     name: 'pull_data',
//     data: {
//       collection: 'users',
//       queryTerm: {
//         unionid: ownerId
//       },
//       operatedItem: 'MY_SHOPS',
//       updateData: shop._id
//     },
//     success: (res) => {},
//     fail: () => {
//       wx.showToast({
//         title: '获取user shops数据失败',
//         icon: 'none'
//       })
//       console.error
//     }
//   });
// }

// export const addNewSolitaireShop = async (authId, solitaireId = null, products = null) => { //添加新接龙店
//   let newSolitaireShop = {
//     authId: authId,
//     createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
//   }
//   if (solitaireId) {
//     newSolitaireShop.solitaires = [solitaireId];
//   }
//   wx.cloud.callFunction({
//     name: 'add_data',
//     data: {
//       collection: 'shops',
//       newItem: newSolitaireShop,
//     },
//     success: (res) => {
//       if (!(res && res.result)) {
//         return
//       }
//       console.log("添加solitaire shop成功", res);
//       let shopId = res.result._id
//       products && products.forEach((it) => {
//         it._id ?
//           modifyProduct(it) :
//           addNewProducts('SOLITAIRE', [it], shopId, '接龙店', authId);
//       });
//       if (newShop.shopInfo.ownerId && newShop.shopInfo.ownerId.length > 0) {
//         addShopToUser('SOLITAIRE', shopId, newShop.shopInfo.ownerId);
//       }
//     },
//     fail: () => {
//       wx.showToast({
//         title: '添加地摊失败',
//         icon: 'none'
//       })
//       console.error
//     }
//   });

// }

// export const modifySolitaire = async (solitaire, shop, products, deletedProducts) => { //修改接龙 这里的shop是接龙店
//   let shopId = shop._id; //* don't forget to save _id first!!!!
//   delete shop._id; //* must delete '_id', or you can't update successfully!!
//   let solitaireId = solitaire._id;
//   delete solitaire._id;

//   //修改接龙
//   wx.cloud.callFunction({
//     name: 'update_data',
//     data: {
//       collection: 'solitaires',
//       queryTerm: {
//         _id: solitaireId
//       },
//       updateData: {
//         ...solitaire,
//         updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
//       }
//     },
//     success: (res) => {
//       console.log('modifyShop-products', products);
//       products && products.forEach((it) => {
//         it._id ?
//           modifyProduct(it) :
//           addNewProducts('SHOP', [it], shopId, shop.shopInfo.shopName, shop.authId);
//       });
//       deleteProducts(deletedProducts);
//     },
//     fail: () => {
//       wx.showToast({
//         title: '更新店铺失败',
//       })
//       console.error
//     }
//   });

//   let updatedProductIdList = [];
//   shop && shop.products && shop.products.productList &&
//     shop.products.productList.forEach((it) => { //去掉被删除的product
//       let index = deletedProducts.findIndex((item) => {
//         return (it.id == item._id)
//       });
//       index < 0 && updatedProductIdList.push(it)
//     })
//   let updatedShop = {
//     ...shop,
//     updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
//     products: {
//       ...shop.products,
//       productList: updatedProductIdList,
//     }
//   }

//   wx.cloud.callFunction({ //修改接龙店、商品
//     name: 'update_data',
//     data: {
//       collection: 'solitaireShops',
//       queryTerm: {
//         _id: shopId
//       },
//       updateData: updatedShop
//     },
//     success: (res) => {
//       console.log('modifyShop-products', products);
//       products && products.forEach((it) => {
//         it._id ?
//           modifyProduct(it) :
//           addNewProducts('SOLITAIRE', [it], shopId, '接龙店', shop.authId);
//       });
//       deleteProducts(deletedProducts);
//     },
//     fail: () => {
//       wx.showToast({
//         title: '更新接龙店铺失败',
//       })
//       console.error
//     }
//   });
// }
// export const addNewSolitaire = async (authId, solitaireShopId, solitaire, newProductList) => { //添加接龙
//   wx.cloud.callFunction({ //添加新接龙
//     name: 'add_data',
//     data: {
//       collection: 'solitaire',
//       newItem: {
//         ...solitaire,
//         authId: authId,
//         createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
//       }
//     },
//     success: (res) => {
//       if (!(res && res.result && res.result.data)) {
//         return
//       }
//       console.log("添加solitaire成功", res);
//       let solitaireId = res.result._id

//       if (!(solitaireShopId && solitaireShopId.length > 0)) { //如果当前用户第一次建接龙，则先新建接龙店，再把接龙加到接龙店
//         addNewSolitaireShop(authId, solitaireId)
//       } else { //否则直接把新的接龙添加到该用户的接龙店
//         addSolitaireToSolitaireShop(solitaireId, solitaireShopId)
//         addNewProducts('SOLITAIRE', newProductList, solitaireShopId, '接龙店', authId)
//       }
//     },
//     fail: () => {
//       wx.showToast({
//         title: '获取数据失败',
//         icon: 'none'
//       })
//       console.error
//     }
//   });
// }
// export const modifySolitaire = async (solitaire, products, deletedProducts) => { //改接龙
// }
// export const addSolitaireToSolitaireShop = async (solitaireId, solitaireShopId) => { //把接龙加进接龙店
//   wx.cloud.callFunction({
//     name: 'push_data',
//     data: {
//       collection: 'solitaireShops',
//       queryTerm: {
//         unionid: solitaireShopId
//       },
//       operatedItem: 'SOLITAIRES',
//       updateData: [solitaireId],
//     },
//     success: (res) => {},
//     fail: () => {
//       wx.showToast({
//         title: '添加接龙到接龙店铺失败',
//       })
//       console.error
//     }
//   });
// }

// const addNewProducts = (way, newProductList, shopId, shopName, authId) => { //添加新商品
//   console.log('addNewProducts', newProductList, shopId, shopName, authId);
//   newProductList && newProductList.forEach((porduct) => {
//     let updatedProduct = {
//       ...porduct,
//       authId: authId,
//       shopId: shopId,
//       shopName: shopName,
//       createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
//     };

//     wx.cloud.callFunction({
//       name: 'add_data',
//       data: {
//         collection: 'products',
//         newItem: updatedProduct
//       },
//       success: (res) => {
//         if (!(res && res.result)) {
//           return
//         }
//         let productId = res.result._id;
//         addProductIdToShop(way, productId, shopId);

//       },
//       fail: () => {
//         wx.showToast({
//           title: '添加商品失败',
//           icon: 'none'
//         })
//         console.error
//       }
//     });

//   });
// }
// const modifyProduct = async (product) => {
//   let c1 = new wx.cloud.Cloud({
//     resourceAppid: 'wx8d82d7c90a0b3eda',
//     resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
//   })
//   await c1.init({
//     resourceAppid: 'wx8d82d7c90a0b3eda',
//     resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
//
//
//     env: 'miemie-buyer-7gemmgzh05a6c577'
//   })
//   const db_1 = c1.database({
//     env: 'miemie-buyer-7gemmgzh05a6c577'
//   });
//   const _ = db_1.command;
//   const $ = db_1.command.aggregate;

//   console.log('modifyProduct,pro', product);
//   let productId = product._id;
//   delete product._id; //* must delete '_id', or you can't update successfully!!

//   let newStock = (product.stock === null) ? {
//       stock: null
//     } :
//     (product.updatedStock.way == 'ADD' ? {
//         stock: _.inc(Number(product.updatedStock.quantity)),
//       } :
//       (product.updatedStock.way == 'SUBTRACT' ? {
//         stock: _.inc(Number(-product.updatedStock.quantity)),
//       } : {
//         stock: Number(product.stock)
//       })
//     );
//   console.log('newStock', newStock, '==', (product.stock));

//   let updatedProduct = {
//     ...product,
//     ...newStock,
//     updatedStock: {
//       way: '',
//       quantity: 0
//     }
//   };

//   console.log('modifyProduct-updatedProduct', updatedProduct);

//   // wx.cloud.callFunction({//*problem 带_command的好像传不进云函数
//   //   name: 'update_data',
//   //   data: {
//   //     collection: 'products',
//   //     queryTerm: {
//   //       _id: productId
//   //     },
//   //     updateData: updatedProduct
//   //   },
//   //   success: (res) => {},
//   //   fail: console.error
//   // });

//   // if(product.stock === null){return}
//   // wx.cloud.callFunction({
//   //   name: 'inc_data',
//   //   data: {
//   //     collection: 'products',
//   //     operatedItem: 'STOCK',
//   //     queryTerm: {
//   //       _id: productId
//   //     },
//   //     incNum: Number(product.updatedStock.way == 'ADD' ?
//   //       product.updatedStock.quantity : -product.updatedStock.quantity)
//   //   },
//   //   success: (res) => {},
//   //   fail: console.error
//   // });

//   db_1.collection('products')
//     .where({
//       _id: productId
//     })
//     .update({
//       data: updatedProduct
//     })

// }

// const deleteProducts = (deletedProducts) => {
//   deletedProducts && deletedProducts.forEach((it, i) => {
//     wx.cloud.callFunction({
//       name: 'remove_data',
//       data: {
//         collection: 'products',
//         removeOption: 'SINGLE',
//         queryTerm: {
//           _id: it._id
//         },
//       },
//       success: (res) => {},
//       fail: () => {
//         wx.showToast({
//           title: '删除商品失败',
//           icon: 'none'
//         })
//         console.error
//       }
//     });
//   })
// }

// export const addProductIdToShop = (way, productId, shopId) => { //把商品id添加到所属店铺
//   wx.cloud.callFunction({
//     name: 'push_data',
//     data: {
//       collection: (way === 'SHOP') ? 'shops' : 'solitaireShops',
//       queryTerm: {
//         _id: shopId
//       },
//       operatedItem: 'PRODUCT_ID_LIST',
//       updateData: [{
//         id: productId
//       }]
//     },
//     success: (res) => {},
//     fail: () => {
//       wx.showToast({
//         title: '添加商品失败',
//         icon: 'none'
//       })
//       console.error
//     }
//   });

// }

// const addShopToUser = (way, shopId, userId) => { //把店铺id添加到用户
//   console.log('addShopToUser', shopId, userId);
//   wx.cloud.callFunction({
//     name: 'push_data',
//     data: {
//       collection: 'users',
//       queryTerm: {
//         unionid: userId
//       },
//       operatedItem: (way === 'SHOP') ?
//         'MY_SHOPS' : 'MY_SOLITAIRE_SHOPS',
//       updateData: [shopId],
//     },
//     success: (res) => {},
//     fail: () => {
//       wx.showToast({
//         title: (way === 'SHOP') ?
//           '添加地摊失败' : '添加接龙店铺失败',
//         icon: 'none'
//       })
//       console.error
//     }
//   });
// }

// export const doPurchase = (way, orders, userId, userName) => { //确定提交订单   way:'SHOP','SOLITAIRE',  orders:[{}]
//   orders && orders.forEach((order) => {
//     let updatedOrder = {
//       ...order,
//       authId: userId,
//       status: 'UN_PROCESSED',
//       buyerId: userId,
//       buyerName: userName,
//       createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
//     };
//     let collection = (way === 'SHOP') ?
//       'orders' : 'solitaireOrders'
//     wx.cloud.callFunction({
//       name: 'add_data',
//       data: {
//         collection: collection,
//         newItem: updatedOrder
//       },
//       success: (r) => {
//         order && order.productList &&
//           order.productList.forEach((it) => {
//             !(it.product.stock === null) &&
//             updateProductStock(it);
//           })
//         addOrderToUser(way, r.result._id, userId);
//         addOrderToShop(way, r.result._id, order.shopId);
//       },
//       fail: () => {
//         wx.showToast({
//           title: '提交订单失败',
//           icon: 'none'
//         })
//         console.error
//       }
//     });
//   })
// }

// const updateProductStock = (item) => { //提交交订单后减少库存
//   console.log('updateProductStock', item);
//   wx.cloud.callFunction({
//     name: 'inc_data',
//     data: {
//       collection: 'products',
//       operatedItem: 'STOCK',
//       queryTerm: {
//         _id: item.product._id
//       },
//       incNum: Number(-item.quantity)
//     },
//     success: (res) => {},
//     fail: console.error
//   });

// }

// const addOrderToUser = (way, orderId, userId) => { //把单号加到用户
//   wx.cloud.callFunction({
//     name: 'push_data',
//     data: {
//       collection: 'users',
//       queryTerm: {
//         unionid: userId
//       },
//       operatedItem: (way === 'SHOP') ?
//         'ORDERS' : 'SOLITAIRE_ORDERS',
//       updateData: [orderId]
//     },
//     success: (res) => {},
//     fail: () => {
//       wx.showToast({
//         title: '添加单号失败',
//         icon: 'none'
//       })
//       console.error
//     }
//   });

// }

// const addOrderToShop = (orderId, shopId) => { //把单号加到店铺
//   wx.cloud.callFunction({
//     name: 'push_data',
//     data: {
//       collection: 'shops',
//       queryTerm: {
//         _id: shopId
//       },
//       operatedItem: 'ORDERS',
//       updateData: [orderId]
//     },
//     success: (res) => {
//       wx.showToast({
//         title: '提交订单成功',
//         icon: 'none'
//       })
//     },
//     fail: () => {
//       wx.showToast({
//         title: '发送单号给店铺失败',
//         icon: 'none'
//       })
//       console.error
//     }
//   });

// }

//message
// export const sendMessage = (messages, authId) => { //发message
//   console.log('sendMessage', messages);
//   let updatedMsg = {
//     ...messages,
//     authId: authId,
//     createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
//     status: 'UNREAD'
//   };
//   wx.cloud.callFunction({
//     name: 'add_data',
//     data: {
//       collection: 'messages',
//       newItem: updatedMsg
//     },
//     success: (res) => {
//       let msgId = res.result._id
//       addMsgToUsers(msgId, messages.from.unionid, messages.to.unionid);
//     },
//     fail: () => {
//       wx.showToast({
//         title: '发送信息失败',
//         icon: 'none'
//       })
//       console.error
//     }
//   });
// }

// const addMsgToUsers = (msgId, formId, toId) => { //把msg的_id添加到发送者和接受者
//   wx.cloud.callFunction({
//     name: 'push_data',
//     data: {
//       collection: 'users',
//       queryTerm: {
//         unionid: formId
//       },
//       operatedItem: 'MSG_SENT',
//       updateData: [msgId]
//     },
//     success: (res) => {},
//     fail: () => {
//       wx.showToast({
//         title: '发送信息失败',
//         icon: 'none'
//       })
//       console.error
//     }
//   });

//   wx.cloud.callFunction({
//     name: 'push_data',
//     data: {
//       collection: 'users',
//       queryTerm: {
//         unionid: toId
//       },
//       operatedItem: 'MSG_RECEIVED',
//       updateData: [msgId]
//     },
//     success: (res) => {},
//     fail: () => {
//       wx.showToast({
//         title: '发送信息失败',
//         icon: 'none'
//       })
//       console.error
//     }
//   });
// }

// //shop announcement
// export const sendShopAnno = async (shopId, anno) => { //*目前是只能有一个公告
//   console.log('anno', anno);
//   return await wx.cloud.callFunction({
//     name: 'update_data',
//     data: {
//       collection: 'shops',
//       queryTerm: {
//         _id: shopId
//       },
//       updateData: {
//         announcements: [anno]
//       }
//     },
//     success: (res) => {
//       wx.showToast({
//         title: '发布公告成功',
//         icon: 'none'
//       })
//     },
//     fail: (err) => {
//       console.log('err', err);
//       wx.showToast({
//         title: '发布公告失败',
//         icon: 'none'
//       })
//       console.error
//     }
//   });

// }

// //order announcement
// export const addAnnoToOrder = (order, anno) => {
//   wx.cloud.callFunction({
//     name: 'push_data',
//     data: {
//       collection: 'orders',
//       queryTerm: {
//         _id: order._id
//       },
//       operatedItem: 'ANNOS',
//       updateData: [anno]
//     },
//     success: (res) => {
//       wx.showToast({
//         title: '发布公告到订单：' + order._id + '成功',
//         icon: 'none'
//       })
//     },
//     fail: () => {
//       wx.showToast({
//         title: '添加公告到订单：' + order._id + '失败',
//         icon: 'none'
//       })
//       console.error
//     }
//   });
// }
// // place:{place:'',palceDetail:''}或{line:'',station:''}
// export const addOrderAnnoToShop = async (shopId, announcement, pickUpWay, place, date) => {
//   console.log('addOrderAnnoToShop,', shopId, announcement, pickUpWay, place, date);
//   let updated = null;
//   switch (pickUpWay) {
//     case 'SELF_PICK_UP':
//       wx.cloud.callFunction({
//         name: 'get_data',
//         data: {
//           collection: 'shops',
//           queryTerm: {
//             _id: shopId
//           }
//         },
//         success: (res) => {
//           if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
//             return
//           }
//           updated = (res.result.data[0].pickUpWay && res.result.data[0].pickUpWay.selfPickUp &&
//             res.result.data[0].pickUpWay.selfPickUp.list) ? res.result.data[0].pickUpWay.selfPickUp.list : [];
//           let index_1 = updated.findIndex((it) => {
//             return ((it.place == place.place) && (it.placeDetail == place.placeDetail))
//           });
//           console.log('index_1', index_1);
//           if (index_1 > -1) {
//             if (!(updated[index_1].announcements)) {
//               updated.splice(index_1, 1, {
//                 ...updated[index_1],
//                 announcements: [],
//               })
//             }
//             let announcements = updated[index_1].announcements;
//             let index_2 = (announcements && announcements.length > 0) ? announcements.findIndex((anno) => {
//               return (anno.date == date);
//             }) : -1;
//             if (index_2 > -1) {
//               updated[index_1].announcements[index_2].list.push(announcement);
//             } else {
//               updated[index_1].announcements.push({
//                 date: date,
//                 list: [announcement]
//               });
//             }
//           };
//           console.log('发布公告成功', updated);
//           if (updated && updated.length > 0) {
//             wx.cloud.callFunction({
//               name: 'update_data',
//               data: {
//                 collection: 'shops',
//                 queryTerm: {
//                   _id: shopId
//                 },
//                 updateData: {
//                   pickUpWay: {
//                     selfPickUp: {
//                       list: updated
//                     }
//                   }
//                 }
//               },
//               success: (res) => {
//                 wx.showToast({
//                   title: '发布公告成功',
//                   icon: 'none'
//                 })
//               },
//               fail: () => {
//                 wx.showToast({
//                   title: '发布公告失败',
//                   icon: 'none'
//                 })
//                 console.error
//               }
//             });
//           }
//         },
//         fail: () => {
//           wx.showToast({
//             title: '获取数据失败',
//             icon: 'none'
//           })
//           console.error
//         }
//       });

//       break;
//     case 'STATION_PICK_UP': //*unfinished 如果发整条线anno，只能发到最后一个车站，因为前一个发成功前就取了旧数据
//       wx.cloud.callFunction({
//         name: 'get_data',
//         data: {
//           collection: 'shops',
//           queryTerm: {
//             _id: shopId
//           }
//         },
//         success: (res) => {
//           if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
//             return;
//           }
//           updated = res.result.data[0].pickUpWay.stationPickUp.list;
//           let index_1 = updated && updated.length > 0 ? updated.findIndex((it) => {
//             return ((it.line == place.line))
//           }) : -1;
//           if (index_1 > -1) {
//             let stations = updated[index_1].stations.list || [];
//             let index_2 = stations.length > 0 ? stations.findIndex((station) => {
//               return (station.station == place.station)
//             }) : -1;
//             if (index_2 > -1) {
//               if (!(stations[index_2].announcements)) {
//                 stations.splice(index_2, 1, {
//                   ...stations[index_2],
//                   announcements: [],
//                 });
//                 updated.splice(index_1, 1, {
//                   ...updated[index_1],
//                   stations: {
//                     ...updated[index_1].stations,
//                     list: stations,
//                   }
//                 })
//               }
//               let announcements = stations[index_2].announcements;
//               let index_3 = (announcements && announcements.length > 0) ? announcements.findIndex((anno) => {
//                 return (anno.date == date);
//               }) : -1;
//               console.log('announcements', announcements, 'index_3', index_3);
//               if (index_3 > -1) {
//                 updated[index_1].stations.list[index_2].
//                 announcements[index_3].list.push(announcement);
//               } else {
//                 updated[index_1].stations.list[index_2].
//                 announcements.push({
//                   date: date,
//                   list: [announcement]
//                 });
//               }
//             }
//             console.log('发布公告成功', updated);
//             if (updated && updated.length > 0) {
//               wx.cloud.callFunction({
//                 name: 'update_data',
//                 data: {
//                   collection: 'shops',
//                   queryTerm: {
//                     _id: shopId
//                   },
//                   updateData: {
//                     pickUpWay: {
//                       stationPickUp: {
//                         list: updated
//                       }
//                     }
//                   }
//                 },
//                 success: (res) => {
//                   wx.showToast({
//                     title: '发布公告成功',
//                     icon: 'none'
//                   })
//                 },
//                 fail: () => {
//                   wx.showToast({
//                     title: '发布公告失败',
//                     icon: 'none'
//                   })
//                   console.error
//                 }
//               });
//             }
//           }
//         },
//         fail: () => {
//           wx.showToast({
//             title: '获取公告数据失败',
//             icon: 'none'
//           })
//           console.error
//         }
//       });
//       break;
//     default:
//       break;
//   }

// }

// export const getOrderAnnos = async (order) => {
//   let annos = [];
//   if (order.pickUpWay.way === 'SELF_PICK_UP') {
//     let res = await wx.cloud.callFunction({
//       name: 'get_data',
//       data: {
//         collection: 'shops',
//         queryTerm: {
//           _id: order.shopId
//         }
//       }
//     });
//     if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
//       return
//     }
//     let list = res.result.data[0].pickUpWay.selfPickUp.list;
//     let index_1 = (list && list.length > 0) ? list.findIndex((it) => {
//       return ((it.place == order.pickUpWay.place.place) &&
//         (it.placeDetail == order.pickUpWay.place.placeDetail))
//     }) : -1;
//     if (index_1 > -1) {
//       let announcements = list[index_1].announcements || [];
//       let index_2 = (announcements.length > 0) ? announcements.findIndex((item) => {
//         return (item.date == order.pickUpWay.date);
//       }) : -1;
//       annos = (index_2 > -1) ? announcements[index_2].list : [];
//     };
//     // console.log('getOrderAnnos', annos);
//     return annos;
//   } else if (order.pickUpWay.way === 'STATION_PICK_UP') {
//     let res = await wx.cloud.callFunction({
//       name: 'get_data',
//       data: {
//         collection: 'shops',
//         queryTerm: {
//           _id: order.shopId
//         }
//       }
//     });
//     if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
//       return
//     }
//     let list = res.result.data[0].pickUpWay.stationPickUp.list;
//     let index_1 = (list && list.length > 0) ? list.findIndex((it) => {
//       return ((it.line == order.pickUpWay.place.line))
//     }) : -1;
//     if (index_1 > -1) {
//       let stations = list[index_1].stations.list || [];
//       let index_2 = stations.length > 0 ? stations.findIndex((station) => {
//         return (station.station == order.pickUpWay.place.station)
//       }) : -1;
//       if (index_2 > -1) {
//         let announcements = stations[index_2].announcements || [];
//         let index_3 = (announcements.length > 0) ? announcements.findIndex((item) => {
//           return (item.date == order.pickUpWay.date);
//         }) : -1;
//         annos = (index_3 > -1) ? announcements[index_3].list : [];
//       }
//       // console.log('getOrderAnnos--', annos);
//       return annos;
//     }
//   }
// }
