import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtTextarea } from 'taro-ui'
import * as actions from '../../../public/redux/actions'

import LoginDialog from '../../components/dialogs/LoginDialog/LoginDialog'
import ActionButtons from '../../components/buttons/ActionButtons/ActionButtons'
import ActionDialog from '../../components/dialogs/ActionDialog/ActionDialog'
import './ExpressInfoContainer.scss'

import * as tool_functions from '../../utils/functions/tool_functions'

const db = wx.cloud.database();
const _ = db.command

/****
 * < ExpressInfoContainer
 * version={}
handleClickItem = {()=> { }}   //可选。点击其中一个item的操作
styleType={}//0:页面式，1: 缩略式
/>
 */

const ExpressInfoContainer = (props) => {
  const dispatch = useDispatch();
  const userManager = useSelector(state => state.userManager);
  const initState = {
    recipientInfos: [],
    currentItem: {
      name: '',
      tel: '',
      address: '',
      des: '',
    },
    currentIndex: null,

    openedDialog: null,//'LOGIN','DELETE','INPUT','ACTION_BUTTON'
    ifOpenActionButtons: false,
  }
  const [state, setState] = useState(initState);


  useEffect(() => {
    doUpdate()
  }, [userManager])
  usePullDownRefresh(() => {
    // console.log('ui-4');
    doUpdate()
    Taro.stopPullDownRefresh()
  })
  const doUpdate = () => {
    dispatch(actions.toggleLoadingSpinner(true));
    if (!(userManager.unionid && userManager.unionid.length > 0)) {
      dispatch(actions.toggleLoadingSpinner(false));
      return
    }
    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'users',

        queryTerm: { unionid: userManager.unionid },

        operatedItem: '',//query term when use db.command
        queriedList: [],
      },
      success: (res) => {
        dispatch(actions.toggleLoadingSpinner(false));
        if (res && res.result && res.result.data && res.result.data.length > 0) {
          setState({
            ...state,
            recipientInfos: (res.result.data[0] && res.result.data[0].recipientInfos) ?
              res.result.data[0].recipientInfos : []
          });
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
    // db.collection('users').where({
    //   openid: userManager.unionid
    // }).get().then((r) => {
    //   setState({
    //     ...state,
    //     recipientInfos: (r.data[0] && r.data[0].recipientInfos) ? r.data[0].recipientInfos : []
    //   });
    // })
  }

  const toggleDialog = (openedDialog = null, i = null, e = null) => {
    e && e.stopPropagation();//点击action buttons时不算点击该item
    setState({
      ...state,
      openedDialog: openedDialog,
      currentItem: (i === null) ? initState.currentItem : state.recipientInfos[i],
      currentIndex: i,
    });
    // switch (way) {
    //   case 'INPUT':
    //     let updated = (i === null) ? state.currentItem : state.recipientInfos[i];
    //     setState({
    //       ...state,
    //       ifOpenInputDialog: (ifOpen === null) ? !state.ifOpenInputDialog : ifOpen,
    //       ifOpenActionButtons: false,
    //       currentItem: updated,
    //       currentIndex: i,
    //     });
    //     break;
    //   case 'DELETE':
    //     setState({
    //       ...state,
    //       ifOpenDeleteDialog: (ifOpen === null) ? !state.ifOpenDeleteDialog : ifOpen,
    //       ifOpenActionButtons: false,
    //       currentIndex: i,
    //     });
    //     break;
    //   case 'ACTION_BUTTONS':
    //     setState({
    //       ...state,
    //       ifOpenActionButtons: (ifOpen === null) ? !state.ifOpenActionButtons : ifOpen,
    //       currentIndex: i,
    //     });
    //     break;
    //   case '':
    //     break;
    //   default:
    //     break;
    // }
  }

  const handelChange = (way, v = null, i = null) => {
    switch (way) {
      case 'NAME':
        setState({
          ...state,
          currentItem: {
            ...state.currentItem,
            name: v,
          }
        });
        break;
      case 'TEL':
        setState({
          ...state,
          currentItem: {
            ...state.currentItem,
            tel: v,
          }
        });
        break;
      case 'ADDRESS':
        setState({
          ...state,
          currentItem: {
            ...state.currentItem,
            address: v,
          }
        });
        break;
      case 'DES':
        setState({
          ...state,
          currentItem: {
            ...state.currentItem,
            des: v,
          }
        });
        break;
      case '':
        break;
      default:
        break;
    }
  }
  const handleCancel = () => {
    setState({
      ...state,
      currentItem: initState.currentItem,
      currentIndex: initState.currentIndex,

      openedDialog: null,
    });
  }
  const handleSubmit = (way) => {
    let updated = state.recipientInfos;
    switch (way) {
      case 'CHANGE_ITEM':
        (state.currentIndex === null) ?
          updated.push(state.currentItem) :
          updated.splice(state.currentIndex, 1, state.currentItem);
        props.handleClickItem && (props.handleClickItem(state.currentItem));//把新增or刚修改的设为被选中的
        break;
      case 'DELETE':
        updated.splice(state.currentIndex, 1);
        break;
      default:
        break;
    }

    wx.cloud.callFunction({
      name: 'update_data',
      data: {
        collection: 'users',
        queryTerm: { unionid: userManager.unionid },
        updateData: { recipientInfos: updated }
      },
      success: (res) => {
        if (res && res.result && res.result.data) {
        }
      },
      fail: () => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        console.error
      }
    });
    // db.collection('users').where({
    //   openid: userManager.unionid
    // }).update({
    //   data: {
    //     recipientInfos: updated
    //   }
    // }).then((res) => { })
    //   .catch((err) => { });

    setState({
      ...state,
      recipientInfos: updated,
      currentItem: initState.currentItem,
      currentIndex: null,
      openedDialog: null,
    });
  }

  const handleClickItem = (it) => {
    if (compareObj(it, props.choosenItem)) {
      props.handleClickItem && props.handleClickItem(null)//点同一项时取消选择
    } else {
      props.handleClickItem && props.handleClickItem(it)
    }
  }

  let deleteDialog = (
    <ActionDialog
      type={1}
      isOpened={state.openedDialog === 'DELETE'}
      onClose={() => toggleDialog()}
      onCancel={() => handleCancel()}
      onSubmit={() => handleSubmit('DELETE')}
      cancelText='取消'
      confirmText='确认'
      textCenter={true}
    >确定删除？</ActionDialog>
  );

  let newItemDialog = (
    <ActionDialog
      type={0}
      closeOnClickOverlay={false}
      isOpened={state.openedDialog === 'INPUT'}
      onClose={() => handleCancel()}
      onCancel={() => handleCancel()}
      onSubmit={() => handleSubmit('CHANGE_ITEM')}
      title='添加收货地址'
    // checkedItems={[  // *problem  太深层时checkrequire会显示不出来
    //   {
    //     check: state.currentItem.name.length > 0,
    //     toastText: '请填写收货人姓名'
    //   },
    //   {
    //     check: state.currentItem.tel.length > 0,
    //     toastText: '请填写联系电话'
    //   },
    //   {
    //     check: state.currentItem.address.length > 0,
    //     toastText: '请填写收货地址'
    //   },
    // ]}
    >
      <scroll-view
        className=''
        scroll-y={true}
      >
        <AtInput
          name='pickUpWay_name'
          title='收货人姓名'
          cursor={state.currentItem.name && state.currentItem.name.length}
          value={state.currentItem.name}
          onChange={(v) => handelChange('NAME', v)}
        >
        </AtInput>
        <AtInput
          name='pickUpWay_tel'
          title='联系电话'
          cursor={state.currentItem.tel && state.currentItem.tel.length}
          value={state.currentItem.tel}
          onChange={(v) => handelChange('TEL', v)}
        >
        </AtInput>
        {/* <AtInput
          name='pickUpWay_address'
          title='地址'
          cursor={state.currentItem.address && state.currentItem.address.length}
          value={state.currentItem.address}
          onChange={(v) => handelChange('ADDRESS', v)}
        >
        </AtInput> */}
        <View className='wrap'>
          <View className='' style='margin:16rpx 0 8rpx 0;'>地址</View>
          <AtTextarea
            name='pickUpWay_address'
            height={200}
            maxLength={300}
            placeholder=''
            cursor={state.currentItem.address && state.currentItem.address.length}
            value={state.currentItem.address}
            onChange={(v) => handelChange('ADDRESS', v)}
          />
        </View>
        {/* <View className='wrap'>
          <View className='' style='margin:10rpx;'>备注:</View>
          <AtTextarea
            name='pickUpWay_des'
            height={200}
            maxLength={300}
            placeholder='放在门口'
            cursor={state.currentItem.des && state.currentItem.des.length}
            value={state.currentItem.des}
            onChange={(v) => handelChange('DES', v)}
          />
        </View> */}
        <AtInput
          name='pickUpWay_des'
          title='备注'
          placeholder='放在门口'
          cursor={state.currentItem.des && state.currentItem.des.length}
          value={state.currentItem.des}
          onChange={(v) => handelChange('DES', v)}
        >
        </AtInput>

      </scroll-view>
    </ActionDialog>
  )
  let doLoginDialog =
    <LoginDialog
      words='请先登录'
      version={props.version}
      isOpened={state.openedDialog === 'LOGIN'}
      onClose={() => handleCancel()}
      onCancel={() => handleCancel()}
      onSubmit={() => handleCancel()}
    />

  const compareObj = (obj_1, obj_2) => {
    console.log('obj_1, obj_2', obj_1, obj_2);
    return (
      ((!obj_1.name) || (obj_1.name && obj_2 && (obj_1.name === obj_2.name))) &&
      ((!obj_1.tel) || (obj_1.tel && obj_2 && (obj_1.tel === obj_2.tel))) &&
      ((!obj_1.address) || (obj_1.address && obj_2 && (obj_1.address === obj_2.address))) &&
      ((!obj_1.des) || (obj_1.des && obj_2 && (obj_1.des === obj_2.des)))
    )
  }
  return (
    <View className={'express_info_container '.concat(
      props.styleType === 0 ? 'express_info_container_style_0' : 'express_info_container_style_1')}>
      {deleteDialog}
      {newItemDialog}
      {doLoginDialog}
      <View className='add_new_button'>
        <View
          className='at-icon at-icon-add-circle'
          onClick={(userManager.unionid && userManager.unionid.length > 0) ?
            () => toggleDialog('INPUT') : () => toggleDialog('LOGIN')}
        >
          <View className='word'>添加新地址</View>
        </View>
      </View>
      {props.styleType === 1 &&
        <View style='margin:10rpx 0;'>我的邮寄地址：</View>
      }
      {/* <View className='express_list'> */}
      {(state.recipientInfos && state.recipientInfos.length > 0) ?
        state.recipientInfos.map((it, i) => {
          return (
            <View
              className={'express_item '.concat(compareObj(it, props.choosenItem) ?
                'choosen' : '')}
            // onLongPress={(e) => toggleDialog('INPUT', i, e)}
            >
              <ActionButtons
                type={2}
                position={'LEFT'}
                actionButtonList={
                  [
                    {
                      word: '修改',
                      onClick: (e) => toggleDialog('INPUT', i, e),
                    },
                    {
                      word: '删除',
                      onClick: (e) => toggleDialog('DELETE', i, e),
                    }
                  ]
                }
              />
              <View
                className='content'
                onClick={() => handleClickItem(it)}
              >
                <View className='wrap flex a_item'>
                  <View className='flex name'>收货人名字</View>
                  <View
                    className='flex flex-1  value replicable_item'
                    onLongPress={() => {
                      it.name && it.name.length > 0 &&
                        tool_functions.text_functions.copyText(it.name)
                    }}
                  >{it.name}</View>
                </View>
                <View className='line_horizontal' />
                <View className='wrap flex a_item'>
                  <View className='flex name'>联系方式</View>
                  <View
                    className='flex flex-1  value replicable_item'
                    onLongPress={() => {
                      it.tel && it.tel.length > 0 &&
                        tool_functions.text_functions.copyText(it.tel)
                    }}
                  >{it.tel}</View>
                </View>
                <View className='line_horizontal' />
                <View className='wrap flex a_item'>
                  <View className='flex name'>收货地址</View>
                  <View
                    className='flex flex-1  value replicable_item'
                    onLongPress={() => {
                      it.address && it.address.length > 0 &&
                        tool_functions.text_functions.copyText(it.address)
                    }}
                  >{it.address}</View>
                </View>
                <View className='line_horizontal' />
                <View className='wrap flex a_item'>
                  <View
                    className='flex name replicable_item'
                    onLongPress={() => {
                      it.des && it.des.length > 0 &&
                        tool_functions.text_functions.copyText(it.des)
                    }}
                  >备注</View>
                  {
                    it.des.length > 0 ?
                      <View className='flex flex-1  value'>{it.des}</View> :
                      <View className='flex flex-1 value empty_value'>无</View>
                  }
                </View>
              </View>
            </View>

          )
        }) :
        <View className='empty_word'>暂无保存的邮寄信息</View>
      }
    </View>
    // </View>
  )
}
ExpressInfoContainer.defaultProps = {
  styleType: 0,
};

export default ExpressInfoContainer;