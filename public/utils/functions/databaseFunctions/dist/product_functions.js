"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.updateProductStock = exports.deleteProducts = exports.modifyProduct = exports.addProductIdToSolitaire = exports.addProductIdToShop = exports.addNewProducts = void 0;
var dayjs_1 = require("dayjs");
exports.addNewProducts = function (way, newProductList, shopId, shopName, authId, solitaireId) {
    if (solitaireId === void 0) { solitaireId = null; }
    return __awaiter(void 0, void 0, void 0, function () {
        var _i, newProductList_1, porduct, updatedProduct, res, productId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('addNewProducts', way, newProductList, shopId, shopName, authId);
                    _i = 0, newProductList_1 = newProductList;
                    _a.label = 1;
                case 1:
                    if (!(_i < newProductList_1.length)) return [3 /*break*/, 4];
                    porduct = newProductList_1[_i];
                    updatedProduct = __assign(__assign({}, porduct), { authId: authId, shopId: shopId, shopName: shopName, createTime: dayjs_1["default"]().format('YYYY-MM-DD HH:mm:ss'), updateTime: dayjs_1["default"]().format('YYYY-MM-DD HH:mm:ss') });
                    return [4 /*yield*/, wx.cloud.callFunction({
                            name: 'add_data',
                            data: {
                                collection: 'products',
                                newItem: updatedProduct
                            }
                        })];
                case 2:
                    res = _a.sent();
                    if (!(res && res.result)) {
                        wx.showToast({
                            title: '添加商品失败'
                        });
                        return [2 /*return*/, null];
                    }
                    else {
                        productId = res.result._id;
                        if (way === 'RETURN_ID') { //此时返回id，不添加到店铺或接龙
                            return [2 /*return*/, productId];
                        }
                        exports.addProductIdToShop(way, productId, shopId);
                        way === 'SOLITAIRE' &&
                            exports.addProductIdToSolitaire(way, productId, solitaireId);
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.addProductIdToShop = function (way, productId, shopId) {
    console.log('addProductIdToShop', way, productId, shopId);
    wx.cloud.callFunction({
        name: 'push_data',
        data: {
            collection: (way === 'SHOP') ? 'shops' : 'solitaireShops',
            queryTerm: {
                _id: shopId
            },
            operatedItem: 'PRODUCT_ID_LIST',
            updateData: [{
                    id: productId
                }]
        },
        success: function (res) { },
        fail: function () {
            wx.showToast({
                title: '添加商品失败'
            });
            console.error;
        }
    });
};
exports.addProductIdToSolitaire = function (way, productId, solitaireId) {
    console.log('addProductIdToSolitaire', way, productId, solitaireId);
    wx.cloud.callFunction({
        name: 'push_data',
        data: {
            collection: 'solitaires',
            queryTerm: {
                _id: solitaireId
            },
            operatedItem: 'PRODUCT_ID_LIST',
            updateData: [{
                    id: productId
                }]
        },
        success: function (res) { },
        fail: function () {
            wx.showToast({
                title: '添加商品失败'
            });
            console.error;
        }
    });
};
exports.modifyProduct = function (product) { return __awaiter(void 0, void 0, void 0, function () {
    var c1, db_1, _, $, productId, newStock, updatedProduct;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                c1 = new wx.cloud.Cloud({
                    resourceAppid: 'wx8d82d7c90a0b3eda',
                    resourceEnv: 'miemie-buyer-7gemmgzh05a6c577'
                });
                return [4 /*yield*/, c1.init({
                        resourceAppid: 'wx8d82d7c90a0b3eda',
                        resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
                        secretId: 'AKIDwiHc09xCF3cwDFrESWOHxNZXLCfvRL2W',
                        secretKey: 'XZfka5K83yeKnAcBCShS4SgS3cBXfXBs',
                        env: 'miemie-buyer-7gemmgzh05a6c577'
                    })];
            case 1:
                _a.sent();
                db_1 = c1.database({
                    env: 'miemie-buyer-7gemmgzh05a6c577'
                });
                _ = db_1.command;
                $ = db_1.command.aggregate;
                productId = product._id;
                delete product._id; //* must delete '_id', or you can't update successfully!!
                newStock = (product.stock === null) ? {
                    stock: null
                } :
                    (product.updatedStock.way == 'ADD' ? {
                        stock: _.inc(Number(product.updatedStock.quantity))
                    } :
                        (product.updatedStock.way == 'SUBTRACT' ? {
                            stock: _.inc(Number(-product.updatedStock.quantity))
                        } : {
                            stock: Number(product.stock)
                        }));
                updatedProduct = __assign(__assign(__assign({}, product), newStock), { updatedStock: {
                        way: '',
                        quantity: 0
                    } });
                // console.log('modifyProduct-updatedProduct', updatedProduct);
                // wx.cloud.callFunction({//*problem 带_command的好像传不进云函数
                //   name: 'update_data',
                //   data: {
                //     collection: 'products',
                //     queryTerm: {
                //       _id: productId
                //     },
                //     updateData: updatedProduct
                //   },
                //   success: (res) => {},
                //   fail: console.error
                // });
                // if(product.stock === null){return}
                // wx.cloud.callFunction({
                //   name: 'inc_data',
                //   data: {
                //     collection: 'products',
                //     operatedItem: 'STOCK',
                //     queryTerm: {
                //       _id: productId
                //     },
                //     incNum: Number(product.updatedStock.way == 'ADD' ?
                //       product.updatedStock.quantity : -product.updatedStock.quantity)
                //   },
                //   success: (res) => {},
                //   fail: console.error
                // });
                db_1.collection('products')
                    .where({
                    _id: productId
                })
                    .update({
                    data: updatedProduct
                });
                return [2 /*return*/];
        }
    });
}); };
exports.deleteProducts = function (deletedProducts) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, deletedProducts_1, it, res;
    return __generator(this, function (_a) {
        if (!(deletedProducts && deletedProducts.length > 0)) {
            return [2 /*return*/];
        }
        for (_i = 0, deletedProducts_1 = deletedProducts; _i < deletedProducts_1.length; _i++) {
            it = deletedProducts_1[_i];
            res = wx.cloud.callFunction({
                name: 'remove_data',
                data: {
                    collection: 'products',
                    removeOption: 'SINGLE',
                    queryTerm: {
                        _id: it._id
                    }
                }
            });
        }
        return [2 /*return*/];
    });
}); };
exports.updateProductStock = function (item) {
    console.log('updateProductStock', item);
    wx.cloud.callFunction({
        name: 'inc_data',
        data: {
            collection: 'products',
            operatedItem: 'STOCK',
            queryTerm: {
                _id: item.product._id
            },
            incNum: Number(-item.quantity)
        },
        success: function (res) { },
        fail: console.error
    });
};
