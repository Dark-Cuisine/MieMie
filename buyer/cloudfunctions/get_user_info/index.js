// 云函数入口文件
var axios = require('axios')
var WXBizDataCrypt = require('./WXBizDataCrypt')

// 云函数入口函数
exports.main = async (event, context) => {

  const appId = 'wx8d82d7c90a0b3eda';
  const secret = '798a6b5f7cf28c9fb6760931f9349a95';
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

  if (!(jscode2session && jscode2session.data && jscode2session.data.session_key)) {
    return
  }
  const sessionKey = jscode2session.data.session_key;

  var pc = new WXBizDataCrypt(appId, sessionKey)

  var data = pc.decryptData(encryptedData, iv)

  return data;

}
