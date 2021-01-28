// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  resourceAppid: 'wx8d82d7c90a0b3eda',
  resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
})
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 数据库push操作
/****
 * wx.cloud.callFunction({
      name: 'push_data',
      data: {
        collection:'users',
        queryTerm:{},
        operatedItem:'',
        updateData:[]
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
  console.log('push_data', event);
  switch (event.collection) {
    case 'users':
      switch (event.operatedItem) {
        case 'MARKED_SHOPS':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                markedShops: _.push(event.updateData) //*注：push要用[]，pull不用！
              }
            })
          break;
        case 'MARKED_ORDERS':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                markedOrders: {
                  markA: _.push(event.updateData)//*unfinished 现在只有一种mark
                }
              }
            })
          break;
        case 'MY_SHOPS':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                myShops: _.push(event.updateData)
              }
            })
          break;
        case 'ORDERS':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                orders: _.push(event.updateData)
              }
            })
          break;
        case 'MSG_SENT':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                messages: {
                  sent: _.push(event.updateData)
                }
              }
            })
          break;
        case 'MSG_RECEIVED':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                messages: {
                  received: _.push(event.updateData)
                }
              }
            })
          break;
        case '':
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
                orders: _.push(event.updateData)
              }
            })
          break;
        case 'PRODUCT_ID_LIST':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                products: {
                  productIdList: _.push(event.updateData)
                }
              }
            })
          break;

        default:
          break;
      }
      break;
    case 'orders':
      switch (event.operatedItem) {
        case 'ANNOS':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                announcements: _.push(event.updateData)
              }
            })
          break;
        case '':

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
