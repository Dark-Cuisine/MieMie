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
var _this = this;
exports.__esModule = true;
var react_1 = require("react");
var taro_1 = require("@tarojs/taro");
var components_1 = require("@tarojs/components");
require("./SwipeCard.scss");
/*** 可滑动的card (未完成)
 * <SwipeCard
 * canMoveLeft={true}//能左移
 * canMoveRight={true}
 * disabled={false}//是否禁止移动
 *
 * startingPosition={}//起始位置
 *
 *  attentionTextLeft='左划拒单'    //左划右划
    attentionTextRight='右划接单'

    SHOW_ATTENTION_TEXT_TH = {30}//左右划显示attentionText的阈值
    DO_ACTION_TH = 150;//左右划执行动作的阈值
    MOVE_ACTION_TH = 30;//左右划card位置移动的阈值

ifChangeColor={}//达到DO_ACTION_TH时卡片是否变色
 *
 */
var SwipeCard = function (props) {
    var initState = {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        moveX: 0,
        attentionText: ''
    };
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
    }, []);
    taro_1.usePullDownRefresh(function () {
        taro_1["default"].stopPullDownRefresh();
    });
    var handleTouchStart = function (e) {
        setState(__assign(__assign({}, state), { startX: e.touches[0].clientX, startY: e.touches[0].clientY }));
    };
    var handleTouchMove = function (e) {
        var moveX = e.touches[0].clientX - state.startX;
        var attentionText = '';
        if (props.attentionTextRight || props.attentionTextLeft) {
            (moveX > props.SHOW_ATTENTION_TEXT_TH) &&
                (attentionText = props.attentionTextRight || ''); //右移显示attentionTextLeft
            (moveX < -props.SHOW_ATTENTION_TEXT_TH) &&
                (attentionText = props.attentionTextLeft || ''); //左移显示attentionTextLeft
        }
        setState(__assign(__assign({}, state), { endX: e.touches[0].clientX, endY: e.touches[0].clientY, moveX: moveX, attentionText: attentionText }));
    };
    var handleTouchEnd = function () {
        if (state.moveX > props.DO_ACTION_TH) {
            console.log('-->');
            props.handleClickButtonRight && props.handleClickButtonRight();
        }
        else if (state.moveX < -props.DO_ACTION_TH) {
            console.log('<--');
            props.handleClickButtonLeft && props.handleClickButtonLeft();
        }
        setState(__assign(__assign({}, state), { startX: initState.startX, startY: initState.startY, endX: initState.endX, endY: initState.endY, moveX: initState.moveX, attentionText: initState.attentionText }));
    };
    var moveLeft = !props.disabled &&
        ((props.canMoveLeft && state.moveX < 0) ||
            (props.canMoveRight && state.moveX > 0)) && state.moveX;
    var changedColor = !props.disabled &&
        props.ifChangeColor &&
        props.DO_ACTION_TH &&
        (Math.abs(state.moveX) > props.DO_ACTION_TH) &&
        ((props.canMoveLeft && state.moveX < 0) ||
            (props.canMoveRight && state.moveX > 0)) && 'background:var(--light-0);';
    var style = !props.disable &&
        (Math.abs(state.moveX) > props.MOVE_ACTION_TH) &&
        ('left:'.concat((props.startingPosition + moveLeft), 'PX;', changedColor));
    // console.log('m-0', state.moveX, moveLeft,
    //   props.startingPosition, moveLeft,
    //   props.startingPosition + moveLeft);
    return (react_1["default"].createElement(components_1.View, { className: 'swipe_card '.concat(props.className), style: style, onTouchStart: handleTouchStart.bind(_this), onTouchMove: handleTouchMove.bind(_this), onTouchEnd: handleTouchEnd.bind(_this), onClick: function () { return props.onClick(); } }, props.children));
};
SwipeCard.defaultProps = {
    SHOW_ATTENTION_TEXT_TH: 30,
    DO_ACTION_TH: 0,
    MOVE_ACTION_TH: 30,
    startingPosition: 0,
    canMoveLeft: true,
    canMoveRight: true,
    disabled: false,
    ifChangeColor: false
};
exports["default"] = SwipeCard;
