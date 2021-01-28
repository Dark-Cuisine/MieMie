import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import ActionButtons from '../../buttons/ActionButtons/ActionButtons'
import './StationsCard.scss'

/***
 * <StationsCard
item={it}
hasActionButotns={state.ifShowActionButtons}
handleModify={(e) => troggleDialog('INPUT', i, e)}
handleDelete={(e) => troggleDialog('DELETE', i, e)}
mode= 'LARGE' 
/>
 */
const StationsCard = (props) => {
  const initState = {
    item: props.item,

    ifShowAllStations: false,

    mode: props.mode ? props.mode : 'LARGE',//'LARGE'(可展开所有车站列表),'MINI'(不能展开所有车站,但能点击获取信息)
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    setState({
      ...state,
      item: initState.item,
    });
  }, [props])



  const troggleDialog = (way, e = null) => {
    e && e.stopPropagation();
    switch (way) {
      case 'SHOW_ALL_STATIONS'://显示该线路被选中的所有车站
        setState({
          ...state,
          ifShowAllStations: !state.ifShowAllStations
        });
        break;
      case '':
        break;
      default:
        break;
    }
  }

  const handleActionButtons = (way, e = null) => {
    e && e.stopPropagation();
    switch (way) {
      case 'MODIFY':
        props.handleModify(e);
        break;
      case 'DELETE':
        props.handleDelete(e);
        break;
      case '':
        break;
      default:
        break;
    }
  }

  let stationList =[]
   state.item.stations && state.item.stations.list && state.item.stations.list.length > 0 &&
    state.item.stations.list.forEach(it => {
      stationList.push(it.station)
    })
  return (
    <View className='stations_card'>
      {state.mode == 'LARGE' && state.item &&
        <View className=' mode_large '>
          <View className='flex'>
            <View className='dot_small_wrap'><View className='dot_small'></View></View>
            <View className='train_line'>{state.item.line}</View>
            <View
              className='train_stations'
              onClick={(e) => troggleDialog('SHOW_ALL_STATIONS', e)}
            >
              <View>{state.item.stations.from}</View>
              {state.item.stations.list.length > 1 &&
                <View >
                  <View
                    className='at-icon at-icon-arrow-right'
                  />
                  {state.item.stations.to}
                </View>
              }
            </View>
          </View>
          {state.ifShowAllStations &&
            <View className='all_stations'>
              {stationList.join('-')}
            </View>
          }
        </View>
      }
      {state.mode == 'MINI' && state.item &&
        <View className='mode_mini'>
          <View>{state.item && state.item.stations.from}</View>
          {state.item && state.item.stations.list.length > 1 &&
            <View> ~ {state.item && state.item.stations.to}</View>
          }
        </View>
      }

      {props.hasActionButotns &&
        <ActionButtons
          type={0}
          position={'RIGHT'}
          onClickLeftButton={(e) => handleActionButtons('MODIFY', e)}
          onClickRightButton={(e) => handleActionButtons('DELETE', e)}
          leftWord='edit'
          rightWord='trash'
        />
      }
    </View>
  )
}

export default StationsCard;