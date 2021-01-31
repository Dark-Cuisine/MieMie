import * as actionsTypes from '../constants/globalData'


export const setLayoutData = (layoutData) => { //设置全局变量
  return {
    type: actionsTypes.SET_LAYOUT_DATA,
    layoutData: layoutData
  };
};