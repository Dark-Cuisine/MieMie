


//复制文本
export const copyText = (text) => {
  wx.setClipboardData({
    data: text,
    success(res) {
      wx.getClipboardData({
        success(res) {
          console.log('copyText', res.data);
        }
      })
    }
  })
}