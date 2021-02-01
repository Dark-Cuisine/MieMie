import * as actionsTypes from '../constants/globalData'


export const setLayoutData = (layoutData) => { //设置layout的全局变量
  return {
    type: actionsTypes.SET_LAYOUT_DATA,
    layoutData: layoutData
  };
};

export const setClassifications = () => {//从数据库拿classifications
  return dispatch => {
    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'classifications',
      },
      success: (res) => {
        if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
          return
        }
        dispatch({
          type: actionsTypes.SET_CLASSIFICATIONS,
          classifications: res.result.data[0],
        });
      },
      fail: () => {
        wx.showToast({
          title: '获取classifications数据失败',
        })
        console.error
      }
    })
  }
}