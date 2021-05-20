const tomatoCalendar = {
  authId: authId,
  createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),

  tomatoNames: [{
      id: 'red',
      name: '黄番茄',
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
  ],
}

const tomatoDay = {
  authId: authId,
  createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),

  date: '', //日期 dayjs().format('YYYYMMDD')
  redQuantity: 0,
  yellowQuantity: 0,
  blueQuantity: 0,
  whiteQuantity: 0,
}