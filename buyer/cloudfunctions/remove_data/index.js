// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  resourceAppid: 'wx8d82d7c90a0b3eda',
  resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
})
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

//数据库remove
/****
 * wx.cloud.callFunction({
      name: 'remove_data',
      data: {
        collection:'users',
        removeOption:'',//'SINGLE','MULTIPLE'
        queryTerm:{},//needed when removeOption==='SINGLE'
        operatedItem:'',//needed when removeOption==='MULTIPLE'
        removeList:[],//needed when removeOption==='MULTIPLE'
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
  if (event.removeOption === 'SINGLE') {
    return await db.collection(event.collection)
      .where(event.queryTerm)
      .remove()
  } else if (event.removeOption === 'MULTIPLE') {
    switch (event.collection) {
      case 'products':
        switch (event.operatedItem) {
          case '_ID':
            return await db.collection(event.collection)
              .where({
                _id: _.in(event.removeList)
              })
              .remove()
            break;

          default:
            break;
        }
        break;

      default:
        break;
    }
  } else {
    return
  }
}
