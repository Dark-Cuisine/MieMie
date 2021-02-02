import React, { Component, useState, useEffect, useImperativeHandle, useRef } from 'react'
import Taro from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtModal, AtIcon } from "taro-ui"
import * as actions from '../../../redux/actions'

import ActionDialog from '../../dialogs/ActionDialog/ActionDialog'
import ActionButtons from '../../buttons/ActionButtons/ActionButtons'
import Dialog from '../../dialogs/Dialog/Dialog'
import MarkedStationsContainer from '../../../containers/MarkedStationsContainer/MarkedStationsContainer'
import TrainStationSetter from '../../TrainStationSetter/TrainStationSetter'
import './LocationSettingDialog.scss'

/**
 * 设置客户地址的dialog
 */
const LocationSettingDialog = (props) => {
  const dispatch = useDispatch();
  const shopsManager = useSelector(state => state.shopsManager);
    const app = getApp()
  const initState = {
    oldItem: shopsManager.filterOptions.stations,
    modifyingItem: shopsManager.filterOptions.stations,//*unfinished:没想好匹配时要不要加上line

    ifShowDialog: false,//本身的dialog
    openedDialog: null,//dialog里的dialog。'SAVE_MARKED_STATIONS'
  }
  const [state, setState] = useState(initState);
  const trainStationSetterRef = useRef();
  const markedStationsContainerRef = useRef();

  useEffect(() => {
    // console.log('shopsManager.filterOptions.stations',shopsManager.filterOptions.stations);
    setState({
      ...state,
      modifyingItem: initState.modifyingItem,
      oldItem: initState.oldItem,
    });
  }, [shopsManager.filterOptions.stations])

  const toggleDialog = (ifOpen = null, openedDialog = null) => {
    setState({
      ...state,
      openedDialog: openedDialog,
      ifShowDialog: (ifOpen === null) ? !state.ifShowDialog : ifOpen,
    });
  }


  const handleActionButtons = (way, v = null, i = null) => {
    switch (way) {
      case 'CANCEL':
        // trainStationSetterRef.current && trainStationSetterRef.current.handleCancel();
        setState({
          ...state,
          modifyingItem: state.oldItem,
          ifShowDialog: false
        });
        break;
      case 'SUBMIT':
        wx.setStorage({
          key: 'preSearchStations',
          data: state.modifyingItem
        });

        trainStationSetterRef.current && trainStationSetterRef.current.handleSubmit();
        dispatch(actions.filterShops('SET_STATIONS',
          shopsManager.filterOptions.shopKind, shopsManager.filterOptions.pickUpWay, state.modifyingItem,
          app.$app.globalData.classifications));
        toggleDialog();
        break;
      default:
        break;
    }
  }

  const handleReset = () => {
    trainStationSetterRef.current && trainStationSetterRef.current.handleReset();
  }

  const handleSetStations = (stations) => {
    console.log('ssss', stations);
    setState({
      ...state,
      modifyingItem: stations
    });
  }
  const handleClickMarkedStations = (it) => {
    setState({
      ...state,
      modifyingItem: it
    });
  }
  const handleSaveMarkedStations = () => {
    toggleDialog(true, false)
    markedStationsContainerRef.current && markedStationsContainerRef.current.handleSave();
  }
  // console.log('lati=state.modifyingItem',state.modifyingItem);
  // console.log('mmm', shopsManager.filterOptions.stations);
  let locationText =
    ((state.oldItem.stations.list) && (state.oldItem.stations.list.length > 0)) ?
      (state.oldItem.stations.from //*problem :不知为何不能直接用+
        .concat(state.oldItem.stations.list.length > 1 ?
          ('~' + state.oldItem.stations.to) : '')) :
      '设定车站';
  let dialog = (
    <Dialog
      className='dialog'
      isOpened={state.ifShowDialog}
      onClose={handleActionButtons.bind(this, 'CANCEL')}
      title='选择车站'
    >
      <View className='location_setting_action_buttons'>
        <View
          className='button reset_button'
          onClick={() => handleReset()}
        >
          <View className='at-icon at-icon-repeat-play' />
          <View className=''>重置</View>
        </View>
        <View
          className='button save_button'
          onClick={() => toggleDialog(true, 'SAVE_MARKED_STATIONS')}
        >
          <View className='at-icon at-icon-add' style={'font-size:42rpx;color:var(--light-3)'} />
          <View className='' style={'color:var(--light-3)'}>保存</View>
        </View>
      </View>

      <TrainStationSetter
        ref={trainStationSetterRef}
        name='locationSettingDialogTrainStationSetter'
        type={3}
        //modifyingItem={state.choosenMarkedStations ? state.choosenMarkedStations : modifyingItem}
        modifyingItem={state.modifyingItem}
        handleSubmit={(returnItem) => handleSetStations(returnItem)}
        sendValue={(returnItem) => handleSetStations(returnItem)}
        hasActionButtons={false}
        maxItem={30}
        maxHeight={400}
      />
      <View className='wrap'>
        <View className=''>我保存的车站： </View>
        <scroll-view
          className=''
          scroll-y="true"
          style={'height:200rpx'}
        >
          <MarkedStationsContainer
            ref={markedStationsContainerRef}
            version={props.version}
            currentItem={state.modifyingItem}
            handleClickItem={(it) => handleClickMarkedStations(it)}
            ifShowActionButtons={false}
            mode={'MINI'}
          />
        </scroll-view>
        <ActionButtons
          type={0}
          position={'MIDDLE'}
          onClickLeftButton={handleActionButtons.bind(this, 'CANCEL')}
          onClickRightButton={handleActionButtons.bind(this, 'SUBMIT')}
        />
      </View>
    </Dialog>
  )
  return (
    <View className='loaction_setting_dialog'>
      {dialog}
      <ActionDialog
        isOpened={state.openedDialog === 'SAVE_MARKED_STATIONS'}
        onClose={() => toggleDialog(true)}
        onCancel={() => toggleDialog(true)}
        onSubmit={() => handleSaveMarkedStations()}
      >
        <View className=''>确定保存？</View>
      </ActionDialog>
      <View
        className='toggle_button'
        onClick={() => toggleDialog()}
      >
        <View className='at-icon at-icon-map-pin' />
        <View className='text'>{locationText}</View>
      </View>
    </View>


  )
}

export default LocationSettingDialog;
