import {
  combineReducers
} from "redux"
import shopsManager from './shopsManager'
import userManager from './userManager'
import ordersManager from './ordersManager'
import tabBarManager from './tabBarManager'
import publicManager from './publicManager'
import globalData from './globalData'

export default combineReducers({
  globalData,
  shopsManager,
  userManager,
  ordersManager,
  tabBarManager,
  publicManager
})