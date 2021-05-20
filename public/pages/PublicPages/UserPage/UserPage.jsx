import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import { connect } from 'react-redux'
import { AtModal } from 'taro-ui'
import * as actions from '../../../redux/actions';

import Dialog from '../../../components/dialogs/Dialog/Dialog'
import ActionDialog from '../../../components/dialogs/ActionDialog/ActionDialog'
import Layout from '../../../components/Layout/Layout'
import LoginDialog from '../../../components/dialogs/LoginDialog/LoginDialog'
import classification from '../../../public/classification'


import './UserPage.scss'




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
    setUser(unionid, openid) {
      dispatch(actions.setUser(unionid, openid))
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

  listItems = this.props.version === 'TOMATO' ?
    [{
      name: '分类2',
      sub: [
        {
          text: '反馈',
          arrow: 'right',
          onClick: () => this.changePage(3)
        },
        {
          text: '关于'.concat(this.props.version === 'SOLITAIRE' ? '咩咩接龙' :
            (this.props.version === 'TOMATO' ? '咩咩番茄' : '咩咩摆摊')),
          arrow: '',
          onClick: () => this.toggleDialog('ABOUT_APP')
        },
      ]
    }] :
    [
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
        sub: this.props.version === 'SOLITAIRE' ? [
          {
            text: '反馈',
            arrow: 'right',
            onClick: () => this.changePage(3)
          },
          {
            text: '关于'.concat(this.props.version === 'SOLITAIRE' ? '咩咩接龙' :
              (this.props.version === 'TOMATO' ? '咩咩番茄' : '咩咩摆摊')),
            arrow: '',
            onClick: () => this.toggleDialog('ABOUT_APP')
          },
        ] :
          [
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
              text: '关于'.concat(this.props.version === 'SOLITAIRE' ? '咩咩接龙' :
                (this.props.version === 'TOMATO' ? '咩咩番茄' : '咩咩摆摊')),
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
      key: 'openid',
      data: null
    });
    wx.setStorage({
      key: 'unionid',
      data: null
    });
    this.toggleDialog()
    this.props.setUser('', '');
  }

  toggleUserGuide = () => {
    let app = getApp()
    if (!(app.$app.globalData.classifications)) { return }

    let tabBarList_buyer = app.$app.globalData.classifications.tabBar.tabBarList_buyer;
    let tabBarList_seller = app.$app.globalData.classifications.tabBar.tabBarList_seller;

    this.props.userGuideNextStep(1, this.props.mode === 'BUYER' ?
      tabBarList_buyer[3] : tabBarList_seller[3]
    )
  }

  render() {
    console.log('this.props.version', this.props.version);
    let aboutDialog = (
      <Dialog
        isOpened={this.state.openedDialog === 'ABOUT_APP'}
        onClose={() => this.toggleDialog()}
        title='关于此小程序'
      >
        <View className=''>
          {}
        </View>
        {this.props.version === 'SOLITAIRE' ?
          '    咩咩接龙是全日本东京武藏野市最可爱的接龙小程序，能用来创建商品接龙、活动接龙。\n    小程序可在任何地方使用（送货车站列表现在只能选择日本东京都地区）。' :
          (this.props.version === 'TOMATO' ?
            '    咩咩番茄是我们全村最可爱的番茄钟，能用来监督社畜们不要沉迷工作忘了休息，也能帮助人们专注于某件事情。' :
            '    咩咩摆摊致力于打造一个面向在日华人的社区团购平台， 给在日本生活的华人和商家们提供交易、 推广等服务。')}
        {this.props.version === 'SOLITAIRE' &&
          <View className='' style='color:var(--gray-3); font-size:30rpx;'>
            {'\n\n    以后会慢慢扩大范围和添加新的功能，敬请期待。'}
          </View>
        }
        {!this.props.version === 'SOLITAIRE' &&
          <View className='' style='color:var(--red-2); font-size:30rpx;'>
            {'\n\n    小程序暂未开通线上付款功能， 订单支付需要根据商家提供的账户自己去转账, 请买卖家双方注意交易安全。'}
          </View>
        }
      </Dialog>
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
        textCenter={true}
      >确定退出登录？</ActionDialog>
    )

    return (
      <Layout
        version={this.props.version}
        className='user_page'
        mode={this.props.mode}
        navBarKind={2}
        ifShowTabBar={false}
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
