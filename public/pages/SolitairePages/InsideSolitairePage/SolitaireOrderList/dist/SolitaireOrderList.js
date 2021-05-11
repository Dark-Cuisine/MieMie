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
var react_1 = require("react");
var taro_1 = require("@tarojs/taro");
var react_redux_1 = require("react-redux");
var components_1 = require("@tarojs/components");
var actions = require("../../../../redux/actions");
var tool_functions = require("../../../../utils/functions/tool_functions");
require("./SolitaireOrderList.scss");
/***
 *<SolitaireOrderList
        solitaireOrders={state.solitaire.solitaireOrders}
        mode={}//'SELLER','BUYER'
        type={}//'GOODS','EVENT'
      />
 */
//*unfinished 最好给每个solitaireOrder弄个个位数的接龙号
var SolitaireOrderList = function (props) {
    var dispatch = react_redux_1.useDispatch();
    var userManager = react_redux_1.useSelector(function (state) { return state.userManager; });
    var initState = {
        solitaireOrders: []
    };
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        doUpdate();
    }, [props.solitaireOrders]);
    taro_1.usePullDownRefresh(function () {
        taro_1["default"].stopPullDownRefresh();
    });
    var doUpdate = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch(actions.toggleLoadingSpinner(true));
                    if (!(props.solitaireOrders && props.solitaireOrders.length > 0)) {
                        dispatch(actions.toggleLoadingSpinner(false));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, wx.cloud.callFunction({
                            name: 'get_data',
                            data: {
                                collection: 'solitaireOrders',
                                operatedItem: '_ID',
                                orderBy: 'createTime',
                                desc: 'asc',
                                queriedList: props.solitaireOrders
                            }
                        })];
                case 1:
                    res = _a.sent();
                    if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
                        dispatch(actions.toggleLoadingSpinner(false));
                        return [2 /*return*/];
                    }
                    setState(__assign(__assign({}, state), { solitaireOrders: res.result.data }));
                    dispatch(actions.toggleLoadingSpinner(false));
                    return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement(components_1.View, { className: 'solitaire_orders_list '.concat(props.className) },
        react_1["default"].createElement(components_1.View, { className: 'solitaire_orders_list_item_title' },
            react_1["default"].createElement(components_1.View, { className: 'line_horizontal_bold' }),
            "\u63A5\u9F99\u4E2D\u7684\u4F19\u4F34\u4EEC",
            react_1["default"].createElement(components_1.View, { className: 'line_horizontal_bold' })),
        react_1["default"].createElement(components_1.View, { className: '', style: 'display:flex;flex-direction:column-reverse;' }, state.solitaireOrders.map(function (it, i) {
            return (react_1["default"].createElement(components_1.View, { className: 'solitaire_order_card' },
                react_1["default"].createElement(components_1.View, { className: 'card_head' },
                    react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                        react_1["default"].createElement(components_1.View, { className: 'number' },
                            i,
                            "."),
                        react_1["default"].createElement(components_1.View, { className: '' }, it.buyerName)),
                    react_1["default"].createElement(components_1.View, { className: 'update_time' }, it.updateTime ? it.updateTime : it.createTime)),
                react_1["default"].createElement(components_1.View, { className: 'product_list' }, it.productList && it.productList.map(function (product, i) {
                    return (react_1["default"].createElement(components_1.View, { className: 'product' },
                        react_1["default"].createElement(components_1.View, { className: '' }, product.product.name),
                        react_1["default"].createElement(components_1.View, { className: 'multiplication' }, "x"),
                        react_1["default"].createElement(components_1.View, { className: '' },
                            product.quantity,
                            product.product.unit),
                        react_1["default"].createElement(components_1.View, { className: '', style: 'margin-left:5rpx;' },
                            "(\u00A5",
                            product.product.price,
                            ")")));
                })),
                it.pickUpWay && it.pickUpWay.place &&
                    it.pickUpWay.way && it.pickUpWay.way.length > 0 &&
                    react_1["default"].createElement(components_1.View, { className: 'pick_up_way flex '.concat(it.pickUpWay.way === 'EXPRESS_PICK_UP' ? '' : 'items-center') },
                        react_1["default"].createElement(components_1.View, { className: 'mie_button', style: 'border-color:var(--gray-4);color:var(--gray-4);margin: 5rpx 10rpx 5rpx 0;' }, it.pickUpWay.way === 'SELF_PICK_UP' ? (props.type === 'GOODS' ? '自提点' : '集合点') :
                            (it.pickUpWay.way === 'STATION_PICK_UP' ? (props.type === 'GOODS' ? '车站取货' : '集合车站') : '邮寄')),
                        (it.pickUpWay.way === 'SELF_PICK_UP' && it.pickUpWay.place && it.pickUpWay.place.place) ?
                            react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                                react_1["default"].createElement(components_1.View, { className: 'replicable_item', onLongPress: function () {
                                        tool_functions.text_functions.copyText(it.pickUpWay.place.place);
                                    } }, it.pickUpWay.place.place),
                                it.pickUpWay.place.placeDetail && it.pickUpWay.place.placeDetail.length > 0 &&
                                    react_1["default"].createElement(components_1.View, { className: 'replicable_item', onLongPress: function () {
                                            tool_functions.text_functions.copyText(it.pickUpWay.place.placeDetail);
                                        } },
                                        "\uFF08",
                                        it.pickUpWay.place.placeDetail,
                                        "\uFF09")) :
                            (it.pickUpWay.way === 'STATION_PICK_UP' ?
                                react_1["default"].createElement(components_1.View, { className: 'replicable_item', onLongPress: function () {
                                        tool_functions.text_functions.copyText(it.pickUpWay.place.station);
                                    } },
                                    it.pickUpWay.place.station,
                                    "\uFF08",
                                    it.pickUpWay.place.line,
                                    "\uFF09",
                                    it.pickUpWay.place.des &&
                                        react_1["default"].createElement(components_1.View, { className: '' }, it.pickUpWay.place.des)) :
                                ((props.mode === 'SELLER' ||
                                    it.authId === userManager.unionid) &&
                                    react_1["default"].createElement(components_1.View, { className: '' },
                                        react_1["default"].createElement(components_1.View, { className: 'replicable_item', onLongPress: function () {
                                                tool_functions.text_functions.copyText(it.pickUpWay.place.name);
                                            } },
                                            "\u59D3\u540D\uFF1A",
                                            it.pickUpWay.place.name),
                                        react_1["default"].createElement(components_1.View, { className: 'replicable_item', onLongPress: function () {
                                                tool_functions.text_functions.copyText(it.pickUpWay.place.tel);
                                            } },
                                            "\u7535\u8BDD\uFF1A",
                                            it.pickUpWay.place.tel),
                                        react_1["default"].createElement(components_1.View, { className: 'replicable_item', onLongPress: function () {
                                                tool_functions.text_functions.copyText(it.pickUpWay.place.address);
                                            } },
                                            "\u5730\u5740\uFF1A",
                                            it.pickUpWay.place.address))))),
                it.paymentOption &&
                    react_1["default"].createElement(components_1.View, { className: 'payment' },
                        react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                            react_1["default"].createElement(components_1.View, { className: '' },
                                "\u652F\u4ED8\u65B9\u5F0F\uFF1A",
                                it.paymentOption.option),
                            (props.mode === 'SELLER' ||
                                it.authId === userManager.unionid) &&
                                it.paymentOption.account && it.paymentOption.account.length > 0 &&
                                react_1["default"].createElement(components_1.View, { className: '' },
                                    "\uFF08",
                                    it.paymentOption.account,
                                    "\uFF09")),
                        (props.mode === 'SELLER' ||
                            it.authId === userManager.unionid) &&
                            it.paymentOption.des && it.paymentOption.des.length > 0 &&
                            react_1["default"].createElement(components_1.View, { className: '' },
                                "\u652F\u4ED8\u5907\u6CE8\uFF1A",
                                it.paymentOption.des)),
                it.des && it.des.length > 0 &&
                    react_1["default"].createElement(components_1.View, { className: 'des' },
                        "(\u5907\u6CE8\uFF1A",
                        it.des,
                        ")"),
                (props.mode === 'SELLER') && //卖家才显示总价
                    react_1["default"].createElement(components_1.View, { className: 'total_price' },
                        "\u603B\u4EF7: ",
                        Number(it.totalPrice))));
        }))));
};
SolitaireOrderList.defaultProps = {
    mode: 'BUYER'
};
exports["default"] = SolitaireOrderList;
