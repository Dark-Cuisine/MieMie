// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
/****
 * msg_sec_check
 * wx.cloud.callFunction({
        name: 'msg_sec_check',
        data: {
          text: {text}
        },
        success(res) {
          console.log('msg_sec_check-res',res)
          if (res.result.errCode == 87014) {
            console.log(res.errCode)
            wx.showToast({
              icon: 'none',
              title: '文字违规',
            })
          }else{
          }
        },fail(err){
          console.log('msg_sec_check-err',err)
        }
 */
exports.main = async (event, context) => {
  console.log('c-event.text', event.text);
  // return await cloud.openapi.security.msgSecCheck({
  //   content: event.text
  // })
  try {
    console.log(event.content)
    var result = await cloud.openapi.security.msgSecCheck({
      content: event.text,
    });
    console.log(result);
    return result;
  } catch (err) {
    console.log('c-err', err);
    return err;
  }
}
