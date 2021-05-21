// import dayjs from 'dayjs'//*注: 云函数不支持import!!!!
const cloud = require('wx-server-sdk')

cloud.init({
  resourceAppid: 'wx8d82d7c90a0b3eda',
  resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
})
// 拿某天的tomatoDay
/**
 * wx.cloud.callFunction({
      name: 'get_tomato_days',
      data: {
       userId:userId,
       dateList: dateList,
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

  let r = await db.collection('tomatoDays')
    .where(_.and({
      authId: event.userId
    }, {
      date: _.in(event.dateList)
    })).get()
  console.log('r', r);

  return r
}
