// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

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
  const result = await cloud.getTempFileURL({
    fileList: event.fileList,
  })
  let tempFileURLList = [];
  result && result.fileList && result.fileList.length > 0 &&
    result.fileList.forEach((it) => {
      tempFileURLList.push(it.tempFileURL)
    })

  return tempFileURLList
}
