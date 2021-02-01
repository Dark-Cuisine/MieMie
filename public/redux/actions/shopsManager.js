import * as actionsTypes from '../constants/shopsManager'
import * as layoutActionsTypes from '../constants/layoutManager'


const db = wx.cloud.database();
const _ = db.command

export const initShops = () => { //初始化店铺list
  return dispatch => {
    dispatch({
      type: layoutActionsTypes.TOGGLE_LOADING_SPINNER,
      ifOpen: true,
    });

    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'shops',
      },
      success: (res) => {
        dispatch({
          type: actionsTypes.SET_SHOP_LIST,
          shopList: (res && res.result && res.result.data) ? res.result.data : []
        });
        dispatch({
          type: layoutActionsTypes.TOGGLE_LOADING_SPINNER,
          ifOpen: false,
        });
      },
      fail: () => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        dispatch({
          type: layoutActionsTypes.TOGGLE_LOADING_SPINNER,
          ifOpen: false,
        });
        console.error
      }
    });

  }
}
export const filterShops = (option, shopKind, pickUpWay, stations, classifications) => { //set筛选条件+筛选店铺
  let updatedItem = null;
  switch (option) {
    case 'SHOP_KIND':
      updatedItem = shopKind;
      break;
    case 'PICK_UP_WAY':
      updatedItem = pickUpWay;
      break;
    case 'SET_STATIONS':
      updatedItem = stations;
      break;
    default:
      break;
  }
  //
  let filterOptionAndList = [];
  let filterOptionOrList = [];
  shopKind && !(shopKind.shopKindLarge == classifications.shopKinds.shopKindLarge[0]) &&
    filterOptionAndList.push({
      shopInfo: {
        shopKinds: {
          shopKindLarge: shopKind.shopKindLarge,
        }
      }
    });
  shopKind && !(shopKind.shopKindSmall == classifications.shopKinds.shopKindSmall[0].shopKindSmall[0]) &&
    filterOptionAndList.push({
      shopInfo: {
        shopKinds: {
          shopKindSmall: shopKind.shopKindSmall
        }
      }
    });
  let selfPickUpIndex = pickUpWay.indexOf(classifications.pickUpWayList[0])
  let stationsPickUpIndex = pickUpWay.indexOf(classifications.pickUpWayList[1])
  let expressPickUpIndex = pickUpWay.indexOf(classifications.pickUpWayList[2])
  stations && stations.stations && stations.stations.list && stations.stations.list.length > 0 &&
    selfPickUpIndex > -1 && stations.stations.list.length > 0 &&
    filterOptionOrList.push({
      selfPickUp: {
        list: _.elemMatch({
          nearestStation: {
            stations: {
              list: _.in(stations.stations.list) //查询时只查车站不查路线 unfinished 不知道加不加路线好
            }
          }
        })
      }
    });
  stations && stations.stations && stations.stations.list && stations.stations.list.length > 0 &&
    stationsPickUpIndex > -1 && stations.stations.list.length > 0 &&
    filterOptionOrList.push({
      stationPickUp: {
        list: _.elemMatch({
          stations: {
            list: _.elemMatch({
              station: _.in(stations.stations.list)
            })
          }
        })
      }
    });
  ((stations && stations.stations && stations.stations.list &&
      stations.stations.list.length > 0) ||
    (selfPickUpIndex < 0 && stationsPickUpIndex < 0)) && //设置了车站or其他两个选项都没被勾选时,才查询是否可邮寄//*unfinished没设置车站时应该禁止那两个选项button
  expressPickUpIndex > -1 &&
    filterOptionOrList.push({
      expressPickUp: {
        isAble: true,
      }
    });
  filterOptionOrList.length > 0 && filterOptionAndList.push({
    pickUpWay: _.or(filterOptionOrList)
  })
  //

  return dispatch => {
    dispatch({
      type: layoutActionsTypes.TOGGLE_LOADING_SPINNER,
      ifOpen: true,
    });

    //*problem:不知为何云函数里拿到的data是空的，但是直接小程序里filter_shops却能正常拿到data

    // wx.cloud.callFunction({
    //   name: 'filter_shops',
    //   data: {
    //     shopKind: shopKind,
    //     pickUpWay: pickUpWay,
    //     stations: stations,
    //   },
    //   success: (res) => {
    //     dispatch({
    //       type: actionsTypes.SET_FILTER_OPTION,
    //       option: option,
    //       updatedItem: updatedItem
    //     });
    //     dispatch({
    //       type: actionsTypes.SET_SHOP_LIST,
    //       shopList: res.result ? res.result.data : [],
    //     });
    //     dispatch({
    //       type: layoutActionsTypes.TOGGLE_LOADING_SPINNER,
    //       ifOpen: false,
    //     });
    //   },
    //   fail: console.error
    // });
    // console.log('filterOptionAndList,',filterOptionAndList);
    if (filterOptionAndList.length > 0) {
      console.log('set filtered shops');
      db.collection('shops').where(
        _.and(filterOptionAndList)).get().then((res) => {
        dispatch({
          type: actionsTypes.SET_FILTER_OPTION,
          option: option,
          updatedItem: updatedItem
        });
        dispatch({
          type: actionsTypes.SET_SHOP_LIST,
          shopList: res.data
        });
        dispatch({
          type: layoutActionsTypes.TOGGLE_LOADING_SPINNER,
          ifOpen: false,
        });
        //console.log('filterOptionAndList',filterOptionAndList);
      })
    } else {
      db.collection('shops').get().then((res) => {
        dispatch({
          type: actionsTypes.SET_FILTER_OPTION,
          option: option,
          updatedItem: updatedItem
        });
        dispatch({
          type: actionsTypes.SET_SHOP_LIST,
          shopList: res.data
        });
        dispatch({
          type: layoutActionsTypes.TOGGLE_LOADING_SPINNER,
          ifOpen: false,
        });
      });
    }
  }
}


export const setSearchedShopList = (shopList) => { //set查找出的shops
  return {
    type: actionsTypes.SET_SEARCHED_SHOP_LIST,
    shopList: shopList
  };
};
export const setSearchedProductList = (productList) => { //set查找出的products 
  return {
    type: actionsTypes.SET_SEARCHED_PRODUCT_LIST,
    productList: productList
  };
};

export const setCurrentShopId = (shopId) => { //set当前店铺id
  return {
    type: actionsTypes.SET_CURRENT_SHOP_ID,
    currentShopId: shopId
  }
}