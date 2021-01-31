import React, { Component } from 'react'
import { Provider } from 'react-redux'

import configStore from '../../public/redux/store'
import 'taro-ui/dist/style/index.scss'

import './app.scss'

const store = configStore()

class App extends Component {
  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    wx.cloud.init({
      env: 'miemie-buyer-7gemmgzh05a6c577',
      traceUser: true,
    });
 
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
