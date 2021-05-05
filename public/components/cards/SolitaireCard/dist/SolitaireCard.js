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
var react_redux_1 = require("react-redux");
var components_1 = require("@tarojs/components");
var taro_ui_1 = require("taro-ui");
var actions = require("../../../redux/actions");
var tool_functions = require("../../../utils/functions/tool_functions");
var databaseFunctions = require("../../../utils/functions/databaseFunctions");
var ActionDialog_1 = require("../../dialogs/ActionDialog/ActionDialog");
require("./SolitaireCard.scss");
/****
 * 接龙card
 * <SolitaireCard
 * solitaire={}
 * solitaireOrder={state.solitaireOrder} //only for 'BUYER' mode
   mode='SELLER',//'SELLER','BUYER'
 />
 */
var SolitaireCard = function (props) {
    var dispatch = react_redux_1.useDispatch();
    var userManager = react_redux_1.useSelector(function (state) { return state.userManager; });
    var initState = {
        solitaire: props.solitaire
    };
    var _a = react_1.useState(initState), state = _a[0], setState = _a[1];
    var _b = react_1.useState(false), isOpened = _b[0], setIsOpened = _b[1]; //是否打开了action button list
    var _c = react_1.useState(null), openedDialog = _c[0], setOpenedDialog = _c[1]; //'DELETE','COPY','CANCEL'
    react_1.useEffect(function () {
        setState(__assign(__assign({}, state), { solitaire: initState.solitaire }));
    }, [props.solitaire]);
    taro_1.usePullDownRefresh(function () {
        taro_1["default"].stopPullDownRefresh();
    });
    var goToInsideSolitairePage = function (mode, e) {
        if (e === void 0) { e = null; }
        e && e.stopPropagation();
        setIsOpened(false);
        taro_1["default"].navigateTo({
            url: "/pages/SolitairePages/InsideSolitairePage/InsideSolitairePage?solitaireId=" + state.solitaire._id + "&solitaireOrderId=" + props.solitaireOrderId + "&mode=" + mode
        });
    };
    var handleActionButton = function (e) {
        switch (e.id) {
            case 'edit':
                goToInsideSolitairePage(props.mode);
                break;
            case 'copy':
                //setOpenedDialog('COPY')
                handleSubmit('COPY');
                break;
            case 'cancel':
                setOpenedDialog('CANCEL');
                break;
            case 'delete':
                setOpenedDialog('DELETE');
                break;
            case '':
                break;
            default:
                break;
        }
    };
    var handleSubmit = function (way, v, i) {
        if (v === void 0) { v = null; }
        if (i === void 0) { i = null; }
        return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setOpenedDialog(null);
                        setIsOpened(false);
                        _a = way;
                        switch (_a) {
                            case 'DELETE': return [3 /*break*/, 1];
                            case 'COPY': return [3 /*break*/, 6];
                            case 'CANCEL': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 8];
                    case 1:
                        if (!(props.mode === 'SELLER')) return [3 /*break*/, 3];
                        return [4 /*yield*/, databaseFunctions.solitaire_functions.deleteSolitaire(state.solitaire._id, state.solitaire.solitaireShopId)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, databaseFunctions.solitaire_functions.deleteSolitaireIdFromUser(userManager.unionid, state.solitaire._id)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [3 /*break*/, 9];
                    case 6:
                        // console.log('c-copy', state.solitaire);
                        // let newCopy = {}
                        // Object.assign(newCopy, state.solitaire)//*深拷贝，否则改newCopy时state.solitaire也会改变
                        // delete newCopy._id
                        // delete newCopy.createTime
                        // delete newCopy.updateTime
                        // console.log('c-copy-2', newCopy);
                        // console.log('c-copy-3', state.solitaire);
                        taro_1["default"].navigateTo({
                            url: "/pages/SolitairePages/InsideSolitairePage/InsideSolitairePage?copySolitaireId=" + state.solitaire._id + "&mode=" + 'SELLER'
                        });
                        return [3 /*break*/, 9];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [3 /*break*/, 9];
                    case 9:
                        dispatch(actions.setUser(userManager.unionid, userManager.openid)); //更新用户信息
                        return [2 /*return*/];
                }
            });
        });
    };
    var deleteDialog = (react_1["default"].createElement(ActionDialog_1["default"], { type: 1, isOpened: !(openedDialog === null), onClose: function () { setOpenedDialog(null); }, onCancel: function () { setOpenedDialog(null); }, onSubmit: function () { return handleSubmit(openedDialog); }, cancelText: '\u53D6\u6D88', confirmText: '\u786E\u8BA4' },
        react_1["default"].createElement(components_1.View, { className: '' },
            "\u786E\u5B9A",
            openedDialog === 'DELETE' ? '删除' :
                (openedDialog === 'COPY' ? '复制接龙' : '取消接龙'),
            "?"),
        openedDialog === 'DELETE' && props.mode === 'BUYER' &&
            react_1["default"].createElement(components_1.View, { className: '' }, "(\u5220\u9664\u4EC5\u4E3A\u81EA\u5DF1\u53EF\u89C1\u3002\u5982\u8981\u53D6\u6D88\u63A5\u9F99\uFF0C\u8BF7\u70B9\u51FB'\u53D6\u6D88\u63A5\u9F99')")));
    var className = (state.solitaire.info.endTime.date &&
        state.solitaire.info.endTime.date.length > 0 &&
        !tool_functions.date_functions.compareDateAndTimeWithNow(state.solitaire.info.endTime.date, state.solitaire.info.endTime.time)) ?
        'solitaire_card_expired' : '';
    // console.log('className', tool_functions.date_functions.compareDateAndTimeWithNow(
    //   state.solitaire.info.endTime.date, state.solitaire.info.endTime.time));
    return (react_1["default"].createElement(components_1.View, { className: 'solitaire_card '.concat(props.className, ' ', className) },
        deleteDialog,
        state.solitaire &&
            react_1["default"].createElement(taro_ui_1.AtSwipeAction, { onClick: function (e) { return handleActionButton(e); }, isOpened: isOpened, onOpened: function () { setIsOpened(true); }, onClosed: function () { setIsOpened(false); }, options: [
                    {
                        id: 'edit',
                        text: '修改',
                        style: {
                            backgroundColor: 'var(--light-2)'
                        }
                    },
                    props.mode === 'SELLER' ? {
                        id: 'copy',
                        text: '复制',
                        style: {
                            backgroundColor: 'var(--light-3)'
                        }
                    } : {
                        id: 'cancel',
                        text: '取消接龙',
                        style: {
                            backgroundColor: 'var(--red-1)'
                        }
                    },
                    {
                        id: 'delete',
                        text: '删除',
                        style: {
                            backgroundColor: props.mode === 'SELLER' ? 'var(--red-1)' : 'var(--red-2)'
                        }
                    }
                ] },
                react_1["default"].createElement(components_1.View, { className: 'card_body', onClick: isOpened ?
                        function () { setIsOpened(false); } : function (e) { return goToInsideSolitairePage('BUYER', e); } },
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
                    react_1["default"].createElement(components_1.View, { className: 'solitaire_content' }, state.solitaire.info.content)))));
};
SolitaireCard.defaultProps = {
    mode: 'BUYER'
};
exports["default"] = SolitaireCard;
