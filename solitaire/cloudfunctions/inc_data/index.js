// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  resourceAppid: 'wx8d82d7c90a0b3eda',
  resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
})
// const db = cloud.database();
// const _ = db.command;
// const $ = db.command.aggregate;

//数据库inc
/****
 * wx.cloud.callFunction({
      name: 'inc_data',
      data: {
        collection:'users',
        operatedItem:'',
        incNum:Number(0)
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
  var c1 = new cloud.Cloud({
    resourceAppid: 'wx8d82d7c90a0b3eda',
    resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
  })

  await c1.init({
    secretId: 'AKIDwiHc09xCF3cwDFrESWOHxNZXLCfvRL2W',
    secretKey: 'XZfka5K83yeKnAcBCShS4SgS3cBXfXBs',
    env: 'miemie-buyer-7gemmgzh05a6c577'
  })

  const db = c1.database({
    env: 'miemie-buyer-7gemmgzh05a6c577'
  });
  const _ = db.command;
  const $ = db.command.aggregate;

  switch (event.collection) {
    case 'users':
      switch (event.operatedItem) {
        case '':
          break;
        case '':

          break;
        default:
          break;
      }
      break;
    case 'products':
      switch (event.operatedItem) {
        case 'STOCK':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                stock: _.inc(Number(event.incNum))
              }
            })
          break;
        case '':

          break;
        default:
          break;
      }
      case '':
        break;
      default:
        break;
  }
}
