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
exports.cancelSolitaireOrder = exports.modifySolitaireOrder = exports.doPurchase = void 0;
var dayjs_1 = require("dayjs");
var product_functions = require("./product_functions");
var user_functions = require("./user_functions");
var solitaire_functions = require("./solitaire_functions");
exports.doPurchase = function (order) { return __awaiter(void 0, void 0, void 0, function () {
    var r, orderId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('doPurchase-solitaire', order);
                return [4 /*yield*/, wx.cloud.callFunction({
                        name: 'add_data',
                        data: {
                            collection: 'solitaireOrders',
                            newItem: order
                        }
                    })];
            case 1:
                r = _a.sent();
                order && order.productList &&
                    order.productList.forEach(function (it) {
                        !(it.product.stock === null) &&
                            product_functions.updateProductStock(it);
                    });
                orderId = r.result._id;
                return [4 /*yield*/, user_functions.addSolitaireOrderToUser(orderId, order.solitaireId, order.authId)];
            case 2:
                _a.sent();
                solitaire_functions.addSolitaireOrderToSolitaire(orderId, order.solitaireId);
                return [2 /*return*/];
        }
    });
}); };
exports.modifySolitaireOrder = function (solitaireOrder) { return __awaiter(void 0, void 0, void 0, function () {
    var old, res_2, les;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('p-modifySolitaireOrder', solitaireOrder);
                old = null //用来在修改接龙时调整数据库商品数量
                ;
                return [4 /*yield*/, wx.cloud.callFunction({
                        name: 'get_data',
                        data: {
                            collection: 'solitaireOrders',
                            queryTerm: { _id: solitaireOrder._id }
                        }
                    })];
            case 1:
                res_2 = _a.sent();
                if ((res_2 && res_2.result && res_2.result.data && res_2.result.data.length > 0)) {
                    old = res_2.result.data[0];
                }
                les = wx.cloud.callFunction({
                    name: 'update_data',
                    data: {
                        collection: 'solitaireOrders',
                        queryTerm: {
                            _id: solitaireOrder._id
                        },
                        updateData: __assign(__assign({}, solitaireOrder), { updateTime: dayjs_1["default"]().format('YYYY-MM-DD HH:mm:ss') })
                    }
                });
                old && old.productList && //先加回库存
                    old.productList.forEach(function (it) {
                        !(it.product.stock === null) &&
                            product_functions.updateProductStock(__assign(__assign({}, it), { quantity: Number(-it.quantity) }));
                    });
                solitaireOrder && solitaireOrder.productList && //再减库存
                    solitaireOrder.productList.forEach(function (it) {
                        !(it.product.stock === null) &&
                            product_functions.updateProductStock(it);
                    });
                return [2 /*return*/];
        }
    });
}); };
exports.cancelSolitaireOrder = function (solitaireOrderId) { return __awaiter(void 0, void 0, void 0, function () {
    var solitaireOrder, res_2, res_3, res_4, res_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('p-cancelSolitaireOrder', solitaireOrderId);
                solitaireOrder = null;
                return [4 /*yield*/, wx.cloud.callFunction({
                        name: 'get_data',
                        data: {
                            collection: 'solitaireOrders',
                            queryTerm: { _id: solitaireOrderId }
                        }
                    })];
            case 1:
                res_2 = _a.sent();
                if ((res_2 && res_2.result && res_2.result.data && res_2.result.data.length > 0)) {
                    solitaireOrder = res_2.result.data[0];
                }
                solitaireOrder && solitaireOrder.productList && //加回库存
                    solitaireOrder.productList.forEach(function (it) {
                        !(it.product.stock === null) &&
                            product_functions.updateProductStock(__assign(__assign({}, it), { quantity: Number(-it.quantity) }));
                    });
                res_3 = wx.cloud.callFunction({
                    name: 'remove_data',
                    data: {
                        collection: 'solitaireOrders',
                        removeOption: 'SINGLE',
                        queryTerm: {
                            _id: solitaireOrderId
                        }
                    }
                });
                if (!(solitaireOrder && solitaireOrder.authId)) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, wx.cloud.callFunction({
                        name: 'pull_data',
                        data: {
                            collection: 'users',
                            queryTerm: {
                                unionid: solitaireOrder.authId
                            },
                            operatedItem: 'SOLITAIRE_ORDER',
                            updateData: solitaireOrder.solitaireId
                        }
                    })];
            case 2:
                res_4 = _a.sent();
                res_5 = wx.cloud.callFunction({
                    name: 'pull_data',
                    data: {
                        collection: 'solitaires',
                        queryTerm: {
                            _id: solitaireOrder.solitaireId
                        },
                        operatedItem: 'SOLITAIRE_ORDER',
                        updateData: solitaireOrderId
                    }
                });
                return [2 /*return*/];
        }
    });
}); };
