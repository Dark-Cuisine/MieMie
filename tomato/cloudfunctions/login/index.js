const cloud = require("wx-server-sdk");

cloud.init({
  resourceAppid: "wx8d82d7c90a0b3eda",
  resourceEnv: "miemie-buyer-7gemmgzh05a6c577",
});
// const db = cloud.database();
// const _ = db.command;
// const $ = db.command.aggregate;

exports.main = async (event, context) => {
  console.log("event,", event);
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

  const wxContext = cloud.getWXContext();

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  };
};
