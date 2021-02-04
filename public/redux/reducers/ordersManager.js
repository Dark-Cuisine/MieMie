import * as actionsType from '../constants/ordersManager'

//订单管理
const INITIAL_STATE = {
  newOrders: [], //购物车里所有的订单

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

  // choosenOrders: [], //被选中准备提交订单的订单

  isOutOfStock: false, //订单里是否有超出库存的商品
};

const countTotalPrice = (newOrder) => { //计算一个订单的总价。 返回值为添加了totalPrice属性的order
  let totalPrice = 0;
  newOrder.productList.forEach((it) => {
    totalPrice += it.product.price * it.quantity;
  });
  return ({
    ...newOrder,
    totalPrice: totalPrice
  });
}

const changeProductQuantity = (state, action) => {
  let updatedNewOrders = state.newOrders;

  let currentOrderIndex = state.newOrders.findIndex((it) => { //找有没添加过该店商品
    return it.shopId == action.product.shopId;
  });
  let newOrder = (currentOrderIndex > -1) ? //如已添加过该店商品，则修改该店铺订单，否则新建订单
    (updatedNewOrders.splice(currentOrderIndex)[0]) : { //*注意要加[0]因为splice返回的是数组！！！！
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
    updatedNewOrders.push(countTotalPrice(newOrder));
  } else if (action.quantity == 0) { //如果已有此商品，且数量变为0，则删除
    newOrder.productList.splice(productIndex, 1);
    if (newOrder.productList.length > 0) { //如果删除后还有该店铺商品才push回去，否则原地丢掉
      updatedNewOrders.push(countTotalPrice(newOrder));
    }
  } else { //如果已有此商品，且数量不变为0，则改数量
    newOrder.productList.splice(productIndex, 1, {
      ...newOrder.productList[productIndex],
      quantity: action.quantity,
    });
    updatedNewOrders.push(countTotalPrice(newOrder));
  };

  return {
    ...state,
    newOrders: updatedNewOrders
  };
}

const initOrders = (state, action) => {
  if (action.shopId) { //init单个店铺的order
    let updatedNewOrders = state.newOrders;
    let currentOrderIndex = state.newOrders.findIndex((it) => { //找该店order
      return it.shopId == action.shopId;
    });
    updatedNewOrders.splice(currentOrderIndex, 1);
    return {
      ...state,
      newOrders: updatedNewOrders, //*注: 不能在这直接用state.newOrders.splice(currentOrderIndex, 1)不然会被删掉两个
    };
  } else { //init所有order
    return { //*problem 如果直接用INITIAL_STATE，数组会初始化失败
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
}

export default function ordersManager(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionsType.CHANGE_PRODUCT_QUANTITY:
      return changeProductQuantity(state, action);
    case actionsType.INIT_ORDERS:
      return initOrders(state, action);
    case actionsType.TOGGLE_IS_OUT_OF_STOCK:
      return {
        ...state,
        isOutOfStock: action.isOutOfStock
      };
    default:
      return state
  }
}