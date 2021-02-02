import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtModal } from 'taro-ui'

import Dialog from '../Dialog/Dialog'
import ActionButtons from '../../buttons/ActionButtons/ActionButtons'

import './ActionDialog.scss'


/***
 * <ActionDialog
  isOpened={}
  closeOnClickOverlay={false}
  type={}//0:--x √-- , 1: 'leftWord' 'rightWord' 
  title='xxx'

 cancelText='取消'
confirmText='确定发送'

  
  onClose={()=>xxx()}
  onCancel={()=>xxx()}
  onSubmit={()=>xxx()}
  
   checkedItems={[ //可选,onSubmit时检查的必选项
  {
      check: state.order.pickUpWay.way.length > 0,
      toastText: '请选择取货方式'
    },
  ]}
 */
const ActionDialog = (props) => {
  const initState = {
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])

  return (
    <Dialog
      className={'action_dialog '.concat(props.className)}
      isOpened={props.isOpened}
      closeOnClickOverlay={props.closeOnClickOverlay}
      onClose={props.onClose}
      title={props.title}
    >
      {props.children}
      <ActionButtons
        type={props.type}
        position={'MIDDLE'}
        onClickLeftButton={() => props.onCancel()}
        onClickRightButton={() => props.onSubmit()}
        leftWord={props.cancelText ?
          props.cancelText : ((props.type == 0) ? 'close' : '取消')}
        rightWord={props.confirmText ?
          props.confirmText : ((props.type == 0) ? 'check' : '确认')}

        checkedItems={props.checkedItems}
      />
    </Dialog>
  )
}

ActionDialog.defaultProps = {
  closeOnClickOverlay: true,

  type: 0,
};

export default ActionDialog;