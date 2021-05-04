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
exports.addOrderAnnoToShop = exports.sendShopAnno = exports.addOrderToShop = exports.addProductIdToShop = exports.deleteShop = exports.modifyShop = exports.addNewShop = void 0;
var dayjs_1 = require("dayjs");
var product_functions = require("./product_functions");
var user_functions = require("./user_functions");
//和 shop有关的 database functions
//添加新shop 
//authId:创建者unionid
//newShop:{},新的shop对象
//newProducts:[]
exports.addNewShop = function (authId, newShop, newProducts) {
    if (newProducts === void 0) { newProducts = null; }
    return __awaiter(void 0, void 0, void 0, function () {
        var res, shopId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('addNewShop-' + newShop, newProducts);
                    return [4 /*yield*/, wx.cloud.callFunction({
                            name: 'add_data',
                            data: {
                                collection: 'shops',
                                newItem: __assign({ authId: authId, createTime: dayjs_1["default"]().format('YYYY-MM-DD HH:mm:ss'), updateTime: dayjs_1["default"]().format('YYYY-MM-DD HH:mm:ss') }, newShop)
                            }
                        })];
                case 1:
                    res = _a.sent();
                    if (!(res && res.result)) {
                        return [2 /*return*/];
                    }
                    console.log("添加店铺成功", res);
                    shopId = res.result._id;
                    product_functions.addNewProducts('SHOP', newProducts, shopId, newShop.shopInfo.shopName, authId);
                    return [4 /*yield*/, user_functions.addShopToUser('SHOP', shopId, authId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
//改店
//（products是已经剔除过deletedProducts的list）
exports.modifyShop = function (shop, products, deletedProducts) { return __awaiter(void 0, void 0, void 0, function () {
    var shopId, updatedProductIdList, updatedShop;
    return __generator(this, function (_a) {
        shopId = shop._id;
        delete shop._id; //* must delete '_id', or you can't update successfully!!
        updatedProductIdList = [];
        shop && shop.products && shop.products.productList &&
            shop.products.productList.forEach(function (it) {
                var index = deletedProducts.findIndex(function (item) {
                    return (it.id == item._id);
                });
                index < 0 && updatedProductIdList.push({ id: it });
            });
        updatedShop = __assign(__assign({}, shop), { updateTime: dayjs_1["default"]().format('YYYY-MM-DD HH:mm:ss'), products: __assign(__assign({}, shop.products), { productList: updatedProductIdList }) });
        wx.cloud.callFunction({
            name: 'update_data',
            data: {
                collection: 'shops',
                queryTerm: {
                    _id: shopId
                },
                updateData: updatedShop
            },
            success: function (res) {
                console.log('modifyShop-products', products);
                products && products.forEach(function (it) {
                    it._id ?
                        product_functions.modifyProduct(it) :
                        product_functions.addNewProducts('SHOP', [it], shopId, shop.shopInfo.shopName, shop.authId);
                });
                product_functions.deleteProducts(deletedProducts);
            },
            fail: function () {
                wx.showToast({
                    title: '更新店铺失败'
                });
                console.error;
            }
        });
        return [2 /*return*/];
    });
}); };
//删除shop（solitaireShop无法被删除）
exports.deleteShop = function (shop, ownerId) { return __awaiter(void 0, void 0, void 0, function () {
    var idList_1;
    return __generator(this, function (_a) {
        console.log('deleteShop', shop);
        // return
        if (shop.products.productList.length > 0) {
            idList_1 = [];
            shop.products.productList.forEach(function (it) {
                idList_1.push(it.id);
            });
            wx.cloud.callFunction({
                name: 'remove_data',
                data: {
                    collection: 'products',
                    removeOption: 'MULTIPLE',
                    operatedItem: '_ID',
                    removeList: idList_1
                },
                success: function (res) { },
                fail: function () {
                    wx.showToast({
                        title: '删除商品失败',
                        icon: 'none'
                    });
                    console.error;
                }
            });
        }
        wx.cloud.callFunction({
            name: 'remove_data',
            data: {
                collection: 'shops',
                removeOption: 'SINGLE',
                queryTerm: {
                    _id: shop._id
                }
            },
            success: function (res) { },
            fail: function () {
                wx.showToast({
                    title: '删除地摊失败',
                    icon: 'none'
                });
                console.error;
            }
        });
        wx.cloud.callFunction({
            name: 'pull_data',
            data: {
                collection: 'users',
                queryTerm: {
                    unionid: ownerId
                },
                operatedItem: 'MY_SHOPS',
                updateData: shop._id
            },
            success: function (res) { },
            fail: function () {
                wx.showToast({
                    title: '获取user shops数据失败',
                    icon: 'none'
                });
                console.error;
            }
        });
        return [2 /*return*/];
    });
}); };
exports.addProductIdToShop = function (way, productId, shopId) {
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
                title: '添加商品失败',
                icon: 'none'
            });
            console.error;
        }
    });
};
exports.addOrderToShop = function (orderId, shopId) {
    wx.cloud.callFunction({
        name: 'push_data',
        data: {
            collection: 'shops',
            queryTerm: {
                _id: shopId
            },
            operatedItem: 'ORDERS',
            updateData: [orderId]
        },
        success: function (res) {
            wx.showToast({
                title: '提交订单成功',
                icon: 'none'
            });
        },
        fail: function () {
            wx.showToast({
                title: '发送单号给店铺失败',
                icon: 'none'
            });
            console.error;
        }
    });
};
//shop announcement
exports.sendShopAnno = function (shopId, anno) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('anno', anno);
                return [4 /*yield*/, wx.cloud.callFunction({
                        name: 'update_data',
                        data: {
                            collection: 'shops',
                            queryTerm: {
                                _id: shopId
                            },
                            updateData: {
                                announcements: [anno]
                            }
                        },
                        success: function (res) {
                            wx.showToast({
                                title: '发布公告成功',
                                icon: 'none'
                            });
                        },
                        fail: function (err) {
                            console.log('err', err);
                            wx.showToast({
                                title: '发布公告失败',
                                icon: 'none'
                            });
                            console.error;
                        }
                    })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
// place:{place:'',palceDetail:''}或{line:'',station:''}
exports.addOrderAnnoToShop = function (shopId, announcement, pickUpWay, place, date) { return __awaiter(void 0, void 0, void 0, function () {
    var updated;
    return __generator(this, function (_a) {
        console.log('addOrderAnnoToShop,', shopId, announcement, pickUpWay, place, date);
        updated = null;
        switch (pickUpWay) {
            case 'SELF_PICK_UP':
                wx.cloud.callFunction({
                    name: 'get_data',
                    data: {
                        collection: 'shops',
                        queryTerm: {
                            _id: shopId
                        }
                    },
                    success: function (res) {
                        if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
                            return;
                        }
                        updated = (res.result.data[0].pickUpWay && res.result.data[0].pickUpWay.selfPickUp &&
                            res.result.data[0].pickUpWay.selfPickUp.list) ? res.result.data[0].pickUpWay.selfPickUp.list : [];
                        var index_1 = updated.findIndex(function (it) {
                            return ((it.place == place.place) && (it.placeDetail == place.placeDetail));
                        });
                        console.log('index_1', index_1);
                        if (index_1 > -1) {
                            if (!(updated[index_1].announcements)) {
                                updated.splice(index_1, 1, __assign(__assign({}, updated[index_1]), { announcements: [] }));
                            }
                            var announcements = updated[index_1].announcements;
                            var index_2 = (announcements && announcements.length > 0) ? announcements.findIndex(function (anno) {
                                return (anno.date == date);
                            }) : -1;
                            if (index_2 > -1) {
                                updated[index_1].announcements[index_2].list.push(announcement);
                            }
                            else {
                                updated[index_1].announcements.push({
                                    date: date,
                                    list: [announcement]
                                });
                            }
                        }
                        ;
                        console.log('发布公告成功', updated);
                        if (updated && updated.length > 0) {
                            wx.cloud.callFunction({
                                name: 'update_data',
                                data: {
                                    collection: 'shops',
                                    queryTerm: {
                                        _id: shopId
                                    },
                                    updateData: {
                                        pickUpWay: {
                                            selfPickUp: {
                                                list: updated
                                            }
                                        }
                                    }
                                },
                                success: function (res) {
                                    wx.showToast({
                                        title: '发布公告成功',
                                        icon: 'none'
                                    });
                                },
                                fail: function () {
                                    wx.showToast({
                                        title: '发布公告失败',
                                        icon: 'none'
                                    });
                                    console.error;
                                }
                            });
                        }
                    },
                    fail: function () {
                        wx.showToast({
                            title: '获取数据失败',
                            icon: 'none'
                        });
                        console.error;
                    }
                });
                break;
            case 'STATION_PICK_UP': //*unfinished 如果发整条线anno，只能发到最后一个车站，因为前一个发成功前就取了旧数据
                wx.cloud.callFunction({
                    name: 'get_data',
                    data: {
                        collection: 'shops',
                        queryTerm: {
                            _id: shopId
                        }
                    },
                    success: function (res) {
                        if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
                            return;
                        }
                        updated = res.result.data[0].pickUpWay.stationPickUp.list;
                        var index_1 = updated && updated.length > 0 ? updated.findIndex(function (it) {
                            return ((it.line == place.line));
                        }) : -1;
                        if (index_1 > -1) {
                            var stations = updated[index_1].stations.list || [];
                            var index_2 = stations.length > 0 ? stations.findIndex(function (station) {
                                return (station.station == place.station);
                            }) : -1;
                            if (index_2 > -1) {
                                if (!(stations[index_2].announcements)) {
                                    stations.splice(index_2, 1, __assign(__assign({}, stations[index_2]), { announcements: [] }));
                                    updated.splice(index_1, 1, __assign(__assign({}, updated[index_1]), { stations: __assign(__assign({}, updated[index_1].stations), { list: stations }) }));
                                }
                                var announcements = stations[index_2].announcements;
                                var index_3 = (announcements && announcements.length > 0) ? announcements.findIndex(function (anno) {
                                    return (anno.date == date);
                                }) : -1;
                                console.log('announcements', announcements, 'index_3', index_3);
                                if (index_3 > -1) {
                                    updated[index_1].stations.list[index_2].
                                        announcements[index_3].list.push(announcement);
                                }
                                else {
                                    updated[index_1].stations.list[index_2].
                                        announcements.push({
                                        date: date,
                                        list: [announcement]
                                    });
                                }
                            }
                            console.log('发布公告成功', updated);
                            if (updated && updated.length > 0) {
                                wx.cloud.callFunction({
                                    name: 'update_data',
                                    data: {
                                        collection: 'shops',
                                        queryTerm: {
                                            _id: shopId
                                        },
                                        updateData: {
                                            pickUpWay: {
                                                stationPickUp: {
                                                    list: updated
                                                }
                                            }
                                        }
                                    },
                                    success: function (res) {
                                        wx.showToast({
                                            title: '发布公告成功',
                                            icon: 'none'
                                        });
                                    },
                                    fail: function () {
                                        wx.showToast({
                                            title: '发布公告失败',
                                            icon: 'none'
                                        });
                                        console.error;
                                    }
                                });
                            }
                        }
                    },
                    fail: function () {
                        wx.showToast({
                            title: '获取公告数据失败',
                            icon: 'none'
                        });
                        console.error;
                    }
                });
                break;
            default:
                break;
        }
        return [2 /*return*/];
    });
}); };
