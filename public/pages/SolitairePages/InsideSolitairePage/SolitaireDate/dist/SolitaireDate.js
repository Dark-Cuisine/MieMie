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
exports.__esModule = true;
var react_1 = require("react");
var taro_1 = require("@tarojs/taro");
var react_redux_1 = require("react-redux");
var components_1 = require("@tarojs/components");
var dayjs_1 = require("dayjs");
require("./SolitaireDate.scss");
/***
 *
 * <SolitaireDate
        type={state.type} //'EVENT'活动接龙,'GOODS'商品接龙
        mode={mode} //'BUYER','SELLER'
        solitaire={state.solitaire}
        solitaireShop={state.solitaireShop} //mode==='SELLER'时才需要这个
      />
 */
var SolitaireDate = function (props) {
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
        console.log('p-props.solitaire', props.solitaire, 'props.solitaireOrder', props.solitaireOrder);
        setState(__assign(__assign({}, state), { solitaire: initState.solitaire, solitaireShop: initState.solitaireShop }));
        setPaymentOptions(initPaymentOptions);
    }, [props.solitaire, props.solitaireShop, props.paymentOptions, app.$app.globalData.classifications]);
    react_1.useEffect(function () {
    }, []);
    taro_1.usePullDownRefresh(function () {
        taro_1["default"].stopPullDownRefresh();
    });
    var handleChange = function (way, v, v_2) {
        if (v === void 0) { v = null; }
        if (v_2 === void 0) { v_2 = null; }
        var newState = {};
        switch (way) {
            case 'START_DATE': //date and time
                newState = __assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { info: __assign(__assign({}, state.solitaire && state.solitaire.info), { startTime: __assign(__assign({}, state.solitaire.info && state.solitaire.info.startTime), { date: v, time: state.solitaire && state.solitaire.info &&
                                    state.solitaire.info.startTime && state.solitaire.info.startTime.time ?
                                    state.solitaire.info.startTime.time : dayjs_1["default"]().format('HH:mm') }) }) }) });
                break;
            case 'END_DATE':
                newState = __assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { info: __assign(__assign({}, state.solitaire && state.solitaire.info), { endTime: __assign(__assign({}, state.solitaire.info && state.solitaire.info.endTime), { date: v, time: state.solitaire && state.solitaire.info &&
                                    state.solitaire.info.endTime && state.solitaire.info.endTime.time ?
                                    state.solitaire.info.endTime.time : dayjs_1["default"]().format('HH:mm') }) }) }) });
                break;
            case 'START_TIME':
                newState = __assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { info: __assign(__assign({}, state.solitaire && state.solitaire.info), { startTime: __assign(__assign({}, state.solitaire.info && state.solitaire.info.startTime), { time: v }) }) }) });
                break;
            case 'END_TIME':
                newState = __assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { info: __assign(__assign({}, state.solitaire && state.solitaire.info), { endTime: __assign(__assign({}, state.solitaire.info && state.solitaire.info.endTime), { time: v }) }) }) });
                break;
            case 'EVENT_START_DATE': //event date and time
                newState = __assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { eventTime: __assign(__assign({}, state.solitaire && state.solitaire.eventTime), { startTime: __assign(__assign({}, state.solitaire.eventTime && state.solitaire.eventTime.startTime), { date: v, time: state.solitaire && state.solitaire.eventTime &&
                                    state.solitaire.eventTime.startTime && state.solitaire.eventTime.startTime.time ?
                                    state.solitaire.eventTime.startTime.time : dayjs_1["default"]().format('HH:mm') }) }) }) });
                break;
            case 'EVENT_END_DATE':
                newState = __assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { eventTime: __assign(__assign({}, state.solitaire && state.solitaire.eventTime), { endTime: __assign(__assign({}, state.solitaire.eventTime && state.solitaire.eventTime.endTime), { date: v, time: state.solitaire && state.solitaire.eventTime &&
                                    state.solitaire.eventTime.endTime && state.solitaire.eventTime.endTime.time ?
                                    state.solitaire.eventTime.endTime.time : dayjs_1["default"]().format('HH:mm') }) }) }) });
                break;
            case 'EVENT_START_TIME':
                newState = __assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { eventTime: __assign(__assign({}, state.solitaire && state.solitaire.eventTime), { startTime: __assign(__assign({}, state.solitaire.info && state.solitaire.eventTime.startTime), { time: v }) }) }) });
                break;
            case 'EVENT_END_TIME':
                newState = __assign(__assign({}, state), { solitaire: __assign(__assign({}, state.solitaire), { eventTime: __assign(__assign({}, state.solitaire && state.solitaire.eventTime), { endTime: __assign(__assign({}, state.solitaire.eventTime && state.solitaire.eventTime.endTime), { time: v }) }) }) });
                break;
            case '':
                break;
            default:
                newState = state;
                break;
        }
        setState(newState);
        props.handleChange(newState.solitaire);
    };
    return state.solitaire && (react_1["default"].createElement(components_1.View, { className: 'solitaire_date date_and_time solitaire_container_item'.concat(props.className) },
        react_1["default"].createElement(components_1.View, { className: 'date_and_time solitaire_container_item' },
            react_1["default"].createElement(components_1.View, { className: 'solitaire_container_item_title' },
                props.type === 'GOODS' ? '接龙时间' : '报名时间',
                react_1["default"].createElement(components_1.View, { className: 'line_horizontal_bold' })),
            react_1["default"].createElement(components_1.View, { className: 'date_time_item' },
                react_1["default"].createElement(components_1.View, { className: 'flex items-center ' },
                    react_1["default"].createElement(components_1.Picker, { mode: 'date', value: state.solitaire.info.startTime && state.solitaire.info.startTime.date, 
                        // disabled={props.mode === 'BUYER'}
                        onChange: function (v) { return handleChange('START_DATE', v.detail.value); } },
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
                react_1["default"].createElement(components_1.View, { className: 'word' }, "\u622A\u6B62"))),
        props.type === 'EVENT' &&
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
                                    react_1["default"].createElement(components_1.View, { className: '' }, "\u6C38\u4E0D\u622A\u6B62"))),
                        state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.endTime &&
                            state.solitaire.eventTime.endTime.date &&
                            react_1["default"].createElement(components_1.Picker, { mode: 'time', disabled: props.mode === 'BUYER', value: state.solitaire.eventTime.endTime.time, onChange: function (v) { return handleChange('EVENT_END_TIME', v.detail.value); } },
                                react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                                    react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-clock' }),
                                    state.solitaire.eventTime.endTime.time))),
                    react_1["default"].createElement(components_1.View, { className: 'word' }, "\u622A\u6B62")))));
};
SolitaireDate.defaultProps = {
    mode: 'BUYER',
    type: 'GOODS'
};
exports["default"] = SolitaireDate;
