"use strict";
exports.__esModule = true;
var react_1 = require("react");
var taro_1 = require("@tarojs/taro");
var react_redux_1 = require("react-redux");
var Layout_1 = require("../../../components/Layout/Layout");
var SolitaireContainer_1 = require("../../../containers/SolitaireContainer/SolitaireContainer");
require("./ManageSolitairesPage.scss");
/**
 * 创建新接龙or修改現有接龙
 */
var ManageSolitairesPage = function (props) {
    var dispatch = react_redux_1.useDispatch();
    var router = taro_1.useRouter();
    var userManager = react_redux_1.useSelector(function (state) { return state.userManager; });
    var initState = {
        mode: 'ADD',
        type: router.params.type,
        solitaireShop: {
            pickUpWay: {
                selfPickUp: {
                    list: [],
                    des: ''
                },
                stationPickUp: {
                    list: [],
                    des: ''
                },
                expressPickUp: {
                    isAble: false,
                    list: [],
                    des: ''
                }
            }
        },
        solitaire: {
            pickUpWay: {
                selfPickUp: {
                    list: [],
                    des: ''
                },
                stationPickUp: {
                    list: [],
                    des: ''
                },
                expressPickUp: {
                    isAble: false,
                    list: [],
                    des: ''
                }
            }
        }
    };
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
    }, []);
    taro_1.usePullDownRefresh(function () {
        taro_1["default"].stopPullDownRefresh();
    });
    var typeName = state.type === 'EVENT' ? '活动' : '商品';
    return (react_1["default"].createElement(Layout_1["default"], { version: props.version, mode: 'SOLITAIRE', navBarKind: 2, lateralBarKind: 0, navBarTitle: (state.mode === 'ADD' ? '新建' : '修改').concat(typeName, '接龙'), ifShowTabBar: false, hideShareMenu: true },
        react_1["default"].createElement(SolitaireContainer_1["default"], { type: state.type, mode: 'SELLER', solitaireShop: state.solitaireShop, solitaire: state.solitaire })));
};
ManageSolitairesPage.defaultProps = {
    version: 'SELLER'
};
exports["default"] = ManageSolitairesPage;
