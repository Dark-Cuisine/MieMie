// 云函数入口文件
var axios = require('axios')
var WXBizDataCrypt = require('./WXBizDataCrypt')

/**
 * wx.cloud.callFunction({
              name: 'get_user_info',
              data: {
                encryptedData: encryptedData,
                iv: iv,

                js_code: res.code,
                grant_type: 'authorization_code',

              },
 */
exports.main = async (event, context) => {

  const appId = 'wx1c4d98a91f3e59a0';
  const secret = 'b1064377b3baab5a1c5731ae5289e20b';
  const encryptedData = event.encryptedData;
  const iv = event.iv;

  const params = {
    appid: appId,
    secret: secret,
    js_code: event.js_code,
    grant_type: event.grant_type
  }

  const jscode2session = await axios.get("https://api.weixin.qq.com/sns/jscode2session", {
    params
  });
  const sessionKey = jscode2session.data.session_key;
  if (!(jscode2session && jscode2session.data && jscode2session.data.session_key)) {
    return
  }
  var pc = new WXBizDataCrypt(appId, sessionKey)
  var data = pc.decryptData(encryptedData, iv)

  const cloud = require('wx-server-sdk')
  cloud.init({
    resourceAppid: 'wx8d82d7c90a0b3eda',
    resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
  })
  const wxContext = cloud.getWXContext()
  console.log('w-wxContext', wxContext);

  return {
    data,
    wxContext,
  };

}
