"use strict";
exports.__esModule = true;
exports.getRandomId = void 0;
//生成随机id（默认12位）*unfinish 现在还没能设置位数
exports.getRandomId = function (digits) {
    if (digits === void 0) { digits = 12; }
    return Number(Math.random().toString().substr(3, 100)).toString(36);
};
