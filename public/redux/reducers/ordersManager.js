import * as actionsType from '../constants/ordersManager'

//接龙管理
const INITIAL_STATE = {
  newOrders: [], //购物车里所有的接龙
  // newOrders: [ //* for test
  //   {
  //     shopId: 'e62469b25fb505680004f90669346287',
  //     shopName: '咩咩羊肉铺',
  //     productList: [{
  //         product: {
  //           des: "xxxx",
  //           labels: ["All", "水果"],
  //           name: "苹果",
  //           price: "22",
  //           shopId: "e62469b25fb505680004f90669346287",
  //           shopName: "咩咩羊肉铺",
  //           status: "LAUNCHED",
  //           stock: 29,
  //           unit: "半个",
  //     updatedStock: {
  //       quantity: "",
  //       way: ""
  //     },
  //     _id: "0288fce75fb5ce700008a5c163f8d7f0",
  //     _openid: "oeaoD5RrvdSNXe7DX5R4Uj43J1W0"
  //   },
  //   quantity: 1
  // },
  // {
  //   product: {
  //     des: "aaaa",
  //     labels: ["All", "水果"],
  //     name: "羊头",
  //     price: "22",
  //     shopId: "e62469b25fb505680004f90669346287",
  //     shopName: "咩咩羊肉铺",
  //       status: "LAUNCHED",
  //       stock: 29,
  //       unit: "半个",
  //       updatedStock: {
  //         quantity: "",
  //         way: ""
  //       },
  //       _id: "b1a52c595fb5cdb3000bafc54acd2806",
  //       _openid: "oeaoD5RrvdSNXe7DX5R4Uj43J1W0"
  //     },
  //     quantity: 3
  //   },
  // ], //{ product: Obj, quantity: '' }
  //     pickUpWay: {
  //       way: '',
  //       place: {}, //{place:'',placeDetail:''} or {line:'',station:'',des:''} or { name: '', tel: '', address: '' }
  //       date: '',
  //       time: '',
  //       des: '',
  //     },
  //     paymentOption: {
  //       option: '',
  //       account: '', //卖家账户
  //       des: '',
  //     },
  //     totalPrice: 22,
  //     status: 'UN_PROCESSED' //'UN_PURCHASE','UN_PROCESSED','ACCEPTED','REJECTED','FINISHED'
  //   },
  // ],
  newOrder: {
    shopId: '',
    shopName: '',
    productList: [], //{ product: Obj, quantity: '' }
    pickUpWay: {
      way: '',
      place: {}, //{place:'',placeDetail:''} or {line:'',station:'',des:''} or { name: '', tel: '', address: '' }
      date: '',
      time: '',
      des: '',
    },
    paymentOption: {
      option: '',
      account: '', //卖家账户
      des: '',
    },
    totalPrice: '',
    status: '' //'UN_PURCHASE','UN_PROCESSED','ACCEPTED','REJECTED','FINISHED'
  },

  choosenOrders: [], //被选中准备提交接龙的接龙

  isOutOfStock: false, //接龙里是否有超出库存的商品
};



const countTotalPrice = (newOrder) => { //计算一个接龙的总价。 返回值为添加了totalPrice属性的order
  let totalPrice = 0;
  newOrder && newOrder.productList && 
  newOrder.productList.forEach((it) => {
    totalPrice += it.product.price * it.quantity;
  });
  let updatedNewOrder = {
    ...newOrder,
    totalPrice: totalPrice
  }
  return (updatedNewOrder);
}

const changeProductQuantity = (state, action) => {
  let currentOrderIndex = state.newOrders.findIndex((it) => {
    return it.shopId == action.product.shopId;
  });

  let updatedNewOrders = state.newOrders;
  let newOrder = (currentOrderIndex > -1) ? //如果已经添加过该店铺商品，则修改该店铺接龙，否则新建接龙
    (updatedNewOrders.splice(currentOrderIndex)[0]) : { //*注意要加[0]！！！！
      ...INITIAL_STATE.newOrder,
      productList: [], //*problem init时数组不会自己清空，还得拿出来手动清空
      shopId: action.product.shopId,
      shopName: action.product.shopName,
    };

  let productIndex = (newOrder.productList.findIndex((it) => {
    return it.product._id == action.product._id;
  }));
  if (productIndex < 0) { //如果还没此商品，则添加
    newOrder.productList.push({
      product: action.product,
      quantity: action.quantity,
    });
    let updatedNewOrder = countTotalPrice(newOrder);
    updatedNewOrders.push(updatedNewOrder);
  } else if (action.quantity == 0) { //如果已有此商品，且数量变为0，则删除
    newOrder.productList.splice(productIndex, 1);
    if (newOrder.productList.length > 0) { //如果删除后还有该店铺商品才push回去，否则直接丢掉
      let updatedNewOrder = countTotalPrice(newOrder);
      updatedNewOrders.push(updatedNewOrder);
    }
  } else { //如果已有此商品，则改数量
    newOrder.productList.splice(productIndex, 1, {
      ...newOrder.productList[productIndex],
      quantity: action.quantity,
    });
    let updatedNewOrder = countTotalPrice(newOrder);
    updatedNewOrders.push(updatedNewOrder);
  };

  return {
    ...state,
    newOrders: updatedNewOrders
  };
}

const initOrders = (state, action) => { //*problem 不知为何如果直接用INITIAL_STATE会初始化不成功
  console.log('ini');
  return {
    ...INITIAL_STATE,
    newOrders: [],
    newOrder: {
      shopId: '',
      shopName: '',
      productList: [],
      pickUpWay: {
        way: '',
        place: {},
        date: '',
        time: '',
        des: '',
      },
      paymentOption: {
        option: '',
        account: '',
        des: '',
      },
      totalPrice: '',
      status: ''
    },
    choosenOrders: [],
  };
}

const toggleIsOutOfStock = (state, action) => {
  return {
    ...state,
    isOutOfStock: action.isOutOfStock
  };
}

export default function ordersManager(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionsType.CHANGE_PRODUCT_QUANTITY:
      return changeProductQuantity(state, action);
    case actionsType.INIT_ORDERS:
      return initOrders(state, action);
    case actionsType.TOGGLE_IS_OUT_OF_STOCK:
      return toggleIsOutOfStock(state, action);
    default:
      return state
  }
}