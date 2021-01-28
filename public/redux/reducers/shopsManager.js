import * as actionsTypes from '../constants/shopsManager'
import classification from '../../public/classification'


const INITIAL_STATE = {

  shopList: [], //筛选出的shops
  productList: [], //筛选出的products 

  searchedShopList: [], //查找出的shops
  searchedProductList: [], //查找出的products 

  //currentShopId: '38597c165fad110f00adff193dde1a65', //*for test
  currentShopId: '', //*for test

  filterOptions: { //筛选条件
    shopKind: null, //{shopKindLarge:'',shopKindSmall:''}
    pickUpWay: classification.pickUpWayList.slice(0),
    stations: {line:'',stations:{list:[],from:'',to:''}}, //{line:'',stations:{list:[''],from:'',to:''}}
  }
};


const setFilterOption = (state, action) => {
  switch (action.option) {
    case 'SHOP_KIND':
      return {
        ...state,
        filterOptions: {
          ...state.filterOptions,
          shopKind: action.updatedItem
        }
      };
      break;
    case 'PICK_UP_WAY':
      return {
        ...state,
        filterOptions: {
          ...state.filterOptions,
          pickUpWay: action.updatedItem
        }
      };
      break;
    case 'SET_STATIONS':
      return {
        ...state,
        filterOptions: {
          ...state.filterOptions,
          stations: action.updatedItem
        }
      };
      break;

    default:
      break;
  }

}

//
const setShopList = (state, action) => {
  return {
    ...state,
    shopList: action.shopList
  };
}
// const setProductList = (state, action) => {
//   return {
//     ...state,
//     productList: action.productList
//   };
// }

//
const setSearchedShopList = (state, action) => {
  return {
    ...state,
    searchedShopList: action.shopList
  };
}
const setSearchedProductList = (state, action) => {
  return {
    ...state,
    searchedProductList: action.productList
  };
}


const setCurrentShopId = (state, action) => {
  return {
    ...state,
    currentShopId: action.currentShopId
  };
}




export default function shopsManager(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionsTypes.SET_FILTER_OPTION:
      return setFilterOption(state, action);

    case actionsTypes.SET_SHOP_LIST:
      return setShopList(state, action);
 
    case actionsTypes.SET_SEARCHED_SHOP_LIST:
      return setSearchedShopList(state, action);
    case actionsTypes.SET_SEARCHED_PRODUCT_LIST:
      return setSearchedProductList(state, action);

    case actionsTypes.SET_CURRENT_SHOP:
      return setCurrentShopId(state, action);


    default:
      return state
  }
}
