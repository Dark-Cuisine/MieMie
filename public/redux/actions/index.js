export {
  initShops,
  filterShops,

  setShopList,
  // setProductList,
  setSearchedShopList,
  setSearchedProductList,
  setCurrentShopId,
}
from './shopsManager';
export {
  setUser,
  handleMark,
}
from './userManager';
export {
  changeProductQuantity,
  initOrders,
  toggleIsOutOfStock,
}
from './ordersManager';
export {
  changeTabBarMode,
  changeTabBarTab,
  toggleHideMode,
}
from './tabBarManager';
export {
  initClassification,
  toggleLoadingSpinner,
  toggleMarkMsgButton,
  judgeIfMarkMsgButton,
  userGuideNextStep,
}
from './publicManager';
export {
  setLayoutData,
}
from './globalData';