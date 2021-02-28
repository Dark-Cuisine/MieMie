export default {
  pages: [
    // 'pages/index/index',
    // 'pages/SolitairePages/ManageSolitairesPage/ManageSolitairesPage',
    // 'pages/SolitairePages/MySolitairesPage/MySolitairesPage',
    // 'pages/SolitairePages/MyActivitiesPage/MyActivitiesPage',
    // 'pages/PublicPages/UserPage/UserPage',

    'pages/index/index',
    'pages/SolitairePages/ManageSolitairesPage/ManageSolitairesPage',
    'pages/SolitairePages/MySolitairesPage/MySolitairesPage',
    'pages/SolitairePages/MyActivitiesPage/MyActivitiesPage',
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
  {
    root: "pages/PublicPages/InsideShopPage",
    pages: [
      "InsideShopPage",
    ]
  }
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
        pagePath: "pages/SolitairePages/MySolitairesPage/MySolitairesPage",
        text: "我发布的",
      },
      {
        pagePath: "pages/SolitairePages/MyActivitiesPage/MyActivitiesPage",
        text: "我参与的",
      },
      {
        pagePath: "pages/PublicPages/UserPage/UserPage",
        text: "用户",
      },
    ]
  },
}
