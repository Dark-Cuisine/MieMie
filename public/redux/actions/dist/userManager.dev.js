"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleMark = exports.handleMarkOrder = exports.setUser = void 0;

var actionsTypes = _interopRequireWildcard(require("../constants/userManager"));

var layoutActionsTypes = _interopRequireWildcard(require("../constants/layoutManager"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var db = wx.cloud.database();
var _ = db.command;
var $ = db.command.aggregate;

var setUser = function setUser(unionid) {
  var openid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return function (dispatch) {
    dispatch({
      type: layoutActionsTypes.TOGGLE_LOADING_SPINNER,
      ifOpen: true
    });
    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'users',
        queryTerm: {
          unionid: unionid
        }
      },
      success: function success(res) {
        dispatch({
          type: layoutActionsTypes.TOGGLE_LOADING_SPINNER,
          ifOpen: false
        });

        if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
          dispatch({
            type: actionsTypes.SET_USER,
            openid: '',
            unionid: '',
            userInfo: {}
          });
        } else {
          dispatch({
            type: actionsTypes.SET_USER,
            openid: openid,
            unionid: unionid,
            userInfo: res.result.data[0]
          });
        }
      },
      fail: function fail() {
        wx.showToast({
          title: '获取用户数据失败'
        });
        dispatch({
          type: layoutActionsTypes.TOGGLE_LOADING_SPINNER,
          ifOpen: false
        });
        console.error;
      }
    });
  };
};

exports.setUser = setUser;

var handleMarkOrder = function handleMarkOrder(userId, itemId) {
  var markNum = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var cancelMarkNum = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var operatedItem = null;
  var operatedItem_Cancel = null;
  operatedItem = markNum === 'A' ? 'MARKED_ORDERS_A' : markNum === 'B' ? 'MARKED_ORDERS_B' : markNum === 'C' ? 'MARKED_ORDERS_C' : null;
  operatedItem_Cancel = cancelMarkNum === 'A' ? 'MARKED_ORDERS_A' : cancelMarkNum === 'B' ? 'MARKED_ORDERS_B' : cancelMarkNum === 'C' ? 'MARKED_ORDERS_C' : null;
  return function (dispatch) {
    wx.cloud.callFunction({
      name: 'push_data',
      data: {
        collection: 'users',
        queryTerm: {
          unionid: userId
        },
        operatedItem: operatedItem,
        updateData: [itemId]
      },
      success: function success(res) {
        markNum === 'A' && wx.showToast({
          title: '已标记订单'
        });
      },
      fail: function fail() {
        wx.showToast({
          title: '标记订单失败'
        });
        console.error;
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
        updateData: itemId
      },
      success: function success(res) {
        cancelMarkNum === 'C' && wx.showToast({
          title: '已取消标记'
        });
      },
      fail: function fail() {
        wx.showToast({
          title: '取消标记订单失败'
        });
        console.error;
      }
    });
    dispatch({
      //*problem 那么早改变状态在快速连续点击时可能会出问题
      type: actionsTypes.HANDLE_MARK_ORDER,
      markNum: markNum,
      cancelMarkNum: cancelMarkNum,
      itemId: itemId
    });
  };
}; //way:'SHOP'


exports.handleMarkOrder = handleMarkOrder;

var handleMark = function handleMark(way, userId, itemId, ifMark) {
  var operatedItem = null;
  var successWord = null;
  var failWord = null;

  switch (way) {
    case 'SHOP':
      operatedItem = 'MARKED_SHOPS';
      failWord = ifMark ? '添加收藏失败' : '取消收藏失败';
      break;

    default:
      break;
  }

  return function (dispatch) {
    if (ifMark) {
      wx.cloud.callFunction({
        name: 'push_data',
        data: {
          collection: 'users',
          queryTerm: {
            unionid: userId
          },
          operatedItem: operatedItem,
          updateData: [itemId]
        },
        success: function success(res) {
          successWord && wx.showToast({
            title: successWord
          }); // console.log('handleMark', res, 'userId', userId, 'itemId', itemId);
        },
        fail: function fail() {
          failWord && wx.showToast({
            title: failWord
          });
          console.error;
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
          updateData: itemId
        },
        success: function success(res) {
          successWord && wx.showToast({
            title: successWord
          });
        },
        fail: function fail() {
          failWord && wx.showToast({
            title: failWord
          });
          console.error;
        }
      });
    }

    ;
    dispatch({
      //*problem 那么早改变状态在快速连续点击时可能会出问题
      type: actionsTypes.HANDLE_MARK,
      way: way,
      itemId: itemId,
      ifMark: ifMark
    });
  };
};

exports.handleMark = handleMark;