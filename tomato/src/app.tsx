import React, { Component } from 'react'
import { Provider } from 'react-redux'

import configStore from '../../public/redux/store'
import 'taro-ui/dist/style/index.scss'

import './app.scss'

const store = configStore()

class App extends Component {
  globalData = {
    classifications: null, //各种默认分类（存在数据库里）
    layoutData: {}, //{NAV_BAR_HEIGHT:'',}  
  }
  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    wx.cloud.init({
      env: 'cloud1-8g706p56add0881f',
      traceUser: true,
    });

    // wx.loadFontFace({
    //   family: 'Long Cang',
    //   source: 'url("https://fonts.googleapis.com/css2?family=Long+Cang&family=ZCOOL+KuaiLe&display=swap")',
    //   success: console.log
    // })
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
