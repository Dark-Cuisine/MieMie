export default {
  pages: [
    // 'pages/index/index',

    // 'pages/SellerPages/MyOrdersPage/MyOrdersPage',
    // // 'pages/SellerPages/MyShopsPage/MyShopsPage',
    // 'pages/SellerPages/DeliveryPage/DeliveryPage',
    // //'pages/SellerPages/MyShopsPage/ManageShopPage/ManageShopPage',

    'pages/SellerPages/MyOrdersPage/MyOrdersPage',
    // 'pages/SellerPages/MyShopsPage/MyShopsPage',
    'pages/SellerPages/DeliveryPage/DeliveryPage',
    //'pages/SellerPages/MyShopsPage/ManageShopPage/ManageShopPage',


  ],
  subpackages: [{
    root: "pages/SellerPages/MyShopsPage",
    pages: [
      "MyShopsPage",
      "ManageShopPage/ManageShopPage",
    ]
  },
  {
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
  }
  ],
  window: {
    navigationStyle: 'custom',
    enablePullDownRefresh: true,

    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
