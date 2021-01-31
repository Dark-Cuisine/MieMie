import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtIcon, AtModal, AtModalHeader, AtModalAction, AtInput, AtTabs } from 'taro-ui'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions/index'

import MyShops from './MyShopsPage/MyShopsPage'
import MyOrders from './MyOrdersPage/MyOrdersPage'
import Layout from '../../components/Layout/Layout'

import './SellerPage.scss'
import '../../public/design.scss'

const db = wx.cloud.database();
const _ = db.command

@connect(
  ({ userManager }) => ({
    userManager
  }),
)

/**
 * 管理接收的接龙和发布的地摊//*已废弃
 */
class SellerPage extends Component {

  initState = {
    myShops: [],

    currentSubPage: 'ORDERS',//'ORDERS','SHOPS'

  }

  state = this.initState;


  componentDidMount() {
    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'shops',

        queryTerm: { ownerId: this.props.userManager.unionid },

      },
      success: (res) => {
        this.setState({
          ...this.state,
          myShops: res.result ? res.result.data : [],
        });
      },
      fail: () => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        console.error
      }
    });
    // db.collection('shops').where({
    //   shopInfo: {
    //     ownerId: this.props.userManager.unionid
    //   }
    // }).get().then((res) => {
    //   this.setState({
    //     ...this.state,
    //     myShops: res.data,
    //   });
    // });
  }



  handleToggleTab = () => { //切换管理接龙or管理地摊页
    this.setState({
      ...this.state,
      currentSubPage: (this.state.currentSubPage == 'ORDERS') ? 'SHOPS' : 'ORDERS'
    });
  }

  render() {
    return (
      <View >
        <Layout
          version={this.props.version}
          navBarKind={3}
          navBarTitle={this.state.currentSubPage == 'ORDERS' ? '处理接龙' : '管理地摊'}
        >
          <View className='switch_sub_page_button'
            onClick={this.handleToggleTab.bind(this, 'ORDERS_OR_SHOPS')}
          >
            {this.state.currentSubPage == 'ORDERS' ? '管理地摊' : '处理接龙'}
          </View>
          <View className='sub_page' >
            {this.state.currentSubPage == 'ORDERS' ?
              <MyOrders
                myShops={this.state.myShops}
              />
              :
              <MyShops
                version={props.version}
                myShops={this.state.myShops}
              />
            }
          </View>
        </Layout>
      </View>
    )
  }
}

export default SellerPage;
