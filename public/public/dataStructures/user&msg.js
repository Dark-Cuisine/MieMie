/**
 * 记录一下数据库储存的格式
 */

const user = {
  authId: '', //创建者的unionid
  openid: '',
  unionid: '',
  createTime: '',
  name: '',

  paymentOptions: [], //{id:'',option:'',account:''}

  orders: [''], //order _id
  solitaireOrders: [{
    choosenItem: '',
    solitaireId: '',
  }],

  myShops: [''], //shop _id
  mySolitaireShops: [''], //solitaireShop _id 虽然这里用了复数，但每个user只能有一个接龙店

  markedShops: [], //shop._id
  markedOrders: { //标记的订单
    markA: [], //order _id
    markB: [],
    markC: [],
  },

  messages: {
    sent: [''], //message._id
    received: [''] //message._id
  },

  recipientInfos: [], //邮寄信息{ name: '', tel: '', address: '', des:''}
  markedStations: [], //{line:'',stations:{list:[''],from:'',to:''}}

  tomatoCalendarId:'',
}

const messages = {
  authId: '', //创建者的unionid
  createTime: '', //发送时间
  from: {
    unionid: '', //user._id
    nickName: '',
  },
  to: {
    unionid: '', //user._id
  },
  type: '', //'ORDER_ACCEPTED','ORDER_REJECTED','ORDER_FINISHED','ORDER_CANCELED','ORDER_ANNOUNCEMENT','ORDER_MSG'
  title: '',
  content: '',
  status: '', //'READ','UNREAD'
}