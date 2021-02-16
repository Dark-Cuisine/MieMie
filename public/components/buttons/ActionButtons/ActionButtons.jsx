import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import CheckRequiredButton from '../CheckRequiredButton/CheckRequiredButton'
import './ActionButtons.scss'

/***
 * <ActionButtons
 * type={1}  
 * //0: x(at-icon-'leftWord') √(at-icon-'leftWord')  
 * 1:'leftWord' 'rightWord' 
 * 2: … -> 展开actionButtonList
 * 3: 单个按钮，leftWord、rightWord互相切换
 * 
 * position={'MIDDLE'} //'LEFT',MIDDLE','RIGHT'(type_0、type_1对应的是在父元素里的位置，type_2对应的是展开actionButtonList相对于toggleButton的位置)
 * 
 * //type_0, type_1
 * onClickLeftButton={}
 * onClickRightButton={}
 * leftWord='取消'
 * rightWord='删除'
 * 
 * //type_2
 * actionButtonList={
 * [
 * {
 * word:'删除'.
 * onClick:()=>{}
 * },
 * word:'修改'.
 * onClick:()=>{}
 * },
 * ]
 * },
 *  onClickSpreadButton={(e) => handleActionButtons('LABEL_TOGGEL', i, e)} //可选

checkedItems={[ //可选,type_0、type_1的onClickRightButton时检查的必选项
    {
      check: ordersManager.isOutOfStock,
      toastText: '库存不足！'
    },
    {
      check: state.order.pickUpWay.way.length < 1,
      toastText: '请选择取货方式！'
    },
  ]}

 */
const ActionButtons = (props) => {
  const initState = {
    currentButton: 0,//0:button_left,1:button_right

    ifOpenButtonList: false,
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])


  //for type_2
  const toggleButtonList = (ifOpen = null, e = null) => {
    e && e.stopPropagation();
    props.onClickSpreadButton && props.onClickSpreadButton();
    setState({
      ...state,
      ifOpenButtonList: (ifOpen === null) ? !state.ifOpenButtonList : ifOpen,
    });
  }

  const handleClickButtonListButton = (button) => {
    button.onClick();
    setState({
      ...state,
      ifOpenButtonList: false,
    });
  }

  //for type_3
  const changeButton = () => {
    state.currentButton == 0 ?
      props.onClickLeftButton() : props.onClickRightButton();
    setState({
      ...state,
      currentButton: (state.currentButton == 0) ? 1 : 0,
    });
  }

  let actionButtons = null;
  switch (props.type) {
    case 0:// x √  
      actionButtons = (
        <View className='type_0 buttons'>
          <View
            className={'button button_left at-icon at-icon-'.concat(
              props.leftWord ? props.leftWord : 'close'
            )}
            onClick={() => props.onClickLeftButton()}
          />
          {
            props.checkedItems ?
              <CheckRequiredButton
                checkedItems={props.checkedItems}
                doAction={() => props.onClickRightButton()}
              >
                <View
                  className={'button button_right at-icon at-icon-'.concat(
                    props.rightWord ? props.rightWord : 'check'
                  )}
                />
              </CheckRequiredButton>
              :
              <View
                className={'button button_right at-icon at-icon-'.concat(
                  props.rightWord ? props.rightWord : 'check'
                )}
                onClick={() => props.onClickRightButton()}
              />
          }
        </View>
      )
      break;
    case 1:// 'leftWord' 'rightWord'  
      actionButtons = (
        <View className='type_1 buttons'>
          {
            props.leftWord &&
            <View
              className='button button_left button_left'
              onClick={() => props.onClickLeftButton()}
            >
              {props.leftWord}
            </View>
          }
          {props.rightWord &&
            (
              props.checkedItems ?
                <CheckRequiredButton
                  className='button button_right button_right'
                  checkedItems={props.checkedItems}
                  doAction={() => props.onClickRightButton()}
                >
                  {props.rightWord}
                </CheckRequiredButton>
                :
                < View
                  className='button button_right button_right'
                  onClick={() => props.onClickRightButton()}
                >
                  {props.rightWord}
                </View>
            )
          }
        </View >
      )
      break;
    case 2://  … -> 展开actionButtonList
      actionButtons = (
        <View className='type_2 '>
          <View
            className='spread_button'
            onClick={(e) => toggleButtonList(null, e)}
          ><View>...</View></View>
          {
            state.ifOpenButtonList &&
            <View className='button_list'>
              {props.actionButtonList && props.actionButtonList.map((it, i) => {
                return (
                  <View
                    key={i}
                    onClick={() => handleClickButtonListButton(it)}
                  >
                    <View
                      className='button'
                    >
                      {it.word}
                    </View>
                    {
                      i < props.actionButtonList.length &&
                      <View className='line_horizontal' />
                    }
                  </View>
                )
              })}
            </View>
          }
          {
            state.ifOpenButtonList &&
            <View className='mask_transparent'
              onClick={(e) => toggleButtonList(false, e)}
            />
          }

        </View>
      )
      break;
    case 3://单个按钮，leftWord、rightWord互相切换
      actionButtons = (
        <View className='type_3'>
          <View
            className={'button '.concat(state.currentButton == 0 ? 'button_left' : 'button_right')}
            onClick={() => changeButton()}
          >
            {state.currentButton == 0 ? props.leftWord : props.rightWord}
          </View>
        </View>
      )
      break;
    case '':
      break;
    default:
      break;
  }

  return (
    <View className={'action_buttons '.concat(props.className)}>
      <View className={props.position === 'LEFT' ? 'position_left' :
        (props.position === 'MIDDLE' ? 'position_middle' : 'position_right')}>
        {actionButtons}
      </View>
    </View>
  )
}

export default ActionButtons;