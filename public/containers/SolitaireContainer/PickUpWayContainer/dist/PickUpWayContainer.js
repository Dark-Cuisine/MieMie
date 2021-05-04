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
var taro_ui_1 = require("taro-ui");
require("./PickUpWayContainer.scss");
/***
 * <PickUpWayContainer
 * type={} //'GOODS''EVENT'
 * mode={}//'BUYER''SELLER'
 />
 */
var PickUpWayContainer = function (props) {
    var initState = {
        //正在修改的项目,同时也用作init新项目
        modifyingSelfPickUp: { place: '', placeDetail: '', nearestStation: { line: '', stations: { list: [], from: '', to: '' } }, announcements: [], dates: [] }
    };
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    var words = props.type === 'GOODS' ? {
        selfPickUp: '自提点',
        stationPickUp: '送货车站'
    } : {
        selfPickUp: '集合点',
        stationPickUp: '集合车站'
    };
    react_1.useEffect(function () {
    }, []);
    taro_1.usePullDownRefresh(function () {
        taro_1["default"].stopPullDownRefresh();
    });
    var handleChange = function (way, v, i) {
        if (v === void 0) { v = null; }
        if (i === void 0) { i = null; }
        switch (way) {
            case 'SELF_PICK_UP_PLACE': //self pick up
                setState(__assign(__assign({}, state), { modifyingSelfPickUp: __assign(__assign({}, state.modifyingSelfPickUp), { place: v }) }));
                break;
            case 'SELF_PICK_UP_PLACE_DETAIL':
                setState(__assign(__assign({}, state), { modifyingSelfPickUp: __assign(__assign({}, state.modifyingSelfPickUp), { placeDetail: v }) }));
                break;
            case '':
                break;
            default:
                break;
        }
    };
    var inputForm = react_1["default"].createElement(components_1.View, { className: '' },
        react_1["default"].createElement(taro_ui_1.AtInput, { name: 'selfPickUpPlaceNew', type: 'text', title: words.selfPickUp, cursor: state.modifyingSelfPickUp.place && state.modifyingSelfPickUp.place.length, value: state.modifyingSelfPickUp.place, onChange: function (v) { return handleChange('SELF_PICK_UP_PLACE', v); } }),
        react_1["default"].createElement(taro_ui_1.AtInput, { name: 'selfPickUpPlaceDetailNew', type: 'text', title: '\u8BE6\u7EC6\u5730\u5740', cursor: state.modifyingSelfPickUp.placeDetail && state.modifyingSelfPickUp.placeDetail.length, value: state.modifyingSelfPickUp.placeDetail, onChange: function (v) { return handleChange('SELF_PICK_UP_PLACE_DETAIL', v); } }));
    return (react_1["default"].createElement(components_1.View, { className: ''.concat(props.className) }, inputForm));
};
PickUpWayContainer.defaultProps = {
    mode: 'BUYER',
    type: 'GOODS'
};
exports["default"] = PickUpWayContainer;
