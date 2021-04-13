"use strict";
exports.__esModule = true;
var react_1 = require("react");
var taro_1 = require("@tarojs/taro");
var components_1 = require("@tarojs/components");
require("./SwipeCard.scss");
var SHOW_ATTENTION_TEXT_TH = 30; //左右划显示attentionText的阈值
var DO_ACTION_TH = 150; //左右划执行动作的阈值
var MOVE_ACTION_TH = 30; //左右划card位置移动的阈值
/*** 可滑动的card (未完成)
 * <SwipeCard
 * mode={}//0:左移 1:右移 2:左右移
 *
 * buttonList=[{
 * word:'修改',
 * onClick:()=>xxx(),
 * }]
 */
var SwipeCard = function (props) {
    var initState = {};
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
    }, []);
    taro_1.usePullDownRefresh(function () {
        taro_1["default"].stopPullDownRefresh();
    });
    return (react_1["default"].createElement(components_1.View, { className: 'swipe_card'.concat(props.className), style: (Math.abs(state.moveX) > MOVE_ACTION_TH) &&
            'left:'.concat(state.moveX, 'px;').concat((Math.abs(state.moveX) > DO_ACTION_TH) ? 'background:var(--light-0);' : '') }));
};
SwipeCard.defaultProps = {};
exports["default"] = SwipeCard;
