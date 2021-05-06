"use strict";
exports.__esModule = true;
var react_1 = require("react");
var taro_1 = require("@tarojs/taro");
var components_1 = require("@tarojs/components");
var SwipeCard_1 = require("../SwipeCard/SwipeCard");
require("./SwipeActionCard.scss");
var FIXED_POSITION = -180; //固定时的位置
/***
 * <SwipeActionCard
 * onClick = {(e) => handleActionButton(e)}//返回被点击option的id
isOpened = { isOpened }
onOpened = {() => { setIsOpened(true); }}
onClosed = {() => { setIsOpened(false); }}
options = {[
    {
      id: 'edit',
      text: '修改',
      style: {
        backgroundColor: 'var(--light-2)'
      }
    }
  ]}
 * disabled={}
 *
 * />
 */
var SwipeActionCard = function (props) {
    var initState = {};
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    var _b = react_1.useState(props.isOpened), isOpened = _b[0], setOpened = _b[1];
    react_1.useEffect(function () {
        setOpened(props.isOpened);
    }, [props.isOpened]);
    taro_1.usePullDownRefresh(function () {
        taro_1["default"].stopPullDownRefresh();
    });
    return (react_1["default"].createElement(components_1.View, { className: 'swipe_action_card '.concat(props.className) },
        react_1["default"].createElement(SwipeCard_1["default"], { className: 'swipe_action_card_content '.concat(isOpened && 'fixed'), canMoveRight: isOpened || false, disabled: props.disabled, DO_ACTION_TH: isOpened ? 30 : 50, ifChangeColor: false, handleClickButtonLeft: function () { return props.onOpened(); }, handleClickButtonRight: function () { return props.onClosed(); }, startingPosition: isOpened && FIXED_POSITION, onClick: isOpened ?
                function () { return props.onClosed(); } :
                function () { return props.onClick(); } }, props.children),
        react_1["default"].createElement(components_1.View, { className: 'swipe_action_card_options' }, props.options &&
            props.options.map(function (it, i) {
                return (react_1["default"].createElement(components_1.View, { className: 'option_button', style: it.style, onClick: function () { return props.onClick(it); } }, it.text));
            }))));
};
SwipeActionCard.defaultProps = {
    disabled: false,
    onClick: function () { }
};
exports["default"] = SwipeActionCard;
