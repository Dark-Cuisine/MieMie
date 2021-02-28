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
        ifOpenPickUpWayAcc: true
    };
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    var _b = react_1.useState(null), openedDialog = _b[0], setOpenedDialog = _b[1]; //'UPLOAD'
    var _c = react_1.useState({ isFocused: false }), des = _c[0], setDes = _c[1];
    var _d = react_1.useState(props.paymentOptions), paymentOptions = _d[0], setPaymentOptions = _d[1]; //所有paymentOptions(包括没被选中的)
    react_1.useEffect(function () {
        setState(__assign(__assign({}, state), { solitaire: initState.solitaire, solitaireShop: initState.solitaireShop }));
        if (!(props.paymentOptions)) {
            if (!classifications) {
                return;
            }
            setPaymentOptions(classifications.defaultPaymentOptionList);
        }
        else {
            setPaymentOptions(props.paymentOptions);
        }
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
    var handleChange = function (way, v) {
        if (v === void 0) { v = null; }
        switch (way) {
            case 'PICK_UP_WAY': //取货方式
                v = pickUpWayContainerRef.current.getValue();
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { pickUpWay: __assign(__assign({}, state.solitaire.pickUpWay), v) }) }));
                break;
            case 'CURRENCY': //币种
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { info: __assign(__assign({}, state.solitaire.info), { currency: v }) }) }));
                break;
            case 'DES':
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { info: __assign(__assign({}, state.solitaire.info), { des: v }) }) }));
                break;
            case 'START_DATE':
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
            case 'PAYMENT_OPTION':
                setState(__assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { info: __assign(__assign({}, state.solitaire && state.solitaire.info), { paymentOptions: v }) }) }));
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
    var handleFocus = function (focused) {
        console.log('f');
        setState(__assign(__assign({}, state), { focusedInput: focused }));
    };
    var handleBlur = function (way) {
        state.focusedInput === way ?
            console.log('a') :
            console.log('b');
        ;
    };
    var handleInit = function () {
        setState(__assign(__assign({}, state), { openedDialog: null }));
    };
    var toggleDialog = function (dialog) {
        dialog === 'UPLOAD' &&
            handleChange('PRODUCTS');
        setOpenedDialog(dialog);
    };
    var handleSubmit = function (way, v, i) {
        if (v === void 0) { v = null; }
        if (i === void 0) { i = null; }
        return __awaiter(void 0, void 0, void 0, function () {
            var _a, solitaire, products_1, solitaireShopId, tabBarList_solitaire;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = way;
                        switch (_a) {
                            case 'UPLOAD': return [3 /*break*/, 1];
                            case '': return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 10];
                    case 1:
                        console.log('UPLOAD-solitaire', state);
                        solitaire = state.solitaire;
                        products_1 = state.productList;
                        solitaireShopId = userManager.userInfo && userManager.userInfo.mySolitaireShops &&
                            userManager.userInfo.mySolitaireShops.length > 0 && userManager.userInfo.mySolitaireShops[0] //因为每个用户只能有一个接龙店，所以这里直接用了[0] *unfinished 要优化
                        ;
                        if (!(state.mode === 'ADD')) return [3 /*break*/, 6];
                        if (!!(solitaireShopId && solitaireShopId.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, databaseFunctions.solitaire_functions.addNewSoltaireShop(userManager.unionid, solitaire, products_1)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3: //否则直接把新的接龙添加到该用户的接龙店
                    return [4 /*yield*/, databaseFunctions.solitaire_functions.addNewSolitaire(userManager.unionid, solitaireShopId, solitaire, products_1)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6: //修改接龙
                    return [4 /*yield*/, databaseFunctions.solitaire_functions.addNewSolitaire(userManager.unionid, solitaireShopId, solitaire, products_1)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        dispatch(actions.setUser(userManager.unionid, userManager.openid)); //更新用户信息
                        setOpenedDialog(null);
                        tabBarList_solitaire = app.$app.globalData.classifications ?
                            app.$app.globalData.classifications.tabBar.tabBarList_solitaire : [];
                        (tabBarList_solitaire && tabBarList_solitaire.length > 0) &&
                            dispatch(actions.changeTabBarTab(tabBarList_solitaire[1]));
                        return [3 /*break*/, 11];
                    case 9: return [3 /*break*/, 11];
                    case 10: return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    var uploadDialog = react_1["default"].createElement(ActionDialog_1["default"], { type: 1, isOpened: openedDialog === 'UPLOAD', cancelText: '\u53D6\u6D88', confirmText: '\u4E0A\u4F20', onClose: function () { return handleInit(); }, onCancel: function () { return handleInit(); }, onSubmit: function () { return handleSubmit('UPLOAD'); } }, "\u786E\u5B9A\u4E0A\u4F20\uFF1F\uFF08\u56FE\u7247\u8F83\u591A\u65F6\u4E0A\u4F20\u6BD4\u8F83\u6162\uFF0C\u8BF7\u8010\u5FC3\u7B49\u5F85\uFF09");
    console.log('k-paymentOptions', paymentOptions);
    var dateAndTime = state.solitaire &&
        react_1["default"].createElement(components_1.View, { className: 'date_and_time' },
            react_1["default"].createElement(components_1.View, { className: 'flex items-center solitaire_container_item' },
                react_1["default"].createElement(components_1.View, { className: '' }, "\u5F00\u59CB\u65F6\u95F4:"),
                react_1["default"].createElement(components_1.Picker, { mode: 'date', onChange: function (v) { return handleChange('START_DATE', v.detail.value); } },
                    react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                        react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-calendar' }),
                        state.solitaire && state.solitaire.info && state.solitaire.info.startTime &&
                            react_1["default"].createElement(components_1.View, { className: '' }, state.solitaire.info.startTime.date))),
                state.solitaire && state.solitaire.info && state.solitaire.info.startTime &&
                    state.solitaire.info.startTime.date &&
                    react_1["default"].createElement(components_1.Picker, { mode: 'time', value: state.solitaire.info.startTime.time, onChange: function (v) { return handleChange('START_TIME', v.detail.value); } },
                        react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                            react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-clock' }),
                            state.solitaire.info.startTime.time))),
            react_1["default"].createElement(components_1.View, { className: 'flex items-center solitaire_container_item' },
                react_1["default"].createElement(components_1.View, { className: '' }, "\u622A\u6B62\u65F6\u95F4:"),
                react_1["default"].createElement(components_1.Picker, { mode: 'date', onChange: function (v) { return handleChange('END_DATE', v.detail.value); } },
                    react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                        react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-calendar' }),
                        state.solitaire && state.solitaire.info && state.solitaire.info.endTime &&
                            react_1["default"].createElement(components_1.View, { className: '' }, state.solitaire.info.endTime.date))),
                state.solitaire && state.solitaire.info && state.solitaire.info.endTime &&
                    state.solitaire.info.endTime.date &&
                    react_1["default"].createElement(components_1.Picker, { mode: 'time', value: state.solitaire.info.endTime.time, onChange: function (v) { return handleChange('START_TIME', v.detail.value); } },
                        react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                            react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-clock' }),
                            state.solitaire.info.endTime.time))));
    var info = state.solitaire &&
        react_1["default"].createElement(components_1.View, { className: 'info' },
            dateAndTime,
            react_1["default"].createElement(components_1.View, { className: 'flex solitaire_container_item' },
                react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item_title' }, "\u63A5\u9F99\u63CF\u8FF0:"),
                react_1["default"].createElement("textarea", { className: 'solitaire_des '.concat(des.isFocused ? 'editing' : 'not_editing'), type: 'text', maxlength: -1, value: (state.solitaire.info && state.solitaire.info.des) ?
                        state.solitaire.info.des : '', onFocus: function () { return setDes(__assign(__assign({}, des), { isFocused: true })); }, onBlur: function () { return setDes(__assign(__assign({}, des), { isFocused: false })); }, onInput: function (e) { return handleChange('DES', e.detail.value); } })),
            react_1["default"].createElement(components_1.View, { className: 'flex items-center solitaire_container_item' },
                react_1["default"].createElement(components_1.View, { className: '' }, "\u5E01\u79CD\u9009\u62E9\uFF1A"),
                currencies && currencies.map(function (it, i) {
                    return (react_1["default"].createElement(components_1.View, { className: 'mie_button '.concat((state.solitaire.info && state.solitaire.info.currency === it.id) ? 'mie_button_choosen' : ''), onClick: function () { return handleChange('CURRENCY', it.id); } },
                        it.name,
                        " (",
                        it.unit,
                        ")"));
                })),
            react_1["default"].createElement(PaymentOptionsSetter_1["default"], { className: 'solitaire_container_item', paymentOptions: paymentOptions, choosenPaymentOptions: state.solitaire && state.solitaire.info &&
                    state.solitaire.info.paymentOptions, handleSave: function (choosenPaymentOptions) { return handleChange('PAYMENT_OPTION', choosenPaymentOptions); } }),
            react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item' },
                react_1["default"].createElement(components_1.View, { className: 'flex items-center justify-between' },
                    react_1["default"].createElement(components_1.View, { className: '' }, props.type === 'EVENT' ? '集合点' : '取货方式'),
                    react_1["default"].createElement(components_1.View, { className: 'toggle_button_arrow', onClick: toggleAcc.bind(_this, 'PICK_UP_WAY') },
                        react_1["default"].createElement(components_1.View, { className: '' }, state.ifOpenPickUpWayAcc ? '展开' : '收起'),
                        react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-chevron-'.concat(state.ifOpenPickUpWayAcc ? 'down' : 'up') }))),
                state.solitaire && state.solitaire.pickUpWay &&
                    react_1["default"].createElement(components_1.View, { className: 'solitaire_pick_up_way' },
                        react_1["default"].createElement(PickUpWayContainer_1["default"], { type: props.type, ref: pickUpWayContainerRef, className: state.ifOpenPickUpWayAcc ? '' : 'hidden_item', mode: 'SELLER_MODIFYING', shop: state.solitaire, handleSave: function () { return handleChange('PICK_UP_WAY'); } }))));
    var products = state.solitaire &&
        react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item' },
            react_1["default"].createElement(components_1.View, { className: '' }, "\u63A5\u9F99\u5546\u54C1:"),
            react_1["default"].createElement(ShopProductsContainer_1["default"], { ref: shopProductsContainerRef, mode: 'SOLITAIRE_SELLER', shop: props.mode === 'SELLER' ?
                    state.solitaireShop : state.solitaire, productList: state.productList, labelList: [], handleSave: function () { return handleChange('PRODUCTS'); } }),
            state.solitaire.products && state.solitaire.products.map(function (it, i) {
                return (react_1["default"].createElement(components_1.View, { className: 'product' }, "\u3010\u5546\u54C1\u5217\u8868\u3011"));
            }));
    return (react_1["default"].createElement(components_1.View, { className: 'solitaire_container' },
        uploadDialog,
        info,
        products,
        props.mode === 'SELLER' &&
            react_1["default"].createElement(components_1.View, { className: 'final_button', onClick: function () { return toggleDialog('UPLOAD'); } }, "\u53D1\u8D77\u63A5\u9F99/\u786E\u5B9A\u4FEE\u6539\u63A5\u9F99")));
};
SolitaireContainer.defaultProps = {
    mode: 'BUYER',
    type: 'GOODS'
};
exports["default"] = SolitaireContainer;
