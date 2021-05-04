import dayjs from 'dayjs'
import * as product_functions from './product_functions'
import * as user_functions from './user_functions'
import * as msg_functions from './msg_functions'
import * as order_functions from './order_functions'
import * as shop_functions from './shop_functions'


export const sendMessage = async (messages, authId) => { //发message
  console.log('sendMessage', messages);
  let updatedMsg = {
    ...messages,
    authId: authId,
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    status: 'UNREAD'
  };
  let res = await wx.cloud.callFunction({
    name: 'add_data',
    data: {
      collection: 'messages',
      newItem: updatedMsg
    },
  });
  if (!(res && res.result && res.result._id)) { return }
  let msgId = res.result._id
  await user_functions.addMsgToUsers(msgId, messages.from.unionid, messages.to.unionid);

  // wx.cloud.callFunction({
  //   name: 'add_data',
  //   data: {
  //     collection: 'messages',
  //     newItem: updatedMsg
  //   },
  //   success: (res) => {
  //     let msgId = res.result._id
  //     user_functions.addMsgToUsers(msgId, messages.from.unionid, messages.to.unionid);
  //   },
  //   fail: () => {
  //     wx.showToast({
  //       title: '发送信息失败',
  //       icon: 'none'
  //     })
  //     console.error
  //   }
  // });
}

