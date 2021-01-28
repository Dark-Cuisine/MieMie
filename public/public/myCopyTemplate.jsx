import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtCard } from "taro-ui"

import './XXX.scss'

class XXX extends Component {
  state = {
    productList: []
  }

  onPullDownRefresh() {
    Taro.stopPullDownRefresh()
  }

  render() {

    return (
      <View >
        XXX
      </View>
    )
  }
}

export default XXX;
