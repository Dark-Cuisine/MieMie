import React, { Component, useState, useImperativeHandle, forwardRef, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import { useSelector, useDispatch } from 'react-redux'

import * as actions from '../../../redux/actions'

import './TrainLineChooser.scss'
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner'
import MatchInput from '../../MatchInput/MatchInput'

/**
 * <TrainLineChooser
 * name='xxx' //*MatchInput的标识，必须保证唯一
    setTrainLine={(line) => setTrainLine(line)} //line:返回的被选中线路
    modifyingItem={props.modifyingItem && props.modifyingItem.line} //可选
    trainLineList={trainLineList} //可选，如没此项则默认设为关东所有线路
    />
 */
const TrainLineChooser = (props) => {
  const dispatch = useDispatch();
  const initState = {
    allTrainLinesList: props.allTrainLinesList ? props.allTrainLinesList : [],

    choosenLine: props.modifyingItem ? props.modifyingItem : null,

  }
  const [state, setState] = useState(initState);
  const [loadingWord, setLoadingWord] = useState(null);

  useEffect(() => {
    setState({
      ...state,
      choosenLine: initState.choosenLine,
    });
  }, [props.modifyingItem])

  useEffect(() => {//get关东的电车线路list //*unifnished现在还只能关东地区
    reLoad()
  }, [state.choosenLine])

  const reLoad = () => {
    setLoadingWord('加载中...')
    wx.cloud.callFunction({
      name: "get_train",
      data: {
        option: 'TRAIN_LINES',
      },
      success: (res) => {
        //console.log("关东的电车lines: ", res.result);
        if (!(res && res.result && res.result.length > 0)) {
          return
        }
        setLoadingWord(null)
        setState({
          ...state,
          allTrainLinesList: res.result,
        });
      },
      fail: (err) => {
        console.log("failed in get lines", err);
        setLoadingWord('加载失败')
        setState({
          ...state,
          allTrainLinesList: [initState.choosenLine],
        });
      }
    });
  }

  //console.log('modifyingItem',props.modifyingItem);
  const setTrainLine = (item) => {
    setState({
      ...state,
      choosenLine: item
    });
    props.setTrainLine(item);//*这里不能直接用state.choosenLine不然只能拿到更新前的值！

  }

  return (
    <MatchInput
      className={'trian_line_chooser '.concat(props.className ? props.className : '')}
      name={props.name}
      placeholder='输入线路'
      defaultInput={state.choosenLine}
      allItemList={state.allTrainLinesList}
      handleSetItem={(item) => setTrainLine(item)}//* don't use '.bind(this,item)' here or it will not work!!!!

      maxItem={5}
      loadingWord={loadingWord}
      handleClickLoadingWord={() => reLoad()}
    />
  )
}

export default TrainLineChooser;