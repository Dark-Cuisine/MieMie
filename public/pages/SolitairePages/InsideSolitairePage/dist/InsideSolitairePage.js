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
var dayjs_1 = require("dayjs");
var actions = require("../../../redux/actions");
var SolitaireOrderList_1 = require("./SolitaireOrderList/SolitaireOrderList");
var SolitaireContainer_1 = require("../../../containers/SolitaireContainer/SolitaireContainer");
var Layout_1 = require("../../../components/Layout/Layout");
require("./InsideSolitairePage.scss");
/***
 * mode='BUYER','SELLER' 卖家模式用于新建or修改
 */
var InsideSolitairePage = function (props) {
    var dispatch = react_redux_1.useDispatch();
    var router = taro_1.useRouter();
    var shopsManager = react_redux_1.useSelector(function (state) { return state.shopsManager; });
    var userManager = react_redux_1.useSelector(function (state) { return state.userManager; });
    var app = getApp();
    var initState = {
        solitaire: {
            info: {
                type: router.params.type,
                startTime: {
                    date: dayjs_1["default"]().format('YYYY-MM-DD'),
                    time: dayjs_1["default"]().format('HH:mm')
                },
                endTime: {
                    date: '',
                    time: ''
                },
                currency: 'jpy'
            },
            eventTime: {
                startTime: {
                    date: dayjs_1["default"]().format('YYYY-MM-DD'),
                    time: dayjs_1["default"]().format('HH:mm')
                },
                endTime: {
                    date: '',
                    time: ''
                }
            },
            pickUpWay: {
                selfPickUp: {
                    list: [],
                    des: ''
                },
                stationPickUp: {
                    list: [],
                    des: ''
                },
                expressPickUp: {
                    isAble: false,
                    list: [],
                    des: ''
                }
            }
        },
        solitaireShop: {
            pickUpWay: {
                selfPickUp: {
                    list: [],
                    des: ''
                },
                stationPickUp: {
                    list: [],
                    des: ''
                },
                expressPickUp: {
                    isAble: false,
                    list: [],
                    des: ''
                }
            }
        },
        solitaireOrder: null
    };
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    var _b = react_1.useState(router.params.mode ? router.params.mode : props.mode), mode = _b[0], setMode = _b[1]; //'BUYER','SELLER'
    var _c = react_1.useState([]), productList = _c[0], setProductList = _c[1];
    react_1.useEffect(function () {
        setMode(router.params.mode);
        doUpdate();
    }, []);
    taro_1.usePullDownRefresh(function () {
        taro_1["default"].stopPullDownRefresh();
    });
    var doUpdate = function () { return __awaiter(void 0, void 0, void 0, function () {
        var solitaire, solitaireShop, solitaireOrder, solitaireId, solitaireOrderId, copySolitaireId, res, res, copyProductsIds, res_2, copyProducts, r, res_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch(actions.toggleLoadingSpinner(true));
                    solitaire = state.solitaire;
                    solitaireShop = state.solitaireShop;
                    solitaireOrder = state.solitaireOrder;
                    solitaireId = router.params.solitaireId;
                    solitaireOrderId = router.params.solitaireOrderId;
                    copySolitaireId = router.params.copySolitaireId;
                    if (!solitaireId) return [3 /*break*/, 2];
                    return [4 /*yield*/, wx.cloud.callFunction({
                            name: 'get_data',
                            data: {
                                collection: 'solitaires',
                                queryTerm: { _id: solitaireId }
                            }
                        })];
                case 1:
                    res = _a.sent();
                    if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
                        return [2 /*return*/];
                    }
                    solitaire = res.result.data[0];
                    _a.label = 2;
                case 2:
                    if (!copySolitaireId) return [3 /*break*/, 5];
                    return [4 /*yield*/, wx.cloud.callFunction({
                            name: 'get_data',
                            data: {
                                collection: 'solitaires',
                                queryTerm: { _id: copySolitaireId }
                            }
                        })];
                case 3:
                    res = _a.sent();
                    if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
                        return [2 /*return*/];
                    }
                    Object.assign(solitaire, res.result.data[0]); //*深拷贝，否则改newCopy时res.result.data[0]也会改变
                    delete solitaire._id;
                    delete solitaire.createTime;
                    delete solitaire.updateTime;
                    copyProductsIds = solitaire.products.productList &&
                        solitaire.products.productList.slice();
                    if (!(copyProductsIds && copyProductsIds.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, wx.cloud.callFunction({
                            name: 'get_data',
                            data: {
                                collection: 'products',
                                operatedItem: '_ID',
                                queriedList: copyProductsIds.map(function (it) { return it.id; })
                            }
                        })];
                case 4:
                    res_2 = _a.sent();
                    if ((res_2 && res_2.result && res_2.result.data && res_2.result.data.length > 0)) {
                        copyProducts = res_2.result.data.slice(0);
                        copyProducts.forEach(function (p) {
                            delete p._id;
                            delete p.createTime;
                            delete p.updateTime;
                        });
                        setProductList(copyProducts);
                    }
                    _a.label = 5;
                case 5:
                    if (!(solitaire && (userManager.unionid === solitaire.authId))) return [3 /*break*/, 7];
                    return [4 /*yield*/, wx.cloud.callFunction({
                            name: 'get_data',
                            data: {
                                collection: 'solitaireShops',
                                queryTerm: { _id: solitaire.solitaireShopId }
                            }
                        })];
                case 6:
                    r = _a.sent();
                    if (r && r.result && r.result.data && r.result.data.length > 0) {
                        solitaireShop = r.result.data[0];
                    }
                    _a.label = 7;
                case 7:
                    if (!(mode === 'BUYER' && solitaireOrderId)) return [3 /*break*/, 9];
                    return [4 /*yield*/, wx.cloud.callFunction({
                            name: 'get_data',
                            data: {
                                collection: 'solitaireOrders',
                                queryTerm: { _id: solitaireOrderId }
                            }
                        })];
                case 8:
                    res_2 = _a.sent();
                    if ((res_2 && res_2.result && res_2.result.data && res_2.result.data.length > 0)) {
                        solitaireOrder = res_2.result.data[0];
                    }
                    _a.label = 9;
                case 9:
                    console.log('c-0', solitaire);
                    //  console.log('solitaireShop', solitaireShop);
                    setState(__assign(__assign({}, state), { solitaire: solitaire, solitaireShop: solitaireShop, solitaireOrder: solitaireOrder }));
                    dispatch(actions.toggleLoadingSpinner(false));
                    return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement(Layout_1["default"], { className: 'inside_solitaire_page '.concat(props.className), mode: 'SOLITAIRE', navBarKind: 2, lateralBarKind: 0, navBarTitle: mode === 'SELLER' ?
            (state.solitaire._id ? '修改' : '新建').concat(state.solitaire && state.solitaire.info && state.solitaire.info.type === 'EVENT' ?
                '活动' : '商品', '接龙')
            : '参与接龙', ifShowTabBar: false, ifShowShareMenu: mode === 'SELLER' },
        state.solitaireShop && mode === 'BUYER' &&
            (state.solitaireShop.authId === userManager.unionid) && //同作者才能修改 *unfinished 以后加上能添加管理员 
            react_1["default"].createElement(components_1.View, { className: 'edit_button', onClick: function () { return setMode(mode === 'BUYER' ? 'SELLER' : 'BUYER'); } },
                mode === 'BUYER' &&
                    react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-edit' }),
                react_1["default"].createElement(components_1.View, { className: '' }, mode === 'BUYER' ? '修改接龙' : '预览')),
        react_1["default"].createElement(SolitaireContainer_1["default"], { type: state.solitaire && state.solitaire.info && state.solitaire.info.type, solitaireOrder: state.solitaireOrder, mode: mode, solitaireShop: state.solitaireShop, solitaire: state.solitaire, paymentOptions: userManager.userInfo && userManager.userInfo.paymentOptions, productList: productList }),
        mode === 'BUYER' &&
            react_1["default"].createElement(SolitaireOrderList_1["default"], { solitaireOrders: state.solitaire && state.solitaire.solitaireOrders, mode: (state.solitaireShop && (state.solitaireShop.authId === userManager.unionid)) ?
                    'SELLER' : 'BUYER' })));
};
InsideSolitairePage.defaultProps = {
    mode: 'BUYER'
};
exports["default"] = InsideSolitairePage;
