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
var components_1 = require("@tarojs/components");
var tool_functions = require("../../../utils/functions/tool_functions");
require("./SolitaireCard.scss");
/****
 * 接龙card
 * <SolitaireCard
 * solitaire={}
 
 />
 */
var SolitaireCard = function (props) {
    var initState = {
        solitaire: props.solitaire
    };
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        setState(__assign(__assign({}, state), { solitaire: initState.solitaire }));
    }, [props.solitaire]);
    taro_1.usePullDownRefresh(function () {
        taro_1["default"].stopPullDownRefresh();
    });
    var goToInsideSolitairePage = function (mode, e) {
        if (e === void 0) { e = null; }
        e && e.stopPropagation();
        taro_1["default"].navigateTo({
            url: "/pages/SolitairePages/InsideSolitairePage/InsideSolitairePage?solitaireId=" + state.solitaire._id + "&mode=" + mode
        });
    };
    var claseName = (state.solitaire.info.endTime.date &&
        state.solitaire.info.endTime.date.length > 0 &&
        !tool_functions.date_functions.compareDateAndTimeWithNow(state.solitaire.info.endTime.date, state.solitaire.info.endTime.time)) ?
        'solitaire_card_expired' : '';
    // console.log('claseName', tool_functions.date_functions.compareDateAndTimeWithNow(
    //   state.solitaire.info.endTime.date, state.solitaire.info.endTime.time));
    // console.log('state.solitaire', state.solitaire);
    return (react_1["default"].createElement(components_1.View, { className: 'solitaire_card '.concat(props.className, ' ', claseName), onClick: function () { return goToInsideSolitairePage('BUYER'); } },
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
        react_1["default"].createElement(components_1.View, { className: 'solitaire_content' }, state.solitaire.info.content),
        react_1["default"].createElement(components_1.View, { className: 'modify_button' },
            react_1["default"].createElement(components_1.View, { className: 'mie_button ', onClick: function (e) { return goToInsideSolitairePage('SELLER', e); } }, "\u4FEE\u6539"))));
};
SolitaireCard.defaultProps = {};
exports["default"] = SolitaireCard;
