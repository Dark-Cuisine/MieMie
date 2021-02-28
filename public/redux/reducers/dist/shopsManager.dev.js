"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = shopsManager;

var actionsTypes = _interopRequireWildcard(require("../constants/shopsManager"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var INITIAL_STATE = {
  shopList: [],
  //筛选出的shops
  productList: [],
  //筛选出的products 
  searchedShopList: [],
  //查找出的shops
  searchedProductList: [],
  //查找出的products 
  currentShopId: '',
  //*for test
  filterOptions: {
    //筛选条件
    shopKind: null,
    //{shopKindLarge:'',shopKindSmall:''}
    pickUpWay: null,
    stations: {
      line: '',
      stations: {
        list: [],
        from: '',
        to: ''
      }
    } //{line:'',stations:{list:[''],from:'',to:''}}

  }
};

var setFilterOption = function setFilterOption(state, action) {
  switch (action.option) {
    case 'SHOP_KIND':
      return _objectSpread({}, state, {
        filterOptions: _objectSpread({}, state.filterOptions, {
          shopKind: action.updatedItem
        })
      });
      break;

    case 'PICK_UP_WAY':
      return _objectSpread({}, state, {
        filterOptions: _objectSpread({}, state.filterOptions, {
          pickUpWay: action.updatedItem
        })
      });
      break;

    case 'SET_STATIONS':
      return _objectSpread({}, state, {
        filterOptions: _objectSpread({}, state.filterOptions, {
          stations: action.updatedItem
        })
      });
      break;

    default:
      break;
  }
};

function shopsManager() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case actionsTypes.SET_CURRENT_SHOP_ID:
      return _objectSpread({}, state, {
        currentShopId: action.currentShopId
      });

    case actionsTypes.SET_SHOP_LIST:
      return _objectSpread({}, state, {
        shopList: action.shopList
      });

    case actionsTypes.SET_FILTER_OPTION:
      return setFilterOption(state, action);

    case actionsTypes.SET_SEARCHED_SHOP_LIST:
      return _objectSpread({}, state, {
        searchedShopList: action.shopList
      });

    case actionsTypes.SET_SEARCHED_PRODUCT_LIST:
      return _objectSpread({}, state, {
        searchedProductList: action.productList
      });

    default:
      return state;
  }
}