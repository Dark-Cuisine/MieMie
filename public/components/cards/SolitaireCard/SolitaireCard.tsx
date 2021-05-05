import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtSwipeAction } from 'taro-ui'
import * as actions from '../../../redux/actions'

import * as tool_functions from '../../../utils/functions/tool_functions'
import * as databaseFunctions from '../../../utils/functions/databaseFunctions'

import ActionDialog from '../../dialogs/ActionDialog/ActionDialog'

import './SolitaireCard.scss'

/****
 * 接龙card
 * <SolitaireCard
 * solitaire={}
 * solitaireOrder={state.solitaireOrder} //only for 'BUYER' mode
   mode='SELLER',//'SELLER','BUYER'
 />
 */
const SolitaireCard = (props) => {
  const dispatch = useDispatch();
  const userManager = useSelector(state => state.userManager);
  const initState = {
    solitaire: props.solitaire,
  }
  const [state, setState] = useState(initState);
  const [isOpened, setIsOpened] = useState(false);//是否打开了action button list
  const [openedDialog, setOpenedDialog] = useState(null);//'DELETE','COPY','CANCEL'

  useEffect(() => {
    setState({
      ...state,
      solitaire: initState.solitaire,
    });
  }, [props.solitaire])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const goToInsideSolitairePage = (mode, e = null) => {
    e && e.stopPropagation();
    setIsOpened(false);
    Taro.navigateTo({
      url: `/pages/SolitairePages/InsideSolitairePage/InsideSolitairePage?solitaireId=${state.solitaire._id}&solitaireOrderId=${props.solitaireOrderId}&mode=${mode}`
    });
  }

  const handleActionButton = (e) => {
     switch (e.id) {
      case 'edit':
        goToInsideSolitairePage(props.mode)
        break;
      case 'copy':
        //setOpenedDialog('COPY')
        handleSubmit('COPY')
        break;
      case 'cancel':
        setOpenedDialog('CANCEL')
        break;
      case 'delete':
        setOpenedDialog('DELETE')
        break;
      case '':
        break;
      default:
        break;
    }
  }

  const handleSubmit = async (way, v = null, i = null) => {
    setOpenedDialog(null)
    setIsOpened(false)
    switch (way) {
      case 'DELETE'://卖家删直接删数据库里的接龙，买家删只删自己那里的
        if (props.mode === 'SELLER') {
          await databaseFunctions.solitaire_functions.deleteSolitaire(
            state.solitaire._id, state.solitaire.solitaireShopId)
        } else {
          await databaseFunctions.solitaire_functions.deleteSolitaireIdFromUser(
            userManager.unionid, state.solitaire._id);
        }
        break;
      case 'COPY':
        // console.log('c-copy', state.solitaire);
        // let newCopy = {}
        // Object.assign(newCopy, state.solitaire)//*深拷贝，否则改newCopy时state.solitaire也会改变
        // delete newCopy._id
        // delete newCopy.createTime
        // delete newCopy.updateTime
        // console.log('c-copy-2', newCopy);
        // console.log('c-copy-3', state.solitaire);
        Taro.navigateTo({
          url: `/pages/SolitairePages/InsideSolitairePage/InsideSolitairePage?copySolitaireId=${state.solitaire._id}&mode=${'SELLER'}`
        });
        break;
      case 'CANCEL':
        break;
      default:
        break;
    }
    dispatch(actions.setUser(userManager.unionid, userManager.openid));//更新用户信息

  }


  let deleteDialog = (
    <ActionDialog
      type={1}
      isOpened={!(openedDialog === null)}
      onClose={() => { setOpenedDialog(null) }}
      onCancel={() => { setOpenedDialog(null) }}
      onSubmit={() => handleSubmit(openedDialog)}
      cancelText='取消'
      confirmText='确认'
    >
      <View className=''>
        确定{openedDialog === 'DELETE' ? '删除' :
          (openedDialog === 'COPY' ? '复制接龙' : '取消接龙')}?
      </View>
      {openedDialog === 'DELETE' && props.mode === 'BUYER' &&
        <View className=''>(删除仅为自己可见。如要取消接龙，请点击'取消接龙')</View>
      }
    </ActionDialog>
  );

  let className = (state.solitaire.info.endTime.date &&
    state.solitaire.info.endTime.date.length > 0 &&
    !tool_functions.date_functions.compareDateAndTimeWithNow(
      state.solitaire.info.endTime.date, state.solitaire.info.endTime.time)) ?
    'solitaire_card_expired' : ''

  // console.log('className', tool_functions.date_functions.compareDateAndTimeWithNow(
  //   state.solitaire.info.endTime.date, state.solitaire.info.endTime.time));


  return (
    <View className={'solitaire_card '.concat(props.className, ' ', className)}>
      {deleteDialog}
      {state.solitaire &&
        <AtSwipeAction
          onClick={(e) => handleActionButton(e)}
          isOpened={isOpened}
          onOpened={() => { setIsOpened(true); }}
          onClosed={() => { setIsOpened(false); }}
          options={
            [
              {
                id: 'edit',
                text: '修改',
                style: {
                  backgroundColor: 'var(--light-2)'
                }
              },
              props.mode === 'SELLER' ? {
                id: 'copy',
                text: '复制',
                style: {
                  backgroundColor: 'var(--light-3)'
                }
              } : {
                id: 'cancel',
                text: '取消接龙',
                style: {
                  backgroundColor: 'var(--red-1)'
                }
              },
              {
                id: 'delete',
                text: '删除',
                style: {
                  backgroundColor: props.mode === 'SELLER' ? 'var(--red-1)' : 'var(--red-2)'
                }
              }
            ]}
        >
          <View
            className='card_body'
            onClick={isOpened ?
              () => { setIsOpened(false) } : (e) => goToInsideSolitairePage('BUYER', e)}
          >
            <View className='date_and_time'>
              <View className='date_and_time'>
                <View className='date'>{state.solitaire.info.startTime.date}</View>
                <View className='time'>{state.solitaire.info.startTime.time}</View>
              </View>
              {(state.solitaire.info.endTime.date &&
                state.solitaire.info.endTime.date.length > 0) ?
                <View className='date_and_time'>
                  <View className='to'>~</View>
                  <View className='date'>{state.solitaire.info.endTime.date}</View>
                  <View className='time'>{state.solitaire.info.endTime.time}</View>
                </View> :
                <View className='word'>开始</View>
              }
            </View>
            <View className='solitaire_content'>{state.solitaire.info.content}</View>
          </View>
        </AtSwipeAction >
      }
    </View>
  )
}
SolitaireCard.defaultProps = {
  mode: 'BUYER',
};
export default SolitaireCard;