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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var taro_1 = require("@tarojs/taro");
var react_redux_1 = require("react-redux");
var components_1 = require("@tarojs/components");
var dayjs_1 = require("dayjs");
var actions = require("../../redux/actions/index");
var ActionDialog_1 = require("../../components/dialogs/ActionDialog/ActionDialog");
var ShopProductsContainer_1 = require("../../containers/ShopProductsContainer/ShopProductsContainer");
var PickUpWayContainer_1 = require("../../containers/PickUpWayContainer/PickUpWayContainer");
var PaymentOptionsSetter_1 = require("../../components/PaymentOptionsSetter/PaymentOptionsSetter");
var CheckRequiredButton_1 = require("../../components/buttons/CheckRequiredButton/CheckRequiredButton");
var LoginDialog_1 = require("../../components/dialogs/LoginDialog/LoginDialog");
// import PickUpWayContainer from './PickUpWayContainer/PickUpWayContainer'
var databaseFunctions = require("../../utils/functions/databaseFunctions");
require("./SolitaireContainer.scss");
/***
 *
 * <SolitaireContainer
        type={state.type} //'EVENT'活动接龙,'GOODS'商品接龙
        mode={mode} //'BUYER','SELLER'
        solitaire={state.solitaire}
        solitaireShop={state.solitaireShop} //mode==='SELLER'时才需要这个
        paymentOptions={}
        productList={productList}
      />
 */
var SolitaireContainer = function (props) {
    var dispatch = react_redux_1.useDispatch();
    var app = getApp();
    var userManager = react_redux_1.useSelector(function (state) { return state.userManager; });
    var ordersManager = react_redux_1.useSelector(function (state) { return state.ordersManager; });
    var classifications = app.$app.globalData.classifications && app.$app.globalData.classifications;
    var currencies = classifications && classifications.currencies;
    var pickUpWayContainerRef = react_1.useRef();
    var shopProductsContainerRef = react_1.useRef();
    var initState = {
        solitaireShop: props.solitaireShop,
        solitaire: props.solitaire,
        // productList: [{
        //   icon: [],
        //   des: "aaaa",
        //   labels: ["All"],
        //   name: "羊头",
        //   price: "22",
        //   unit: '个',
        //   status: 'LAUNCHED',
        //   updatedStock: {
        //     way: '', //'ADD','SUBTRACT'
        //     quantity: ''
        //   },
        // }],
        productList: props.productList ? props.productList : [],
        deletedProducts: [],
        solitaireOrder: props.solitaireOrder,
        ifOpenPickUpWayAcc: true
    };
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    var _b = react_1.useState(null), openedDialog = _b[0], setOpenedDialog = _b[1]; //'UPLOAD'
    var _c = react_1.useState([]), deletedImgList = _c[0], setDeletedImgList = _c[1]; //要从云储存删除的图片
    var _d = react_1.useState({ isFocused: false }), des = _d[0], setDes = _d[1];
    var _e = react_1.useState({ isFocused: false }), content = _e[0], setContent = _e[1];
    var initPaymentOptions = props.paymentOptions;
    var _f = react_1.useState(initPaymentOptions), paymentOptions = _f[0], setPaymentOptions = _f[1]; //所有paymentOptions(包括没被选中的)
    react_1.useEffect(function () {
        console.log('c-5', props.productList);
        console.log('p-props.solitaire', props.solitaire, 'props.solitaireOrder', props.solitaireOrder);
        setState(__assign(__assign({}, state), { solitaire: initState.solitaire, solitaireShop: initState.solitaireShop, solitaireOrder: initState.solitaireOrder, productList: initState.productList }));
        setPaymentOptions(initPaymentOptions);
    }, [props.productList, props.solitaire, props.solitaireShop, props.paymentOptions, app.$app.globalData.classifications]);
    react_1.useEffect(function () {
    }, []);
    taro_1.usePullDownRefresh(function () {
        taro_1["default"].stopPullDownRefresh();
    });
    var toggleAcc = function (way, v, i) {
        if (v === void 0) { v = null; }
        if (i === void 0) { i = null; }
        switch (way) {
            case 'PICK_UP_WAY':
                setState(__assign(__assign({}, state), { ifOpenPickUpWayAcc: !state.ifOpenPickUpWayAcc }));
                break;
            case '':
                break;
            default:
                break;
        }
    };
    var handleChange = function (way, v, v_2) {
        if (v === void 0) { v = null; }
        if (v_2 === void 0) { v_2 = null; }
        switch (way) {
            case 'PICK_UP_WAY': //取货方式
                v = pickUpWayContainerRef.current.getValue();
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { pickUpWay: __assign(__assign({}, state.solitaire.pickUpWay), v) }) }));
                break;
            case 'CURRENCY': //币种
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { info: __assign(__assign({}, state.solitaire.info), { currency: v }) }) }));
                break;
            case 'CONTENT':
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { info: __assign(__assign({}, state.solitaire.info), { content: v }) }) }));
                break;
            case 'DES':
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { info: __assign(__assign({}, state.solitaire.info), { des: v }) }) }));
                break;
            case 'START_DATE': //date and time
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { info: __assign(__assign({}, state.solitaire && state.solitaire.info), { startTime: __assign(__assign({}, state.solitaire.info && state.solitaire.info.startTime), { date: v, time: state.solitaire && state.solitaire.info &&
                                    state.solitaire.info.startTime && state.solitaire.info.startTime.time ?
                                    state.solitaire.info.startTime.time : dayjs_1["default"]().format('HH:mm') }) }) }) }));
                break;
            case 'END_DATE':
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { info: __assign(__assign({}, state.solitaire && state.solitaire.info), { endTime: __assign(__assign({}, state.solitaire.info && state.solitaire.info.endTime), { date: v, time: state.solitaire && state.solitaire.info &&
                                    state.solitaire.info.endTime && state.solitaire.info.endTime.time ?
                                    state.solitaire.info.endTime.time : dayjs_1["default"]().format('HH:mm') }) }) }) }));
                break;
            case 'START_TIME':
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { info: __assign(__assign({}, state.solitaire && state.solitaire.info), { startTime: __assign(__assign({}, state.solitaire.info && state.solitaire.info.startTime), { time: v }) }) }) }));
                break;
            case 'END_TIME':
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { info: __assign(__assign({}, state.solitaire && state.solitaire.info), { endTime: __assign(__assign({}, state.solitaire.info && state.solitaire.info.endTime), { time: v }) }) }) }));
                break;
            case 'EVENT_START_DATE': //event date and time
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { eventTime: __assign(__assign({}, state.solitaire && state.solitaire.eventTime), { startTime: __assign(__assign({}, state.solitaire.eventTime && state.solitaire.eventTime.startTime), { date: v, time: state.solitaire && state.solitaire.eventTime &&
                                    state.solitaire.eventTime.startTime && state.solitaire.eventTime.startTime.time ?
                                    state.solitaire.eventTime.startTime.time : dayjs_1["default"]().format('HH:mm') }) }) }) }));
                break;
            case 'EVENT_END_DATE':
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { eventTime: __assign(__assign({}, state.solitaire && state.solitaire.eventTime), { endTime: __assign(__assign({}, state.solitaire.eventTime && state.solitaire.eventTime.endTime), { date: v, time: state.solitaire && state.solitaire.eventTime &&
                                    state.solitaire.eventTime.endTime && state.solitaire.eventTime.endTime.time ?
                                    state.solitaire.eventTime.endTime.time : dayjs_1["default"]().format('HH:mm') }) }) }) }));
                break;
            case 'EVENT_START_TIME':
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { eventTime: __assign(__assign({}, state.solitaire && state.solitaire.eventTime), { startTime: __assign(__assign({}, state.solitaire.info && state.solitaire.eventTime.startTime), { time: v }) }) }) }));
                break;
            case 'EVENT_END_TIME':
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { eventTime: __assign(__assign({}, state.solitaire && state.solitaire.eventTime), { endTime: __assign(__assign({}, state.solitaire.eventTime && state.solitaire.eventTime.endTime), { time: v }) }) }) }));
                break;
            case 'PAYMENT_OPTION': //
                var allPaymentOptions = v;
                var choosenPaymentOptions = v_2;
                setPaymentOptions(allPaymentOptions);
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { info: __assign(__assign({}, state.solitaire && state.solitaire.info), { paymentOptions: choosenPaymentOptions }) }) }));
                break;
            case 'PRODUCTS':
                v = shopProductsContainerRef.current.getValue();
                console.log('handleChange-PRODUCTS', v);
                setState(__assign(__assign({}, state), { productList: v.productList, deletedProducts: v.deletedProducts }));
                setDeletedImgList((v.deletedImgList.productIcons && v.deletedImgList.productIcons.length > 0) ? __spreadArrays(deletedImgList, v.deletedImgList.productIcons) : []);
                break;
            case '':
                break;
            default:
                break;
        }
    };
    var handleBuyerMode = function (way, v_1, v_2) {
        if (v_1 === void 0) { v_1 = null; }
        if (v_2 === void 0) { v_2 = null; }
        switch (way) {
            case 'PAYMENT_OPTION':
                setState(__assign(__assign({}, state), { solitaireOrder: __assign(__assign({}, state.solitaireOrder), { paymentOption: __assign(__assign({}, v_1), { des: v_2 }) }) }));
                break;
            case 'PICK_UP_WAY':
                setState(__assign(__assign({}, state), { solitaireOrder: __assign(__assign({}, state.solitaireOrder), { pickUpWay: __assign(__assign({}, state.pickUpWay), { way: v_1, place: v_2 }) }) }));
                break;
            case '':
                break;
            default:
                break;
        }
    };
    var handleInit = function () {
        setOpenedDialog(null);
    };
    var toggleDialog = function (dialog) {
        (dialog === 'UPLOAD' || dialog === 'DO_PURCHASE') &&
            handleChange('PRODUCTS');
        setOpenedDialog(dialog);
    };
    var handleSubmit = function (way, v, i) {
        if (v === void 0) { v = null; }
        if (i === void 0) { i = null; }
        return __awaiter(void 0, void 0, void 0, function () {
            var tabBarList_solitaire, _a, deletedUrlList, fileDir, updatedProductList, _i, _b, p, updatedProductIcons, _c, _d, it, updated, _e, solitaire, solitaireShopId, _f, solitaireOrder;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        setOpenedDialog(null);
                        tabBarList_solitaire = app.$app.globalData.classifications ?
                            app.$app.globalData.classifications.tabBar.tabBarList_solitaire : [];
                        _a = way;
                        switch (_a) {
                            case 'UPLOAD': return [3 /*break*/, 1];
                            case 'DO_PURCHASE': return [3 /*break*/, 20];
                            case '': return [3 /*break*/, 21];
                        }
                        return [3 /*break*/, 22];
                    case 1:
                        console.log('UPLOAD-solitaire', state);
                        deletedUrlList = deletedImgList.map(function (it) {
                            return it.fileID;
                        });
                        deletedUrlList.length > 0 &&
                            databaseFunctions.img_functions.deleteImgs(deletedUrlList);
                        fileDir = dayjs_1["default"]().format('YYYY-MM');
                        updatedProductList = [];
                        _i = 0, _b = state.productList;
                        _g.label = 2;
                    case 2:
                        if (!(_i < _b.length)) return [3 /*break*/, 10];
                        p = _b[_i];
                        updatedProductIcons = [];
                        if (!(p.icon && p.icon.length > 0)) return [3 /*break*/, 8];
                        _c = 0, _d = p.icon;
                        _g.label = 3;
                    case 3:
                        if (!(_c < _d.length)) return [3 /*break*/, 8];
                        it = _d[_c];
                        if (!it.fileID) return [3 /*break*/, 4];
                        _e = it;
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, databaseFunctions.img_functions.compressAndUploadImg(it, fileDir, 'product_icons')];
                    case 5:
                        _e = _g.sent();
                        _g.label = 6;
                    case 6:
                        updated = _e;
                        if ((updated == null) || (!updated.fileID)) {
                            wx.showToast({
                                title: '上传商品图片失败',
                                icon: 'none'
                            });
                        }
                        else {
                            updatedProductIcons.push(updated);
                        }
                        _g.label = 7;
                    case 7:
                        _c++;
                        return [3 /*break*/, 3];
                    case 8:
                        updatedProductList.push(__assign(__assign({}, p), { icon: updatedProductIcons }));
                        _g.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 2];
                    case 10:
                        ;
                        solitaire = state.solitaire;
                        solitaireShopId = userManager.userInfo && userManager.userInfo.mySolitaireShops &&
                            userManager.userInfo.mySolitaireShops.length > 0 && userManager.userInfo.mySolitaireShops[0] //因为每个用户只能有一个接龙店，所以这里直接用了[0] *unfinished 要优化
                        ;
                        if (!!(state.solitaire && state.solitaire._id && state.solitaire._id.length > 0)) return [3 /*break*/, 15];
                        if (!!(solitaireShopId && solitaireShopId.length > 0)) return [3 /*break*/, 12];
                        return [4 /*yield*/, databaseFunctions.solitaire_functions.addNewSoltaireShop(userManager.unionid, solitaire, updatedProductList)];
                    case 11:
                        _g.sent();
                        return [3 /*break*/, 14];
                    case 12: //否则直接把新的接龙添加到该用户的接龙店
                    return [4 /*yield*/, databaseFunctions.solitaire_functions.addNewSolitaire(userManager.unionid, solitaireShopId, solitaire, updatedProductList)];
                    case 13:
                        _g.sent();
                        _g.label = 14;
                    case 14: return [3 /*break*/, 17];
                    case 15: //修改接龙
                    return [4 /*yield*/, databaseFunctions.solitaire_functions.modifySolitaire(solitaire, updatedProductList, state.deletedProducts)];
                    case 16:
                        _g.sent();
                        _g.label = 17;
                    case 17:
                        _f = paymentOptions;
                        if (!_f) return [3 /*break*/, 19];
                        return [4 /*yield*/, databaseFunctions.user_functions.updatePaymentOptions(userManager.unionid, paymentOptions)];
                    case 18:
                        _f = (_g.sent());
                        _g.label = 19;
                    case 19:
                        _f;
                        dispatch(actions.setUser(userManager.unionid, userManager.openid)); //更新用户信息
                        (tabBarList_solitaire && tabBarList_solitaire.length > 0) &&
                            dispatch(actions.changeTabBarTab(tabBarList_solitaire[0]));
                        return [3 /*break*/, 23];
                    case 20:
                        console.log('DO_PURCHASE-solitaire', state);
                        console.log('DO_PURCHASE-solitaire-ordersManager', ordersManager);
                        solitaireOrder = __assign(__assign({}, state.solitaireOrder), { authId: userManager.unionid, buyerName: userManager.userInfo.nickName, solitaireId: state.solitaire._id, createTime: dayjs_1["default"]().format('YYYY-MM-DD HH:mm:ss'), updateTime: dayjs_1["default"]().format('YYYY-MM-DD HH:mm:ss'), status: 'ACCEPTED', productList: (ordersManager.newOrders &&
                                ordersManager.newOrders.length > 0) ?
                                ordersManager.newOrders[0].productList : [] });
                        if (!(state.solitaireOrder && state.solitaireOrder._id && state.solitaireOrder._id.length > 0)) { //创建接龙订单
                            databaseFunctions.solitaireOrder_functions
                                .doPurchase(solitaireOrder);
                        }
                        else { //修改接龙订单
                            //await databaseFunctions.solitaire_functions.addNewSolitaire(userManager.unionid, solitaireShopId, solitaire, products)
                        }
                        dispatch(actions.setUser(userManager.unionid, userManager.openid)); //更新用户信息
                        (tabBarList_solitaire && tabBarList_solitaire.length > 0) &&
                            dispatch(actions.changeTabBarTab(tabBarList_solitaire[1]));
                        return [3 /*break*/, 23];
                    case 21: return [3 /*break*/, 23];
                    case 22: return [3 /*break*/, 23];
                    case 23:
                        handleInit();
                        return [2 /*return*/];
                }
            });
        });
    };
    // console.log('d-1', state.solitaireOrder);
    var handleChoose = function (way, v) {
        var productList = state.solitaire.products.productList;
        switch (way) {
            case 'CHOOSE':
                productList.push({ id: v._id });
                break;
            case 'UN_CHOOSE':
                productList.splice(productList.findIndex(function (it) {
                    return it.id == v._id;
                }), 1);
                break;
            case '':
                break;
            default:
                break;
        }
        setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { products: __assign(__assign({}, state.solitaire.products), { productList: productList }) }) }));
    };
    var getCurrencyIndex = function () {
        var index = currencies.findIndex(function (it, i) {
            return (it.id === state.solitaire.info.currency);
        });
        return ((index > -1) ? index : 0);
    };
    var uploadDialog = react_1["default"].createElement(ActionDialog_1["default"], { type: 1, isOpened: openedDialog === 'UPLOAD', cancelText: '\u53D6\u6D88', confirmText: '\u4E0A\u4F20', onClose: function () { return handleInit(); }, onCancel: function () { return handleInit(); }, onSubmit: function () { return handleSubmit('UPLOAD'); } }, "\u786E\u5B9A\u4E0A\u4F20\uFF1F\uFF08\u56FE\u7247\u8F83\u591A\u65F6\u4E0A\u4F20\u6BD4\u8F83\u6162\uFF0C\u8BF7\u8010\u5FC3\u7B49\u5F85\uFF09");
    var dateAndTime = state.solitaire &&
        react_1["default"].createElement(components_1.View, { className: 'date_and_time solitaire_container_item' },
            react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item_title' },
                props.type === 'GOODS' ? '接龙时间' : '报名时间',
                react_1["default"].createElement(components_1.View, { className: 'line_horizontal_bold' })),
            react_1["default"].createElement(components_1.View, { className: 'date_time_item' },
                react_1["default"].createElement(components_1.View, { className: 'flex items-center ' },
                    react_1["default"].createElement(components_1.Picker, { mode: 'date', value: state.solitaire.info.startTime && state.solitaire.info.startTime.date, disabled: props.mode === 'BUYER', onChange: function (v) { return handleChange('START_DATE', v.detail.value); } },
                        react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                            react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-calendar' }),
                            state.solitaire && state.solitaire.info && state.solitaire.info.startTime &&
                                react_1["default"].createElement(components_1.View, { className: '' }, state.solitaire.info.startTime.date))),
                    state.solitaire && state.solitaire.info && state.solitaire.info.startTime &&
                        state.solitaire.info.startTime.date &&
                        react_1["default"].createElement(components_1.Picker, { mode: 'time', disabled: props.mode === 'BUYER', value: state.solitaire.info.startTime && state.solitaire.info.startTime.time, onChange: function (v) { return handleChange('START_TIME', v.detail.value); } },
                            react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                                react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-clock' }),
                                state.solitaire.info.startTime.time))),
                react_1["default"].createElement(components_1.View, { className: 'word' }, "\u5F00\u59CB")),
            react_1["default"].createElement(components_1.View, { className: 'date_time_item' },
                react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                    react_1["default"].createElement(components_1.Picker, { mode: 'date', disabled: props.mode === 'BUYER', value: state.solitaire.info.endTime && state.solitaire.info.endTime.date, onChange: function (v) { return handleChange('END_DATE', v.detail.value); } },
                        react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                            react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-calendar' }),
                            (state.solitaire && state.solitaire.info && state.solitaire.info.endTime
                                && state.solitaire.info.endTime.date.length > 0) ?
                                react_1["default"].createElement(components_1.View, { className: '' }, state.solitaire.info.endTime.date) :
                                react_1["default"].createElement(components_1.View, { className: '' }, "\u6C38\u4E0D\u622A\u6B62"))),
                    state.solitaire && state.solitaire.info && state.solitaire.info.endTime &&
                        state.solitaire.info.endTime.date &&
                        react_1["default"].createElement(components_1.Picker, { mode: 'time', disabled: props.mode === 'BUYER', value: state.solitaire.info.endTime.time, onChange: function (v) { return handleChange('END_TIME', v.detail.value); } },
                            react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                                react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-clock' }),
                                state.solitaire.info.endTime.time))),
                react_1["default"].createElement(components_1.View, { className: 'word' }, "\u622A\u6B62")));
    var eventDateAndTime = props.type === 'EVENT' &&
        state.solitaire &&
        react_1["default"].createElement(components_1.View, { className: 'date_and_time solitaire_container_item' },
            react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item_title' },
                '活动时间',
                react_1["default"].createElement(components_1.View, { className: 'line_horizontal_bold' })),
            react_1["default"].createElement(components_1.View, { className: 'date_time_item' },
                react_1["default"].createElement(components_1.View, { className: 'flex items-center ' },
                    react_1["default"].createElement(components_1.Picker, { mode: 'date', value: state.solitaire.eventTime &&
                            state.solitaire.eventTime.startTime && state.solitaire.eventTime.startTime.date, disabled: props.mode === 'BUYER', onChange: function (v) { return handleChange('EVENT_START_DATE', v.detail.value); } },
                        react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                            react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-calendar' }),
                            state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.startTime &&
                                react_1["default"].createElement(components_1.View, { className: '' }, state.solitaire.eventTime.startTime.date))),
                    state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.startTime &&
                        state.solitaire.eventTime.startTime.date &&
                        react_1["default"].createElement(components_1.Picker, { mode: 'time', disabled: props.mode === 'BUYER', value: state.solitaire.eventTime.startTime.time, onChange: function (v) { return handleChange('EVENT_START_TIME', v.detail.value); } },
                            react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                                react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-clock' }),
                                state.solitaire.eventTime.startTime.time))),
                react_1["default"].createElement(components_1.View, { className: 'word' }, "\u5F00\u59CB")),
            react_1["default"].createElement(components_1.View, { className: 'date_time_item' },
                react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                    react_1["default"].createElement(components_1.Picker, { mode: 'date', value: state.solitaire.eventTime &&
                            state.solitaire.eventTime.endTime && state.solitaire.eventTime.endTime.date, disabled: props.mode === 'BUYER', onChange: function (v) { return handleChange('EVENT_END_DATE', v.detail.value); } },
                        react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                            react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-calendar' }),
                            (state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.endTime
                                && state.solitaire.eventTime.endTime.date.length > 0) ?
                                react_1["default"].createElement(components_1.View, { className: '' }, state.solitaire.eventTime.endTime.date) :
                                react_1["default"].createElement(components_1.View, { className: '' }, "\u6C38\u4E0D\u7ED3\u675F"))),
                    state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.endTime &&
                        state.solitaire.eventTime.endTime.date &&
                        react_1["default"].createElement(components_1.Picker, { mode: 'time', disabled: props.mode === 'BUYER', value: state.solitaire.eventTime.endTime.time, onChange: function (v) { return handleChange('EVENT_END_TIME', v.detail.value); } },
                            react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                                react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-clock' }),
                                state.solitaire.eventTime.endTime.time))),
                react_1["default"].createElement(components_1.View, { className: 'word' }, "\u7ED3\u675F")));
    var info = state.solitaire &&
        react_1["default"].createElement(components_1.View, { className: 'info' },
            dateAndTime,
            eventDateAndTime,
            react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item des_and_remarks' },
                react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item_title ' },
                    "\u63CF\u8FF0\u4E0E\u5907\u6CE8",
                    react_1["default"].createElement(components_1.View, { className: 'line_horizontal_bold' })),
                props.mode === 'BUYER' ?
                    react_1["default"].createElement(components_1.View, { className: 'des_and_remarks_buyer' },
                        "\u63A5\u9F99\u63CF\u8FF0\uFF1A",
                        state.solitaire.info && state.solitaire.info.content) :
                    react_1["default"].createElement("textarea", { className: 'solitaire_content '.concat(content.isFocused ? 'editing' : 'not_editing'), type: 'text', placeholder: '描述', 
                        // disabled={props.mode === 'BUYER'}
                        maxlength: -1, value: (state.solitaire.info && state.solitaire.info.content) ?
                            state.solitaire.info.content : '', onFocus: function () { return setContent(__assign(__assign({}, content), { isFocused: true })); }, onBlur: function () { return setContent(__assign(__assign({}, content), { isFocused: false })); }, onInput: function (e) { return handleChange('CONTENT', e.detail.value); } }),
                props.mode === 'BUYER' ?
                    react_1["default"].createElement(components_1.View, { className: 'des_and_remarks_buyer' },
                        "\u5907\u6CE8\uFF1A",
                        state.solitaire.info && state.solitaire.info.des) :
                    react_1["default"].createElement(components_1.View, { className: 'solitaire_des' },
                        react_1["default"].createElement("textarea", { className: 'solitaire_des  '.concat(des.isFocused ? 'editing' : 'not_editing'), type: 'text', placeholder: '备注', disabled: props.mode === 'BUYER', maxlength: -1, value: (state.solitaire.info && state.solitaire.info.des) ?
                                state.solitaire.info.des : '', onFocus: function () { return setDes(__assign(__assign({}, des), { isFocused: true })); }, onBlur: function () { return setDes(__assign(__assign({}, des), { isFocused: false })); }, onInput: function (e) { return handleChange('DES', e.detail.value); } }))));
    var pickUpWay = react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item' },
        react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item_title' },
            react_1["default"].createElement(components_1.View, { className: '' }, props.type === 'EVENT' ? '集合点' : '取货方式'),
            react_1["default"].createElement(components_1.View, { className: 'line_horizontal_bold' })),
        state.solitaire && //state.solitaire.pickUpWay &&
            // <View className='solitaire_pick_up_way'>
            react_1["default"].createElement(PickUpWayContainer_1["default"], { styleType: props.type === 'EVENT' ? 2 : 1, type: props.type, ref: pickUpWayContainerRef, className: state.ifOpenPickUpWayAcc ? '' : 'hidden_item', mode: props.mode === 'SELLER' ? 'SELLER_MODIFYING' : props.mode, shop: state.solitaire, handleSave: function () { return handleChange('PICK_UP_WAY'); }, handleChoose: props.mode === 'BUYER' &&
                    (function (way, v) { return handleBuyerMode('PICK_UP_WAY', way, v); }), choosenItem: state.solitaireOrder && state.solitaireOrder.pickUpWay })
    // </View>
    );
    var currency = react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item' },
        react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item_title' },
            react_1["default"].createElement(components_1.View, { className: '' }, "\u6807\u4EF7\u5E01\u79CD"),
            react_1["default"].createElement(components_1.View, { className: 'line_horizontal_bold' })),
        currencies &&
            (props.mode === 'SELLER' ?
                currencies.map(function (it, i) {
                    return (react_1["default"].createElement(components_1.View, { className: 'mie_button '.concat((state.solitaire.info && state.solitaire.info.currency === it.id) ?
                            'mie_button_choosen' : ''), onClick: function () { return handleChange('CURRENCY', it.id); } },
                        it.name,
                        " (",
                        it.unit,
                        ")"));
                }) :
                react_1["default"].createElement(components_1.View, { className: '', style: 'font-size: 28rpx;' }, (state.solitaire.info && state.solitaire.info.currency &&
                    currencies[getCurrencyIndex()].name))));
    var products = //state.solitaire &&  //*注：这里不能加这句否则ShopProductsContainer里就不会根据shopid的改变刷新了！
     react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item' },
        react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item_title' },
            react_1["default"].createElement(components_1.View, { className: '' }, props.type === 'GOODS' ? '接龙商品' : '报名费'),
            react_1["default"].createElement(components_1.View, { className: 'line_horizontal_bold' })),
        react_1["default"].createElement(ShopProductsContainer_1["default"], { ref: shopProductsContainerRef, type: props.type, mode: props.mode === 'SELLER' ? 'SOLITAIRE_SELLER' : 'SOLITAIRE_BUYER', 
            // shop={props.mode === 'SELLER' ?
            //   state.solitaireShop : state.solitaire}//如果是seller版则传入shop，否则传入单条接龙
            shop: state.solitaire, productList: state.productList, 
            // labelList={[]}
            handleSave: function () { return handleChange('PRODUCTS'); }, maxProductIconsLength: 1 }));
    var loginDialog = //*problem 这里没错但是ts会报错
     react_1["default"].createElement(LoginDialog_1["default"], { words: '\u8BF7\u5148\u767B\u5F55', version: 'BUYER', isOpened: state.openedDialog === 'LOGIN', onClose: function () { return toggleDialog(null); }, onCancel: function () { return toggleDialog(null); } });
    var doPurchaseDialog = react_1["default"].createElement(ActionDialog_1["default"], { type: 1, isOpened: openedDialog === 'DO_PURCHASE', cancelText: '\u53D6\u6D88', confirmText: '\u63D0\u4EA4', onClose: function () { return handleInit(); }, onCancel: function () { return handleInit(); }, onSubmit: function () { return handleSubmit('DO_PURCHASE'); } }, "\u786E\u5B9A\u63D0\u4EA4\u63A5\u9F99\uFF1F");
    var payments = react_1["default"].createElement(components_1.View, { className: 'pay solitaire_container_item' },
        react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item_title' },
            "\u652F\u4ED8\u65B9\u5F0F",
            react_1["default"].createElement(components_1.View, { className: 'line_horizontal_bold' })),
        react_1["default"].createElement(PaymentOptionsSetter_1["default"], { className: '', mode: props.mode, paymentOptions: //卖家模式显示自己保存的所有支付选项，买家模式只显示已被卖家选中的
            props.mode === 'SELLER' ? paymentOptions :
                (state.solitaire && state.solitaire.info && state.solitaire.info.paymentOptions), sellerChoosenPaymentOptions: state.solitaire && state.solitaire.info &&
                state.solitaire.info.paymentOptions, 
            //choosenPaymentOptions: 买家模式选中的solitaireOrder支付选项
            choosenPaymentOption: state.solitaireOrder && state.solitaireOrder &&
                state.solitaireOrder.paymentOption, handleChoose: props.mode === 'BUYER' ?
                function (choosen, des) { return handleBuyerMode('PAYMENT_OPTION', choosen, des); } : null, handleSave: props.mode === 'SELLER' ?
                function (all, choosen, des) { return handleChange('PAYMENT_OPTION', all, choosen); } :
                null }));
    return (react_1["default"].createElement(components_1.View, { className: 'solitaire_container' },
        loginDialog,
        doPurchaseDialog,
        uploadDialog,
        info,
        pickUpWay,
        payments,
        products,
        props.mode === 'SELLER' &&
            react_1["default"].createElement(components_1.View, { className: 'final_button', onClick: function () { return toggleDialog('UPLOAD'); } }, state.solitaire._id ? '确定修改接龙' : '发起接龙'),
        props.mode === 'BUYER' &&
            react_1["default"].createElement(components_1.View, { className: 'final_button' },
                react_1["default"].createElement(CheckRequiredButton_1["default"], { className: 'final_button', checkedItems: [{
                            check: true,
                            toastText: '请选择报名项目！'
                        },
                    ], doAction: (userManager.unionid && userManager.unionid.length > 0) ? //如果没登录就打开登录窗，否则继续提交订单
                        function () { return toggleDialog('DO_PURCHASE'); } : function () { return toggleDialog('LOGIN'); } }, "\u53C2\u4E0E\u63A5\u9F99/\u4FEE\u6539\u6211\u53C2\u4E0E\u7684\u63A5\u9F99"))));
};
SolitaireContainer.defaultProps = {
    mode: 'BUYER',
    type: 'GOODS'
};
exports["default"] = SolitaireContainer;
