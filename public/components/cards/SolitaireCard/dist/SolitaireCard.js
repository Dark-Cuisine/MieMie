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
var taro_ui_1 = require("taro-ui");
var tool_functions = require("../../../utils/functions/tool_functions");
var databaseFunctions = require("../../../utils/functions/databaseFunctions");
var ActionDialog_1 = require("../../dialogs/ActionDialog/ActionDialog");
require("./SolitaireCard.scss");
/****
 * 接龙card
 * <SolitaireCard
 * solitaire={}
   mode='SELLER',//'SELLER','BUYER'
 />
 */
var SolitaireCard = function (props) {
    var userManager = react_redux_1.useSelector(function (state) { return state.userManager; });
    var initState = {
        solitaire: props.solitaire,
        openedDialog: null
    };
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    var _b = react_1.useState(false), isOpened = _b[0], setIsOpened = _b[1]; //是否打开了action button list
    react_1.useEffect(function () {
        setState(__assign(__assign({}, state), { solitaire: initState.solitaire }));
    }, [props.solitaire]);
    taro_1.usePullDownRefresh(function () {
        taro_1["default"].stopPullDownRefresh();
    });
    var goToInsideSolitairePage = function (mode, e) {
        if (e === void 0) { e = null; }
        e && e.stopPropagation();
        setIsOpened(false);
        taro_1["default"].navigateTo({
            url: "/pages/SolitairePages/InsideSolitairePage/InsideSolitairePage?solitaireId=" + state.solitaire._id + "&mode=" + mode
        });
    };
    var handleActionButton = function (e) {
        console.log('c-click', e);
        switch (e.id) {
            case 'edit':
                goToInsideSolitairePage('SELLER');
                break;
            case 'copy':
                setState(__assign(__assign({}, state), { openedDialog: 'COPY' }));
                break;
            case 'cancel':
                setState(__assign(__assign({}, state), { openedDialog: 'CANCEL' }));
                break;
            case 'delete':
                setState(__assign(__assign({}, state), { openedDialog: 'DELETE' }));
                break;
            case '':
                break;
            default:
                break;
        }
    };
    var handleSubmit = function (way, v, i) {
        if (v === void 0) { v = null; }
        if (i === void 0) { i = null; }
        switch (way) {
            case 'DELETE': //卖家删直接删数据库里的接龙，买家删只删自己那里的
                props.mode === 'SELLER' ?
                    databaseFunctions.solitaire_functions.deleteSolitaire(state.solitaire._id, state.solitaire.solitaireShopId) :
                    databaseFunctions.solitaire_functions.deleteSolitaireIdFromUser(userManager.unionid, state.solitaire._id);
                break;
            case 'COPY':
                break;
            case 'CANCEL':
                break;
            default:
                break;
        }
        setState(__assign(__assign({}, state), { openedDialog: null }));
    };
    var deleteDialog = (react_1["default"].createElement(ActionDialog_1["default"], { type: 1, isOpened: !(state.openedDialog === null), onClose: function () { setState(__assign(__assign({}, state), { openedDialog: null })); }, onCancel: function () { setState(__assign(__assign({}, state), { openedDialog: null })); }, onSubmit: function () { return handleSubmit(state.openedDialog); }, cancelText: '\u53D6\u6D88', confirmText: '\u786E\u8BA4' },
        react_1["default"].createElement(components_1.View, { className: '' },
            "\u786E\u5B9A",
            state.openedDialog === 'DELETE' ? '删除' :
                (state.openedDialog === 'COPY' ? '复制接龙' : '取消接龙'),
            "?"),
        state.openedDialog === 'DELETE' && props.mode === 'BUYER' &&
            react_1["default"].createElement(components_1.View, { className: '' }, "(\u5220\u9664\u4EC5\u4E3A\u81EA\u5DF1\u53EF\u89C1\u3002\u5982\u8981\u53D6\u6D88\u63A5\u9F99\uFF0C\u8BF7\u70B9\u51FB'\u53D6\u6D88\u63A5\u9F99')")));
    var claseName = (state.solitaire.info.endTime.date &&
        state.solitaire.info.endTime.date.length > 0 &&
        !tool_functions.date_functions.compareDateAndTimeWithNow(state.solitaire.info.endTime.date, state.solitaire.info.endTime.time)) ?
        'solitaire_card_expired' : '';
    // console.log('claseName', tool_functions.date_functions.compareDateAndTimeWithNow(
    //   state.solitaire.info.endTime.date, state.solitaire.info.endTime.time));
    return (react_1["default"].createElement(components_1.View, { className: '' },
        deleteDialog,
        state.solitaire &&
            react_1["default"].createElement(taro_ui_1.AtSwipeAction, { className: 'solitaire_card '.concat(props.className, ' ', claseName), onClick: function (e) { return handleActionButton(e); }, isOpened: isOpened, onOpened: function () { setIsOpened(true); }, onClosed: function () { setIsOpened(false); }, options: [
                    {
                        id: 'edit',
                        text: '修改',
                        style: {
                            backgroundColor: 'var(--light-2)'
                        }
                    },
                    props.mode === 'SELLER' ? {
                        id: 'copy',
                        text: '复制',
                        style: {
                            backgroundColor: 'var(--light-3)'
                        }
                    } : {
                        id: 'cancel',
                        text: '取消接龙',
                        style: {
                            backgroundColor: 'var(--red-1)'
                        }
                    },
                    {
                        id: 'delete',
                        text: '删除',
                        style: {
                            backgroundColor: props.mode === 'SELLER' ? 'var(--red-1)' : 'var(--red-2)'
                        }
                    }
                ] },
                react_1["default"].createElement(components_1.View, { className: 'card_body', onClick: isOpened ?
                        function () { setIsOpened(false); } : function (e) { return goToInsideSolitairePage(e); } },
                    react_1["default"].createElement(components_1.View, { className: 'date_and_time' },
                        react_1["default"].createElement(components_1.View, { className: 'date_and_time' },
                            react_1["default"].createElement(components_1.View, { className: 'date' }, state.solitaire.info.startTime.date),
                            react_1["default"].createElement(components_1.View, { className: 'time' }, state.solitaire.info.startTime.time)),
                        (state.solitaire.info.endTime.date &&
                            state.solitaire.info.endTime.date.length > 0) ?
                            react_1["default"].createElement(components_1.View, { className: 'date_and_time' },
                                react_1["default"].createElement(components_1.View, { className: 'to' }, "~"),
                                react_1["default"].createElement(components_1.View, { className: 'date' }, state.solitaire.info.endTime.date),
                                react_1["default"].createElement(components_1.View, { className: 'time' }, state.solitaire.info.endTime.time)) :
                            react_1["default"].createElement(components_1.View, { className: 'word' }, "\u5F00\u59CB")),
                    react_1["default"].createElement(components_1.View, { className: 'solitaire_content' }, state.solitaire.info.content)))));
};
SolitaireCard.defaultProps = {
    mode: 'BUYER'
};
exports["default"] = SolitaireCard;
