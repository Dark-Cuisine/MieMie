import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
import { AtInput, AtTextarea, AtModal } from 'taro-ui'

import Dialog from '../../../../components/dialogs/Dialog/Dialog'
import ActionDialog from '../../../../components/dialogs/ActionDialog/ActionDialog'
import ActionButtons from '../../../../components/buttons/ActionButtons/ActionButtons'
import TabPage from '../../../../components/formats/TabPage/TabPage'
import Layout from '../../../../components/Layout/Layout'
import sendMailPNG from '../../../../resource/illustration/sendMail.jpg'
import suggestPNG from '../../../../resource/illustration/suggestion.jpg'
import bugPNG from '../../../../resource/illustration/bug.jpg'

import './FeedBackPage.scss'

const FeedBackPage = (props) => {
  const router = useRouter();
  const initState = {
    message: '',
    contactMethod: '',

    openedDialog: null,//'SEND'
    isSended: false,
    currentTab: 0  //0:'SUGGESTION',1:'BUG'
  }
  const [state, setState] = useState(initState);

  const sendMail = () => {
    let subject = (state.tab == 'SUGGESTION') ? '意見--咩咩摆摊feedback' : 'Bug--咩咩摆摊feedback';

    wx.cloud.callFunction({
      name: "sendmail",
      data: {
        message: state.message.concat('联系方式：', state.contactMethod),
        subject: subject
      },
      success: (res) => {
        wx.showToast({
          title: '发送成功',
          icon: 'none'
        })
        console.log("邮件发送成功", res)
      },
      fail: (err) => {
        setLoadingWord(null)
        wx.showToast({
          title: '发送失败',
          icon: 'none'
        })
        console.log("邮件发送失败", err)
      }
    });
  }

  const handleChangeInput = (way, v) => {
    switch (way) {
      case 'MESSAGE':
        setState({
          ...state,
          message: v
        });
        break;
      case 'CONTACT_METHOD':
        setState({
          ...state,
          contactMethod: v
        });
        break;
      default:
        break;
    }

  }

  const handleClickTab = (i) => {
    setState({
      ...state,
      currentTab: i
    });
  }

  const handleConfirm = () => {
    sendMail();
     setState({
      ...initState,
      isSended: true,
      SEND: null
    });
  }

  const initAllState = () => {
    setState({
      ...initState,
    });
  }

  const toggleDialog = (dialog) => {
    setState({
      ...state,
      openedDialog: dialog
    });
  }



  return (
    <Layout
      version={props.version}
      className='feed_back_page'
      navBarKind={2}
      lateralBarKind={0}
      navBarTitle={'反馈'}
      ifShowTabBar={false}

      ifShowShareMenu={true}
      initUrl={router.path}
    >
      {state.isSended ?
        <View>
          <View
            className='SentSusccessfully'
          >已成功发送</View>
          {state.tab == 'SUGGESTION' ?//* problem：how换行
            (
              <View>
                <View className='ThanksMsg'>顾客的建议就是上帝的声音,</View>
                <View className='ThanksMsg'>每一句都要好好聆听</View>
              </View>
            )
            :
            (
              <View>
                <View className='ThanksMsg'> 谢谢你幫忙抓到了這隻Bug,</View>
                <View className='ThanksMsg'> 我这就跟它干架去！</View>
              </View>
            )

          }
          <Image
            className='SendedImg'
            src={state.tab == 'SUGGESTION' ? suggestPNG : bugPNG}
          />
        </View> :
        <View className='wrap'>
          <TabPage
            tabList={[{ title: '建议' }, { title: 'BUG' }]}
            currentTab={state.currentTab}
            onClick={i => handleClickTab(i)}
          >
            {state.currentTab === 0 &&
              <View className='prefix'>我有一个华丽的建议：</View>
            }
            {state.currentTab === 1 &&
              <View className='prefix'>
                我抓到了一个Bug：
              </View>
            }
          </TabPage>
          <AtTextarea
            className='feed_back_input'
            value={state.message}
            placeholder={'如有可能，请提供一下出现Bug的手机型号'}
            onChange={(v) => handleChangeInput('MESSAGE', v)}
            maxLength={20000}
            height={500}
            count={false}
          />
          <AtInput
            name='feed_back_input_contact_method'
            placeholder='微信号或者邮箱'
            title='联系方式'
            cursor={state.contactMethod && state.contactMethod.length}
            value={state.contactMethod}
            onChange={(v) => handleChangeInput('CONTACT_METHOD', v)}
          />
          <View className='' style='color:var(--gray-3);'>
            ( 发送反馈均为匿名, 如果你希望得到联系, 请留下联系方式 ）
          </View>

          <Image
            className='send_mail_img'
            src={sendMailPNG}
            onClick={() => toggleDialog('SEND')}
          />
          <View
            className=''
            style='text-align: center; font-size: 30rpx; margin-top: 30rpx;'
          >
            商务合作or交流也可以在这里联系我！
          </View>
        </View>
      }



      {/* <ActionDialog  //*problem 太深层显示不出来
        isOpened={state.openedDialog === 'SEND'}
        cancelText='取消'
        confirmText='确认'
        content=''
        //onClose={ this.handleClose }
        onClose={() => toggleDialog()}
        onCancel={() => toggleDialog()}
        onSubmit={() => handleConfirm()}
        textCenter={true}
      >
        确定提交？
      </ActionDialog> */}
      <Dialog
        isOpened={state.openedDialog === 'SEND'}
        cancelText='取消'
        confirmText='确认'
        content=''
        //onClose={ this.handleClose }
        onClose={() => toggleDialog()}
        onCancel={() => toggleDialog()}
        onSubmit={() => handleConfirm()}
        textCenter={true}>
        确定提交？
        <View
          className='flex items-center'
          style='justify-content: space-around;position: relative;top: 30rpx;'
        >
          <View
            className=''
            onClick={() => toggleDialog()}
          >取消</View>
          <View
            className=''
            onClick={() => handleConfirm()}
          >提交</View>
        </View>
      </Dialog>
    </Layout>
  )
}

export default FeedBackPage;