const tomatoCalendar = {
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