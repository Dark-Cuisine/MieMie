"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

exports.__esModule = true;
exports.addSolitaireOrderToSolitaire = exports.addSolitaireToSolitaireShop = exports.modifySolitaireShop = exports.modifySolitaire = exports.addSolitaireOrder = exports.addNewSolitaire = exports.addNewSoltaireShop = void 0;

var dayjs_1 = require("dayjs");

var product_functions = require("./product_functions");

var user_functions = require("./user_functions");

var shop_functions = require("./shop_functions"); //和solitaire\solitaireShop有关的 database functions
//添加新solitaireShop。现在每个user只能有一个solitaireShop，所以这个函数只在第一次创建接龙时使用。
//authId:创建者unionid
//newSolitaire:{} ,新的solitaire(*注：是solitaire不是solitaireShop)
//newProducts:[]


exports.addNewSoltaireShop = function (authId, newSolitaire, newProducts) {
  if (newSolitaire === void 0) {
    newSolitaire = null;
  }

  if (newProducts === void 0) {
    newProducts = null;
  }

  return __awaiter(void 0, void 0, void 0, function () {
    var res, solitaireShopId;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          console.log('addNewSoltaireShop-' + newSolitaire, newProducts);
          return [4
          /*yield*/
          , wx.cloud.callFunction({
            name: 'add_data',
            data: {
              collection: 'solitaireShops',
              newItem: {
                authId: authId,
                createTime: dayjs_1["default"]().format('YYYY-MM-DD HH:mm:ss'),
                solitaires: []
              }
            }
          })];

        case 1:
          res = _a.sent();

          if (!(res && res.result)) {
            return [2
            /*return*/
            ];
          }

          solitaireShopId = res.result._id;
          exports.addNewSolitaire(authId, solitaireShopId, newSolitaire, newProducts);
          return [4
          /*yield*/
          , user_functions.addShopToUser('SOLITAIRE', solitaireShopId, authId)];

        case 2:
          _a.sent();

          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.addNewSolitaire = function (authId, solitaireShopId, solitaire, newProductList) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      wx.cloud.callFunction({
        name: 'add_data',
        data: {
          collection: 'solitaires',
          newItem: __assign(__assign({}, solitaire), {
            authId: authId,
            createTime: dayjs_1["default"]().format('YYYY-MM-DD HH:mm:ss'),
            solitaireShopId: solitaireShopId
          })
        },
        success: function success(res) {
          if (!(res && res.result)) {
            //*注：这里不是res.result.data
            return;
          }

          console.log("添加solitaire成功", res);
          var solitaireId = res.result._id;
          exports.addSolitaireToSolitaireShop(solitaireId, solitaireShopId);
          product_functions.addNewProducts('SOLITAIRE', newProductList, solitaireShopId, '接龙店', authId, solitaireId);
        },
        fail: function fail() {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          });
          console.error;
        }
      });
      return [2
      /*return*/
      ];
    });
  });
}; //新建接龙订单


exports.addSolitaireOrder = function (solitaireOrder, userId, userName) {
  return __awaiter(void 0, void 0, void 0, function () {
    var updatedOrder, collection;
    return __generator(this, function (_a) {
      updatedOrder = __assign(__assign({}, solitaireOrder), {
        authId: userId,
        status: 'UN_PROCESSED',
        buyerId: userId,
        buyerName: userName,
        createTime: dayjs_1["default"]().format('YYYY-MM-DD HH:mm:ss')
      });
      collection = 'solitaireOrders';
      wx.cloud.callFunction({
        name: 'add_data',
        data: {
          collection: collection,
          newItem: updatedOrder
        },
        success: function success(r) {
          solitaireOrder && solitaireOrder.productList && solitaireOrder.productList.forEach(function (it) {
            !(it.product.stock === null) && product_functions.updateProductStock(it);
          });
          user_functions.addOrderToUser(r.result._id, userId);
          shop_functions.addOrderToShop(r.result._id, solitaireOrder.solitaireId);
        },
        fail: function fail() {
          wx.showToast({
            title: '提交订单失败',
            icon: 'none'
          });
          console.error;
        }
      });
      return [2
      /*return*/
      ];
    });
  });
};

exports.modifySolitaire = function (solitaire, products, deletedProducts) {
  return __awaiter(void 0, void 0, void 0, function () {
    var solitaireId, existingProducts, newProducts, existingProductIds;
    return __generator(this, function (_a) {
      solitaireId = solitaire._id;
      delete solitaire._id; //* must delete '_id', or you can't update successfully!!

      existingProducts = [];
      newProducts = [];
      products.forEacch(function (it) {
        it.id ? existingProducts.push(it) : newProducts.push(it);
      });
      existingProductIds = existingProducts.map(function (it) {
        return it._id;
      });
      wx.cloud.callFunction({
        name: 'update_data',
        data: {
          collection: 'solitaires',
          queryTerm: {
            _id: solitaireId
          },
          updateData: {
            updateTime: dayjs_1["default"]().format('YYYY-MM-DD HH:mm:ss'),
            products: __assign(__assign({}, solitaire.products), {
              productList: existingProductIds
            })
          }
        },
        success: function success(res) {
          console.log('modifySolitaire-products', products);
          existingProducts.forEach(function (it) {
            product_functions.modifyProduct(it);
          });
          product_functions.addNewProducts('SHOP', newProducts, solitaire.solitaireShopId, shop.shopInfo.shopName, shop.authId);
          product_functions.deleteProducts(deletedProducts);
        },
        fail: function fail() {
          wx.showToast({
            title: '更新店铺失败'
          });
          console.error;
        }
      });
      exports.modifySolitaireShop();
      return [2
      /*return*/
      ];
    });
  });
};

exports.modifySolitaireShop = function (solitaireShopId, products, deletedProducts) {
  return __awaiter(void 0, void 0, void 0, function () {
    var shopId;
    return __generator(this, function (_a) {
      shopId = shop._id;
      delete shop._id; //* must delete '_id', or you can't update successfully!!

      return [2
      /*return*/
      ];
    });
  });
};

exports.addSolitaireToSolitaireShop = function (solitaireId, solitaireShopId) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      console.log('addSolitaireToSolitaireShop', solitaireId, solitaireShopId);
      wx.cloud.callFunction({
        name: 'push_data',
        data: {
          collection: 'solitaireShops',
          queryTerm: {
            _id: solitaireShopId
          },
          operatedItem: 'SOLITAIRES',
          updateData: [solitaireId]
        },
        success: function success(res) {},
        fail: function fail() {
          wx.showToast({
            title: '添加接龙到接龙店铺失败'
          });
          console.error;
        }
      });
      return [2
      /*return*/
      ];
    });
  });
};

exports.addSolitaireOrderToSolitaire = function (orderId, solitaireId) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      console.log('addSolitaireOrderToSolitaire', orderId, solitaireId);
      wx.cloud.callFunction({
        name: 'push_data',
        data: {
          collection: 'solitaires',
          queryTerm: {
            _id: solitaireId
          },
          operatedItem: 'SOLITAIRE_ORDERS',
          updateData: [orderId]
        },
        success: function success(res) {},
        fail: function fail() {
          wx.showToast({
            title: '添加接龙订单到接龙失败'
          });
          console.error;
        }
      });
      return [2
      /*return*/
      ];
    });
  });
};