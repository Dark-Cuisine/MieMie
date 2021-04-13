// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  resourceAppid: 'wx8d82d7c90a0b3eda',
  resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
})
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

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
            if (!(res && res.result)) { return}

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
  console.log('event', event);
  // if (!(event.userId = event.authId)) {
  //   return
  // }
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
        case 'MARKED_ORDERS_A': //marked orders
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                markedOrders: {
                  markA: _.pull(event.updateData)
                }
              }
            })
          break;
        case 'MARKED_ORDERS_B':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                markedOrders: {
                  markB: _.pull(event.updateData)
                }
              }
            })
          break;
        case 'MARKED_ORDERS_C':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                markedOrders: {
                  markC: _.pull(event.updateData)
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
        case 'SOLITAIRE_ORDER':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                solitaireOrders: _.pull({
                  solitaireId: event.updateData
                })
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
    case 'solitaireShops':
      switch (event.operatedItem) {
        case 'SOLITAIRE':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                solitaires: _.pull(event.updateData)
              }
            })
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
