export default {
  pages: [
    'pages/index/index',

    // 'pages/BuyerPages/ShoppingPage/ShoppingPage',
    // 'pages/BuyerPages/MarkedPage/MarkedPage',
    // 'pages/BuyerPages/OrdersPage/OrdersPage',
    // 'pages/PublicPages/UserPage/UserPage',

    'pages/BuyerPages/ShoppingPage/ShoppingPage',
    'pages/BuyerPages/MarkedPage/MarkedPage',
    'pages/BuyerPages/OrdersPage/OrdersPage',
    'pages/PublicPages/UserPage/UserPage',

  ],
  subpackages: [
    {
      root: "pages/BuyerPages/PurchasePage",
      pages: [
        "PurchasePage",
      ]
    },
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
    list: [{
      pagePath: "pages/BuyerPages/MarkedPage/MarkedPage",
      // iconPath: "./assets/tab-bar/home.png",
      // selectedIconPath: "./assets/tab-bar/home-active.png",
      text: "收藏",
    },
    {
      pagePath: "pages/BuyerPages/ShoppingPage/ShoppingPage",
      text: "逛摊",
    },
    {
      pagePath: "pages/BuyerPages/OrdersPage/OrdersPage",
      text: "订单",
    },
      // {
      //   pagePath: "pages/PublicPages/UserPage/UserPage",
      //   text: "用户",
      // }
    ]
  },

}
