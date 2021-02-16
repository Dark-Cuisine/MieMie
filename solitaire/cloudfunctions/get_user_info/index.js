// 云函数入口文件
var axios = require('axios')
var WXBizDataCrypt = require('./WXBizDataCrypt')

// 云函数入口函数
exports.main = async (event, context) => {

  const appId = 'wx6bf51d7abfd5618b';
  const secret = 'dbbf1a71c622a643d8cc98dfbd52605a';
  const encryptedData = event.encryptedData;
  const iv = event.iv;

  const params = {
    appid: appId,
    secret: secret,
    js_code: event.js_code,
    grant_type: event.grant_type
  }

  const jscode2session = await axios.get("https://api.weixin.qq.com/sns/jscode2session", { params });

  const sessionKey = jscode2session.data.session_key;
  if (!(jscode2session && jscode2session.data && jscode2session.data.session_key)) {
    return
  }
  var pc = new WXBizDataCrypt(appId, sessionKey)

  var data = pc.decryptData(encryptedData, iv)

  return data;

}
