// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  resourceAppid: 'wx8d82d7c90a0b3eda',
  resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
})
// const db = cloud.database();
// const _ = db.command;
// const $ = db.command.aggregate;

// 数据库pull操作
/****
 * wx.cloud.callFunction({
      name: 'pull_data',
      data: {
        collection:'users',
        queryTerm:{},
        operatedItem: 'ORDERS',
        updateData:{}
      },
      success: (res) => {
      if (res && res.result && res.result.data){
     } 
    },
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
        case 'MARKED_SHOPS':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                markedShops: _.pull(event.updateData) //*注：push要用[]，pull不用！
              }
            })
          break;
        case 'MARKED_ORDERS':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                markedOrders: {
                  markA: _.pull(event.updateData) //*unfinished 现在只有一种mark
                }
              }
            })
          break;
        case 'MY_SHOPS':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                myShops: _.pull(event.updateData)
              }
            })
          break;
        case 'ORDERS':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                markedShops: _.pull(event.updateData)
              }
            })
          break;
        case 'MSG_RECEIVED':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                messages: {
                  received: _.pull(event.updateData)
                }
              }
            })
          break;
        case 'MSG_SENT':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                messages: {
                  sent: _.pull(event.updateData)
                }
              }
            })
          break;
        default:
          break;
      }
      break;
    case 'shops':
      switch (event.operatedItem) {
        case 'ORDERS':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                orders: _.pull(event.updateData)
              }
            })
          break;

        default:
          break;
      }
      break;
    case '':
      break;
    default:
      break;
  }
}
