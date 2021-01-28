// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  resourceAppid: 'wx8d82d7c90a0b3eda',
  resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
}) //* not wx.cloud.database()

// const db = cloud.database();
// const _ = db.command;
// const $ = db.command.aggregate;

//从数据库取内容
/****
 * wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection:'users',

        queryTerm:{},

        orderBy:'time',
        desc:'desc',//'desc','asc'

        operatedItem:'',// when use db.command
        queriedList:[],
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
  console.log('event,', event);
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


  if (event.queryTerm) {
    if (event.orderBy) {
      return await db.collection(event.collection)
        .where(event.queryTerm)
        .orderBy(event.orderBy, event.desc)
        .get()
    } else {
      return await db.collection(event.collection)
        .where(event.queryTerm)
        .get()
    }
  } else if (event.operatedItem) {
    switch (event.operatedItem) {
      case '_ID':
        if (event.orderBy) {
          return await db.collection(event.collection)
            .where({
              _id: _.in(event.queriedList)
            })
            .orderBy(event.orderBy, event.desc)
            .get()
        } else {
          return await db.collection(event.collection)
            .where({
              _id: _.in(event.queriedList)
            })
            .get()
        }
        break;
      case '_ID_AND_STATUS': //*unfinished 这里应该能简化
        return await db.collection(event.collection)
          .where({
            _id: _.in(event.queriedList),
            status: event.queryTerm.status
          })
          .get()
        break;
      default:
        break;
    }
  } else {
    return await db.collection(event.collection).get()
  }

}
