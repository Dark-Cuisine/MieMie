"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleIsOutOfStock = exports.setSolitaireOrders = exports.initOrders = exports.changeProductQuantity = void 0;

var actionsTypes = _interopRequireWildcard(require("../constants/ordersManager"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var db = wx.cloud.database();
var _ = db.command;

var changeProductQuantity = function changeProductQuantity(product, quantity) {
  //改变购物车里此商品的数量 
  return {
    type: actionsTypes.CHANGE_PRODUCT_QUANTITY,
    product: product,
    quantity: quantity
  };
};

exports.changeProductQuantity = changeProductQuantity;

var initOrders = function initOrders() {
  var shopId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  //提交订单后从购物车删掉该店铺订单
  return {
    type: actionsTypes.INIT_ORDERS,
    shopId: shopId
  };
};

exports.initOrders = initOrders;

var setSolitaireOrders = function setSolitaireOrders(solitaireOrder) {
  //设定订单，用于接龙
  return {
    type: actionsTypes.SET_SOLITAIRE_ORDER,
    solitaireOrder: solitaireOrder
  };
};

exports.setSolitaireOrders = setSolitaireOrders;

var toggleIsOutOfStock = function toggleIsOutOfStock() {
  var isOutOfStock = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  //toggle订单里是否有超出库存的商品
  return {
    type: actionsTypes.TOGGLE_IS_OUT_OF_STOCK,
    isOutOfStock: isOutOfStock
  };
};

exports.toggleIsOutOfStock = toggleIsOutOfStock;