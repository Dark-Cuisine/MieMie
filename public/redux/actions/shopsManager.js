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

//set筛选条件+筛选店铺
//option要更新的项目种类: 'SHOP_KIND','PICK_UP_WAY','SET_STATIONS'
//shopKind筛选店铺类型: {shopKindLarge:'',shopKindSmall:''}
//pickUpWay筛选提货方式: (所有提货方式储存在云数据库classifications里)
//stations车站
export const filterShops = (option, shopKind, pickUpWay, stations, classifications) => {
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

  //筛选店铺类型
  let filterOptionAndList = [];
  let filterOptionOrList = [];
  shopKind && //筛掉'ALL'的情况
    !(shopKind.shopKindLarge == classifications.shopKinds.shopKindLarge[0]) &&
    filterOptionAndList.push({
      shopInfo: {
        shopKinds: {
          shopKindLarge: shopKind.shopKindLarge,
        }
      }
    });
  shopKind && //筛掉'ALL'的情况
    !(shopKind.shopKindSmall == classifications.shopKinds.shopKindSmall[0].shopKindSmall[0]) &&
    filterOptionAndList.push({
      shopInfo: {
        shopKinds: {
          shopKindSmall: shopKind.shopKindSmall
        }
      }
    });

  //筛选提货方法、车站
  let selfPickUpIndex = pickUpWay.indexOf(classifications.pickUpWayList[0])
  let stationsPickUpIndex = pickUpWay.indexOf(classifications.pickUpWayList[1])
  let expressPickUpIndex = pickUpWay.indexOf(classifications.pickUpWayList[2])
  selfPickUpIndex > -1 && stations && stations.stations && //设置了车站, 且勾选了'自提点'
    stations.stations.list && stations.stations.list.length > 0 &&
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
  stationsPickUpIndex > -1 && stations && stations.stations && //设置了车站, 且勾选了'车站提货'
    stations.stations.list && stations.stations.list.length > 0 && stations.stations.list.length > 0 &&
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
  ((stations && stations.stations && stations.stations.list && stations.stations.list.length > 0) ||
    (selfPickUpIndex < 0 && stationsPickUpIndex < 0)) && //设置了车站or其他两个选项都没被勾选时,才查询是否可邮寄//*unfinished没设置车站时应该禁止那两个选项button
  expressPickUpIndex > -1 &&
    filterOptionOrList.push({
      expressPickUp: {
        isAble: true,
      }
    });

  filterOptionOrList.length > 0 && filterOptionAndList.push({ //如果orlist不为空，则放入andlist
    pickUpWay: _.or(filterOptionOrList)
  })
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
    if (filterOptionAndList.length > 0) {//如筛选条件不为空，则筛选
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
    } else {//如筛选条件为空，则显示全部店铺（unfinished 还是全都不显示比较好？
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