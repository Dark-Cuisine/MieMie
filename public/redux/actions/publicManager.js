import * as actionsTypes from '../constants/publicManager'

const db = wx.cloud.database();
const _ = db.command

export const initClassification = () => {
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
          type: actionsTypes.INIT_CLASSIFICATION,
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

export const toggleLoadingSpinner = (ifOpen) => { //开关loading spinner
  return {
    type: actionsTypes.TOGGLE_LOADING_SPINNER,
    ifOpen: (ifOpen === null) ? null : ifOpen,
  }
}

export const judgeIfMarkMsgButton = (userId) => { //
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
        let result = r && r.result;
        if (!(result && result.data && result.data.length > 0)) {
          return;
        }
        let receivedMsgIdList = (result.data[0] && result.data[0].messages) ?
          result.data[0].messages.received : [];
        if (receivedMsgIdList && receivedMsgIdList.length > 0) {
          wx.cloud.callFunction({
            name: 'get_data',
            data: {
              collection: 'messages',
              operatedItem: '_ID',
              queriedList: receivedMsgIdList,
            },
            success: (response) => {
              let result = response.result;
              let ifMark = false;
              if (result && result.data && result.data.length > 0) {
                ifMark = (result.data.findIndex((it) => {
                  return (it.status == 'UNREAD')
                }) > -1)
              }
              dispatch({
                type: actionsTypes.TOGGLE_MARK_MSG_BUTTON,
                ifMark: ifMark,
              });
            },
            fail: () => {
              wx.showToast({
                title: '获取数据失败',
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