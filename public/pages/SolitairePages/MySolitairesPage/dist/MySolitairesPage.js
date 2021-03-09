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
require("./MySolitairesPage.scss");
/**
 * 我发布的接龙
 */
var MySolitairesPage = function (props) {
    var dispatch = react_redux_1.useDispatch();
    var userManager = react_redux_1.useSelector(function (state) { return state.userManager; });
    var initState = {
        solitaires: []
    };
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        doUpdate();
    }, [userManager.unionid]);
    taro_1.usePullDownRefresh(function () {
        doUpdate();
        taro_1["default"].stopPullDownRefresh();
    });
    var doUpdate = function () {
        var mySolitaireShopId = userManager.userInfo.mySolitaireShops &&
            userManager.userInfo.mySolitaireShops[0]; //因为每个用户只能有一个接龙店，所以这里直接用了[0] *unfinished 要优化
        if (!mySolitaireShopId) {
            return;
        }
        dispatch(actions.toggleLoadingSpinner(true));
        wx.cloud.callFunction({
            name: 'get_data',
            data: {
                collection: 'solitaireShops',
                queryTerm: { _id: mySolitaireShopId }
            },
            success: function (res) {
                console.log('get-solitaireShops', res);
                if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
                    dispatch(actions.toggleLoadingSpinner(false));
                    return;
                }
                var solitaires = res.result.data[0].solitaires;
                if (!(solitaires && solitaires.length > 0)) {
                    dispatch(actions.toggleLoadingSpinner(false));
                    return;
                }
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
            },
            fail: function () {
                console.error;
                wx.showToast({
                    title: '获取数据失败',
                    icon: 'none'
                });
                dispatch(actions.toggleLoadingSpinner(false));
            }
        });
    };
    return (react_1["default"].createElement(Layout_1["default"], { version: props.version, className: 'my_solitaires_page', mode: 'SOLITAIRE', navBarKind: 3, navBarTitle: '\u6211\u53D1\u5E03\u7684\u63A5\u9F99' },
        react_1["default"].createElement(components_1.View, { className: 'solitaire_list' }, state.solitaires.map(function (it, i) {
            return (react_1["default"].createElement(SolitaireCard_1["default"], { solitaire: it }));
        }))));
};
MySolitairesPage.defaultProps = {
    version: 'SOLITAIRE'
};
exports["default"] = MySolitairesPage;
