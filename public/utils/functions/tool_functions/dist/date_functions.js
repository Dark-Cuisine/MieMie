"use strict";
exports.__esModule = true;
exports.compareDateAndTimeWithNow = void 0;
var dayjs_1 = require("dayjs");
//date_functions
//和今天的日期、时间对比
//返回: 输入值是否>当前时间
//date 格式为'YYYYMMDD'
//time 格式为'HHmmss'或'HHmm'
exports.compareDateAndTimeWithNow = function (date, time) {
    var reg_1 = new RegExp('\\/', 'g');
    var reg_2 = new RegExp('-', 'g');
    var reg_3 = new RegExp(':', 'g');
    var uDate = date.replace(reg_1, '');
    uDate = date.replace(reg_2, '');
    var uTime = time.replace(reg_3, '');
    uTime.length < 6 &&
        (uTime = uTime.concat('00'));
    var currentDate = dayjs_1["default"]().format('YYYYMMDD');
    var currentTime = dayjs_1["default"]().format('HHmmss');
    // console.log('compareDateAndTimeWithNow', date, uDate, currentDate);
    // console.log('compareDateAndTimeWithNow-time', time, uTime, currentTime);
    if (uDate > currentDate) {
        return true;
    }
    else {
        return uTime > currentTime;
    }
};
