// 云函数入口文件
var axios = require('axios')
var WXBizDataCrypt = require('./WXBizDataCrypt')

// 云函数入口函数
exports.main = async (event, context) => {

  const appId = 'wxd93345bec2ff3742';
  const secret = '4fa73446174d6ae84bb57ab0fe4333c6';
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
