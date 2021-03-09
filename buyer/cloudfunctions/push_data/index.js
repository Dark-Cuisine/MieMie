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
        case 'MARKED_ORDERS_A': //marked orders
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                markedOrders: {
                  markA: _.push(event.updateData)
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
                  markB: _.push(event.updateData)
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
                  markC: _.push(event.updateData)
                }
              }
            })
          break;
        case 'MY_SHOPS': //
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
        case 'SOLITAIRE_ORDERS':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                solitaireOrders: _.push(event.updateData)
              }
            })
          break;
        case 'MY_SOLITAIRE_SHOPS': //接龙
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                mySolitaireShops: _.push(event.updateData)
              }
            })
          break;
        case 'SOLITAIRE_ORDERS':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                solitaireOrders: _.push(event.updateData)
              }
            })
          break;
        case 'MSG_SENT': //msg
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
                  productList: _.push(event.updateData)
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
    case 'solitaireShops':
      switch (event.operatedItem) {
        case 'SOLITAIRES':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                solitaires: _.push(event.updateData)
              }
            })
          break;
        case 'PRODUCT_ID_LIST':
          return await db.collection(event.collection)
            .where(event.queryTerm)
            .update({
              data: {
                products: {
                  productList: _.push(event.updateData)
                }
              }
            })
          break;
        case '':
          break;
        default:
          break;
      }
      case 'solitaires':
        switch (event.operatedItem) {
          case 'PRODUCT_ID_LIST':
            return await db.collection(event.collection)
              .where(event.queryTerm)
              .update({
                data: {
                  products: {
                    productList: _.push(event.updateData)
                  }
                }
              })
            break;
          case 'SOLITAIRE_ORDERS':
            return await db.collection(event.collection)
              .where(event.queryTerm)
              .update({
                data: {
                  solitaireOrders: _.push(event.updateData)
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
