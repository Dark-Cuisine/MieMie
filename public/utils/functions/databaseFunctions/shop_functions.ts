import dayjs from 'dayjs'
import * as product_functions from './product_functions'
import * as user_functions from './user_functions'


//和 shop有关的 database functions

//添加新shop 
//authId:创建者unionid
//newShop:{},新的shop对象
//newProducts:[]
export const addNewShop = async (authId, newShop, newProducts = null) => {
  console.log('addNewShop-' + newShop, newProducts);
  let res = await wx.cloud.callFunction({
    name: 'add_data',
    data: {
      collection: 'shops',
      newItem: {
        authId: authId,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        ...newShop
      }
    },
  });
  if (!(res && res.result)) {
    return
  }
  console.log("添加店铺成功", res);
  let shopId = res.result._id
  product_functions.addNewProducts('SHOP', newProducts, shopId,
    newShop.shopInfo.shopName, authId);
  await user_functions.addShopToUser('SHOP', shopId, authId);

  // wx.cloud.callFunction({
  //   name: 'add_data',
  //   data: {
  //     collection: 'shops',
  //     newItem: {
  //       authId: authId,
  //       createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  //       ...newShop
  //     }
  //   },
  //   success: (res) => {
  //     console.log("添加店铺成功", res);
  //     if (!(res && res.result)) {
  //       return
  //     }
  //     let shopId = res.result._id
  //     product_functions.addNewProducts('SHOP', newProducts, shopId,
  //       newShop.shopInfo.shopName, authId);
  //     user_functions.addShopToUser('SHOP', shopId, authId);
  //   },
  //   fail: () => {
  //     wx.showToast({
  //       title: '添加地摊失败',
  //     })
  //     console.error
  //   }
  // });
}

//改店
//（products是已经剔除过deletedProducts的list）
export const modifyShop = async (shop, products, deletedProducts) => {
  let shopId = shop._id; //* don't forget to save _id first!!!!
  delete shop._id; //* must delete '_id', or you can't update successfully!!

  let updatedProductIdList = [];
  shop && shop.products && shop.products.productList &&
    shop.products.productList.forEach((it) => { //去掉被删除的product
      let index = deletedProducts.findIndex((item) => {
        return (it.id == item._id)
      });
      index < 0 && updatedProductIdList.push({ id: it })
    })
  let updatedShop = {
    ...shop,
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    products: {
      ...shop.products,
      productList: updatedProductIdList,
    }
  }

  wx.cloud.callFunction({
    name: 'update_data',
    data: {
      collection: 'shops',
      queryTerm: {
        _id: shopId
      },
      updateData: updatedShop
    },
    success: (res) => {
      console.log('modifyShop-products', products);
      products && products.forEach((it) => {
        it._id ?
          product_functions.modifyProduct(it) :
          product_functions.addNewProducts('SHOP', [it], shopId, shop.shopInfo.shopName, shop.authId);
      });
      product_functions.deleteProducts(deletedProducts);
    },
    fail: () => {
      wx.showToast({
        title: '更新店铺失败',
      })
      console.error
    }
  });
}
//删除shop（solitaireShop无法被删除）
export const deleteShop = async (shop, ownerId) => {
  console.log('deleteShop', shop);
  // return
  if (shop.products.productList.length > 0) {
    let idList = []
    shop.products.productList.forEach(it => {
      idList.push(it.id)
    })

    wx.cloud.callFunction({
      name: 'remove_data',
      data: {
        collection: 'products',
        removeOption: 'MULTIPLE',
        operatedItem: '_ID',
        removeList: idList,
      },
      success: (res) => { },
      fail: () => {
        wx.showToast({
          title: '删除商品失败',
          icon: 'none'
        })
        console.error
      }
    });

  }

  wx.cloud.callFunction({
    name: 'remove_data',
    data: {
      collection: 'shops',
      removeOption: 'SINGLE',
      queryTerm: {
        _id: shop._id
      },
    },
    success: (res) => { },
    fail: () => {
      wx.showToast({
        title: '删除地摊失败',
        icon: 'none'
      })
      console.error
    }
  });

  wx.cloud.callFunction({
    name: 'pull_data',
    data: {
      collection: 'users',
      queryTerm: {
        unionid: ownerId
      },
      operatedItem: 'MY_SHOPS',
      updateData: shop._id
    },
    success: (res) => { },
    fail: () => {
      wx.showToast({
        title: '获取user shops数据失败',
        icon: 'none'
      })
      console.error
    }
  });
}

export const addProductIdToShop = (way, productId, shopId) => { //把商品id添加到所属店铺
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
        icon: 'none'
      })
      console.error
    }
  });

}

export const addOrderToShop = (orderId, shopId) => { //把单号加到店铺
  wx.cloud.callFunction({
    name: 'push_data',
    data: {
      collection: 'shops',
      queryTerm: {
        _id: shopId
      },
      operatedItem: 'ORDERS',
      updateData: [orderId]
    },
    success: (res) => {
      wx.showToast({
        title: '提交订单成功',
        icon: 'none'
      })
    },
    fail: () => {
      wx.showToast({
        title: '发送单号给店铺失败',
        icon: 'none'
      })
      console.error
    }
  });

}

//shop announcement
export const sendShopAnno = async (shopId, anno) => { //*目前是只能有一个公告
  console.log('anno', anno);
  return await wx.cloud.callFunction({
    name: 'update_data',
    data: {
      collection: 'shops',
      queryTerm: {
        _id: shopId
      },
      updateData: {
        announcements: [anno]
      }
    },
    success: (res) => {
      wx.showToast({
        title: '发布公告成功',
        icon: 'none'
      })
    },
    fail: (err) => {
      console.log('err', err);
      wx.showToast({
        title: '发布公告失败',
        icon: 'none'
      })
      console.error
    }
  });

}

// place:{place:'',palceDetail:''}或{line:'',station:''}
export const addOrderAnnoToShop = async (shopId, announcement, pickUpWay, place, date) => {
  console.log('addOrderAnnoToShop,', shopId, announcement, pickUpWay, place, date);
  let updated = null;
  switch (pickUpWay) {
    case 'SELF_PICK_UP':
      wx.cloud.callFunction({
        name: 'get_data',
        data: {
          collection: 'shops',
          queryTerm: {
            _id: shopId
          }
        },
        success: (res) => {
          if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
            return
          }
          updated = (res.result.data[0].pickUpWay && res.result.data[0].pickUpWay.selfPickUp &&
            res.result.data[0].pickUpWay.selfPickUp.list) ? res.result.data[0].pickUpWay.selfPickUp.list : [];
          let index_1 = updated.findIndex((it) => {
            return ((it.place == place.place) && (it.placeDetail == place.placeDetail))
          });
          console.log('index_1', index_1);
          if (index_1 > -1) {
            if (!(updated[index_1].announcements)) {
              updated.splice(index_1, 1, {
                ...updated[index_1],
                announcements: [],
              })
            }
            let announcements = updated[index_1].announcements;
            let index_2 = (announcements && announcements.length > 0) ? announcements.findIndex((anno) => {
              return (anno.date == date);
            }) : -1;
            if (index_2 > -1) {
              updated[index_1].announcements[index_2].list.push(announcement);
            } else {
              updated[index_1].announcements.push({
                date: date,
                list: [announcement]
              });
            }
          };
          console.log('发布公告成功', updated);
          if (updated && updated.length > 0) {
            wx.cloud.callFunction({
              name: 'update_data',
              data: {
                collection: 'shops',
                queryTerm: {
                  _id: shopId
                },
                updateData: {
                  pickUpWay: {
                    selfPickUp: {
                      list: updated
                    }
                  }
                }
              },
              success: (res) => {
                wx.showToast({
                  title: '发布公告成功',
                  icon: 'none'
                })
              },
              fail: () => {
                wx.showToast({
                  title: '发布公告失败',
                  icon: 'none'
                })
                console.error
              }
            });
          }
        },
        fail: () => {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          })
          console.error
        }
      });


      break;
    case 'STATION_PICK_UP': //*unfinished 如果发整条线anno，只能发到最后一个车站，因为前一个发成功前就取了旧数据
      wx.cloud.callFunction({
        name: 'get_data',
        data: {
          collection: 'shops',
          queryTerm: {
            _id: shopId
          }
        },
        success: (res) => {
          if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
            return;
          }
          updated = res.result.data[0].pickUpWay.stationPickUp.list;
          let index_1 = updated && updated.length > 0 ? updated.findIndex((it) => {
            return ((it.line == place.line))
          }) : -1;
          if (index_1 > -1) {
            let stations = updated[index_1].stations.list || [];
            let index_2 = stations.length > 0 ? stations.findIndex((station) => {
              return (station.station == place.station)
            }) : -1;
            if (index_2 > -1) {
              if (!(stations[index_2].announcements)) {
                stations.splice(index_2, 1, {
                  ...stations[index_2],
                  announcements: [],
                });
                updated.splice(index_1, 1, {
                  ...updated[index_1],
                  stations: {
                    ...updated[index_1].stations,
                    list: stations,
                  }
                })
              }
              let announcements = stations[index_2].announcements;
              let index_3 = (announcements && announcements.length > 0) ? announcements.findIndex((anno) => {
                return (anno.date == date);
              }) : -1;
              console.log('announcements', announcements, 'index_3', index_3);
              if (index_3 > -1) {
                updated[index_1].stations.list[index_2].
                  announcements[index_3].list.push(announcement);
              } else {
                updated[index_1].stations.list[index_2].
                  announcements.push({
                    date: date,
                    list: [announcement]
                  });
              }
            }
            console.log('发布公告成功', updated);
            if (updated && updated.length > 0) {
              wx.cloud.callFunction({
                name: 'update_data',
                data: {
                  collection: 'shops',
                  queryTerm: {
                    _id: shopId
                  },
                  updateData: {
                    pickUpWay: {
                      stationPickUp: {
                        list: updated
                      }
                    }
                  }
                },
                success: (res) => {
                  wx.showToast({
                    title: '发布公告成功',
                    icon: 'none'
                  })
                },
                fail: () => {
                  wx.showToast({
                    title: '发布公告失败',
                    icon: 'none'
                  })
                  console.error
                }
              });
            }
          }
        },
        fail: () => {
          wx.showToast({
            title: '获取公告数据失败',
            icon: 'none'
          })
          console.error
        }
      });
      break;
    default:
      break;
  }

}
