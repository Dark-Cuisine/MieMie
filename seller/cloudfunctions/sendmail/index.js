const cloud = require("wx-server-sdk");

cloud.init({
  resourceAppid: "wx8d82d7c90a0b3eda",
  resourceEnv: "miemie-buyer-7gemmgzh05a6c577",
});
// const db = cloud.database();
// const _ = db.command;
// const $ = db.command.aggregate;

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

  const nodemailer = require("nodemailer");

  let sendEmail = nodemailer.createTransport({
    host: "smtp.163.com",
    port: 465,
    secure: true,
    auth: {
      user: "miemiestalls@163.com", //*problem 不知为何gmail发不了
      pass: "ZIDUUMSLFJVNXQJP",
    },
  });

  let message = {
    from: "miemiestalls@163.com",
    to: "miemiestalls@gmail.com",
    subject: event.subject,
    text: event.message,
  };

  let res = await sendEmail.sendMail(message);
  return res;
};
