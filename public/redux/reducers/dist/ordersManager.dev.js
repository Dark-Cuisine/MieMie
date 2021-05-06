"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ordersManager;

var actionsType = _interopRequireWildcard(require("../constants/ordersManager"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//订单管理
var INITIAL_STATE = {
  newOrders: [],
  //购物车里所有的订单
  newOrder: {
    shopId: '',
    shopName: '',
    productList: [],
    //{ product: Obj, quantity: '' }
    pickUpWay: {
      way: '',
      place: {},
      //{place:'',placeDetail:''} or {line:'',station:'',des:''} or { name: '', tel: '', address: '' }
      date: '',
      time: '',
      des: ''
    },
    paymentOption: {
      option: '',
      account: '',
      //卖家账户
      des: ''
    },
    totalPrice: '',
    status: '' //'UN_PURCHASE','UN_PROCESSED','ACCEPTED','REJECTED','FINISHED'

  },
  // choosenOrders: [], //被选中准备提交订单的订单
  isOutOfStock: false //订单里是否有超出库存的商品

};

var countTotalPrice = function countTotalPrice(newOrder) {
  //计算一个订单的总价。 返回值为添加了totalPrice属性的order
  var totalPrice = 0;
  newOrder.productList.forEach(function (it) {
    totalPrice += it.product.price * it.quantity;
  });
  return _objectSpread({}, newOrder, {
    totalPrice: totalPrice
  });
};

var setSolitaireOrders = function setSolitaireOrders(state, action) {
  console.log('t-000', action.solitaireOrder);
  var productList = action.solitaireOrder && action.solitaireOrder.productList;

  if (!(productList && productList.length > 0)) {
    return _objectSpread({}, state);
  }

  var newOrder = countTotalPrice(_objectSpread({
    shopId: productList[0].product.shopId,
    shopName: productList[0].product.shopName
  }, action.solitaireOrder));
  console.log('t-newOrder', newOrder);
  return _objectSpread({}, state, {
    newOrder: newOrder,
    newOrders: [newOrder]
  });
};

var changeProductQuantity = function changeProductQuantity(state, action) {
  var updatedNewOrders = state.newOrders; // Object.assign(updatedNewOrders, state.newOrders);

  var currentOrderIndex = state.newOrders.findIndex(function (it) {
    //找有没添加过该店商品
    return it.shopId == action.product.shopId;
  }); // let newOrder = {} //*unfinished 用Object.assign应该能解决init时数组不会自己清空的问题，但只是这里这样写会导致不能更新，还得改后面的才能用
  // Object.assign(newOrder, INITIAL_STATE.newOrder)

  var newOrder = INITIAL_STATE.newOrder;
  newOrder = currentOrderIndex > -1 ? //如已添加过该店商品，则修改该店铺订单，否则新建订单
  updatedNewOrders.splice(currentOrderIndex)[0] : _objectSpread({}, newOrder, {
    productList: [],
    //*problem init时数组不会自己清空，还得拿出来手动清空
    shopId: action.product.shopId,
    shopName: action.product.shopName
  });
  var productIndex = newOrder.productList.findIndex(function (it) {
    return it.product._id == action.product._id;
  });

  if (productIndex < 0) {
    //如果还没此商品，则添加
    newOrder.productList.push({
      product: action.product,
      quantity: action.quantity
    });
    updatedNewOrders.push(countTotalPrice(newOrder));
  } else if (action.quantity == 0) {
    //如果已有此商品，且数量变为0，则删除
    newOrder.productList.splice(productIndex, 1);

    if (newOrder.productList.length > 0) {
      //如果删除后还有该店铺商品才push回去，否则原地丢掉
      updatedNewOrders.push(countTotalPrice(newOrder));
    }
  } else {
    //如果已有此商品，且数量不变为0，则改数量
    newOrder.productList.splice(productIndex, 1, _objectSpread({}, newOrder.productList[productIndex], {
      quantity: action.quantity
    }));
    updatedNewOrders.push(countTotalPrice(newOrder));
  }

  ;
  return _objectSpread({}, state, {
    newOrders: updatedNewOrders
  });
};

var initOrders = function initOrders(state, action) {
  if (action.shopId) {
    //init单个店铺的order
    var updatedNewOrders = state.newOrders;
    var currentOrderIndex = state.newOrders.findIndex(function (it) {
      //找该店order
      return it.shopId == action.shopId;
    });
    updatedNewOrders.splice(currentOrderIndex, 1);
    return _objectSpread({}, state, {
      newOrders: updatedNewOrders //*注: 不能在这直接用state.newOrders.splice(currentOrderIndex, 1)不然会被删掉两个

    });
  } else {
    //init所有order
    return _objectSpread({}, INITIAL_STATE, {
      newOrders: [],
      newOrder: {
        shopId: '',
        shopName: '',
        productList: [],
        pickUpWay: {
          way: '',
          place: {},
          date: '',
          time: '',
          des: ''
        },
        paymentOption: {
          option: '',
          account: '',
          des: ''
        },
        totalPrice: '',
        status: ''
      },
      choosenOrders: []
    });
  }
};

function ordersManager() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case actionsType.CHANGE_PRODUCT_QUANTITY:
      return changeProductQuantity(state, action);

    case actionsType.INIT_ORDERS:
      return initOrders(state, action);

    case actionsType.SET_SOLITAIRE_ORDER:
      return setSolitaireOrders(state, action);

    case actionsType.TOGGLE_IS_OUT_OF_STOCK:
      return _objectSpread({}, state, {
        isOutOfStock: action.isOutOfStock
      });

    default:
      return state;
  }
}