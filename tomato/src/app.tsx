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

    tomatoTypes: [
      {
        id: 'tomato001', index: '0', color: 'red', name: '红番茄',
        workTime: Number(2700), restTime: Number(900),
        icon_fileId: 'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/images/tomatos/red.png',
        iconUrl: '',
        animationImgUrls: {
          work: [],
          trans: [],
          rest: [],
        },
      },//红番茄，45min-15min
      {
        id: 'tomato002', index: '1', color: 'yellow', name: '黄番茄',
        workTime: Number(2700), restTime: Number(900),
        icon_fileId: 'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/images/tomatos/yellow.png',
        iconUrl: '',
        animationImgUrls: {
          work: [],
          trans: [],
          rest: [],
        },
      },//黄番茄，45min-15min
      {
        id: 'tomato003', index: '2', color: 'blue', name: '蓝番茄',
        workTime: Number(1500), restTime: Number(300),
        icon_fileId: 'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/images/tomatos/blue.png',
        iconUrl: '',
        animationImgUrls: {
          work: [],
          trans: [],
          rest: [],
        },
      },//蓝番茄，25min-5min
      {
        id: 'tomato004', index: '3', color: 'white', name: '白番茄',
        workTime: Number(1500), restTime: Number(300),
        icon_fileId: 'cloud://miemie-buyer-7gemmgzh05a6c577.6d69-miemie-buyer-7gemmgzh05a6c577-1304799026/resources/images/tomatos/white.png',
        iconUrl: '',
        animationImgUrls: {
          work: [],
          trans: [],
          rest: [],
        },
      },//白番茄，25min-5min
    ],

    macro: {//宏
      ANI_WORK_LENGTH: 11,//动图的张数
      ANI_TRANS_LENGTH: 7,
      ANI_REST_LENGTH: 3,
      A_TOTAL_LENGTH: 21.//一个颜色的番茄里的动图总数
    }
  }
  componentDidMount() { }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
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
