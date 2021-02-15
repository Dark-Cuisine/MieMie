/**
 * 记录一下数据库储存的格式
 */

//接龙
const solitaireShop = { //地位相当于shop，每个用户只有一个，用来存放接龙设定信息(支付方式、取货方法、商品等)
  authId: '', //创建者的unionid
  createTime: '',

  solitaires: [], //单条接龙id

  info: {
    paymentOptions: [], //{option:'',account:''}
    extraOptions: [], //{option:'',des:''}
  }
}
const solitaire = { //单条接龙
  authId: '', //创建者的unionid
  createTime: '',

  products: {
    productIdList: [], //商品_id
  },

  info: {
    type: 'GOODS', //GOODS:商品,EVENTS:活动
    startTime: {
      date: '',
      time: ''
    }, //开始时间
    endTime: {
      date: '',
      time: ''
    }, //截止时间
    des: '',
    currency: '', //币种id
    paymentOptions: [], //{option:'',account:''}
    extraOptions: [], //{option:'',des:''}
  },


}
//店铺
const shop = {
  authId: '', //创建者的unionid
  createTime: '',

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
  authId: '', //创建者的unionid
  createTime: '',

  name: '',
  price: '',
  stock: '',
  unit: '', //单位
  oldStock: null,
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
  authId: '', //创建者的unionid
  buyerId: '', //unionid
  buyerName: '',
  shopId: '',
  shopName: '',
  createTime: '', //提交订单时间

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
  authId: '', //创建者的unionid
  openid: '',
  unionid: '',
  createTime: '',
  name: '',

  paymentOptions: [], //{option:'',account:''}

  orders: [''], //order _id
  markedShops: [], //shop._id

  myShops: [''], //shop _id
  mySolitaireShop: [''], //solitaireShop _id

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