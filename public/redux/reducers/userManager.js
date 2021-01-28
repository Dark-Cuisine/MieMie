import * as actionsTypes from '../constants/userManager'



const INITIAL_STATE = {
  openid: '',
  unionid: '',
  userInfo: {},
};

const setUser = (state, action) => {
  return {
    ...state,
    openid: action.openid,
    unionid: action.unionid,
    userInfo: action.userInfo,
  };
}



const handleMark = (state, action) => {
  let upadted = []
  switch (action.way) {
    case 'SHOP':
      upadted = state.userInfo.markedShops ? state.userInfo.markedShops : [];
      break;
    case 'ORDER':
      upadted = (state.userInfo.markedOrders && state.userInfo.markedOrders.markA) ?
        state.userInfo.markedOrders.markA : []; //*unfinished 现在只有一种mark
      break;
    default:
      break;
  }
  if (action.ifMark) {
    upadted.push(action.itemId);
  } else {
    let index = upadted.indexOf(action.itemId);
    upadted.splice(index, 1);
  };
  switch (action.way) {
    case 'SHOP':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          markedShops: upadted,
        },
      };
      break;
    case 'ORDER':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          markedOrders: {
            ...state.userInfo.markedOrders,
            markA: upadted,
          },
        },
      };
      break;
    default:
      break;
  }

}



export default function userManager(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionsTypes.SET_USER:
      return setUser(state, action);
    case actionsTypes.HANDLE_MARK:
      return handleMark(state, action);
    default:
      return state
  }
}