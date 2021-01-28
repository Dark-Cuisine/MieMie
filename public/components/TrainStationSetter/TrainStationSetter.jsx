import React, { Component, useState, useReducer, useImperativeHandle, forwardRef, useEffect, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../redux/actions'

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import ActionButtons from '../buttons/ActionButtons/ActionButtons'
import MatchInput from '../MatchInput/MatchInput'
import TrainLineChooser from './TrainLineChooser/TrainLineChooser'

import './TrainStationSetter.scss'

/**电车线路、车站的选择器（现在默认只能选关东地区线路 
 * <TrainStationSetter
    type={0}  //0: input(单选),1:input(多选),2:button(单选),3:button(多选)
    name='aaa'//*MatchInput的标识，必须保证唯一

    modifyingItem={it}  //如果有传这个值，则初始化为它
    
    sendValue={(newItem) => handleChange('SELF_PICK_UP_NEARLEST_STATION', newItem)}

    handleSubmit={(newItem) => handleModify('STATION_PICKUP', i, newItem)}
   hasActionButtons={true} //是否显示acton buttons ,actionButtons时按了确定后所有车站的list会缩略起来

    ref={TrainStationSetterRef}//可用ref

    maxItem={15} //可选
    maxHeight={400} //可选，超过maxItem个车站时scroll view的高度
    />
 */
const TrainStationSetter = (props, ref) => {
  const dispatch = useDispatch();
  const initState = {
    allTrainStationsList: [],

    newItem: props.modifyingItem ? props.modifyingItem : {
      line: '',
      stations: {
        list: [],
        from: '',
        to: ''
      }
    },

    stations: {//用来init
      list: [],
      from: '',
      to: ''
    },

    firststationsIndex: null,

    hasActionButtons: (props.hasActionButtons === false) ? false : true,

    ifLineLowIndex: false,

    startX: 0,
    moveX: 0,
    startY: 0,
    moveY: 0,

  }
  const [state, setState] = useState(initState);
  const [loadingWord, setLoadingWord] = useState(null);
  const stationsMatchInputRef = useRef();

  useEffect(() => {//变了line就重查新line的stations
    console.log('props.modifyingItem', props.modifyingItem);
    if (props.modifyingItem) {
      console.log('2.5');
      setAllTrainStationsList(props.modifyingItem.line);
    } else {
      console.log('3');
      setState({
        ...state,
        newItem: initState.newItem
      });
    }
  }, [props.modifyingItem.line]);
  useEffect(() => {//只变了stations不用重查
    console.log('props.modifyingItem-stations', props.modifyingItem);
    setState({
      ...state,
      newItem: initState.newItem
    });
  }, [props.modifyingItem.stations]);

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return (state.newItem)
    },
    handleSubmit: () => {
      handleActionButtons('SUBMIT')
    },
    handleCancel: () => {
      handleActionButtons('CANCEL')
    },
    handleReset: () => {
      handleActionButtons('RESET')
    },
  }));



  const setTrainLine = (line) => {//set线路
    resetAllTrainStationsList(line)
  }

  const setAllTrainStationsList = (line) => {//查找该线路的车站list
    if (line.length < 1) {
      return;
    }
    setLoadingWord('加载中...')
    wx.cloud.callFunction({
      name: "get_train",
      data: {
        option: 'TRAIN_STATIONS',
        line: line,
      },
      success: (res) => {
        setLoadingWord(null)
        if (!(res && res.result)) {
          return
        }
        console.log('2');//*problem: 如果点了修改，在数据库返回数据前迅速把dialog关掉, 再点击新建item时，输入框里面就会出现延迟返回的数据
        setState({
          ...state,
          allTrainStationsList: res.result,
          newItem: initState.newItem,
        });
      },
      fail: (err) => {
        console.log("failed in get stations ", err)
        setLoadingWord('加载失败点击重试')
        setState({
          ...state,
          allTrainStationsList: initState.allTrainStationsList,
          newItem: initState.newItem,
        });
      }
    });

  }
  const resetAllTrainStationsList = (line) => {//查找该线路的车站list
    // console.log('resetAllTrainStationsList', line);
    if (line.length < 1) return;
    setLoadingWord('加载中...')
    wx.cloud.callFunction({
      name: "get_train",
      data: {
        option: 'TRAIN_STATIONS',
        line: line,
      },
      success: (res) => {
        setLoadingWord(null)
        if (!(res && res.result)) {
          return
        }
        //console.log("get train stations", res.result);
        let updatedNewItem = {
          ...state.newItem,
          line: line,
          stations: {
            list: [],
            from: '',
            to: ''
          }
        };
        setState({
          ...state,
          allTrainStationsList: res.result,
          newItem: updatedNewItem,
          firststationsIndex: null,
        });
        props.sendValue && props.sendValue(updatedNewItem);
      },
      fail: (err) => {
        console.log("failed in get stations ", err)
        setLoadingWord('加载失败点击重试')

      }
    });
  }

  const handleSetStation = (way, station, index = null) => {
    console.log('handleSetStation', way, station, index);
    let updatedNewItem = state.newItem;
    switch (way) {
      case 'SINGLE_CHOOSE'://单选车站
        updatedNewItem = {
          ...state.newItem,
          stations: {
            ...state.newItem.stations,
            list: [station],
            from: station,
            to: station
          }
        };
        setState({
          ...state,
          newItem: updatedNewItem,
        });
        props.handleSubmit && props.handleSubmit(updatedNewItem);
        props.sendValue && props.sendValue(updatedNewItem);
        break;
      case 'MULTIPLY_CHOOSE'://多选车站
        let firstIndex = state.firststationsIndex;
        if (firstIndex === null ||
          state.newItem.stations.list.length > 1 ||
          index < firstIndex) {//如没选,设定起点or已经选过范围or第二次选的比第一个靠前，则重新选      //*不能!firstIndex因为0会被误判
          updatedNewItem = {
            ...state.newItem,
            stations: {
              ...state.newItem.stations,
              list: [station],
              from: station,
              to: station
            }
          };
          setState({
            ...state,
            newItem: updatedNewItem,
            firststationsIndex: index
          });
        } else if (index === firstIndex && state.newItem.stations.list.length == 1) {//如果两次按的是相同车站，则取消选择
          updatedNewItem = {
            ...state.newItem,
            stations: initState.stations
          }
          setState({
            ...state,
            newItem: updatedNewItem,
            firststationsIndex: null
          });
        } else {//已有起点，选终点
          let updatedList = null;
          updatedList = state.allTrainStationsList.slice(firstIndex, index + 1);//*记得'+1'
          updatedNewItem = {
            ...state.newItem,
            stations: {
              ...state.newItem.stations,
              list: updatedList,
              from: updatedList[0],
              to: updatedList[updatedList.length - 1]
            }
          }
          setState({
            ...state,
            newItem: updatedNewItem,
          });
        };
        break;

      default:
        break;
    }
    props.sendValue && props.sendValue(updatedNewItem);
  }

  const handleActionButtons = (way, v = null, i = null) => {
    switch (way) {
      case 'RESET':
        let newItem = {
          line: '',
          stations: {
            list: [],
            from: '',
            to: ''
          }
        }
        setState({
          ...state,
          newItem: newItem,
          firststationsIndex: null,
        });
        props.handleSubmit(newItem);
        break;
      case 'CANCEL':
        setState({
          ...state,
          newItem: initState.newItem,
          firststationsIndex: null,
        });
        props.handleSubmit(initState.newItem);
        break;
      case 'SUBMIT'://确认时没有选择，则默认全选
        let updatedNewItem = state.newItem.stations.list.length > 0 ?
          state.newItem :
          {
            ...state.newItem,
            stations: {
              list: state.allTrainStationsList.slice(0, state.allTrainStationsList.length),   //*不用-1
              from: state.allTrainStationsList[0],
              to: state.allTrainStationsList[state.allTrainStationsList.length - 1]
            }
          };
        console.log('updatedNewItem', updatedNewItem);
        props.handleSubmit(updatedNewItem);
        setState({
          ...state,
          newItem: initState.newItem,
          firststationsIndex: null,
        });
        break;

      default:
        break;
    }
  }

  const handleTouchStart = (e) => {
    setState({
      ...state,
      startY: e.touches[0].clientY,
      startX: e.touches[0].clientX,
    });
  }
  const handleTouchMove = (e) => {
    e && e.stopPropagation();
    setState({
      ...state,
      moveY: e.touches[0].clientY - state.startY,
      moveX: e.touches[0].clientX - state.startX
    });
  }
  const handleTouchEnd = (it, i, e) => {//根据state.moveY绝对值判断是拖动还是点击
    // console.log('handleTouchEnd', e,state.moveY);
    console.log(state.moveY, state.moveX);
    if ((Math.abs(state.moveY) < 10) &&
      (Math.abs(state.moveX) < 10)) {
      handleSetStation('MULTIPLY_CHOOSE', it, i)
    } else {
      setState({
        ...state,
        startY: 0,
        moveY: 0,
        startX: 0,
        moveX: 0,
      });
    }
  }

  const toggleLineLowIndex = (ifLineLowIndex) => {
    setState({
      ...state,
      ifLineLowIndex: ifLineLowIndex
    });
  }
  let trainStationChooser = null;
  let from = state.newItem.stations.from;
  let to = (state.newItem.stations.list && state.newItem.stations.list.length > 1) ?
    state.newItem.stations.to : null;
  switch (props.type) {
    case 0://___
      trainStationChooser = (
        <View className='stations_chooser'>
          <MatchInput
            name={props.name + 'matchedStationInput'}
            placeholder='输入车站'
            defaultInput={state.newItem.stations.from}
            allItemList={state.allTrainStationsList}
            handleSetItem={(station) => handleSetStation('SINGLE_CHOOSE', station)}
            handleFocus={() => toggleLineLowIndex(true)}
            handleBlur={() => toggleLineLowIndex(false)}

            loadingWord={loadingWord}
            handleClickLoadingWord={() => setAllTrainStationsList(props.modifyingItem.line)}
          />
          <View>
          </View>
          {state.hasActionButtons &&
            <ActionButtons
              type={0}
              position={'MIDDLE'}
              onClickLeftButton={handleActionButtons.bind(this, 'CANCEL')}
              onClickRightButton={handleActionButtons.bind(this, 'SUBMIT')}
            />
          }
        </View>)
      break;
    case 1://___~___

      break;
    case 2://[]-[*]-[]-[]

      break;
    case 3://[]-[*]-[*]-[]
      // console.log('state.newItem.stations', state.newItem.stations);
      trainStationChooser = (
        <View className='wrap stations_chooser'>
          <View className='title'>车站：{from}{to && (' ~ ' + to)}</View>
          {loadingWord ? (
            loadingWord === '加载失败点击重试' ?
              <View
                className='empty_word'
                onClick={() => setAllTrainStationsList(props.modifyingItem.line)}
              >
                {loadingWord}
              </View> :
              <LoadingSpinner />
          ) :
            <scroll-view
              className='station_button_list'
              scroll-y={true}
              style={(props.maxHeight && props.maxItem) &&
                state.allTrainStationsList.length > props.maxItem &&
                ('height:'.concat(props.maxHeight, 'rpx'))}
            >

              {state.allTrainStationsList.map((it, i) => {
                return (
                  <View
                    className={(state.newItem.stations.list.findIndex((item) => {
                      return ((it == item) || (it == item.station))
                    }) > -1) ?
                      'button choosen' : 'button'}
                    key={i}
                    // onClick={handleSetStation.bind(this, 'MULTIPLY_CHOOSE', it, i)}
                    onTouchStart={e => handleTouchStart(e)}
                    onTouchMove={e => handleTouchMove(e)}
                    onTouchEnd={e => handleTouchEnd(it, i, e)}
                  >
                    {it}
                  </View>
                )
              })
              }
            </scroll-view>
          }
          {state.newItem.stations.list.length > 0 && state.hasActionButtons &&  //*因为要应对修改so这里不能用firststationsIndex来判断是否显示
            <View
              className='at-icon at-icon-close'
              onClick={handleActionButtons.bind(this, 'CANCEL')}
            />
          }
          {state.hasActionButtons && <View
            className='at-icon at-icon-check'
            onClick={handleActionButtons.bind(this, 'SUBMIT')}
          />}
        </View>
      );
      break;
    default:
      break;
  }

  return (
    <View className='train_station_setter'>
      <TrainLineChooser
        name={props.name + 'TrainLineChooser'}
        className={state.ifLineLowIndex ? 'low_index' : ''}
        setTrainLine={(line) => setTrainLine(line)}
        modifyingItem={state.newItem.line}
      />
      {state.newItem.line.length > 0 && trainStationChooser}
      {loadingWord && (
        loadingWord === '加载失败点击重试' ?
          <View
            className='empty_word'
            onClick={() => setAllTrainStationsList(props.modifyingItem.line)}
          >
            {loadingWord}
          </View> :
          <LoadingSpinner />
      )}
    </View>
  )
}

export default forwardRef(TrainStationSetter);