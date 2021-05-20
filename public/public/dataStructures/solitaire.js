/**
 * 记录一下数据库储存的格式
 */

//接龙
const solitaireShop = { //地位相当于shop，每个用户只有一个，用来存放接龙设定信息(支付方式、取货方法、商品等)
  authId: '', //创建者的unionid
  createTime: '',
  updateTime: '',

  solitaires: [''], //单条接龙id

  info: {
    shopName: '接龙店',
    paymentOptions: [], //{id:'',option:'',account:''}
    extraOptions: [], //{option:'',des:''}
  },
  products: {
    productList: [{
      id: ''
    }], // 
  },
  pickUpWay: {
    selfPickUp: {
      list: [], //{id:'',place:'',placeDetail:'',nearestStation:{line: '', stations: { list: [''], from: '', to: '' }},announcements: [{date:'',list:['']}],dates:[]//*unfinished 可选日期}
      des: '', //
    },
    stationPickUp: {
      list: [], //{id:'',line:'',stations:{from:'',to:'',list:[{station:'',announcements: [{date:'',list:['']}]}]},floorPrice:0,dates:[]//可选日期}
      des: '', //
    },
    expressPickUp: {
      isAble: false,
      list: [], //{id:'',area:'',floorPrice: ''}//满额包邮list
      des: '',
    },
  },
}
const solitaire = { //单条接龙
  authId: '', //创建者的unionid
  createTime: '',
  solitaireShopId: '', //solitaireShop _id

  solitaireOrders: [''], //solitaireOrders _id

  products: {
    productList: [{
      id: '',
      stock: '',
    }], // 
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
    content: '', //内容
    des: '', //备注
    currency: '', //币种id
    paymentOptions: [], //{id:'',option:'',account:''}
    extraOptions: [], //{option:'',des:''}
  },
  pickUpWay: {
    selfPickUp: {
      list: [], //{id:'',place:'',placeDetail:'',nearestStation:{line: '', stations: { list: [''], from: '', to: '' }},announcements: [{date:'',list:['']}],dates:[]//*unfinished 可选日期}
      des: '', //
    },
    stationPickUp: {
      list: [], //{id:'',line:'',stations:{from:'',to:'',list:[{station:'',announcements: [{date:'',list:['']}]}]},floorPrice:0,dates:[]//可选日期}
      des: '', //
    },
    expressPickUp: {
      isAble: false,
      list: [], //{id:'',area:'',floorPrice: ''}//满额包邮list
      des: '',
    },
  },
  eventTime: { //只有活动型接龙才有
    startTime: {
      date: '',
      time: ''
    }, //开始时间
    endTime: {
      date: '',
      time: ''
    }, //结束时间
  },
}


const solitaireOrder = { //接龙订单
  authId: '', //创建者的unionid
  buyerId: '', //unionid
  buyerName: '',
  solitaireId: '', //所属的solitaire _id
  createTime: '', //提交订单时间
  updateTime: '', //最后修改的时间

  productList: [], //[{product:Obj,quantity:''}]
  pickUpWay: {
    way: '', //'SELF_PICK_UP','STATION_PICK_UP','EXPRESS_PICK_UP'
    place: {}, //{place:'',placeDetail:''} or {line:'',station:'',des:''} or { name: '', tel: '', address: '' }
    date: '', //'2020-1-1'
    time: '',
    des: '',
  },
  paymentOption: {
    id: '',
    option: '',
    account: '', //卖家账户
    des: '', //买家备注
  },
  des: '',
  totalPrice: '',
  status: 'ACCEPTED', //'UN_PURCHASE','UN_PROCESSED','ACCEPTED','REJECTED','FINISHED','CANCELED'
  rejectedReason: {
    reason: '',
    des: ''
  },

  announcements: [''], //卖家发布的公告

}
