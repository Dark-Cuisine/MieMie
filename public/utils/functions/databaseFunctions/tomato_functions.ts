import dayjs from 'dayjs'
import * as product_functions from './product_functions'
import * as solitaire_functions from './solitaire_functions'
import * as msg_functions from './msg_functions'
import * as order_functions from './order_functions'
import * as shop_functions from './shop_functions'

//新建该用户的tomatocalendar  
export const newTomatoCalendar = async (authId) => {
  let tomatoCalendar = {
    authId: authId,
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),

    tomatoNames: {
      red: '',
      yellow: '',
      blue: '',
      white: '',
    },
    tomatoDays: [{
      date: '', //日期
      redQuantity: 0,
      yellowQuantity: 0,
      blueQuantity: 0,
      whiteQuantity: 0,
    }]
  }
  let res = await wx.cloud.callFunction({
    name: 'add_data',
    data: {
      collection: 'tomatoCalendars',
      newItem: tomatoCalendar
    },
  });
  let tomatoCalendarId = res.result._id;
  let res_2 = wx.cloud.callFunction({
    name: 'update_data',
    data: {
      collection: 'users',
      queryTerm: { unionid: authId },
      updateData: { tomatoCalendarId: tomatoCalendarId }
    }
  });
}

//改番茄数量
export const changeTomatoQuantity = async (userId, tomatoCalendarId, color, quantiy) => {
}


//改番茄名
export const changeTomatoName = async (userId, tomatoCalendarId, color, name) => {
}