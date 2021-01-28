// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  resourceAppid: 'wx8d82d7c90a0b3eda',
  resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
})
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

//更新数据库内容
/****
 * wx.cloud.callFunction({
      name: 'update_data',
      data: {
        collection:'users',
        queryTerm:{},
        updateData:{}
      },
      success: (res) => {
     if (res && res.result && res.result.data){
     } },
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
  console.log('update_data', event);

  let updateData = event.updateData;
  (updateData._id) && //* must delete '_id', or you can't update successfully!!
  delete updateData._id;

  return await db.collection(event.collection)
    .where(event.queryTerm)
    .update({
      data: updateData
    })

}
