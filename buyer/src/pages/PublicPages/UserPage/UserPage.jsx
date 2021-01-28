import React, { Component } from 'react'
import Taro, { useRouter, usePullDownRefresh, render } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import { connect } from 'react-redux'
import { AtModal } from 'taro-ui'

import Layout from '../../../../../public/components/Layout/Layout'
import UserPageC from '../../../../../public/pages/PublicPages/UserPage/UserPage'

import './UserPage.scss'


class UserPage extends Component {
  onPullDownRefresh() {
    console.log('onPullDownRefresh--userpage-1');
    Taro.stopPullDownRefresh()
  }

  render() {
    return (
      <UserPageC
        mode='BUYER'
        version={'BUYER'}
      />
    )
  }
}

export default UserPage;
