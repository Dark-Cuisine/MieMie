import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtModal, AtToast } from "taro-ui"
import { connect } from 'react-redux'
import dayjs from 'dayjs'
import * as actions from "../../../redux/actions";

import * as databaseFunctions from '../../../utils/functions/databaseFunctions'

const WXBizDataCrypt = require('../../../utils/WXBizDataCrypt.js');
const db = wx.cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

import './LoginButton.scss'

@connect(
  ({ userManager }) => ({
    userManager
  }),
  (dispatch) => ({
    setUser(unionid, openid) {
      dispatch(actions.setUser(unionid, openid))
    },
    toggleLoadingSpinner(ifOpen) {
      dispatch(actions.toggleLoadingSpinner(ifOpen))
    },
  }),
)

/****  如果没登录则叫你登录的button
 * <LoginButton
doAction={}//如果登录了就做的动作
 */
class LoginButton extends Component {

  state = {
    tryTime: 0,//第一次登录失败则自动再登一次
  }

  doLogin = async () => {
    let that = this;
    this.props.toggleLoadingSpinner(true);


    wx.getUserProfile({
      desc: '登录小程序',
      success: function (res) {
        console.log('w-getUserProfile--', res);

        !that.props.version && console.log('you forget to set version');
        let encryptedData = res.encryptedData;
        let iv = res.iv;

        if (res.iv == undefined) { //if用户拒绝授权
          wx.showToast({
            title: '登录失败!',
            icon: 'none'
          })
          return
        }
        wx.login({    //调用登录接口，获取 code
          success: function (res) {
            console.log('w-1', res);
            wx.cloud.callFunction({
              name: 'get_user_info',
              data: {
                encryptedData: encryptedData,
                iv: iv,

                js_code: res.code,
                grant_type: 'authorization_code',

              },
              success: function (res) {
                console.log('w-get_user_info-res', res);
                let data = res.result.data
                let wxContext = res.result.wxContext
                console.log('w-解密数据: ', data)
                let nickName = (data && data.nickName) ? data.nickName : null;
                console.log('w-nickName', nickName);
                let unionid = (wxContext && wxContext.UNIONID) ? wxContext.UNIONID : null;
                console.log('w-UNIONID', unionid);
                let openid = (wxContext && wxContext.OPENID) ? wxContext.OPENID : null;
                console.log('w-OPENID', openid);

                wx.setStorage({
                  key: 'openid',
                  data: openid
                });
                wx.setStorage({
                  key: 'unionid',
                  data: unionid
                });


                wx.cloud.callFunction({
                  name: 'get_data',
                  data: {
                    collection: 'users',
                    queryTerm: {
                      unionid: unionid
                    }
                  },
                  success: (r) => {
                    let result_2 = r.result;
                    that.props.onSubmit && that.props.onSubmit();
                    if (!(result_2 && result_2.data && result_2.data.length > 0)) {//第一次登录,则在数据库添加该user
                      wx.cloud.callFunction({
                        name: 'add_data',
                        data: {
                          collection: 'users',
                          newItem: {
                            authId: unionid,
                            openid: openid,
                            // appid: result.appid,
                            unionid: unionid,
                            nickName: nickName,
                            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            markedOrders: {
                              markA: [],
                              markB: [],
                              markC: [],
                            },
                          }
                        },
                        success: (response) => {
                          console.log("添加user成功", response);
                          that.props.setUser(unionid, openid);
                        },
                        fail: () => {
                          wx.showToast({
                            title: '添加用户失败',
                            icon: 'none'
                          })
                          console.error
                        }
                      });
                    }
                    that.props.setUser(unionid, openid);
                    that.props.toggleLoadingSpinner(false);
                    that.props.doAction()
                  },
                  fail: () => {
                    console.error
                    wx.showToast({
                      title: '登录失败，请再试一次',
                      icon: 'none'
                    })
                    that.props.toggleLoadingSpinner(false);
                  }
                });
              },
              fail: () => {
                console.error
                // let newTryTime = (that.state.tryTime > 0) ? 0 : 1
                // that.setState({
                //   ...that.state,
                //   tryTime: (that.state.tryTime > 0) ? 0 : 1
                // });
                // if (newTryTime > 0) {
                //   console.log('w-第二次尝试登录');
                //   that.doLogin()//*problem no effect here
                // } else {
                wx.showToast({
                  title: '登录失败，请再试一次',
                  icon: 'none'
                })
                // }
                that.props.toggleLoadingSpinner(false);
              }
            });
          }
        })
      }
    })

  }



  render() {
    return (
      <View
        className=''
        onClick={(this.props.userManager.unionid &&
          this.props.userManager.unionid.length > 0) ?
          () => this.props.doAction() : () => this.doLogin()}
      >{this.props.children}</View>
    )
  }
}

export default LoginButton;