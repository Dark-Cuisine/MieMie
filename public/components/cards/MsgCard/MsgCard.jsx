import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtModal, AtTextarea } from 'taro-ui'
import * as actions from '../../../redux/actions'

import ActionDialog from '../../dialogs/ActionDialog/ActionDialog'
import ActionButtons from '../../buttons/ActionButtons/ActionButtons'

import './MsgCard.scss'

const db = wx.cloud.database();
const _ = db.command;

/*** 可展开-缩略的message卡
 * <MsgCard
    msg={it}
  showStatus={false} //是否显示'已读/未读'状态
 />
 */
const MsgCard = (props) => {
  const dispatch = useDispatch();
  const userManager = useSelector(state => state.userManager);
  const initState = {
    msg: props.msg,
    status: props.msg.status,//'READ','UNREAD'

    ifOpenDeleteDialog: false,

    mode: 'PREVIEW',//'PREVIEW','COMPLETE'
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    // console.log('msgcard', props.msg.status, state.status);
    setState({
      ...state,
      msg: initState.msg,
    });
  }, [props.msg])


  const toggleModeAndStatus = (mode = null, status = null, e = null) => {//toggle‘展开/缩略’，'已读/未读'
    e && e.stopPropagation();

    let updatedMode = (mode === null) ? state.mode : mode;
    let updatedStatus = (status === null) ? state.status : status;


    if (!(state.status == updatedStatus) && !(props.showStatus === false)) {
      wx.cloud.callFunction({
        name: 'update_data',
        data: {
          collection: 'messages',
          queryTerm: { _id: state.msg._id },
          updateData: { status: updatedStatus }
        },
        success: (res) => {
          console.log('status->', updatedStatus)
          dispatch(actions.judgeIfMarkMsgButton(userManager.unionid));
        },
        fail: () => {
          dispatch(actions.judgeIfMarkMsgButton(userManager.unionid));
          wx.showToast({
            title: '获取messages数据失败',
            icon: 'none'
          })
          console.error
        }
      })
    } else {
      dispatch(actions.judgeIfMarkMsgButton(userManager.unionid));
    }
    ;
    // db.collection('messages').where({
    //   _id: state.msg._id
    // }).update({
    //   data: {
    //     status: updatedStatus,
    //   }
    // })
    //   .then((res) => { console.log('status->', updatedStatus); })
    //   .catch((err) => { });

    props.toggleModeAndStatus(updatedStatus)
    setState({
      ...state,
      mode: updatedMode,
      status: updatedStatus,
    });
  }



  //delete dialog
  const toggleDeleteDialog = (ifOpen = null) => {//toggle
    setState({
      ...state,
      ifOpenDeleteDialog: (ifOpen === null) ? !state.ifOpenDeleteDialog : ifOpen,
    });
  }
  const handleSubmitDelete = () => {//确定删除
    // db.collection('messages').where({
    //   _id: state.msg._id
    // }).remove();

    props.handleDelete();
    setState({
      ...state,
      ifOpenDeleteDialog: false,
    });
  }
  const handleCancel = () => {//取消
    setState({
      ...state,
      ifOpenDeleteDialog: false,
    });
  }

  const handleCopy = (text) => {
    if (state.mode == 'PREVIEW') { return }
    console.log('copy', text);
    wx.setClipboardData({
      data: text,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }

  let deletaDialog = (
    <ActionDialog
      type={1}
      isOpened={state.ifOpenDeleteDialog}
      cancelText='取消'
      confirmText='删除'
      onClose={() => toggleDeleteDialog(false)}
      onCancel={() => handleCancel()}
      onSubmit={() => handleSubmitDelete()}
    >确定删除</ActionDialog>
  )

  let actionButtonList = [{
    word: '删除',
    onClick: () => toggleDeleteDialog(true),
  }].concat(!(props.showStatus === false) ? [
    {
      word: state.status === 'READ' ? '设为未读' : '设为已读',
      onClick: (e) => toggleModeAndStatus(null, state.status === 'READ' ? 'UNREAD' : 'READ', e),
    }
  ] : [])
  return (
    <View className={'msg_card'.concat(
      state.mode == 'PREVIEW' ? ' preview' : ' complete'
    )}
    >
      {deletaDialog}
      <View
        className={'card'.concat(
          state.mode == 'PREVIEW' ? ' preview' : ' complete'
        )}
      >
        <View className='header'>
          <View
            className={'title '}
          // style={(state.msg.type && state.msg.type === 'ORDER_REJECTED') ?
          //   'color:var(--red-1);' : ''}
          >
            {state.msg.title}
          </View>
          <View className='time'>{state.msg.time}</View>
          <ActionButtons
            type={2}
            position={'LEFT'}
            actionButtonList={actionButtonList}
          />
          <View className='line_horizontal' />
        </View>

        <View
          className=''
          onClick={() => toggleModeAndStatus(state.mode == 'PREVIEW' ? 'COMPLETE' : 'PREVIEW',
            state.mode == 'PREVIEW' ? 'READ' : state.status)}
        >
          <View className='addresser'>
            发件人：{state.msg.from.nickName}
          </View>
          {/* <AtTextarea
            value={state.msg.content}
            focus={false}
            disabled={true}
          /> */}
          <View
            onLongPress={() => handleCopy(state.msg.content)}
            className='content'>
            {state.msg.content}
          </View>
          {/* <text
            className='content'
            user-select='true'//*problem : user-select无效
          >
            {state.msg.content}
          </text> */}
          {!(props.showStatus === false) &&
            <View className={'status '.concat(state.status == 'READ' ? 'read' : 'unread')}>
              {state.status == 'READ' ? '已读' : '未读'}
            </View>
          }
          <View
            className={'at-icon at-icon-'.concat(state.mode == 'PREVIEW' ?
              'chevron-down' : 'chevron-up')}
          />
        </View>
      </View>



    </View>
  )
}

MsgCard.defaultProps = {
  showStatus: true,
};

export default MsgCard;