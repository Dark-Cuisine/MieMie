import * as actionsTypes from '../constants/layoutManager'

const db = wx.cloud.database();
const _ = db.command

export const changeTabBarTab = (tab) => { //切换tabBar的tabs
  wx.switchTab({
    url: tab.url
  }); //跳转
  toggleHideMode('NORMAL', 'NORMAL', 'NORMAL')
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
 
export const toggleLoadingSpinner = (ifOpen) => { //开关loading spinner
  return {
    type: actionsTypes.TOGGLE_LOADING_SPINNER,
    ifOpen: (ifOpen === null) ? null : ifOpen,
  }
}

export const judgeIfMarkMsgButton = (userId) => { //判断收件箱是否有未读信息
  return dispatch => {
    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'users',
        queryTerm: {
          unionid: userId
        }
      },
      success: (r) => {
        if (!(r && r.result && r && r.result.data && r.result.data.length > 0)) {
          return;
        }
        let messages = r.result.data[0].messages;
        let receivedMsgIdList = messages && messages.received;
        if (receivedMsgIdList && receivedMsgIdList.length > 0) {
          wx.cloud.callFunction({
            name: 'get_data',
            data: {
              collection: 'messages',
              operatedItem: '_ID',
              queriedList: receivedMsgIdList,
            },
            success: (response) => {
              if (!(response && response.result && response.result.data)) {
                return
              }
              let msgs = response.result.data;
              let ifMark = (msgs.findIndex((it) => {//找有没有未读信息
                return (it.status == 'UNREAD')
              }) > -1)
              dispatch({
                type: actionsTypes.TOGGLE_MARK_MSG_BUTTON,
                ifMark: ifMark,
              });
            },
            fail: () => {
              wx.showToast({
                title: '获取收件箱数据失败',
                icon: 'none'
              })
              console.error
            }
          });
        } else {
          dispatch({
            type: actionsTypes.TOGGLE_MARK_MSG_BUTTON,
            ifMark: false,
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        console.error
      }
    });
    //     db.collection('users').where({
    //       unionid: unionid
    //     }).get().then((r) => {
    //     let receivedMsgIdList = (r.data[0] && r.data[0].messages) ?
    //      r.data[0].messages.received : [];
    //     if (receivedMsgIdList && receivedMsgIdList.length > 0) {
    //       db.collection('messages').where({
    //         _id: _.in(receivedMsgIdList)
    //       }).get().then((response) => {
    //         let ifMark = false;
    //         if (response.data && response.data.length > 0) {
    //           ifMark = (response.data.findIndex((it) => {
    //             return (it.status == 'UNREAD')
    //           }) > -1)
    //         }
    //         dispatch({
    //           type: actionsTypes.TOGGLE_MARK_MSG_BUTTON,
    //           ifMark: ifMark,
    //         });
    //       });
    //     } else {
    //       dispatch({
    //         type: actionsTypes.TOGGLE_MARK_MSG_BUTTON,
    //         ifMark: false,
    //       });
    //     }
    //   });
  }
}

export const toggleMarkMsgButton = (ifMark) => { //
  return {
    type: actionsTypes.TOGGLE_MARK_MSG_BUTTON,
    ifMark: ifMark,
  }
}

export const userGuideNextStep = (nextStep, returnPage = null) => { //
  return {
    type: actionsTypes.USER_GUIDE_NEXT_STEP,
    nextStep: nextStep,
    returnPage: returnPage,
  }
}