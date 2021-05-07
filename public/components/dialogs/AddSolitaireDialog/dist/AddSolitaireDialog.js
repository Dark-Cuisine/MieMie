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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var taro_1 = require("@tarojs/taro");
var components_1 = require("@tarojs/components");
var Dialog_1 = require("../Dialog/Dialog");
require("./AddSolitaireDialog.scss");
var eventPNG_Ids = [
    'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/1.png',
    'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/2.png',
    'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/3.png',
    'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/4.png',
    'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/5.png',
    'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/6.png',
    'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/7.png',
    'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/hulaHoop/8.png',
];
var goodsPNG_Ids = [
    'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/camelWalking/1.png',
    'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/camelWalking/2.png',
    'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/camelWalking/3.png',
    'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/camelWalking/4.png',
    'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/camelWalking/5.png',
    'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/animations/camelWalking/6.png',
];
var defaultEventPNG = 4;
var defaultGoodsPNG = 5;
/***
 * <AddSolitaireDialog
 * isOpened={state.isOpened}
  * onClose={()=>()}
  * />
 */
var AddSolitaireDialog = function (props) {
    var initState = {
        eventPNG_urls: [],
        goodsPNG_urls: [],
        startTime: null,
        lastClickTime: null,
        currentType: null
    };
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    var _b = react_1.useState(defaultEventPNG), eventPNG = _b[0], setEventPNG = _b[1];
    var _c = react_1.useState(defaultGoodsPNG), goodsPNG = _c[0], setGoodsPNG = _c[1];
    react_1.useEffect(function () {
        initImg();
    }, []);
    react_1.useEffect(function () {
        console.log('g-0', state.currentType);
        if (!(state.currentType === null)) {
            setTimeout(function () {
                state.currentType === 'EVENT' ?
                    setEventPNG(((eventPNG + 1) < (eventPNG_Ids && eventPNG_Ids.length)) ?
                        (eventPNG + 1) : 0) :
                    setGoodsPNG(((goodsPNG + 1) < (goodsPNG_Ids && goodsPNG_Ids.length)) ?
                        (goodsPNG + 1) : 0);
            }, 200);
        }
        else {
            setEventPNG(defaultEventPNG);
            setGoodsPNG(defaultGoodsPNG);
        }
    }, [state.currentType, eventPNG, goodsPNG]);
    taro_1.usePullDownRefresh(function () {
        taro_1["default"].stopPullDownRefresh();
    });
    var handleTouchStart = function (way, e) {
        if (state.currentType === null) {
            setState(__assign(__assign({}, state), { lastClickTime: e.timeStamp, currentType: way }));
        }
        else {
            setState(__assign(__assign({}, state), { lastClickTime: e.timeStamp }));
        }
    };
    var handleTouchEnd = function (e) {
        var gap = e.timeStamp - state.lastClickTime;
        if (gap < 400) {
            navigateTo(state.currentType);
        }
        setState(__assign(__assign({}, state), { lastClickTime: null, startTime: null, currentType: null }));
    };
    var initImg = function () { return __awaiter(void 0, void 0, void 0, function () {
        var r_1, r_2, eventPNG_urls, goodsPNG_urls;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, wx.cloud.callFunction({
                        name: 'get_temp_file_url',
                        data: {
                            fileList: eventPNG_Ids
                        }
                    })];
                case 1:
                    r_1 = _a.sent();
                    return [4 /*yield*/, wx.cloud.callFunction({
                            name: 'get_temp_file_url',
                            data: {
                                fileList: goodsPNG_Ids
                            }
                        })];
                case 2:
                    r_2 = _a.sent();
                    eventPNG_urls = r_1.result || [];
                    goodsPNG_urls = r_2.result || [];
                    console.log('g-goodsPNG_urls', goodsPNG_urls);
                    setState(__assign(__assign({}, state), { eventPNG_urls: eventPNG_urls, goodsPNG_urls: goodsPNG_urls }));
                    return [2 /*return*/];
            }
        });
    }); };
    var navigateTo = function (way) {
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
    console.log('g-3', eventPNG, goodsPNG);
    return (react_1["default"].createElement(Dialog_1["default"], { className: 'add_solitaire_dialog', isOpened: props.isOpened, onClose: props.onClose, title: '\u53D1\u5E03\u63A5\u9F99' },
        react_1["default"].createElement(components_1.View, { className: 'content' },
            react_1["default"].createElement(components_1.View, { className: 'img_button', onClick: function () { return navigateTo('EVENT'); }, onTouchStart: function (e) { return handleTouchStart('EVENT', e); }, onTouchEnd: function (e) { return handleTouchEnd(e); } },
                react_1["default"].createElement(components_1.View, { className: 'word' }, "\u6D3B\u52A8\u63A5\u9F99"),
                state.eventPNG_urls && state.eventPNG_urls.length > 0 &&
                    react_1["default"].createElement(components_1.Image, { src: state.eventPNG_urls[eventPNG] })),
            react_1["default"].createElement(components_1.View, { className: 'line_vertical' }),
            react_1["default"].createElement(components_1.View, { className: 'img_button', onClick: function () { return navigateTo('GOODS'); }, onTouchStart: function (e) { return handleTouchStart('GOODS', e); }, onTouchEnd: function (e) { return handleTouchEnd(e); } },
                react_1["default"].createElement(components_1.View, { className: 'word' }, "\u5546\u54C1\u63A5\u9F99"),
                state.goodsPNG_urls && state.goodsPNG_urls.length > 0 &&
                    react_1["default"].createElement(components_1.Image, { src: state.goodsPNG_urls[goodsPNG] })))));
};
AddSolitaireDialog.defaultProps = {};
exports["default"] = AddSolitaireDialog;
