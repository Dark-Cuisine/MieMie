/**
 * 记录一下数据库储存的格式
 */

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
    paymentOptions: [], //{id:'',option:'',account:''}
    QRCodeList: [], //{url:''}
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
  products: {
    labelList: [{
      name: 'All'
    }], //[{name:'All'},{name:''}]//*后期打算加icon
    productList: [{
      id: '', // 这里只放product的_id
    }],
  },

  announcements: [], //''
}

const product = { //商品（包括物品和活动）
  authId: '', //创建者的unionid
  createTime: '',

  name: '',
  type: '', //'GOODS','EVENT'
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

  shopId: '', //shop 或者 solitaireShop 的 _id
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


