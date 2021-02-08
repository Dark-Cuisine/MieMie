import * as actionsTypes from '../constants/userManager'
import * as layoutActionsTypes from '../constants/layoutManager'

const db = wx.cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

export const setUser = (openid, unionid) => {
  return dispatch => {
    dispatch({
      type: layoutActionsTypes.TOGGLE_LOADING_SPINNER,
      ifOpen: true,
    });

    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'users',
        queryTerm: {
          unionid: unionid
        }
      },
      success: (res) => {
        dispatch({
          type: layoutActionsTypes.TOGGLE_LOADING_SPINNER,
          ifOpen: false,
        });

        if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
          dispatch({
            type: actionsTypes.SET_USER,
            openid: '',
            unionid: '',
            userInfo: {}
          })
        } else {
          dispatch({
            type: actionsTypes.SET_USER,
            openid: openid,
            unionid: unionid,
            userInfo: res.result.data[0]
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '获取用户数据失败',
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


export const handleMarkOrder = (userId, itemId, markNum = null, cancelMarkNum = null) => {
  let operatedItem = null;
  let operatedItem_Cancel = null;

  operatedItem = (markNum === 'A') ? 'MARKED_ORDERS_A' :
    ((markNum === 'B') ? 'MARKED_ORDERS_B' :
      (markNum === 'C') ? 'MARKED_ORDERS_C' : null)
  operatedItem_Cancel = (cancelMarkNum === 'A') ? 'MARKED_ORDERS_A' :
    ((cancelMarkNum === 'B') ? 'MARKED_ORDERS_B' :
      (cancelMarkNum === 'C') ? 'MARKED_ORDERS_C' : null)

  return dispatch => {
    wx.cloud.callFunction({
      name: 'push_data',
      data: {
        collection: 'users',
        queryTerm: {
          unionid: userId
        },
        operatedItem: operatedItem,
        updateData: [itemId],
      },
      success: (res) => {
        (markNum === 'A') &&
        wx.showToast({
          title: '已标记订单',
        })
      },
      fail: () => {
        wx.showToast({
          title: '标记订单失败',
        })
        console.error
      }
    });
    wx.cloud.callFunction({
      name: 'pull_data',
      data: {
        collection: 'users',
        queryTerm: {
          unionid: userId
        },
        operatedItem: operatedItem_Cancel,
        updateData: itemId,
      },
      success: (res) => {
        (cancelMarkNum === 'C') &&
        wx.showToast({
          title: '已取消标记',
        })
      },
      fail: () => {
        wx.showToast({
          title: '取消标记订单失败',
        })
        console.error
      }
    });
    dispatch({ //*problem 那么早改变状态在快速连续点击时可能会出问题
      type: actionsTypes.HANDLE_MARK_ORDER,
      markNum: markNum,
      cancelMarkNum: cancelMarkNum,
      itemId: itemId,
    });
  }
}
//way:'SHOP'
export const handleMark = (way, userId, itemId, ifMark) => {
  let operatedItem = null;
  let successWord = null;
  let failWord = null;
  switch (way) {
    case 'SHOP':
      operatedItem = 'MARKED_SHOPS'
      failWord = ifMark ? '添加收藏失败' : '取消收藏失败'
      break;
    default:
      break;
  }

  return dispatch => {
    if (ifMark) {
      wx.cloud.callFunction({
        name: 'push_data',
        data: {
          collection: 'users',
          queryTerm: {
            unionid: userId
          },
          operatedItem: operatedItem,
          updateData: [itemId],
        },
        success: (res) => {
          successWord &&
            wx.showToast({
              title: successWord,
            })
          // console.log('handleMark', res, 'userId', userId, 'itemId', itemId);
        },
        fail: () => {
          failWord &&
            wx.showToast({
              title: failWord,
            })
          console.error
        }
      });
    } else {
      wx.cloud.callFunction({
        name: 'pull_data',
        data: {
          collection: 'users',
          queryTerm: {
            unionid: userId
          },
          operatedItem: operatedItem,
          updateData: itemId,
        },
        success: (res) => {
          successWord &&
            wx.showToast({
              title: successWord,
            })
        },
        fail: () => {
          failWord &&
            wx.showToast({
              title: failWord,
            })
          console.error
        }
      });
    };
    dispatch({ //*problem 那么早改变状态在快速连续点击时可能会出问题
      type: actionsTypes.HANDLE_MARK,
      way: way,
      itemId: itemId,
      ifMark: ifMark,
    });
  }
}