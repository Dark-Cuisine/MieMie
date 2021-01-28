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
import tabBarManager from '../../../redux/reducers/tabBarManager'

const db = wx.cloud.database();
const _ = db.command

@connect(
  ({ shopsManager, publicManager, tabBarManager, userManager }) => ({
    shopsManager, publicManager, tabBarManager, userManager
  }),
  (dispatch) => ({
    initShops() {
      dispatch(actions.initShops())
    },
    setUser(openid, unionid) {
      dispatch(actions.setUser(openid, unionid))
    },
    filterShops(way, shopKind, pickUpWay, stations) {
      dispatch(actions.filterShops(way, shopKind, pickUpWay, stations))
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

  componentDidMount = async () => {    
    let preSearchStations = wx.getStorageSync('preSearchStations');
    //console.log('preSearchStations', preSearchStations);
    preSearchStations ?
      this.props.filterShops('SET_STATIONS',
        this.props.shopsManager.filterOptions.shopKind,
        this.props.shopsManager.filterOptions.pickUpWay,
        preSearchStations) :
      this.props.initShops();
  }

  onPullDownRefresh() {
    console.log('onPullDownRefresh');
    this.props.initShops()
    Taro.stopPullDownRefresh()
  }
  // componentWillReceiveProps(nextProps){
  //   console.log('nextProps,nextProps',nextProps);
  //   if(nextProps.tabBarManager.controlBarMode==this.props.controlBarMode){
  //     setState({
  //     ...state,
  //     controlBarMode:nextProps.tabBarManager.controlBarMode
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
        <View className='sticky_head'>
          <View className={(this.props.tabBarManager.controlBarMode === 'NORMAL') ?
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
          (this.props.publicManager.ifOpenLoadingSpinner) ? null :
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
      </Layout>
    )
  }
}

export default ShoppingPage;
