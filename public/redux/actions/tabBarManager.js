import * as actionsTypes from '../constants/tabBarManager'

const db = wx.cloud.database();
const _ = db.command


export const changeTabBarMode = (mode) => { //切换tabBar买家卖家模式
  return {
    type: actionsTypes.CHANGE_TAB_BAR_MODE,
    mode: mode,
  };
};

export const changeTabBarTab = (tab) => { //切换tabBar的tabs
  wx.switchTab({ url: tab.url });//跳转页面
  return {
    type: actionsTypes.CHANGE_TAB_BAR_TAB,
    tab: tab,
  };
};

export const toggleHideMode = (horizontalBarMode = 'NORMAL', shoppingCarMode = 'NORMAL', controlBarMode = 'NORMAL') => { //根据上下滑动距离判断是否隐藏  'HIDED','NORMAL'

  return {
    type: actionsTypes.TOGGLE_HIDE_MODE,
    horizontalBarMode: horizontalBarMode,
    shoppingCarMode: shoppingCarMode,
    controlBarMode: controlBarMode,
  };
};
