// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

//云储存fileId换取真实url
/****
 * wx.cloud.callFunction({
      name: 'get_temp_file_url',
      data: {
        fileList:['cloud://xxx', 'cloud://yyy'],
       },
      success: (res) => {
      if (res && res.result && res.result.data){
     }},
            fail: () => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        console.error
      }
   });
 */
exports.main = async (event, context) => {
  console.log("get_temp_file_url", event);
  var c1 = new cloud.Cloud({
    resourceAppid: "wx8d82d7c90a0b3eda",
    resourceEnv: "miemie-buyer-7gemmgzh05a6c577",
  });

  await c1.init({
    env: "miemie-buyer-7gemmgzh05a6c577",
  });

  const result = await c1.getTempFileURL({
    fileList: event.fileList,
  });
  let tempFileURLList = [];
  result &&
    result.fileList &&
    result.fileList.length > 0 &&
    result.fileList.forEach((it) => {
      tempFileURLList.push(it.tempFileURL);
    });

  return tempFileURLList;
};
