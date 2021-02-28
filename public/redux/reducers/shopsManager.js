import * as actionsTypes from '../constants/shopsManager'
 

const INITIAL_STATE = {

  shopList: [], //筛选出的shops
  productList: [], //筛选出的products 

  searchedShopList: [], //查找出的shops
  searchedProductList: [], //查找出的products 

  currentShopId: '', //*for test

  filterOptions: { //筛选条件
    shopKind: null, //{shopKindLarge:'',shopKindSmall:''}
    pickUpWay: null,
    stations: {
      line: '',
      stations: {
        list: [],
        from: '',
        to: ''
      }
    }, //{line:'',stations:{list:[''],from:'',to:''}}
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


export default function shopsManager(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionsTypes.SET_CURRENT_SHOP_ID:
      return {
        ...state,
        currentShopId: action.currentShopId
      };
    case actionsTypes.SET_SHOP_LIST:
      return {
        ...state,
        shopList: action.shopList
      };
    case actionsTypes.SET_FILTER_OPTION:
      return setFilterOption(state, action);
    case actionsTypes.SET_SEARCHED_SHOP_LIST:
      return {
        ...state,
        searchedShopList: action.shopList
      };
    case actionsTypes.SET_SEARCHED_PRODUCT_LIST:
      return {
        ...state,
        searchedProductList: action.productList
      };
    default:
      return state
  }
}