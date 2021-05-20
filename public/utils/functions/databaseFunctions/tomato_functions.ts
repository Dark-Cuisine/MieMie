import dayjs from 'dayjs'
import * as product_functions from './product_functions'
import * as solitaire_functions from './solitaire_functions'
import * as msg_functions from './msg_functions'
import * as order_functions from './order_functions'
import * as shop_functions from './shop_functions'



//新建该用户的tomatocalendar  
export const newTomatoCalendar = async (authId) => {
  console.log('c-newTomatoCalendar', authId);
  let tomatoCalendar = {
    authId: authId,
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),

    tomatoNames: [
      {
        id: 'red',
        name: '红番茄',
      },
      {
        id: 'yellow',
        name: '黄番茄',
      },
      {
        id: 'blue',
        name: '蓝番茄',
      },
      {
        id: 'white',
        name: '白番茄',
      },
    ]
  }
  let res = await wx.cloud.callFunction({
    name: 'add_data',
    data: {
      collection: 'tomatoCalendars',
      newItem: tomatoCalendar
    },
  });
  let tomatoCalendarId = res.result._id;
  let res_2 = await wx.cloud.callFunction({
    name: 'update_data',
    data: {
      collection: 'users',
      queryTerm: { unionid: authId },
      updateData: { tomatoCalendarId: tomatoCalendarId }
    }
  });
}

//改番茄数量
export const changeTomatoQuantity = async (userId, date, color, quantity) => {
  console.log('c-changeTomatoQuantity', userId, date, color, quantity);
  let r = await wx.cloud.callFunction({
    name: 'change_tomato_quantity',
    data: {
      userId: userId,
      date: date,
      color: color,
      quantity: quantity,
    }
  })
}


//改番茄名
export const changeTomatoName = async (userId, tomatoCalendarId, color, name) => {
}

//拿取今天的番茄
export const getTomatoDay = async (userId, date) => {
  console.log('c-getTomatoDay', userId, date);
  let r = await wx.cloud.callFunction({
    name: 'get_tomato_day',
    data: {
      userId: userId,
      date: date,
    }
  })
  return r && r.result && r.result.data &&
    r.result.data.length > 0 &&
    r.result.data[0]
}