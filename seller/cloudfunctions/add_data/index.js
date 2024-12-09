// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  resourceAppid: "wx8d82d7c90a0b3eda",
  resourceEnv: "miemie-buyer-7gemmgzh05a6c577",
});

// const db = cloud.database();
// const _ = db.command;
// const $ = db.command.aggregate;

//向数据库添加内容
/****
 * wx.cloud.callFunction({
      name: 'add_data',
      data: {
        collection:'users',
        newItem:{}
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
    resourceAppid: "wx8d82d7c90a0b3eda",
    resourceEnv: "miemie-buyer-7gemmgzh05a6c577",
  });

  await c1.init({
    env: "miemie-buyer-7gemmgzh05a6c577",
  });

  const db = c1.database({
    env: "miemie-buyer-7gemmgzh05a6c577",
  });
  const _ = db.command;
  const $ = db.command.aggregate;

  let returnV = db.collection(event.collection).add({
    data: event.newItem,
  });
  return returnV;
};
