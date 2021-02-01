import * as actionsType from '../constants/layoutManager'


const INITIAL_STATE = {
  currentTabId: null, //当前tab

  horizontalBarMode: 'NORMAL', //横tabbar位置 'NORMAL','HIDED'
  shoppingCarMode: 'NORMAL', //购物车图标位置
  controlBarMode: 'NORMAL', //控制bar位置

  ifOpenLoadingSpinner: false, //加载圈
  ifMarkMsgButton: false, //未读消息标记

  userGuideReturnPage: null, //用户指南结束后返回的页面
  userGuideIndex: null, //用户指南现在在第几步

};

export default function layoutManager(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionsType.CHANGE_TAB_BAR_TAB:
      return ({
        ...state,
        currentTabId: action.tab.id,
        horizontalBarMode: 'NORMAL',
      });
    case actionsType.TOGGLE_HIDE_MODE:
      return ({
        ...state,
        horizontalBarMode: action.horizontalBarMode,
        shoppingCarMode: action.shoppingCarMode,
        controlBarMode: action.controlBarMode,
      });
    case actionsType.TOGGLE_LOADING_SPINNER:
      return ({
        ...state,
        ifOpenLoadingSpinner: (action.ifOpen === null) ? !state.ifOpenLoadingSpinner : action.ifOpen,
      });
    case actionsType.TOGGLE_MARK_MSG_BUTTON:
      return ({
        ...state,
        ifMarkMsgButton: action.ifMark,
      });
    case actionsType.USER_GUIDE_NEXT_STEP:
      return ({
        ...state,
        userGuideIndex: action.nextStep,
        userGuideReturnPage: (action.returnPage === null) ?
          state.userGuideReturnPage : action.returnPage,
      });
    default:
      return state
  }
}