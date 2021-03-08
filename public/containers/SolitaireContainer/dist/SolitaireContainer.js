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
var _this = this;
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
        productList: [],
        deletedProducts: [],
        solitaireOrder: {},
        ifOpenPickUpWayAcc: true
    };
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    var _b = react_1.useState(null), openedDialog = _b[0], setOpenedDialog = _b[1]; //'UPLOAD'
    var _c = react_1.useState({ isFocused: false }), des = _c[0], setDes = _c[1];
    var _d = react_1.useState({ isFocused: false }), content = _d[0], setContent = _d[1];
    var initPaymentOptions = props.paymentOptions;
    var _e = react_1.useState(initPaymentOptions), paymentOptions = _e[0], setPaymentOptions = _e[1]; //所有paymentOptions(包括没被选中的)
    react_1.useEffect(function () {
        setState(__assign(__assign({}, state), { solitaire: initState.solitaire, solitaireShop: initState.solitaireShop }));
        setPaymentOptions(initPaymentOptions);
    }, [props.solitaire, props.solitaireShop, props.paymentOptions, app.$app.globalData.classifications]);
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
                // console.log('handleChange-PRODUCTS', v);
                setState(__assign(__assign({}, state), { productList: v.productList, deletedProducts: v.deletedProducts }));
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
                setState(__assign(__assign({}, state), { solitaireOrder: __assign(__assign({}, state.solitaireOrder), { pickUpWay: __assign(__assign(__assign({}, state.pickUpWay), { way: v_1 }), v_2) }) }));
                break;
            case '':
                break;
            default:
                break;
        }
    };
    var handleInit = function () {
        setState(__assign(__assign({}, state), { openedDialog: null }));
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
            var _a, solitaire, products_1, solitaireShopId, _b, tabBarList_solitaire, solitaireOrder;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = way;
                        switch (_a) {
                            case 'UPLOAD': return [3 /*break*/, 1];
                            case 'DO_PURCHASE': return [3 /*break*/, 9];
                            case '': return [3 /*break*/, 12];
                        }
                        return [3 /*break*/, 13];
                    case 1:
                        console.log('UPLOAD-solitaire', state);
                        solitaire = state.solitaire;
                        products_1 = state.productList;
                        solitaireShopId = userManager.userInfo && userManager.userInfo.mySolitaireShops &&
                            userManager.userInfo.mySolitaireShops.length > 0 && userManager.userInfo.mySolitaireShops[0] //因为每个用户只能有一个接龙店，所以这里直接用了[0] *unfinished 要优化
                        ;
                        if (!!(state.solitaire && state.solitaire._id && state.solitaire._id.length > 0)) return [3 /*break*/, 6];
                        if (!!(solitaireShopId && solitaireShopId.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, databaseFunctions.solitaire_functions.addNewSoltaireShop(userManager.unionid, solitaire, products_1)];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 3: //否则直接把新的接龙添加到该用户的接龙店
                    return [4 /*yield*/, databaseFunctions.solitaire_functions.addNewSolitaire(userManager.unionid, solitaireShopId, solitaire, products_1)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: return [3 /*break*/, 6];
                    case 6:
                        _b = paymentOptions;
                        if (!_b) return [3 /*break*/, 8];
                        return [4 /*yield*/, databaseFunctions.user_functions.updatePaymentOptions(userManager.unionid, paymentOptions)];
                    case 7:
                        _b = (_c.sent());
                        _c.label = 8;
                    case 8:
                        _b;
                        dispatch(actions.setUser(userManager.unionid, userManager.openid)); //更新用户信息
                        setOpenedDialog(null);
                        tabBarList_solitaire = app.$app.globalData.classifications ?
                            app.$app.globalData.classifications.tabBar.tabBarList_solitaire : [];
                        (tabBarList_solitaire && tabBarList_solitaire.length > 0) &&
                            dispatch(actions.changeTabBarTab(tabBarList_solitaire[1]));
                        return [3 /*break*/, 14];
                    case 9:
                        console.log('DO_PURCHASE-solitaire', state);
                        console.log('DO_PURCHASE-solitaire-ordersManager', ordersManager);
                        solitaireOrder = __assign(__assign({}, state.solitaireOrder), { authId: userManager.unionid, buyerName: userManager.userInfo.nickName, solitaireId: state.solitaire._id, createTime: dayjs_1["default"]().format('YYYY-MM-DD HH:mm:ss'), status: 'ACCEPTED', productList: ordersManager.newOrders[0].productList });
                        if (!!(state.solitaireOrder && state.solitaireOrder._id && state.solitaireOrder._id.length > 0)) return [3 /*break*/, 11];
                        return [4 /*yield*/, databaseFunctions.solitaireOrder_functions
                                .doPurchase(solitaireOrder)];
                    case 10:
                        _c.sent();
                        return [3 /*break*/, 11];
                    case 11: return [3 /*break*/, 14];
                    case 12: return [3 /*break*/, 14];
                    case 13: return [3 /*break*/, 14];
                    case 14:
                        handleInit();
                        return [2 /*return*/];
                }
            });
        });
    };
    var uploadDialog = react_1["default"].createElement(ActionDialog_1["default"], { type: 1, isOpened: openedDialog === 'UPLOAD', cancelText: '\u53D6\u6D88', confirmText: '\u4E0A\u4F20', onClose: function () { return handleInit(); }, onCancel: function () { return handleInit(); }, onSubmit: function () { return handleSubmit('UPLOAD'); } }, "\u786E\u5B9A\u4E0A\u4F20\uFF1F\uFF08\u56FE\u7247\u8F83\u591A\u65F6\u4E0A\u4F20\u6BD4\u8F83\u6162\uFF0C\u8BF7\u8010\u5FC3\u7B49\u5F85\uFF09");
    var dateAndTime = state.solitaire &&
        react_1["default"].createElement(components_1.View, { className: 'date_and_time' },
            react_1["default"].createElement(components_1.View, { className: 'flex items-center solitaire_container_item' },
                react_1["default"].createElement(components_1.View, { className: '' }, props.type === 'GOODS' ? '接龙开始时间' : '报名开始时间'),
                react_1["default"].createElement(components_1.Picker, { mode: 'date', disabled: props.mode === 'BUYER', onChange: function (v) { return handleChange('START_DATE', v.detail.value); } },
                    react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                        react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-calendar' }),
                        state.solitaire && state.solitaire.info && state.solitaire.info.startTime &&
                            react_1["default"].createElement(components_1.View, { className: '' }, state.solitaire.info.startTime.date))),
                state.solitaire && state.solitaire.info && state.solitaire.info.startTime &&
                    state.solitaire.info.startTime.date &&
                    react_1["default"].createElement(components_1.Picker, { mode: 'time', disabled: props.mode === 'BUYER', value: state.solitaire.info.startTime.time, onChange: function (v) { return handleChange('START_TIME', v.detail.value); } },
                        react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                            react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-clock' }),
                            state.solitaire.info.startTime.time))),
            react_1["default"].createElement(components_1.View, { className: 'flex items-center solitaire_container_item' },
                react_1["default"].createElement(components_1.View, { className: '' }, props.type === 'GOODS' ? '接龙截止时间' : '报名截止时间'),
                react_1["default"].createElement(components_1.Picker, { mode: 'date', disabled: props.mode === 'BUYER', onChange: function (v) { return handleChange('END_DATE', v.detail.value); } },
                    react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                        react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-calendar' }),
                        state.solitaire && state.solitaire.info && state.solitaire.info.endTime &&
                            react_1["default"].createElement(components_1.View, { className: '' }, state.solitaire.info.endTime.date))),
                state.solitaire && state.solitaire.info && state.solitaire.info.endTime &&
                    state.solitaire.info.endTime.date &&
                    react_1["default"].createElement(components_1.Picker, { mode: 'time', disabled: props.mode === 'BUYER', value: state.solitaire.info.endTime.time, onChange: function (v) { return handleChange('END_TIME', v.detail.value); } },
                        react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                            react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-clock' }),
                            state.solitaire.info.endTime.time))));
    var eventDateAndTime = props.type === 'EVENT' &&
        state.solitaire &&
        react_1["default"].createElement(components_1.View, { className: 'date_and_time' },
            react_1["default"].createElement(components_1.View, { className: 'flex items-center solitaire_container_item' },
                react_1["default"].createElement(components_1.View, { className: '' }, '活动开始时间'),
                react_1["default"].createElement(components_1.Picker, { mode: 'date', disabled: props.mode === 'BUYER', onChange: function (v) { return handleChange('EVENT_START_DATE', v.detail.value); } },
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
            react_1["default"].createElement(components_1.View, { className: 'flex items-center solitaire_container_item' },
                react_1["default"].createElement(components_1.View, { className: '' }, '活动结束时间'),
                react_1["default"].createElement(components_1.Picker, { mode: 'date', disabled: props.mode === 'BUYER', onChange: function (v) { return handleChange('EVENT_END_DATE', v.detail.value); } },
                    react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                        react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-calendar' }),
                        state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.endTime &&
                            react_1["default"].createElement(components_1.View, { className: '' }, state.solitaire.eventTime.endTime.date))),
                state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.endTime &&
                    state.solitaire.eventTime.endTime.date &&
                    react_1["default"].createElement(components_1.Picker, { mode: 'time', disabled: props.mode === 'BUYER', value: state.solitaire.eventTime.endTime.time, onChange: function (v) { return handleChange('EVENT_END_TIME', v.detail.value); } },
                        react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                            react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-clock' }),
                            state.solitaire.eventTime.endTime.time))));
    var info = state.solitaire &&
        react_1["default"].createElement(components_1.View, { className: 'info' },
            dateAndTime,
            eventDateAndTime,
            react_1["default"].createElement(components_1.View, { className: 'flex solitaire_container_item' },
                react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item_title' }, "\u63A5\u9F99\u63CF\u8FF0:"),
                react_1["default"].createElement("textarea", { className: 'solitaire_content '.concat(content.isFocused ? 'editing' : 'not_editing'), type: 'text', disabled: props.mode === 'BUYER', maxlength: -1, value: (state.solitaire.info && state.solitaire.info.content) ?
                        state.solitaire.info.content : '', onFocus: function () { return setContent(__assign(__assign({}, content), { isFocused: true })); }, onBlur: function () { return setContent(__assign(__assign({}, content), { isFocused: false })); }, onInput: function (e) { return handleChange('CONTENT', e.detail.value); } })),
            react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item_title' }, "\u5907\u6CE8:"),
            react_1["default"].createElement("textarea", { className: 'solitaire_des '.concat(des.isFocused ? 'editing' : 'not_editing'), type: 'text', disabled: props.mode === 'BUYER', maxlength: -1, value: (state.solitaire.info && state.solitaire.info.des) ?
                    state.solitaire.info.des : '', onFocus: function () { return setDes(__assign(__assign({}, des), { isFocused: true })); }, onBlur: function () { return setDes(__assign(__assign({}, des), { isFocused: false })); }, onInput: function (e) { return handleChange('DES', e.detail.value); } }),
            props.mode === 'SELLER' &&
                react_1["default"].createElement(components_1.View, { className: 'flex items-center solitaire_container_item' },
                    react_1["default"].createElement(components_1.View, { className: '' }, "\u5E01\u79CD\u9009\u62E9\uFF1A"),
                    currencies && currencies.map(function (it, i) {
                        return (react_1["default"].createElement(components_1.View, { className: 'mie_button '.concat((state.solitaire.info && state.solitaire.info.currency === it.id) ? 'mie_button_choosen' : ''), onClick: function () { return handleChange('CURRENCY', it.id); } },
                            it.name,
                            " (",
                            it.unit,
                            ")"));
                    })),
            react_1["default"].createElement(PaymentOptionsSetter_1["default"], { className: 'solitaire_container_item', mode: props.mode, paymentOptions: props.mode === 'SELLER' ? paymentOptions : //卖家模式显示所有支付选项，买家模式只显示已选中的
                    (state.solitaire && state.solitaire.info && state.solitaire.info.paymentOptions), choosenPaymentOptions: state.solitaire && state.solitaire.info &&
                    state.solitaire.info.paymentOptions, handleSave: props.mode === 'SELLER' ? function (all, choosen, des) { return handleChange('PAYMENT_OPTION', all, choosen); } :
                    function (all, choosen, des) { return handleBuyerMode('PAYMENT_OPTION', choosen, des); } }),
            react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item' },
                react_1["default"].createElement(components_1.View, { className: 'flex items-center justify-between' },
                    react_1["default"].createElement(components_1.View, { className: '' }, props.type === 'EVENT' ? '集合点' : '取货方式'),
                    react_1["default"].createElement(components_1.View, { className: 'toggle_button_arrow', onClick: toggleAcc.bind(_this, 'PICK_UP_WAY') },
                        react_1["default"].createElement(components_1.View, { className: '' }, state.ifOpenPickUpWayAcc ? '展开' : '收起'),
                        react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-chevron-'.concat(state.ifOpenPickUpWayAcc ? 'down' : 'up') }))),
                state.solitaire && state.solitaire.pickUpWay &&
                    react_1["default"].createElement(components_1.View, { className: 'solitaire_pick_up_way' },
                        react_1["default"].createElement(PickUpWayContainer_1["default"], { type: props.type, ref: pickUpWayContainerRef, className: state.ifOpenPickUpWayAcc ? '' : 'hidden_item', mode: props.mode === 'SELLER' ? 'SELLER_MODIFYING' : props.mode, shop: state.solitaire, handleSave: function () { return handleChange('PICK_UP_WAY'); }, handleChoose: props.mode === 'BUYER' &&
                                (function (way, v) { return handleBuyerMode('PICK_UP_WAY', way, v); }), choosenItem: state.solitaireOrder.pickUpWay }))));
    var products = //state.solitaire &&  //*注：这里不能加这句否则ShopProductsContainer里就不会根据shopid的改变刷新了！
     react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item' },
        react_1["default"].createElement(components_1.View, { className: '' }, props.type === 'GOODS' ? '接龙商品:' : '报名选项'),
        react_1["default"].createElement(ShopProductsContainer_1["default"], { ref: shopProductsContainerRef, type: props.type, mode: props.mode === 'SELLER' ? 'SOLITAIRE_SELLER' : 'SOLITAIRE_BUYER', shop: props.mode === 'SELLER' ?
                state.solitaireShop : state.solitaire, 
            // productList={state.productList}
            // labelList={[]}
            handleSave: function () { return handleChange('PRODUCTS'); } }));
    var loginDialog = //*problem 这里没错但是ts会报错
     react_1["default"].createElement(LoginDialog_1["default"], { words: '\u8BF7\u5148\u767B\u5F55', version: 'BUYER', isOpened: state.openedDialog === 'LOGIN', onClose: function () { return toggleDialog(null); }, onCancel: function () { return toggleDialog(null); } });
    var doPurchaseDialog = react_1["default"].createElement(ActionDialog_1["default"], { type: 1, isOpened: openedDialog === 'DO_PURCHASE', cancelText: '\u53D6\u6D88', confirmText: '\u63D0\u4EA4', onClose: function () { return handleInit(); }, onCancel: function () { return handleInit(); }, onSubmit: function () { return handleSubmit('DO_PURCHASE'); } }, "\u786E\u5B9A\u63D0\u4EA4\u63A5\u9F99\uFF1F");
    return (react_1["default"].createElement(components_1.View, { className: 'solitaire_container' },
        loginDialog,
        doPurchaseDialog,
        uploadDialog,
        info,
        products,
        props.mode === 'SELLER' &&
            react_1["default"].createElement(components_1.View, { className: 'final_button', onClick: function () { return toggleDialog('UPLOAD'); } }, "\u53D1\u8D77\u63A5\u9F99/\u786E\u5B9A\u4FEE\u6539\u63A5\u9F99"),
        props.mode === 'BUYER' &&
            react_1["default"].createElement(CheckRequiredButton_1["default"], { className: 'final_button', checkedItems: [{
                        check: true,
                        toastText: '请选择报名项目！'
                    },
                ], doAction: (userManager.unionid && userManager.unionid.length > 0) ? //如果没登录就打开登录窗，否则继续提交订单
                    function () { return toggleDialog('DO_PURCHASE'); } : function () { return toggleDialog('LOGIN'); } }, "\u53C2\u4E0E\u63A5\u9F99/\u4FEE\u6539\u6211\u53C2\u4E0E\u7684\u63A5\u9F99")));
};
SolitaireContainer.defaultProps = {
    mode: 'BUYER',
    type: 'GOODS'
};
exports["default"] = SolitaireContainer;
