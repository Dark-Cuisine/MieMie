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
var actions = require("../../../redux/actions");
var SolitaireCard_1 = require("../../../components/cards/SolitaireCard/SolitaireCard");
var Layout_1 = require("../../../components/Layout/Layout");
require("./MyActivitiesPage.scss");
/**
 * 我参与的接龙
 */
var MyActivitiesPage = function (props) {
    var dispatch = react_redux_1.useDispatch();
    var userManager = react_redux_1.useSelector(function (state) { return state.userManager; });
    var layoutManager = react_redux_1.useSelector(function (state) { return state.layoutManager; });
    var initState = {
        solitaires: [],
        solitaireOrders: []
    };
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    var _b = react_1.useState(null), openedCardId = _b[0], setOpenedCardId = _b[1];
    react_1.useEffect(function () {
        console.log('k-1', state);
        doUpdate();
    }, [userManager.unionid, userManager.userInfo, layoutManager.currentTabId]);
    taro_1.usePullDownRefresh(function () {
        doUpdate();
        taro_1["default"].stopPullDownRefresh();
    });
    var doUpdate = function () {
        setOpenedCardId(null);
        var solitaireOrderObjs = userManager.userInfo.solitaireOrders;
        if (!(solitaireOrderObjs && solitaireOrderObjs.length > 0)) {
            setState(__assign(__assign({}, state), { solitaires: [] }));
            return;
        }
        var solitaires = solitaireOrderObjs.map(function (it) {
            return it.solitaireId;
        });
        dispatch(actions.toggleLoadingSpinner(true));
        wx.cloud.callFunction({
            name: 'get_data',
            data: {
                collection: 'solitaires',
                operatedItem: '_ID',
                orderBy: 'createTime',
                desc: 'desc',
                queriedList: solitaires
            },
            success: function (r) {
                dispatch(actions.toggleLoadingSpinner(false));
                if (!(r && r.result && r.result.data && r.result.data.length > 0)) {
                    return;
                }
                setState(__assign(__assign({}, state), { solitaires: r.result.data }));
            },
            fail: function () {
                dispatch(actions.toggleLoadingSpinner(false));
                wx.showToast({
                    title: '获取数据失败',
                    icon: 'none'
                });
                console.error;
            }
        });
    };
    var goToInsideSolitairePage = function (mode, solitaire) {
        taro_1["default"].navigateTo({
            url: "/pages/SolitairePages/InsideSolitairePage/InsideSolitairePage?solitaireId=" + solitaire._id + "&mode=" + mode
        });
    };
    var getSolitaireOrderId = function (solitaireId) {
        var index = userManager.userInfo.solitaireOrders.findIndex(function (it) {
            return (it.solitaireId == solitaireId);
        });
        return index < 0 ? null :
            userManager.userInfo.solitaireOrders[index].orderId;
    };
    return (react_1["default"].createElement(Layout_1["default"], { version: props.version, className: 'my_activities_page', mode: 'SOLITAIRE', navBarKind: 3, navBarTitle: '\u6211\u53C2\u4E0E\u7684\u63A5\u9F99' },
        react_1["default"].createElement(components_1.View, { className: 'solitaire_list' }, state.solitaires && state.solitaires.length > 0 &&
            state.solitaires.map(function (it, i) {
                return (react_1["default"].createElement(SolitaireCard_1["default"], { solitaire: it, mode: 'BUYER', isOpened: it._id === openedCardId, onOpened: function (id) { setOpenedCardId(id); }, onClosed: function () { setOpenedCardId(null); } }));
            }))));
};
MyActivitiesPage.defaultProps = {
    version: 'SOLITAIRE'
};
exports["default"] = MyActivitiesPage;
