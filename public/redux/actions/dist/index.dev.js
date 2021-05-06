"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "initShops", {
  enumerable: true,
  get: function get() {
    return _shopsManager.initShops;
  }
});
Object.defineProperty(exports, "filterShops", {
  enumerable: true,
  get: function get() {
    return _shopsManager.filterShops;
  }
});
Object.defineProperty(exports, "setSearchedShopList", {
  enumerable: true,
  get: function get() {
    return _shopsManager.setSearchedShopList;
  }
});
Object.defineProperty(exports, "setSearchedProductList", {
  enumerable: true,
  get: function get() {
    return _shopsManager.setSearchedProductList;
  }
});
Object.defineProperty(exports, "setCurrentShopId", {
  enumerable: true,
  get: function get() {
    return _shopsManager.setCurrentShopId;
  }
});
Object.defineProperty(exports, "setUser", {
  enumerable: true,
  get: function get() {
    return _userManager.setUser;
  }
});
Object.defineProperty(exports, "handleMark", {
  enumerable: true,
  get: function get() {
    return _userManager.handleMark;
  }
});
Object.defineProperty(exports, "handleMarkOrder", {
  enumerable: true,
  get: function get() {
    return _userManager.handleMarkOrder;
  }
});
Object.defineProperty(exports, "changeProductQuantity", {
  enumerable: true,
  get: function get() {
    return _ordersManager.changeProductQuantity;
  }
});
Object.defineProperty(exports, "initOrders", {
  enumerable: true,
  get: function get() {
    return _ordersManager.initOrders;
  }
});
Object.defineProperty(exports, "toggleIsOutOfStock", {
  enumerable: true,
  get: function get() {
    return _ordersManager.toggleIsOutOfStock;
  }
});
Object.defineProperty(exports, "setSolitaireOrders", {
  enumerable: true,
  get: function get() {
    return _ordersManager.setSolitaireOrders;
  }
});
Object.defineProperty(exports, "changeTabBarTab", {
  enumerable: true,
  get: function get() {
    return _layoutManager.changeTabBarTab;
  }
});
Object.defineProperty(exports, "toggleHideMode", {
  enumerable: true,
  get: function get() {
    return _layoutManager.toggleHideMode;
  }
});
Object.defineProperty(exports, "toggleLoadingSpinner", {
  enumerable: true,
  get: function get() {
    return _layoutManager.toggleLoadingSpinner;
  }
});
Object.defineProperty(exports, "toggleMarkMsgButton", {
  enumerable: true,
  get: function get() {
    return _layoutManager.toggleMarkMsgButton;
  }
});
Object.defineProperty(exports, "judgeIfMarkMsgButton", {
  enumerable: true,
  get: function get() {
    return _layoutManager.judgeIfMarkMsgButton;
  }
});
Object.defineProperty(exports, "userGuideNextStep", {
  enumerable: true,
  get: function get() {
    return _layoutManager.userGuideNextStep;
  }
});

var _shopsManager = require("./shopsManager");

var _userManager = require("./userManager");

var _ordersManager = require("./ordersManager");

var _layoutManager = require("./layoutManager");

require("./publicManager");