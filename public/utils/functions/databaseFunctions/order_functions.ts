import dayjs from 'dayjs'
import * as product_functions from './product_functions'
import * as user_functions from './user_functions'
import * as msg_functions from './msg_functions'
import * as solitaire_functions from './solitaire_functions'
import * as shop_functions from './shop_functions'

export const doPurchase = async (orders, userId, userName) => { //确定提交订单   way:'SHOP','SOLITAIRE',  orders:[{}]
  for (let order of orders) {
    let updatedOrder = {
      ...order,
      authId: userId,
      status: 'UN_PROCESSED',
      buyerId: userId,
      buyerName: userName,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    let collection = 'orders'
    let r = await wx.cloud.callFunction({
      name: 'add_data',
      data: {
        collection: collection,
        newItem: updatedOrder
      },
    });
    order && order.productList &&
      order.productList.forEach((it) => {
        !(it.product.stock === null) &&
          product_functions.updateProductStock(it);
      })
    await user_functions.addOrderToUser(r.result._id, userId);
    shop_functions.addOrderToShop(r.result._id, order.shopId);

  }

  // orders && orders.forEach((order) => {
  //   let updatedOrder = {
  //     ...order,
  //     authId: userId,
  //     status: 'UN_PROCESSED',
  //     buyerId: userId,
  //     buyerName: userName,
  //     createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  //   };
  //   let collection = 'orders'
  //   wx.cloud.callFunction({
  //     name: 'add_data',
  //     data: {
  //       collection: collection,
  //       newItem: updatedOrder
  //     },
  //     success: (r) => {
  //       order && order.productList &&
  //         order.productList.forEach((it) => {
  //           !(it.product.stock === null) &&
  //             product_functions.updateProductStock(it);
  //         })
  //       user_functions.addOrderToUser( r.result._id, userId);
  //       shop_functions.addOrderToShop(r.result._id, order.shopId);
  //     },
  //     fail: () => {
  //       wx.showToast({
  //         title: '提交订单失败',
  //         icon: 'none'
  //       })
  //       console.error
  //     }
  //   });
  // })
}

//order announcement   
export const addAnnoToOrder = (order, anno) => {
  wx.cloud.callFunction({
    name: 'push_data',
    data: {
      collection: 'orders',
      queryTerm: {
        _id: order._id
      },
      operatedItem: 'ANNOS',
      updateData: [anno]
    },
    success: (res) => {
      wx.showToast({
        title: '发布公告到订单：' + order._id + '成功',
        icon: 'none'
      })
    },
    fail: () => {
      wx.showToast({
        title: '添加公告到订单：' + order._id + '失败',
        icon: 'none'
      })
      console.error
    }
  });
}

export const getOrderAnnos = async (order) => {
  let annos = [];
  if (order.pickUpWay.way === 'SELF_PICK_UP') {
    let res = await wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'shops',
        queryTerm: {
          _id: order.shopId
        }
      }
    });
    if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
      return
    }
    let list = res.result.data[0].pickUpWay.selfPickUp.list;
    let index_1 = (list && list.length > 0) ? list.findIndex((it) => {
      return ((it.place == order.pickUpWay.place.place) &&
        (it.placeDetail == order.pickUpWay.place.placeDetail))
    }) : -1;
    if (index_1 > -1) {
      let announcements = list[index_1].announcements || [];
      let index_2 = (announcements.length > 0) ? announcements.findIndex((item) => {
        return (item.date == order.pickUpWay.date);
      }) : -1;
      annos = (index_2 > -1) ? announcements[index_2].list : [];
    };
    // console.log('getOrderAnnos', annos);
    return annos;
  } else if (order.pickUpWay.way === 'STATION_PICK_UP') {
    let res = await wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'shops',
        queryTerm: {
          _id: order.shopId
        }
      }
    });
    if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
      return
    }
    let list = res.result.data[0].pickUpWay.stationPickUp.list;
    let index_1 = (list && list.length > 0) ? list.findIndex((it) => {
      return ((it.line == order.pickUpWay.place.line))
    }) : -1;
    if (index_1 > -1) {
      let stations = list[index_1].stations.list || [];
      let index_2 = stations.length > 0 ? stations.findIndex((station) => {
        return (station.station == order.pickUpWay.place.station)
      }) : -1;
      if (index_2 > -1) {
        let announcements = stations[index_2].announcements || [];
        let index_3 = (announcements.length > 0) ? announcements.findIndex((item) => {
          return (item.date == order.pickUpWay.date);
        }) : -1;
        annos = (index_3 > -1) ? announcements[index_3].list : [];
      }
      // console.log('getOrderAnnos--', annos);
      return annos;
    }
  }
}

