import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtSearchBar } from 'taro-ui'
import * as actions from "../../../redux/actions";
import dayjs from 'dayjs'


import Layout from '../../../components/Layout/Layout'
import ControlBar from './ControlBar/ControlBar'
import LoginDialog from '../../../components/dialogs/LoginDialog/LoginDialog'
import ShopCard from '../../../components/cards/ShopCard/ShopCard'
import ShopProductCard from '../../../components/cards/ShopProductCard/ShopProductCard'
import SearchBar from './SearchBar/SearchBar'
import LotteryDraw from './LotteryDraw/LotteryDraw'
import UserGuide from '../../../components/UserGuide/UserGuide'
import DatePicker from '../../../components/DatePicker/DatePicker'
import ActionButtons from '../../../components/buttons/ActionButtons/ActionButtons'

import './ShoppingPage.scss'
import layoutManager from '../../../redux/reducers/layoutManager'

const app = getApp()
const db = wx.cloud.database();
const _ = db.command

@connect(
  ({ shopsManager, publicManager, layoutManager, userManager }) => ({
    shopsManager, publicManager, layoutManager, userManager
  }),
  (dispatch) => ({
    initShops() {
      dispatch(actions.initShops())
    },
    setUser(openid, unionid) {
      dispatch(actions.setUser(openid, unionid))
    },
    filterShops(way, shopKind, pickUpWay, stations, classifications) {
      dispatch(actions.filterShops(way, shopKind, pickUpWay, stations, classifications))
    },
    setCurrentShopId(shopId) {
      dispatch(actions.setCurrentShopId(shopId))
    }
  }),
)

class ShoppingPage extends Component {
  state = {
    isSearching: false,
  }

  componentDidShow() {
    // if (typeof this.getTabBar === 'function' &&
    //   this.getTabBar()) {
    //   this.getTabBar().setData({
    //     selected: 0 //这个数是，tabBar从左到右的下标，从0开始
    //   })
    // }
  }

  componentDidMount = async () => {
    this.doInit()
  }
  // componentWillReceiveProps(nextProps) {
  //   //  console.log('abab-nextProps,nextProps', nextProps.userManager, 'thisprops', this.props.userManager);
  //   if (!(nextProps.userManager.unionid == this.props.userManager.unionid) ||
  //     (!(nextProps.layoutManager.currentTabId == this.props.layoutManager.currentTabId) &&
  //       (nextProps.layoutManager.currentTabId == app.$app.globalData.classifications.tabBar.tabBarList_buyer[1].id))
  //   ) {
  //     console.log('abab-1');
  //     this.doInit(nextProps);
  //   }
  // }
  onPullDownRefresh() {
    console.log('onPullDownRefresh');
    this.props.initShops()
    Taro.stopPullDownRefresh()
  }

  doInit = async (props = this.props) => {
    let classifications = app.$app.globalData.classifications
    let preSearchStations = wx.getStorageSync('preSearchStations');
    // console.log('preSearchStations', preSearchStations);
    (preSearchStations && classifications) ?
      this.props.filterShops('SET_STATIONS',
        props.shopsManager.filterOptions.shopKind,
        props.shopsManager.filterOptions.pickUpWay,
        preSearchStations,
        classifications
      ) :
      this.props.initShops();
  }

  // componentWillReceiveProps(nextProps){
  //   console.log('nextProps,nextProps',nextProps);
  //   if(nextProps.layoutManager.controlBarMode==this.props.controlBarMode){
  //     setState({
  //     ...state,
  //     controlBarMode:nextProps.layoutManager.controlBarMode
  //     });
  //   }
  // }

  handleToggleShoppingCar = () => {
    this.setState({
      ...this.state,
      isShoppingCarOpen: !this.state.isShoppingCarOpen,
    });
  };

  toggleSearchBar(ifOpen) {
    this.setState({
      ...this.state,
      isSearching: (ifOpen === null) ? !this.state.isSearching : ifOpen
    });
  }

  //跳去该店铺的页面
  navigateToInsideShopPage = (shopId) => {
    this.props.setCurrentShopId(shopId);
    Taro.navigateTo({
      url: '/pages/PublicPages/InsideShopPage/InsideShopPage',
    });
  }

  render() {
    let app = getApp()
    let classifications = app.$app.globalData.classifications

    return (
      <Layout
        version={this.props.version}
        className='shopping_page'
        ref={ref => this.ShoppingPage = ref}
        // style={'font-size:200% !important;'}
        mode='BUYER'
        navBarKind={1}
        lateralBarKind={1}
        navBarTitle='逛摊'
      >
        <View
          className='sticky_head'
          style={'top:' + (app.$app.globalData.layoutData && app.$app.globalData.layoutData.NAV_BAR_HEIGHT) + 'rpx'}
        >
          <View className={(this.props.layoutManager.controlBarMode === 'NORMAL') ?
            'mode_normal' : 'mode_hide'}>
            <View className={'flex header'.concat(this.state.isSearching ?
              ' high' : ' low')}>
              {this.state.isSearching || <LotteryDraw />}
              <SearchBar
                toggleSearchBar={(ifOpen) => this.toggleSearchBar(ifOpen)}
              />
            </View>
            {this.state.isSearching || <ControlBar />}
          </View>
        </View>
        <View className={'place_holder_'.concat(
          (this.state.isSearching) ?
            'low' : 'high')} />
        {
          (this.props.layoutManager.ifOpenLoadingSpinner) ? null :
            (this.state.isSearching ?
              (this.props.shopsManager.searchedShopList &&
                this.props.shopsManager.searchedShopList.length > 0 ?
                <View className='shop_cards'>
                  {this.props.shopsManager.searchedShopList.map((it, i) => {
                    return (
                      <ShopCard
                        key={i}
                        shop={it}
                      />
                    )
                  })}
                </View>
                : null
              )
              :
              (this.props.shopsManager.shopList && this.props.shopsManager.shopList.length > 0 ?
                <View className='shop_cards'>
                  {this.props.shopsManager.shopList.map((it, i) => {
                    return (
                      <ShopCard
                        key={i}
                        shop={it}
                      />
                    )
                  })}
                </View>
                :
                <View className='shop_cards'>
                  <View className='empty_word'>
                    无符合条件的地摊
                </View>
                </View>
              )
            )
        }
        {this.state.isSearching &&
          <View className='product_cards wrap'>
            {
              this.props.shopsManager.searchedProductList.map((it, i) => {
                return (
                  <View className='' style={'padding-top:10rpx;'}>
                    <View
                      className='shop_name'
                      onClick={() => this.navigateToInsideShopPage(it.shopId)}
                    >
                      {it.shopName}
                    </View>
                    <ShopProductCard
                      key={i}
                      product={it}
                      mode='BUYER'
                      hasDeleteDialog={false}
                    />
                  </View>
                )
              })
            }
          </View>
        }
        <tabbar></tabbar>
      </Layout>
    )
  }
}

export default ShoppingPage;
