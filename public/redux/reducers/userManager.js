import * as actionsTypes from '../constants/userManager'



const INITIAL_STATE = {
  openid: '',
  unionid: '',
  userInfo: {},
};


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
  if (action.ifMark) { //加进收藏
    upadted.push(action.itemId);
  } else { //取消收藏
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
    default:
      break;
  }
}
const handleMarkOrder = (state, action) => {
  let upadted_A = state.userInfo.markedOrders.markA
  let upadted_B = state.userInfo.markedOrders.markB
  let upadted_C = state.userInfo.markedOrders.markC

  action.markNum === 'A' && //加进收藏
    upadted_A.push(action.itemId);
  action.markNum === 'B' &&
    upadted_B.push(action.itemId);
  action.markNum === 'C' &&
    upadted_C.push(action.itemId);

  action.cancelMarkNum === 'A' && //取消收藏
    upadted_A.splice(upadted_A.indexOf(action.itemId), 1)
  action.cancelMarkNum === 'B' &&
    upadted_B.splice(upadted_B.indexOf(action.itemId), 1)
  action.cancelMarkNum === 'C' &&
    upadted_C.splice(upadted_C.indexOf(action.itemId), 1)


  return {
    ...state,
    userInfo: {
      ...state.userInfo,
      markedOrders: {
        ...state.userInfo.markedOrders,
        markA: upadted_A,
        markB: upadted_B,
        markC: upadted_C,
      },
    },
  };

}


export default function userManager(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionsTypes.SET_USER:
      return ({
        ...state,
        openid: (action.openid && action.openid.length > 0) ?
          action.openid : state.openid,
        unionid: action.unionid,
        userInfo: action.userInfo,
      });
    case actionsTypes.HANDLE_MARK:
      return handleMark(state, action);
    case actionsTypes.HANDLE_MARK_ORDER:
      return handleMarkOrder(state, action);
    default:
      return state
  }
}