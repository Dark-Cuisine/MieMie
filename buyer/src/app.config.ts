export default {
  pages: [
    // 'pages/index/index',

    // 'pages/BuyerPages/ShoppingPage/ShoppingPage',
    // 'pages/BuyerPages/OrdersPage/OrdersPage',
    // 'pages/BuyerPages/MarkedPage/MarkedPage',
    // 'pages/BuyerPages/PurchasePage/PurchasePage',

    'pages/BuyerPages/ShoppingPage/ShoppingPage',
    'pages/BuyerPages/OrdersPage/OrdersPage',
    'pages/BuyerPages/MarkedPage/MarkedPage',
    'pages/BuyerPages/PurchasePage/PurchasePage',

  ],
  subpackages: [{
    root: "pages/PublicPages",
    pages: [
      "MessagesPage/MessagesPage",
      "InsideShopPage/InsideShopPage",
      "UserPage/UserPage",
      "UserPage/UserInfoSettingPage/UserInfoSettingPage",
      "UserPage/ExpressInfoPage/ExpressInfoPage",
      "UserPage/MarkedStationsPage/MarkedStationsPage",
      "UserPage/FeedBackPage/FeedBackPage",
    ]
  }],
  window: {
    navigationStyle: 'custom',
    enablePullDownRefresh: true,

    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
