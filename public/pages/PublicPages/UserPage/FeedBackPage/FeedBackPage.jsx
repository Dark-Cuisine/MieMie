import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
import { AtInput, AtTextarea, AtModal } from 'taro-ui'

import Layout from '../../../../components/Layout/Layout'
import sendMailPNG from '../../../../resource/illustration/sendMail.jpg'
import suggestPNG from '../../../../resource/illustration/suggestion.jpg'
import bugPNG from '../../../../resource/illustration/bug.jpg'

import './FeedBackPage.scss'

const FeedBackPage = (props) => {
  const initState = {
    message: '',
    contactMethod: '',

    ifDialogOpen: false,
    isSended: false,
    tab: 'SUGGESTION'//'SUGGESTION','BUG'
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

  const handleConfirm = () => {
    sendMail();
    initAllState();
    setState({
      ...state,
      isSended: true,
      ifDialogOpen: false
    });
  }

  const initAllState = () => {
    setState({
      ...initState,
    });
  }

  const toggleDialog = () => {
    setState({
      ...state,
      ifDialogOpen: !state.ifDialogOpen
    });
  }

  return (
    <View>
      <Layout
        version={props.version}
        navBarKind={2}
        lateralBarKind={0}
        navBarTitle={'反馈'}
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
            <View className='TabButton'>
              <Button
                className={state.tab == 'SUGGESTION' ? 'TabButton_1' : 'TabButton_2'}
                onClick={() => { setState({ ...state, tab: 'SUGGESTION' }) }}
              >建议</Button>
              <Button
                className={state.tab == 'BUG' ? 'TabButton_1' : 'TabButton_2'}
                onClick={() => { setState({ ...state, tab: 'BUG' }) }}
              >BUG</Button>
            </View>
            {state.tab == 'SUGGESTION' ?
              <View className='Prefix'>我有一个华丽的建议：</View> :
              <View className=''>
                <View className='Prefix'>我抓到了一个Bug：</View>
                <View className='' style={'font-size: 35rpx;color: var(--gray-3);'}>
                  (如有可能，请提供一下出现Bug的手机型号)
                  </View>
                </View>
              
            } 
            <AtTextarea
              className='feed_back_input'
              value={state.message}
              onChange={(v) => handleChangeInput('MESSAGE', v)}
              maxLength={20000}
              height={500}
              count={false}
            />
            <View className=''>
              联系方式：(发送反馈均为匿名, 如果你希望得到联系, 请留下你的联系方式)
                        </View>
            <AtInput
              name='feed_back_input_contact_method'
              placeholder='微信号或者邮箱'
              cursor={state.contactMethod&&state.contactMethod.length}
              value={state.contactMethod}
              onChange={(v) => handleChangeInput('CONTACT_METHOD', v)}
            />

            <Image
              className='SendMailImg'
              src={sendMailPNG}
              onClick={() => toggleDialog()}
            />
            <View
              className=''
              style='color:var(--gray-2)'
            >
              咩咩开发者在开发过程中遇到了很多问题，如果有熟悉小程序开发而且愿意提供一点技术支持的小伙伴，
              请务必和我联系！
              </View>
          </View>
        }



        <AtModal
          isOpened={state.ifDialogOpen}
          cancelText='取消'
          confirmText='确认'
          content='确定提交？'
          //onClose={ this.handleClose }
          onCancel={() => toggleDialog()}
          onConfirm={() => handleConfirm()}
        />
      </Layout>
    </View >
  )
}

export default FeedBackPage;