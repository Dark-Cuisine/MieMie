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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var components_1 = require("@tarojs/components");
var taro_ui_1 = require("taro-ui");
var MultipleChoiceButtonsBox_1 = require("../MultipleChoiceButtonsBox/MultipleChoiceButtonsBox");
var tool_functions = require("../../utils/functions/tool_functions");
require("./PaymentOptionsSetter.scss");
var MAX_PAYMENT_OPTION_OPTION_LENGTH = 10;
/***
 * <PaymentOptionsSetter
         mode= 'BUYER',
        ifShowRequiredMark={true}
        paymentOptions={paymentOptions}
        handleSave={(items) => handleChange('PAYMENT_OPTIONS', items)}
      />
 */
var PaymentOptionsSetter = function (props) {
    var app = getApp();
    var classifications = app.$app.globalData.classifications && app.$app.globalData.classifications;
    var defaultPaymentOptionList = classifications ? classifications.defaultPaymentOptionList : [];
    var userManager = react_redux_1.useSelector(function (state) { return state.userManager; });
    var initState = {
        paymentOptions: (props.paymentOptions && props.paymentOptions.length > 0) ?
            props.paymentOptions :
            ((userManager.userInfo.paymentOptions && userManager.userInfo.paymentOptions.length > 0) ?
                userManager.userInfo.paymentOptions :
                defaultPaymentOptionList),
        choosenPaymentOptions: props.choosenPaymentOptions ? props.choosenPaymentOptions : [],
        des: '',
        ifShowOptionInput: false,
        optionInput: '',
        openedDialog: null,
        ifHideAccounts: false
    };
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        setState(__assign(__assign({}, state), { paymentOptions: initState.paymentOptions }));
    }, [props.paymentOptions, app.$app.globalData.classifications]);
    react_1.useEffect(function () {
        // console.log('state.choosenPaymentOptions',state.choosenPaymentOptions);
        props.handleSave(state.paymentOptions, state.choosenPaymentOptions, state.des); //保存
    }, [state.choosenPaymentOptions, state.des]);
    var handlePaymentOptionsOption = function (way, v, i) {
        if (v === void 0) { v = null; }
        if (i === void 0) { i = null; }
        var updatedPeymentOptions = state.paymentOptions;
        var updatedChoosen = [];
        switch (way) {
            case 'CLICK_OPTION': //选择or取消选择option
                updatedChoosen = v.map(function (it, i) {
                    var index = state.paymentOptions.findIndex(function (item) {
                        return it.id === item.id;
                    });
                    return state.paymentOptions[index];
                });
                setState(__assign(__assign({}, state), { 
                    // paymentOptions: updatedPeymentOptions,
                    choosenPaymentOptions: updatedChoosen, optionInput: initState.optionInput, ifShowOptionInput: false }));
                break;
            case 'SHOW_ADD_OPTION': //显示添加新payment option的input
                setState(__assign(__assign({}, state), { ifShowOptionInput: true }));
                break;
            case 'CHANGE_OPTION_INPUT': //修改新payment option的input
                setState(__assign(__assign({}, state), { optionInput: (v && v.length > MAX_PAYMENT_OPTION_OPTION_LENGTH) ?
                        v.slice(0, MAX_PAYMENT_OPTION_OPTION_LENGTH) : v }));
                break;
            case 'SUBMIT_ADD_OPTION': //确定添加新付款方式的标签
                var newPaymentOption = { id: tool_functions.getRandomId(), option: state.optionInput, account: '' };
                setState(__assign(__assign({}, state), { choosenPaymentOptions: __spreadArrays(state.choosenPaymentOptions, [newPaymentOption]), paymentOptions: __spreadArrays(state.paymentOptions, [newPaymentOption]), ifShowOptionInput: false, optionInput: initState.optionInput }));
                break;
            case 'CANCEL_ADD_OPTION': //取消添加新payment option
                setState(__assign(__assign({}, state), { ifShowOptionInput: false, optionInput: initState.optionInput }));
                break;
            case 'DELETE':
                updatedChoosen = state.choosenPaymentOptions;
                var index = state.paymentOptions.findIndex(function (it, index) {
                    return it.id == v;
                });
                if (index > -1) {
                    updatedChoosen.splice(index, 1);
                }
                updatedPeymentOptions.splice(i, 1);
                setState(__assign(__assign({}, state), { choosenPaymentOptions: updatedChoosen, paymentOptions: updatedPeymentOptions }));
                break;
            case '':
                break;
            default:
                break;
        }
    };
    var handlePaymentOptionsAccount = function (way, value, id) {
        if (value === void 0) { value = null; }
        if (id === void 0) { id = null; }
        var updatedPeymentOptions = state.paymentOptions;
        var updatedChoosen = state.choosenPaymentOptions;
        var updatedItem = null;
        var index = state.paymentOptions.findIndex(function (it) {
            return id == it.id;
        });
        var index_2 = state.choosenPaymentOptions.findIndex(function (it) {
            return id == it.id;
        });
        switch (way) {
            case 'CHANGE_INPUT': //改变payment account的input
                updatedItem = __assign(__assign({}, state.paymentOptions[index]), { account: value });
                updatedChoosen.splice(index_2, 1, updatedItem);
                updatedPeymentOptions[index].account = value;
                setState(__assign(__assign({}, state), { paymentOptions: updatedPeymentOptions, choosenPaymentOptions: updatedChoosen, optionInput: initState.optionInput, ifShowOptionInput: false }));
                break;
            case 'SET_SAME_AS_ABOVE': //payment account的input设为同上
                if ((state.choosenPaymentOptions[index_2].option === '现金') && (index_2 > 1)) {
                    updatedItem = __assign(__assign({}, state.choosenPaymentOptions[index_2]), { account: state.choosenPaymentOptions[index_2 - 2].account });
                }
                else {
                    updatedItem = __assign(__assign({}, state.choosenPaymentOptions[index_2]), { account: state.choosenPaymentOptions[index_2 - 1].account });
                }
                updatedPeymentOptions.splice(index, 1, updatedItem);
                updatedChoosen.splice(index_2, 1, updatedItem);
                setState(__assign(__assign({}, state), { paymentOptions: updatedPeymentOptions, choosenPaymentOptions: updatedChoosen, optionInput: initState.optionInput, ifShowOptionInput: false }));
                break;
            case '':
                break;
            default:
                break;
        }
    };
    var handleBuyerMode = function (way, v) {
        if (v === void 0) { v = null; }
        switch (way) {
            case 'CHOOSE':
                setState(__assign(__assign({}, state), { choosenPaymentOptions: [v] }));
                break;
            case 'DES':
                setState(__assign(__assign({}, state), { des: v }));
                break;
            case '':
                break;
            default:
                break;
        }
    };
    var toggleHideAccounts = function () {
        setState(__assign(__assign({}, state), { ifHideAccounts: !state.ifHideAccounts }));
    };
    var options = react_1["default"].createElement(components_1.View, { className: '' },
        react_1["default"].createElement(components_1.View, { className: 'flex' },
            props.ifShowRequiredMark && react_1["default"].createElement(components_1.View, { className: 'required_mark' }, "*"),
            react_1["default"].createElement(components_1.View, { className: 'title flex' },
                " \u4ED8\u6B3E\u65B9\u5F0F\uFF1A",
                react_1["default"].createElement(components_1.View, { style: 'color:var(--gray-2)' }, "(\u8D26\u53F7\u53EA\u5BF9\u63D0\u4EA4\u8BA2\u5355\u7528\u6237\u53EF\u89C1)"))),
        react_1["default"].createElement(MultipleChoiceButtonsBox_1["default"], { itemList: state.paymentOptions.map(function (it) {
                return { id: it.id, name: it.option };
            }), choosenList: state.choosenPaymentOptions &&
                state.choosenPaymentOptions.map(function (it) {
                    return { id: it.id, name: it.option };
                }), onChoose: function (itemList) { return handlePaymentOptionsOption('CLICK_OPTION', itemList); }, isDeletable: true, handleDelete: function (id) { return handlePaymentOptionsOption('DELETE', id); } },
            state.ifShowOptionInput || //*注:这里不能用?:函数
                react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-add-circle ', onClick: function () { return handlePaymentOptionsOption('SHOW_ADD_OPTION'); } }),
            state.ifShowOptionInput &&
                react_1["default"].createElement(components_1.View, { className: 'add_payment_option ' },
                    react_1["default"].createElement(taro_ui_1.AtInput, { name: 'add_payment_option_input', value: state.optionInput, cursor: state.optionInput && state.optionInput.length, onChange: function (value) { return handlePaymentOptionsOption('CHANGE_OPTION_INPUT', value); } }),
                    react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-close action_button', onClick: function () { return handlePaymentOptionsOption('CANCEL_ADD_OPTION'); } }),
                    react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-check action_button', onClick: function () { return handlePaymentOptionsOption('SUBMIT_ADD_OPTION'); } }))));
    var accounts = state.choosenPaymentOptions &&
        state.choosenPaymentOptions.length > 0 &&
        react_1["default"].createElement(components_1.View, { className: 'accounts' }, (state.ifHideAccounts ?
            react_1["default"].createElement(components_1.View, { className: 'toggle_button_arrow', onClick: function () { return toggleHideAccounts(); } },
                react_1["default"].createElement(components_1.View, { className: '' }, "\u8BE6\u7EC6\u4FE1\u606F"),
                react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-chevron-up' })) :
            react_1["default"].createElement(components_1.View, { className: '' },
                react_1["default"].createElement(components_1.View, { className: 'toggle_button_arrow', onClick: function () { return toggleHideAccounts(); } },
                    react_1["default"].createElement(components_1.View, { className: '' }, "\u8BE6\u7EC6\u4FE1\u606F"),
                    react_1["default"].createElement(components_1.View, { className: 'at-icon at-icon-chevron-down' })),
                state.choosenPaymentOptions.map(function (it, i) {
                    return ((it.option === '现金') ?
                        react_1["default"].createElement(taro_ui_1.AtInput, { key: i, editable: false, name: 'payment_option_accout_item_input_'.concat(i), title: it.option }) :
                        react_1["default"].createElement(taro_ui_1.AtInput, { key: i, name: 'payment_option_accout_item_input_'.concat(i), title: it.option, placeholder: it.option + '账号', cursor: it.account && it.account.length, value: it.account, onChange: function (value) { return handlePaymentOptionsAccount('CHANGE_INPUT', value, it.id); } }, ((i > 0) &&
                            !((i === 1) && (state.choosenPaymentOptions[0].option === '现金'))) ?
                            react_1["default"].createElement(components_1.View, { className: 'set_same_button mie_button', onClick: function () { return handlePaymentOptionsAccount('SET_SAME_AS_ABOVE', null, it.id); } }, "\u540C\u4E0A") :
                            react_1["default"].createElement(components_1.View, { className: 'set_same_button mie_button set_same_button_transparent' }, "\u540C\u4E0A")));
                }))));
    var options_and_accounts = react_1["default"].createElement(components_1.View, { className: ' ' },
        state.paymentOptions && state.paymentOptions.map(function (it, i) {
            return (react_1["default"].createElement(components_1.View, { className: 'flex items-center' },
                react_1["default"].createElement(components_1.View, { className: 'item '.concat((it.option == state.choosenPaymentOptions.option) ?
                        'mie_button mie_button_choosen' : 'mie_button'), onClick: function () { return handleBuyerMode('CHOOSE', it); } }, it.option),
                state.paymentOption && (it.option == state.paymentOption.option) &&
                    (react_1["default"].createElement(components_1.View, { className: '' },
                        "(\u5356\u5BB6\u8D26\u6237\uFF1A",
                        it.account,
                        ")"))));
        }),
        state.choosenPaymentOptions.option && state.choosenPaymentOptions.length > 0 &&
            react_1["default"].createElement(taro_ui_1.AtInput, { name: 'payment_des', title: '\u4ED8\u6B3E\u4EBA\u4FE1\u606F', placeholder: '\u4ED8\u6B3E\u8D26\u6237\u540D\u54A9\u54A9', cursor: state.des && state.des.length, value: state.des, onChange: function (v) { return handleBuyerMode('DES', v); } }));
    return (react_1["default"].createElement(components_1.View, { className: 'payment_options_setter '.concat(props.className) },
        props.mode === 'SELLER' && options,
        props.mode === 'SELLER' && accounts,
        props.mode === 'BUYER' && options_and_accounts));
};
PaymentOptionsSetter.defaultProps = {
    mode: 'BUYER',
    ifShowRequiredMark: false
};
exports["default"] = PaymentOptionsSetter;
