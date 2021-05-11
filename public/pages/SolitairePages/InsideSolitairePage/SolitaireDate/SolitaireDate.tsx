import React, { Component, useState, useReducer, useEffect, useRef } from 'react'
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Textarea, Picker } from '@tarojs/components'
import { AtInput, AtTextarea, AtAccordion, AtToast } from 'taro-ui'
import dayjs from 'dayjs'
import * as actions from "../../../../redux/actions/index";



import * as databaseFunctions from '../../../../utils/functions/databaseFunctions'

import './SolitaireDate.scss'

/***
 * 
 * <SolitaireDate
        type={state.type} //'EVENT'活动接龙,'GOODS'商品接龙
        mode={mode} //'BUYER','SELLER'
        solitaire={state.solitaire}
        solitaireShop={state.solitaireShop} //mode==='SELLER'时才需要这个
      />
 */
const SolitaireDate = (props) => {
  const dispatch = useDispatch();
  const app = getApp()
  const userManager = useSelector(state => state.userManager);
  const ordersManager = useSelector(state => state.ordersManager)
  const classifications = app.$app.globalData.classifications && app.$app.globalData.classifications
  const currencies = classifications && classifications.currencies
  const pickUpWayContainerRef = useRef();
  const shopProductsContainerRef = useRef();
  const initState = {
    solitaireShop: props.solitaireShop,
    solitaire: props.solitaire,

    ifOpenPickUpWayAcc: true,

  }
  const [state, setState] = useState(initState);
  const [openedDialog, setOpenedDialog] = useState(null);//'UPLOAD'
  const [deletedImgList, setDeletedImgList] = useState([]);//要从云储存删除的图片
  const [des, setDes] = useState({ isFocused: false });
  const [content, setContent] = useState({ isFocused: false });
  const initPaymentOptions = props.paymentOptions
  const [paymentOptions, setPaymentOptions] = useState(initPaymentOptions);//所有paymentOptions(包括没被选中的)

  useEffect(() => {
     setState({
      ...state,
      solitaire: initState.solitaire,
      solitaireShop: initState.solitaireShop,
    });
    setPaymentOptions(initPaymentOptions);
  }, [props.solitaire, props.solitaireShop, props.paymentOptions, app.$app.globalData.classifications])


  useEffect(() => {
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const handleChange = (way, v = null, v_2 = null) => {
    let newState = {};
    switch (way) {
      case 'START_DATE'://date and time
        newState = {
          ...state,
          solitaire: {
            ...state.solitaire,
            info: {
              ...state.solitaire && state.solitaire.info,
              startTime: {
                ...state.solitaire.info && state.solitaire.info.startTime,
                date: v,
                time: state.solitaire && state.solitaire.info &&
                  state.solitaire.info.startTime && state.solitaire.info.startTime.time ?
                  state.solitaire.info.startTime.time : dayjs().format('HH:mm')
              },
            }
          }
        }
        break;
      case 'END_DATE':
        newState = {
          ...state,
          solitaire: {
            ...state.solitaire,
            info: {
              ...state.solitaire && state.solitaire.info,
              endTime: {
                ...state.solitaire.info && state.solitaire.info.endTime,
                date: v,
                time: state.solitaire && state.solitaire.info &&
                  state.solitaire.info.endTime && state.solitaire.info.endTime.time ?
                  state.solitaire.info.endTime.time : dayjs().format('HH:mm')
              },
            }
          }
        };
        break;
      case 'START_TIME':
        newState = {
          ...state,
          solitaire: {
            ...state.solitaire,
            info: {
              ...state.solitaire && state.solitaire.info,
              startTime: {
                ...state.solitaire.info && state.solitaire.info.startTime,
                time: v,
              },
            }
          }
        };
        break;
      case 'END_TIME':
        newState = {
          ...state,
          solitaire: {
            ...state.solitaire,
            info: {
              ...state.solitaire && state.solitaire.info,
              endTime: {
                ...state.solitaire.info && state.solitaire.info.endTime,
                time: v,
              },
            }
          }
        };
        break;

      case 'EVENT_START_DATE'://event date and time
        newState = {
          ...state,
          solitaire: {
            ...state.solitaire,
            eventTime: {
              ...state.solitaire && state.solitaire.eventTime,
              startTime: {
                ...state.solitaire.eventTime && state.solitaire.eventTime.startTime,
                date: v,
                time: state.solitaire && state.solitaire.eventTime &&
                  state.solitaire.eventTime.startTime && state.solitaire.eventTime.startTime.time ?
                  state.solitaire.eventTime.startTime.time : dayjs().format('HH:mm')
              },
            }
          }
        };
        break;
      case 'EVENT_END_DATE':
        newState = {
          ...state,
          solitaire: {
            ...state.solitaire,
            eventTime: {
              ...state.solitaire && state.solitaire.eventTime,
              endTime: {
                ...state.solitaire.eventTime && state.solitaire.eventTime.endTime,
                date: v,
                time: state.solitaire && state.solitaire.eventTime &&
                  state.solitaire.eventTime.endTime && state.solitaire.eventTime.endTime.time ?
                  state.solitaire.eventTime.endTime.time : dayjs().format('HH:mm')
              },
            }
          }
        };
        break;
      case 'EVENT_START_TIME':
        newState = {
          ...state,
          solitaire: {
            ...state.solitaire,
            eventTime: {
              ...state.solitaire && state.solitaire.eventTime,
              startTime: {
                ...state.solitaire.info && state.solitaire.eventTime.startTime,
                time: v,
              },
            }
          }
        };
        break;
      case 'EVENT_END_TIME':
        newState = {
          ...state,
          solitaire: {
            ...state.solitaire,
            eventTime: {
              ...state.solitaire && state.solitaire.eventTime,
              endTime: {
                ...state.solitaire.eventTime && state.solitaire.eventTime.endTime,
                time: v,
              },
            }
          }
        };
        break;
      case '':
        break;
      default:
        newState = state
        break;
    }
    setState(newState);
    props.handleChange(newState.solitaire)
  }

  return state.solitaire && (
    <View className={'solitaire_date date_and_time solitaire_container_item'.concat(props.className)}>
      <View className='date_and_time solitaire_container_item'>
        <View className='solitaire_container_item_title'>
          {props.type === 'GOODS' ? '接龙时间' : '报名时间'}
          <View className='line_horizontal_bold' />
        </View>
        <View className='date_time_item'>
          <View className='flex items-center '>
            <Picker
              mode='date'
              value={state.solitaire.info.startTime && state.solitaire.info.startTime.date}
              // disabled={props.mode === 'BUYER'}
              onChange={v => handleChange('START_DATE', v.detail.value)}
            >
              <View className='flex items-center'>
                <View className='at-icon at-icon-calendar' />
                {state.solitaire && state.solitaire.info && state.solitaire.info.startTime &&
                  <View className=''>{state.solitaire.info.startTime.date}</View>
                }
              </View>
            </Picker>
            {state.solitaire && state.solitaire.info && state.solitaire.info.startTime &&
              state.solitaire.info.startTime.date &&
              <Picker
                mode='time'
                disabled={props.mode === 'BUYER'}
                value={state.solitaire.info.startTime && state.solitaire.info.startTime.time}
                onChange={v => handleChange('START_TIME', v.detail.value)}
              >
                <View className='flex items-center'>
                  <View className='at-icon at-icon-clock' />
                  {state.solitaire.info.startTime.time}
                </View>
              </Picker>
            }
          </View>
          <View className='word'>开始</View>
        </View>
        <View className='date_time_item'>
          <View className='flex items-center'>
            <Picker
              mode='date'
              disabled={props.mode === 'BUYER'}
              value={state.solitaire.info.endTime && state.solitaire.info.endTime.date}
              onChange={v => handleChange('END_DATE', v.detail.value)}>
              <View className='flex items-center'>
                <View className='at-icon at-icon-calendar' />
                {(state.solitaire && state.solitaire.info && state.solitaire.info.endTime
                  && state.solitaire.info.endTime.date.length > 0) ?
                  <View className=''>{state.solitaire.info.endTime.date}</View> :
                  <View className=''>永不截止</View>
                }
              </View>
            </Picker>
            {state.solitaire && state.solitaire.info && state.solitaire.info.endTime &&
              state.solitaire.info.endTime.date &&
              <Picker
                mode='time'
                disabled={props.mode === 'BUYER'}
                value={state.solitaire.info.endTime.time}
                onChange={v => handleChange('END_TIME', v.detail.value)}
              >
                <View className='flex items-center'>
                  <View className='at-icon at-icon-clock' />
                  {state.solitaire.info.endTime.time}
                </View>
              </Picker>
            }
          </View>
          <View className='word'>截止</View>
        </View>
      </View>
      {props.type === 'EVENT' &&
        <View className='date_and_time solitaire_container_item'>
          <View className='solitaire_container_item_title'>
            {'活动时间'}
            <View className='line_horizontal_bold' />
          </View>
          <View className='date_time_item'>
            <View className='flex items-center '>
              <Picker
                mode='date'
                value={state.solitaire.eventTime &&
                  state.solitaire.eventTime.startTime && state.solitaire.eventTime.startTime.date}
                disabled={props.mode === 'BUYER'}
                onChange={v => handleChange('EVENT_START_DATE', v.detail.value)}
              >
                <View className='flex items-center'>
                  <View className='at-icon at-icon-calendar' />
                  {state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.startTime &&
                    <View className=''>{state.solitaire.eventTime.startTime.date}</View>
                  }
                </View>
              </Picker>
              {state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.startTime &&
                state.solitaire.eventTime.startTime.date &&
                <Picker
                  mode='time'
                  disabled={props.mode === 'BUYER'}
                  value={state.solitaire.eventTime.startTime.time}
                  onChange={v => handleChange('EVENT_START_TIME', v.detail.value)}
                >
                  <View className='flex items-center'>
                    <View className='at-icon at-icon-clock' />
                    {state.solitaire.eventTime.startTime.time}
                  </View>
                </Picker>
              }
            </View>
            <View className='word'>开始</View>
          </View>
          <View className='date_time_item'>
            <View className='flex items-center'>
              <Picker
                mode='date'
                value={state.solitaire.eventTime &&
                  state.solitaire.eventTime.endTime && state.solitaire.eventTime.endTime.date}
                disabled={props.mode === 'BUYER'}
                onChange={v => handleChange('EVENT_END_DATE', v.detail.value)}>
                <View className='flex items-center'>
                  <View className='at-icon at-icon-calendar' />
                  {(state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.endTime
                    && state.solitaire.eventTime.endTime.date.length > 0) ?
                    <View className=''>{state.solitaire.eventTime.endTime.date}</View> :
                    <View className=''>永不截止</View>
                  }
                </View>
              </Picker>
              {state.solitaire && state.solitaire.eventTime && state.solitaire.eventTime.endTime &&
                state.solitaire.eventTime.endTime.date &&
                <Picker
                  mode='time'
                  disabled={props.mode === 'BUYER'}
                  value={state.solitaire.eventTime.endTime.time}
                  onChange={v => handleChange('EVENT_END_TIME', v.detail.value)}
                >
                  <View className='flex items-center'>
                    <View className='at-icon at-icon-clock' />
                    {state.solitaire.eventTime.endTime.time}
                  </View>
                </Picker>
              }
            </View>
            <View className='word'>截止</View>
          </View>
        </View>

      }
    </View>
  )
}
SolitaireDate.defaultProps = {
  mode: 'BUYER',
  type: 'GOODS',
};
export default SolitaireDate;