"use strict";
exports.__esModule = true;
exports.copyText = void 0;
//复制文本
exports.copyText = function (text) {
    wx.setClipboardData({
        data: text,
        success: function (res) {
            wx.getClipboardData({
                success: function (res) {
                    console.log('copyText', res.data);
                }
            });
        }
    });
};
