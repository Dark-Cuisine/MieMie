export default {
  pages: [
    'pages/index/index',


    // 'pages/SellerPages/MyOrdersPage/MyOrdersPage',
    // 'pages/SellerPages/MyShopsPage/MyShopsPage',
    // 'pages/SellerPages/DeliveryPage/DeliveryPage',
    // 'pages/PublicPages/UserPage/UserPage',

    'pages/SellerPages/MyOrdersPage/MyOrdersPage',
    'pages/SellerPages/MyShopsPage/MyShopsPage',
    'pages/SellerPages/DeliveryPage/DeliveryPage',
    'pages/PublicPages/UserPage/UserPage',
  ],
  subpackages: [{
    root: "pages/SellerPages/MyShopsPage/ManageShopPage",
    pages: [
      "ManageShopPage",
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
    list: [
      {
        // iconPath: "./assets/tab-bar/home.png",
        // selectedIconPath: "./assets/tab-bar/home-active.png",
        pagePath: "pages/SellerPages/MyShopsPage/MyShopsPage",
        text: "地摊",
      },
      {
        pagePath: "pages/SellerPages/MyOrdersPage/MyOrdersPage",
        text: "接单",
      },
      {
        pagePath: "pages/SellerPages/DeliveryPage/DeliveryPage",
        text: "发货",
      },
      // {
      //   pagePath: "pages/PublicPages/UserPage/UserPage",
      //   text: "用户",
      // },
    ]
  },

}
