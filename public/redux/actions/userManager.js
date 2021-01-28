import * as actionsTypes from '../constants/userManager'
import * as publicActionsTypes from '../constants/publicManager'

const db = wx.cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

export const setUser = (openid, unionid) => {
  return dispatch => {
    dispatch({
      type: publicActionsTypes.TOGGLE_LOADING_SPINNER,
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
          type: publicActionsTypes.TOGGLE_LOADING_SPINNER,
          ifOpen: false,
        });

        console.log('setUser', res);
        if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
          dispatch({
            type: actionsTypes.SET_USER,
            openid: '',
            unionid: '',
            userInfo: {}
          })
        }
        dispatch({
          type: actionsTypes.SET_USER,
          openid: openid,
          unionid: unionid,
          userInfo: res.result.data[0]
        })
      },
      fail: () => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        dispatch({
          type: publicActionsTypes.TOGGLE_LOADING_SPINNER,
          ifOpen: false,
        });
        console.error
      }
    });
  }
}




//way:'SHOP','ORDER'
export const handleMark = (way, userId, itemId, ifMark) => {
  let operatedItem = null;
  let successWord = null;
  let failWord = null;
  switch (way) {
    case 'SHOP':
      operatedItem = 'MARKED_SHOPS'
      failWord = ifMark ? '添加收藏失败' : '取消收藏失败'
      break;
    case 'ORDER':
      operatedItem = 'MARKED_ORDERS'
      successWord = ifMark ? '已标记订单' : '已取消标记'
      failWord = ifMark ? '标记订单失败' : '取消标记订单失败'
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
              icon: 'none'
            })
          console.log('handleMark', res, 'userId', userId, 'itemId', itemId);
        },
        fail: () => {
          failWord &&
            wx.showToast({
              title: failWord,
              icon: 'none'
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
              icon: 'none'
            })
        },
        fail: () => {
          failWord &&
            wx.showToast({
              title: failWord,
              icon: 'none'
            })
          console.error
        }
      });
    };
    dispatch({//*problem 那么早改变状态在快速连续点击时可能会出问题
      type: actionsTypes.HANDLE_MARK,
      way: way,
      itemId: itemId,
      ifMark: ifMark,
    });
  }
}