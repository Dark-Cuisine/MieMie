// import dayjs from 'dayjs'//*注: 云函数不支持import!!!!
const cloud = require('wx-server-sdk')

cloud.init({
  resourceAppid: 'wx8d82d7c90a0b3eda',
  resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
})
// 改番茄数量
/**
 * wx.cloud.callFunction({
      name: 'change_tomato_quantity',
      data: {
       userId:userId,
       date: date,
       color: color,
       quantiy: quantiy,

      } 
    })
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


  // let tomatoDay = {}

  let r = await db.collection('tomatoDays')
    .where(_.and({
      authId: event.userId
    }, {
      date: event.date
    })).update({
      data: event.color === 'red' ? {
        redQuantity: _.inc(event.quantity)
      } : (event.color === 'yellow' ? {
        yellowQuantity: _.inc(event.quantity)
      } : (
        event.color === 'blue' ? {
          blueQuantity: _.inc(event.quantity)
        } : {
          whiteQuantity: _.inc(event.quantity)
        }
      ))
    })
  console.log('r', r);
  // return

  if (!(r && r.stats && r.stats.updated > 0)) {
    let r_2 = await db.collection('tomatoDays')
      .add({ //如果还没当天番茄日，则先新建番茄日
        data: {
          // createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          // updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          authId: event.userId,
          date: event.date, //日期
          redQuantity: 0,
          yellowQuantity: 0,
          blueQuantity: 0,
          whiteQuantity: 0,
        }
      })
    console.log('r_2', r_2);
    newTomatoDayId = r_2 && r_2._id
    let r_3 = await db.collection('tomatoDays')
      .doc(newTomatoDayId).update({
        data: event.color === 'red' ? {
          redQuantity: _.inc(event.quantity)
        } : (event.color === 'yellow' ? {
          yellowQuantity: _.inc(event.quantity)
        } : (
          event.color === 'blue' ? {
            blueQuantity: _.inc(event.quantity)
          } : {
            whiteQuantity: _.inc(event.quantity)
          }
        ))
      })
  }

  return 
}
