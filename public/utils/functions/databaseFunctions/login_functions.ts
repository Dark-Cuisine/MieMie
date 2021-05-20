import dayjs from 'dayjs'
import * as actions from '../../../redux/actions'

import * as product_functions from './product_functions'
import * as solitaire_functions from './solitaire_functions'
import * as msg_functions from './msg_functions'
import * as order_functions from './order_functions'
import * as shop_functions from './shop_functions'


//*unfinished
//*problem 不知怎么在这里用dispatch actions.
export const doLogin = async (unionid) => {
  actions.toggleLoadingSpinner(true)
  try {
    let r_1 = await wx.getUserProfile({ desc: '登录小程序' })
    console.log('w-getUserProfile--', r_1);
    let encryptedData = r_1.encryptedData;
    let iv = r_1.iv;
    if (iv == undefined) { //if用户拒绝授权
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      })
      return
    }

    // try {//*注: wx.login()不支持Promise风格调用
    wx.login({    //调用登录接口，获取 code
      success: async function (res) {
        let r_3 = await wx.cloud.callFunction({
          name: 'get_user_info',
          data: {
            encryptedData: encryptedData,
            iv: iv,

            js_code: res.code,
            grant_type: 'authorization_code',

          },
        })
        console.log('w-rrrrr3', r_3);
        let data = r_3.result.data
        let wxContext = r_3.result.wxContext
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
            // that.props.onSubmit && that.props.onSubmit();
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
                  actions.setUser(unionid, openid);
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
            console.log('w-ww');
            actions.setUser(unionid, openid)
            // actions.toggleLoadingSpinner(false)
          },
          fail: () => {
            console.error
            wx.showToast({
              title: '登录失败，请再试一次',
              icon: 'none'
            })
            // actions.toggleLoadingSpinner(false)
          }
        });
      }

    });
    //   }
    // })
    // } catch (err) {
    //   console.log('c-err', err);
      // dispatch(actions.toggleLoadingSpinner(false));
    //   return err;
    // }
    //   }
    // })
  } catch (err) {
    console.log('c-err', err);
    // actions.toggleLoadingSpinner(false)
    return err;
  }

}


export const updateUserInfo = (unionid) => {
}
