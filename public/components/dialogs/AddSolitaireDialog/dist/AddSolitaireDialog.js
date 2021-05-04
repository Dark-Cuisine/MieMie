"use strict";
exports.__esModule = true;
var react_1 = require("react");
var taro_1 = require("@tarojs/taro");
var components_1 = require("@tarojs/components");
var Dialog_1 = require("../Dialog/Dialog");
require("./AddSolitaireDialog.scss");
/***
 * <AddSolitaireDialog
 * isOpened={state.isOpened}
  * onClose={()=>()}
  * />
 */
var AddSolitaireDialog = function (props) {
    var initState = {};
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
    }, []);
    taro_1.usePullDownRefresh(function () {
        taro_1["default"].stopPullDownRefresh();
    });
    var navigateTo = function (way) {
        console.log('', way);
        switch (way) {
            case 'EVENT':
                taro_1["default"].navigateTo({
                    url: "/pages/SolitairePages/InsideSolitairePage/InsideSolitairePage?type=" + 'EVENT' + "&mode=" + 'SELLER'
                });
                break;
            case 'GOODS':
                taro_1["default"].navigateTo({
                    url: "/pages/SolitairePages/InsideSolitairePage/InsideSolitairePage?type=" + 'GOODS' + "&mode=" + 'SELLER'
                });
                break;
            case '':
                break;
            default:
                break;
        }
        props.onClose();
    };
    return (react_1["default"].createElement(Dialog_1["default"], { className: 'add_solitaire_dialog', isOpened: props.isOpened, onClose: props.onClose, title: '\u53D1\u5E03\u63A5\u9F99' },
        react_1["default"].createElement(components_1.View, { className: 'content' },
            react_1["default"].createElement(components_1.View, { className: 'img_button', onClick: function () { return navigateTo('EVENT'); } }, "\u6D3B\u52A8\u63A5\u9F99"),
            react_1["default"].createElement(components_1.View, { className: 'line_vertical' }),
            react_1["default"].createElement(components_1.View, { className: 'img_button', onClick: function () { return navigateTo('GOODS'); } }, "\u5546\u54C1\u63A5\u9F99"))));
};
AddSolitaireDialog.defaultProps = {};
exports["default"] = AddSolitaireDialog;
