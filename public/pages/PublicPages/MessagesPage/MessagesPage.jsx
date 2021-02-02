import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtSegmentedControl, AtModal } from 'taro-ui'
import * as actions from '../../../redux/actions'

import TabPage from '../../../components/formats/TabPage/TabPage'
import MsgCard from '../../../components/cards/MsgCard/MsgCard'
import Layout from '../../../components/Layout/Layout'

import './MessagesPage.scss'


const db = wx.cloud.database();
const _ = db.command


const MessagesPage = (props) => {
  const dispatch = useDispatch();
  const initState = {
    // sentMsgList: [],
    // receivedMsgList: [],
    sentMsgIdList: [],
    receivedMsgIdList: [],

    currentTab: 0,

    currentItem: null,
  }
  const [state, setState] = useState(initState);
  const [sentMsgList, setSentMsgList] = useState([]);
  const [receivedMsgList, setReceivedMsgList] = useState([]);
  const userManager = useSelector(state => state.userManager);

  useEffect(() => {
    doUpdate('ALL')
  }, [])
  useEffect(() => {
    doUpdate('MSG_SENT')
    doUpdate('MSG_RECEIVED')
  }, [state.sentMsgIdList, state.receivedMsgIdList])

  const handleSwitchTab = (v) => {
    setState({
      ...state,
      currentTab: v
    });
    switch (v) {
      case 0:
        doUpdate('MSG_RECEIVED')
        break;
      case 1:
        doUpdate('MSG_SENT')
        break;
      default:
        break;
    }
  }

  const doUpdate = async (way, v = null, i = null) => {
    let sentMsgIdList = state.sentMsgIdList;
    let receivedMsgIdList = state.receivedMsgIdList;
    let sentMsgList = [];
    let receivedMsgList = [];

    switch (way) {
      case 'ALL':
        dispatch(actions.toggleLoadingSpinner(true));
        wx.cloud.callFunction({
          name: 'get_data',
          data: {
            collection: 'users',

            queryTerm: { unionid: userManager.unionid },
            },
          success: (r) => {
            if (r && r.result && r.result.data && r.result.data.length > 0) {
              setState({
                ...state,
                sentMsgIdList: r.result.data[0].messages ?
                  r.result.data[0].messages.sent : [],
                receivedMsgIdList: r.result.data[0].messages ?
                  r.result.data[0].messages.received : []
              });
            }
          },
          fail: () => {
            dispatch(actions.toggleLoadingSpinner(false));
            wx.showToast({
              title: '获取数据失败',  
            })
          console.error
          }
        });
        break;
      case 'MSG_SENT':
        if (sentMsgIdList && sentMsgIdList.length > 0) {
          dispatch(actions.toggleLoadingSpinner(true));
          wx.cloud.callFunction({
            name: 'get_data',
            data: {
              collection: 'messages',
              operatedItem: '_ID',
              orderBy:'time',
              desc:'asc',
              queriedList: sentMsgIdList,
            },
            success: (res) => {
              dispatch(actions.toggleLoadingSpinner(false));
              if (res && res.result && res.result.data) {
                sentMsgList = res.result.data
              }
              setSentMsgList(sentMsgList)
            },
            fail: () => {
              dispatch(actions.toggleLoadingSpinner(false));
              wx.showToast({
                title: '获取数据失败',
                icon: 'none'
              })
            console.error
            }
          });
        }
        break;
      case 'MSG_RECEIVED':
        if (receivedMsgIdList && receivedMsgIdList.length > 0) {
          dispatch(actions.toggleLoadingSpinner(true));
          wx.cloud.callFunction({
            name: 'get_data',
            data: {
              collection: 'messages',
              operatedItem: '_ID',
              orderBy:'time',
              desc:'asc',
              queriedList: receivedMsgIdList,
            },
            success: (response) => {
              console.log('MSG_RECEIVED',response);
              dispatch(actions.toggleLoadingSpinner(false));
              if (response && response.result && response.result.data) {
                if (response.result.data.length > 0) {
                  (response.result.data.findIndex((it) => {
                    return (it.status == 'UNREAD')
                  }) > -1) ?
                    dispatch(actions.toggleMarkMsgButton(true)) :
                    dispatch(actions.toggleMarkMsgButton(false))
                }
                receivedMsgList = response.result.data
                setReceivedMsgList(receivedMsgList)
              }
            },
            fail: () => {
              dispatch(actions.toggleLoadingSpinner(false));
                 wx.showToast({
                  title: '获取数据失败',
                  icon: 'none'
                })
                console.error
            }
          });
        }
        break;
      case '':
        break;
      default:
        break;
    }
  }

  const handleDelete = (way, msgId) => {//delete msg  ///*unfinished要简化

    if (way === 'RECEIVE') {
      wx.cloud.callFunction({
        name: 'pull_data',
        data: {
          collection: 'users',
          queryTerm: { unionid: userManager.unionid },
          operatedItem: 'MSG_RECEIVED',
          updateData: msgId,
        },
        success: (res) => {
        },
              fail: () => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        console.error
      }
      });


      let receivedMsgList = receivedMsgList
      let index = receivedMsgList && receivedMsgList.length > 0 &&
        receivedMsgList.findIndex(msg => {
          return (msg._id == msgId)
        })
      index > -1 && receivedMsgList.splice(index, 1)
      setState({
        ...state,
        receivedMsgList: receivedMsgList,
      });
    } else {
      wx.cloud.callFunction({
        name: 'pull_data',
        data: {
          collection: 'users',
          queryTerm: { unionid: userManager.unionid },
          operatedItem: 'MSG_SENT',
          updateData: {}
        },
        success: (res) => {
        },
              fail: () => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        console.error
      }
      });

      let sentMsgList = sentMsgList
      let index = sentMsgList && sentMsgList.length > 0 &&
        sentMsgList.findIndex(msg => {
          return (msg._id == msgId)
        })
      index > -1 && sentMsgList.splice(index, 1)

      setState({
        ...state,
        sentMsgList: sentMsgList,
      });
    }
  }


  
  return (
    <Layout
      className='messages_page'
      version={props.version}
      navBarKind={4}
      lateralBarKind={0}
      navBarTitle='我的消息'
      ifShowTabBar={false}
    >
      <AtSegmentedControl
        values={['我收到的', '我发送的']}
        onClick={handleSwitchTab.bind(this)}
        current={state.currentTab}
      />
      {state.currentTab === 0 &&
        <View className='msg_list receive_list'>
          {receivedMsgList.map((it, i) => {
            return (
              <MsgCard
                key={i}
                msg={it}
                handleDelete={() => handleDelete('RECEIVE', it._id)}
              />
            )
          })}
        </View>
      }
      {state.currentTab === 1 &&
        <View className='msg_list sent_list'>
          {sentMsgList.map((it, i) => {
            return (
              <MsgCard
                key={i}
                msg={it}
                showStatus={false}
                handleDelete={() => handleDelete('SENT', it._id)}
              />
            )
          })}
        </View>
      }


    </Layout>
  )
}

export default MessagesPage;

