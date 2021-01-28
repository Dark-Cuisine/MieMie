import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'
import { redirectTo } from '@tarojs/taro';

/**
 * 废弃
 */
export default class Index extends Component {

  componentWillMount () { 
    redirectTo({
      url:'pages/BuyerPages/ShoppingPage/ShoppingPage'
    });
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <View>Hello world!</View>
      </View>
    )
  }
}
