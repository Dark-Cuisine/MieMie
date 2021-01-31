import * as actionsType from '../constants/tabBarManager'
// import classification from '../../public/classification'


const INITIAL_STATE = {
  //  tabBarTab: classification.tabBar.tabBarList_buyer[0],
  currentTabId: null,

  horizontalBarMode: 'NORMAL',
  shoppingCarMode: 'NORMAL', //'NORMAL','HIDED'
  controlBarMode: 'NORMAL',

};


const changeTabBarTab = (state, action) => {
  return ({
    ...state,
    // tabBarTab: action.tab,
    currentTabId: action.tab.id,
    horizontalBarMode: 'NORMAL',
  });
}

const toggleHideMode = (state, action) => {
  return ({
    ...state,
    horizontalBarMode: action.horizontalBarMode,
    shoppingCarMode: action.shoppingCarMode,
    controlBarMode: action.controlBarMode,
  });
}


export default function tabBarManager(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionsType.CHANGE_TAB_BAR_MODE:
      return changeTabBarMode(state, action);
    case actionsType.CHANGE_TAB_BAR_TAB:
      return changeTabBarTab(state, action);
    case actionsType.TOGGLE_HIDE_MODE:
      return toggleHideMode(state, action);
    default:
      return state
  }
}