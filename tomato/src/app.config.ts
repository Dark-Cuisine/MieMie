export default {
  pages: [
    'pages/index/index',
    'pages/TomatoPages/TodayTomatoPage/TodayTomatoPage',
    'pages/TomatoPages/TomatoCalendarPage/TomatoCalendarPage',
    'pages/TomatoPages/DoingTomatoPage/DoingTomatoPage',

    'pages/PublicPages/UserPage/UserPage',
  ],
  subpackages: [
    {
      root: "pages/PublicPages/UserPage/UserInfoSettingPage",
      pages: [
        "UserInfoSettingPage",
      ]
    },
    {
      root: "pages/PublicPages/UserPage/ExpressInfoPage",
      pages: [
        "ExpressInfoPage",
      ]
    },
    {
      root: "pages/PublicPages/UserPage/MarkedStationsPage",
      pages: [
        "MarkedStationsPage",
      ]
    },
    {
      root: "pages/PublicPages/UserPage/FeedBackPage",
      pages: [
        "FeedBackPage",
      ]
    },
    {
      root: "pages/PublicPages/MessagesPage",
      pages: [
        "MessagesPage",
      ]
    }, 
  ],
  window: {
    navigationStyle: 'custom',
    enablePullDownRefresh: true,

    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    color: "#666",
    selectedColor: "#b4282d",
    backgroundColor: "#fafafa",
    borderStyle: 'black',
    list: [
      {
        pagePath: "pages/TomatoPages/TodayTomatoPage/TodayTomatoPage",
        text: "今天",
      },
      {
        pagePath: "pages/TomatoPages/TomatoCalendarPage/TomatoCalendarPage",
        text: "日历",
      },
    ]
  },
  useExtendedLib: {
    weui: true
  },
  permissions: {
    openapi: [
      "templateMessage.send",
      "security.msgSecCheck",
      "security.imgSecCheck"
    ]
  }
}
