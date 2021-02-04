import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import { connect } from 'react-redux'
import { AtModal } from 'taro-ui'
import * as actions from '../../../redux/actions';

import ActionDialog from '../../../components/dialogs/ActionDialog/ActionDialog'
import Layout from '../../../components/Layout/Layout'
import LoginDialog from '../../../components/dialogs/LoginDialog/LoginDialog'
import classification from '../../../public/classification'


import './UserPage.scss'

const tabBarList_buyer = classification.tabBar.tabBarList_buyer;
const tabBarList_seller = classification.tabBar.tabBarList_seller;


const urlList = [
  '/pages/PublicPages/UserPage/UserInfoSettingPage/UserInfoSettingPage',
  '/pages/PublicPages/UserPage/ExpressInfoPage/ExpressInfoPage',
  '/pages/PublicPages/UserPage/MarkedStationsPage/MarkedStationsPage',
  '/pages/PublicPages/UserPage/FeedBackPage/FeedBackPage',
]
@connect(
  ({ publicManager, layoutManager, userManager }) => ({
    publicManager, layoutManager, userManager
  }),
  (dispatch) => ({
    userGuideNextStep(nextStep, returnPage) {
      dispatch(actions.userGuideNextStep(nextStep, returnPage))
    },
    setUser(openid, unionid) {
      dispatch(actions.setUser(openid, unionid))
    },
    changeTabBarTab(payload) {
      dispatch(actions.changeTabBarTab(payload))
    },

  }),
)
/**
 * 
 */
class UserPage extends Component {

  state = {
    ifOpenLoginDialog: false,
    ifOpenAboutDialog: false,
    ifOpenLogoutDialog: false,
  }

  listItems = [
    {
      name: '分类1',
      sub: [
        // {
        //   text: '个人信息设置',
        //   arrow: 'right',
        //   onClick: () => this.changePage(0)
        // },
        {
          text: '我的邮寄地址',
          arrow: 'right',
          onClick: () => this.changePage(1)
        },
        {
          text: '我保存的车站',
          arrow: 'right',
          onClick: () => this.changePage(2)
        }
      ]
    },
    {
      name: '分类2',
      sub: [
        {
          text: '反馈',
          arrow: 'right',
          onClick: () => this.changePage(3)
        },
        {
          text: '使用指南',
          arrow: '',
          onClick: () => this.toggleUserGuide()
        },
        {
          text: '关于咩咩摆摊',
          arrow: '',
          onClick: () => this.toggleDialog('ABOUT_APP')
        },
      ]
    }
  ]
  componentDidMount() {

  }
  onPullDownRefresh() {
    console.log('onPullDownRefresh--userpage');
    Taro.stopPullDownRefresh()
  }

  changePage = (pageIndex) => {
    Taro.navigateTo({
      url: urlList[pageIndex],
    });
  }

  toggleDialog = (way = null) => {
    this.setState({
      ...this.state,
      openedDialog: way,
    });
  }

  doLogOut() {
    wx.setStorage({
      key: 'isLogged',
      data: false
    });
    this.toggleDialog()
    this.props.setUser('', '');

  }

  toggleUserGuide = () => {
    this.props.userGuideNextStep(1, this.props.mode === 'BUYER' ?
      tabBarList_buyer[3] : tabBarList_seller[3]
    )
  }

  render() {
    let aboutDialog = (
      <AtModal
        isOpened={this.state.openedDialog === 'ABOUT_APP'}
        onClose={() => this.toggleDialog()}
        title='关于此小程序'
        // content='咩咩摆摊致力于打造一个面向在日华人的社区团购平台，
        // 给在日本生活的华人和商家们提供交易、推广等服务。
        // 该小程序暂未开通线上付款功能，
        // 订单支付需要根据商家提供的账户自己去转账, 请买卖家双方注意交易安全。'
        content='咩咩摆摊是一个面向在日华人的接龙小程序，
        给在日本生活的华人和商家们提供交易、推广等服务。
        该小程序暂未开通线上付款功能，
        支付需要根据商家提供的账户自己去转账, 请买卖家双方注意交易安全。'
      />
    )
    let loginDialog =
      <LoginDialog
        version={this.props.version}
        isOpened={this.state.openedDialog === 'LOG_IN'}
        onClose={() => this.toggleDialog()}
        onCancel={() => this.toggleDialog()}
      />;
    let logoutDialog = (
      <ActionDialog
        isOpened={this.state.openedDialog === 'LOG_OUT'}
        onClose={() => this.toggleDialog()}
        onCancel={() => this.toggleDialog()}
        onSubmit={() => this.doLogOut()}
      >确定退出登录？</ActionDialog>
    )

    return (
      <Layout
        version={this.props.version}
        className='user_page'
        mode={this.props.mode}
        navBarKind={3}
        lateralBarKind={0}
        navBarTitle={'用户'}
      >
        {logoutDialog}
        {loginDialog}
        {aboutDialog}
        <View
          className='user_info'
          style={'background-color: '.concat(this.props.mode === 'SELLER' ?
            'var(--dark-1);' : 'var(--light-2);')}
        >
          {this.props.userManager.unionid && this.props.userManager.unionid.length > 0 ?
            <View className='flex flex-col items-center'>
              <open-data className='icon' type="userAvatarUrl" />
              <open-data className='user_name' type="userNickName" />
              <View
                className='log_out_button'
                onClick={() => this.toggleDialog('LOG_OUT')}
                style={'color: '.concat(this.props.mode === 'SELLER' ?
                  'var(--gray-6);' : 'var(--gray-5);')}
              >退出登录</View>
            </View>
            :
            <Button
              className='icon login_button'
              onClick={() => this.toggleDialog('LOG_IN')}
            >
              <View>点击登录</View>
            </Button>
          }
        </View>
        {this.listItems.map(category =>
          <View className='user_category'>
            <AtList>
              {category.sub.map(item =>
                <AtListItem title={item.text} onClick={item.onClick} arrow={item.arrow} />
              )}
            </AtList>
          </View>
        )}

      </Layout>
    )
  }
}
UserPage.defaultProps = {
  mode: 'BUYER',//'BUYER','SELLER'
};
export default UserPage;
