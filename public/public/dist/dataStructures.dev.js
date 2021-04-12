"use strict";

/**
 * 记录一下数据库储存的格式
 */
//接龙
var solitaireShop = {
  //地位相当于shop，每个用户只有一个，用来存放接龙设定信息(支付方式、取货方法、商品等)
  authId: '',
  //创建者的unionid
  createTime: '',
  updateTime: '',
  solitaires: [],
  //单条接龙id
  info: {
    shopName: '接龙店',
    paymentOptions: [],
    //{id:'',option:'',account:''}
    extraOptions: [] //{option:'',des:''}

  },
  products: {
    productList: [{
      id: ''
    }] // 

  },
  pickUpWay: {
    selfPickUp: {
      list: [],
      //{id:'',place:'',placeDetail:'',nearestStation:{line: '', stations: { list: [''], from: '', to: '' }},announcements: [{date:'',list:['']}],dates:[]//*unfinished 可选日期}
      des: '' //

    },
    stationPickUp: {
      list: [],
      //{id:'',line:'',stations:{from:'',to:'',list:[{station:'',announcements: [{date:'',list:['']}]}]},floorPrice:0,dates:[]//可选日期}
      des: '' //

    },
    expressPickUp: {
      isAble: false,
      list: [],
      //{id:'',area:'',floorPrice: ''}//满额包邮list
      des: ''
    }
  }
};
var solitaire = {
  //单条接龙
  authId: '',
  //创建者的unionid
  createTime: '',
  solitaireShopId: '',
  //solitaireShop _id
  solitaireOrders: [''],
  //solitaireOrders _id
  products: {
    productList: [{
      id: '',
      stock: ''
    }] // 

  },
  info: {
    type: 'GOODS',
    //GOODS:商品,EVENTS:活动
    startTime: {
      date: '',
      time: ''
    },
    //开始时间
    endTime: {
      date: '',
      time: ''
    },
    //截止时间
    content: '',
    //内容
    des: '',
    //备注
    currency: '',
    //币种id
    paymentOptions: [],
    //{id:'',option:'',account:''}
    extraOptions: [] //{option:'',des:''}

  },
  pickUpWay: {
    selfPickUp: {
      list: [],
      //{id:'',place:'',placeDetail:'',nearestStation:{line: '', stations: { list: [''], from: '', to: '' }},announcements: [{date:'',list:['']}],dates:[]//*unfinished 可选日期}
      des: '' //

    },
    stationPickUp: {
      list: [],
      //{id:'',line:'',stations:{from:'',to:'',list:[{station:'',announcements: [{date:'',list:['']}]}]},floorPrice:0,dates:[]//可选日期}
      des: '' //

    },
    expressPickUp: {
      isAble: false,
      list: [],
      //{id:'',area:'',floorPrice: ''}//满额包邮list
      des: ''
    }
  },
  eventTime: {
    //只有活动型接龙才有
    startTime: {
      date: '',
      time: ''
    },
    //开始时间
    endTime: {
      date: '',
      time: ''
    } //结束时间

  }
}; //店铺

var shop = {
  authId: '',
  //创建者的unionid
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
      shopKindLarge: '',
      //'DELI','MARKET','GOODS','EVENT'
      shopKindSmall: []
    },
    paymentOptions: [],
    //{id:'',option:'',account:''}
    QRCodeList: [] //{url:''}

  },
  pickUpWay: {
    selfPickUp: {
      list: [],
      //{id:'',place:'',placeDetail:'',nearestStation:{line: '', stations: { list: [''], from: '', to: '' }},announcements: [{date:'',list:['']}],dates:[]//*unfinished 可选日期}
      des: '' //

    },
    stationPickUp: {
      list: [],
      //{id:'',line:'',stations:{from:'',to:'',list:[{station:'',announcements: [{date:'',list:['']}]}]},floorPrice:0,dates:[]//可选日期}
      des: '' //

    },
    expressPickUp: {
      isAble: false,
      list: [],
      //{id:'',area:'',floorPrice: ''}//满额包邮list
      des: ''
    }
  },
  products: {
    labelList: [{
      name: 'All'
    }],
    //[{name:'All'},{name:''}]//*后期打算加icon
    productList: [{
      id: '' // 这里只放product的_id

    }]
  },
  announcements: [] //''

};
var product = {
  //商品（包括物品和活动）
  authId: '',
  //创建者的unionid
  createTime: '',
  name: '',
  type: '',
  //'GOODS','EVENT'
  price: '',
  stock: '',
  unit: '',
  //单位
  oldStock: null,
  updatedStock: {
    way: '',
    //'ADD','SUBTRACT'
    quantity: ''
  },
  icon: [{
    url: ''
  }],
  labels: ['All'],
  //['All','']
  des: '',
  status: '',
  //'LAUNCHED','DISCONTINUED'
  shopId: '',
  //shop 或者 solitaireShop 的 _id
  shopName: ''
};
var solitaireOrder = {
  //接龙订单
  authId: '',
  //创建者的unionid
  buyerId: '',
  //unionid
  buyerName: '',
  solitaireId: '',
  //所属的solitaire _id
  createTime: '',
  //提交订单时间
  updateTime: '',
  //最后修改的时间
  productList: [],
  //[{product:Obj,quantity:''}]
  pickUpWay: {
    way: '',
    //'SELF_PICK_UP','STATION_PICK_UP','EXPRESS_PICK_UP'
    place: {},
    //{place:'',placeDetail:''} or {line:'',station:'',des:''} or { name: '', tel: '', address: '' }
    date: '',
    //'2020-1-1'
    time: '',
    des: ''
  },
  paymentOption: {
    id: '',
    option: '',
    account: '',
    //卖家账户
    des: '' //买家备注

  },
  des: '',
  totalPrice: '',
  status: 'ACCEPTED',
  //'UN_PURCHASE','UN_PROCESSED','ACCEPTED','REJECTED','FINISHED','CANCELED'
  rejectedReason: {
    reason: '',
    des: ''
  },
  announcements: [''] //卖家发布的公告

};
var order = {
  authId: '',
  //创建者的unionid
  buyerId: '',
  //unionid
  buyerName: '',
  shopId: '',
  shopName: '',
  createTime: '',
  //提交订单时间
  productList: [],
  //[{product:Obj,quantity:''}]
  pickUpWay: {
    way: '',
    //'SELF_PICK_UP','STATION_PICK_UP','EXPRESS_PICK_UP'
    place: {},
    //{place:'',placeDetail:''} or {line:'',station:'',des:''} or { name: '', tel: '', address: '' }
    date: '',
    //'2020-1-1'
    time: '',
    des: ''
  },
  paymentOption: {
    option: '',
    account: '',
    //卖家账户
    des: ''
  },
  des: '',
  totalPrice: '',
  status: 'UN_PURCHASE',
  //'UN_PURCHASE','UN_PROCESSED','ACCEPTED','REJECTED','FINISHED','CANCELED'
  rejectedReason: {
    reason: '',
    des: ''
  },
  announcements: [''] //卖家发布的公告

};
var user = {
  authId: '',
  //创建者的unionid
  openid: '',
  unionid: '',
  createTime: '',
  name: '',
  paymentOptions: [],
  //{id:'',option:'',account:''}
  orders: [''],
  //order _id
  solitaireOrders: [{
    orderId: '',
    solitaireId: ''
  }],
  myShops: [''],
  //shop _id
  mySolitaireShops: [''],
  //solitaireShop _id 虽然这里用了复数，但每个user只能有一个接龙店
  markedShops: [],
  //shop._id
  markedOrders: {
    //标记的订单
    markA: [],
    //order _id
    markB: [],
    markC: []
  },
  messages: {
    sent: [''],
    //message._id
    received: [''] //message._id

  },
  recipientInfos: [],
  //邮寄信息{ name: '', tel: '', address: '', des:''}
  markedStations: [] //{line:'',stations:{list:[''],from:'',to:''}}

};
var messages = {
  authId: '',
  //创建者的unionid
  createTime: '',
  //发送时间
  from: {
    unionid: '',
    //user._id
    nickName: ''
  },
  to: {
    unionid: '' //user._id

  },
  type: '',
  //'ORDER_ACCEPTED','ORDER_REJECTED','ORDER_FINISHED','ORDER_CANCELED','ORDER_ANNOUNCEMENT','ORDER_MSG'
  title: '',
  content: '',
  status: '' //'READ','UNREAD'

};