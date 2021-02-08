/**
 * 记录一下数据库储存的格式
 */

//店铺
const shop = {
  shopInfo: {
    ownerId: '',
    shopName: '',
    shopIcon: [{
      url: '',
      cloudPath: '',
      fileID: ''
    }],
    ownerName: '',
    phoneNumber: '',
    address: '',
    des: '',
    shopKinds: {
      shopKindLarge: '', //'DELI','MARKET','GOODS','EVENT'
      shopKindSmall: []
    },
    paymentOptions: [], //{option:'',account:''}
    QRCodeList: [], //{url:''}
  },
  pickUpWay: {
    selfPickUp: {
      list: [], //{place:'',placeDetail:'',nearestStation:{line: '', stations: { list: [''], from: '', to: '' }},announcements: [{date:'',list:['']}],dates:[]//*unfinished 可选日期}
      des: '', //
    },
    stationPickUp: {
      list: [], //{line:'',stations:{from:'',to:'',list:[{station:'',announcements: [{date:'',list:['']}]}]},floorPrice:0,dates:[]//可选日期}
      des: '', //
    },
    expressPickUp: {
      isAble: false,
      list: [], //{area:'',floorPrice: ''}//满额包邮list
      des: '',
    },
  },
  products: {
    labelList: [{
      name: 'All'
    }], //[{name:'All'},{name:''}]//*后期打算加icon
    productIdList: [], //''
  },

  announcements: [], //''
}

const product = {
  name: '',
  price: '',
  stock: '',
  unit: '', //单位
  oldStock:null,
  updatedStock: {
    way: '', //'ADD','SUBTRACT'
    quantity: ''
  },
  icon: [{
    url: ''
  }],
  labels: ['All'], //['All','']
  des: '',

  status: '', //'LAUNCHED','DISCONTINUED'

  shopId: '',
  shopName: '',

}

const order = {
  buyerId: '', //unionid
  buyerName: '',  
  shopId: '',
  shopName: '',

  productList: [], //[{product:Obj,quantity:''}]
  pickUpWay: {
    way: '', //'SELF_PICK_UP','STATION_PICK_UP','EXPRESS_PICK_UP'
    place: {}, //{place:'',placeDetail:''} or {line:'',station:'',des:''} or { name: '', tel: '', address: '' }
    date: '', //'2020-1-1'
    time: '',
    des: '',
  },
  paymentOption: {
    option: '',
    account: '', //卖家账户
    des: '',
  },
  time: '', //提交订单时间
  des: '',
  totalPrice: '',
  status: 'UN_PURCHASE', //'UN_PURCHASE','UN_PROCESSED','ACCEPTED','REJECTED','FINISHED','CANCELED'
  rejectedReason: {
    reason: '',
    des: ''
  },

  announcements: [''], //卖家发布的公告

}



const user = {
  openid: '',
  unionid: '',
  name: '',
  orders: [''], //order _id
  myShops: [''], //order _id
  markedShops: [], //shop._id

  markedOrders:{//标记的订单
    markA:[],//order _id
    markB:[],
    markC:[],
  }, 

  messages: {
    sent: [''], //message._id
    received: [''] //message._id
  },

  recipientInfos: [], //邮寄信息{ name: '', tel: '', address: '', des:''}
  markedStations: [], //{line:'',stations:{list:[''],from:'',to:''}}
}

const messages = {
  from: {
    unionid: '',//user._id
    nickName:'',
  }, 
  to:  {
    unionid: '',//user._id
  }, 
  type: '', //'ORDER_ACCEPTED','ORDER_REJECTED','ORDER_FINISHED','ORDER_CANCELED','ORDER_ANNOUNCEMENT'
  title: '',
  content: '',
  time: '', //发送时间
  status: '', //'READ','UNREAD'
}