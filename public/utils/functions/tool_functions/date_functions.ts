import { connect } from 'react-redux';

import dayjs from 'dayjs'

//date_functions

//和今天的日期、时间对比
//返回: 输入值是否>当前时间
//date 格式为'YYYYMMDD'
//time 格式为'HHmmss'或'HHmm'
export const compareDateAndTimeWithNow = (date, time) => {
   let reg_1 = new RegExp('\\/', 'g');
  let reg_2 = new RegExp('-', 'g');
  let reg_3 = new RegExp(':', 'g');

  let uDate = date.replace(reg_1, '')
  uDate = date.replace(reg_2, '')
  let uTime = time.replace(reg_3, '')

  uTime.length < 6 &&
    (uTime = uTime.concat('00'))

  let currentDate = dayjs().format('YYYYMMDD')
  let currentTime = dayjs().format('HHmmss')

  // console.log('compareDateAndTimeWithNow', date, uDate, currentDate);
  // console.log('compareDateAndTimeWithNow-time', time, uTime, currentTime);
  if (uDate > currentDate) {
    return true
  } else {
    return uTime > currentTime
  }

}

