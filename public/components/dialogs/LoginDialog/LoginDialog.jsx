import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtModal, AtToast } from "taro-ui"
import { connect } from 'react-redux'
import * as actions from "../../../redux/actions";

const WXBizDataCrypt = require('../../../utils/WXBizDataCrypt.js');
const db = wx.cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

import './LoginDialog.scss'

@connect(
  ({ userManager }) => ({
    userManager
  }),
  (dispatch) => ({
    setUser(openid, unionid) {
      dispatch(actions.setUser(openid, unionid))
    },
    toggleLoadingSpinner(ifOpen) {
      dispatch(actions.toggleLoadingSpinner(ifOpen))
    },
  }),
)

/****
 * <LoginDialog
 * version='SELLER'//'BUYER','SELLER'
 */
class LoginDialog extends Component {

  state = {
  }

  doLogin = (user) => {
    let that = this;
    this.props.toggleLoadingSpinner(true);

    that.props.onClose()
    console.log('doLogin', user);

    wx.getUserInfo({
      success: function (res) {
        console.log('getUserInfo--', res);

        !that.props.version && console.log('you forget to se version');
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

            wx.cloud.callFunction({
              name: 'get_user_info',
              data: {
                encryptedData: encryptedData,
                iv: iv,

                js_code: res.code,
                grant_type: 'authorization_code',

              },
              success: function (res) {
                console.log('get_user_info-res', res);
                let data = res.result
                console.log('解密数据: ', data)
                let nickName = (data && data.nickName) ? data.nickName : null;
                console.log('nickName', nickName);
                let unionid = (data && data.unionId) ? data.unionId : null;
                console.log('unionid', unionid);
                let openid = (data && data.openId) ? data.openId : null;
                console.log('openid', openid);

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
                    if (!(result_2 && result_2.data && result_2.data.length > 0)) {//第一次登陆,则在数据库添加该user
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
                            markedOrders: {
                              markA: [],
                              markB: [],
                              markC: [],
                            }
                          }
                        },
                        success: (response) => {
                          console.log("添加user成功", response);
                          that.props.setUser(openid, unionid);
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
                    that.props.setUser(openid, unionid);
                    that.props.toggleLoadingSpinner(false);
                    that.props.onClose();
                  },
                  fail: () => {
                    console.error
                    wx.showToast({
                      title: '登录失败，请再试一次',
                      icon: 'none'
                    })
                    that.props.toggleLoadingSpinner(false);
                    that.props.onClose();
                  }
                });
              },
              fail: () => {
                console.error
                wx.showToast({
                  title: '登录失败，请再试一次',
                  icon: 'none'
                })
                that.props.toggleLoadingSpinner(false);
                that.props.onClose();
              }

            });
          }
        })
      }
    })

  }



  render() {
    return (
      <View className=''>

        <AtModal
          className='login_dialog'
          isOpened={this.props.isOpened}
          onClose={this.props.onClose}
        >
          <View className='word flex justify-center'>
            {this.props.words ? this.props.words : '确定登录？'}
          </View>
          <View className='flex'>
            <Button
              className='button button_left'
              onClick={() => this.props.onCancel()}
            >取消</Button>
            <Button
              className='button button_right'
              openType='getUserInfo'
              onGetUserInfo={(e) => this.doLogin(e)}
            >登录</Button>
          </View>
        </AtModal>
      </View>
    )
  }
}

export default LoginDialog;
