"use strict";
//规范格式化的函数
exports.__esModule = true;
exports.prefixZero = void 0;
//位数不够前面补0
//num: 数字
//n: 位数
exports.prefixZero = function (num, n) {
    return (Array(n).join(0) + num).slice(-n);
};
