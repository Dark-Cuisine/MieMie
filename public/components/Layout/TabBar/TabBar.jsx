import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { usePageScroll, useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import * as actions from '../../../redux/actions'

import './TabBar.scss'

const SCROLL_TOP_THR = 1000;//超过这个阈值tababr会变为缩略模式
const CLICK_THR = 20;//小于这个阈值就会判定为click

/****
 * <TabBar
 * mode='SELLER'//'SELLER','BUYER' //mode-'BUYER':收藏-逛摊-(订单)我的订单-用户, 'SELLER':（摆摊)我的地摊-(接单)订单管理-(发货)发货助手-用户
 */
const TabBar = (props) => {
  const dispatch = useDispatch();
  const tabBarManager = useSelector(state => state.tabBarManager);
  const publicManager = useSelector(state => state.publicManager);

  const initState = {
    tabBarList_buyer: publicManager.classifications ? //buyer版的tabbar obj
      publicManager.classifications.tabBar.tabBarList_buyer : [],
    tabBarList_seller: publicManager.classifications ?//seller版的tabbar obj
      publicManager.classifications.tabBar.tabBarList_seller : [],

    currentTabId: publicManager.classifications ? //当前选中的tab id
      (props.mode === 'BUYER' ?
        publicManager.classifications.tabBar.tabBarList_buyer[1].id :
        publicManager.classifications.tabBar.tabBarList_seller[1].id
      ) : null,

    verticalBarMode: 'MODE_0',//'MODE_0'（不显示）,'MODE_1'（竖直）,'MODE_2'（弯曲）
    hoveredButtonIndex: null,

  }
  const initTouchMoveState = { //触摸移动的state
    startX: null,
    startY: null,
    endX: null,
    endY: null,
    moveX: null,
    moveY: null,
  }
  const [state, setState] = useState(initState);
  const [touchMoveState, setTouchMoveState] = useState(initTouchMoveState);

  useEffect(() => {
    setState({
      ...state,
      tabBarList_buyer: initState.tabBarList_buyer,
      tabBarList_seller: initState.tabBarList_seller,
      currentTabId: initState.currentTabId,
    });
  }, [publicManager.classifications]);

  useEffect(() => {
    setState({
      ...state,
      currentTabId: tabBarManager.currentTabId,
    });
  }, [tabBarManager.currentTabId]);

  usePageScroll(res => {//根据离顶部的距离判断是否开隐藏模式
    let oldMode = tabBarManager.horizontalBarMode;
    let newMode = res.scrollTop > SCROLL_TOP_THR ? 'HIDED' : 'NORMAL';

    console.log(!(oldMode == newMode));
    !(oldMode == newMode) &&
      dispatch(actions.toggleHideMode(newMode, newMode, newMode))
  })


  const handleChangeTab = (it) => {//跳转页面
    dispatch(actions.toggleLoadingSpinner(false));
    dispatch(actions.changeTabBarTab(it));
  }

  const toggleMode = (way, mode = null) => {
    switch (way) {
      case 'HORIZONTAL_BAR'://横tabar模式下
        let updatedMode = (mode === null) ?
          (tabBarManager.horizontalBarMode == 'HIDED' ? 'NORMAL' : 'HIDED') : mode
        dispatch(actions.toggleHideMode(updatedMode, updatedMode, updatedMode))
        break;
      case 'VERTICAL_BAR'://竖tabbar模式下
        setState({
          ...state,
          verticalBarMode: (mode === null) ?
            (state.verticalBarMode == 'MODE_1' ? 'MODE_2' : 'MODE_1') : mode,
        });
        break;
      case '':
        break;
      default:
        break;
    }
  }



  //handle touch缩略模式下的horizontalBar
  const handleTouchStart = (e) => {
    // e && e.stopPropagation();//*problem 挡不住后面页面的移动
    setTouchMoveState({
      ...touchMoveState,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
    })
  }
  const handleTouchMove = (e) => {
    // e && e.stopPropagation();

    let endX = e.touches[0].clientX;
    let endY = e.touches[0].clientY;
    let moveX = endX - touchMoveState.startX;
    let moveY = endY - touchMoveState.startY;

    setTouchMoveState({
      ...touchMoveState,
      endX: endX,
      endY: endY,
      moveX: moveX,
      moveY: moveY,
    })

    let currentVerMode = state.verticalBarMode;//根据纵向移动的距离决定verticalBar的mode
    let newVerMode = moveX < 50 ? 'MODE_1' : 'MODE_2';
    if (!(currentVerMode == newVerMode)) {
      toggleMode('VERTICAL_BAR', newVerMode)
      return  //* remember to 'return',or setState will not work in toggleMode() !!!!
    }

    let hoveredButtonIndex = null;
    if (currentVerMode == 'MODE_1') {//竖直verticalBar
      switch (true) {
        case (-30 > moveY && moveY > -100)://-100 ~ -30
          hoveredButtonIndex = 0
          break;
        case (-30 > moveY && moveY > -180)://-180 ~ -100
          hoveredButtonIndex = 1
          break;
        case (-30 > moveY && moveY > -260): //-260 ~ -180
          hoveredButtonIndex = 2
          break;
        case (-30 > moveY && moveY > -340): //-340 ~ -260
          hoveredButtonIndex = 3
          break;
        default:
          break;
      }
    } else {//弯曲verticalBar
      switch (true) {
        case (-30 > moveY && moveY > -100 && //moveY: -100 ~ -30
          50 < moveX && moveX < 60)://moveX: 50 ~ 60
          hoveredButtonIndex = 0
          break;
        case (-100 > moveY && moveY > -180 &&//moveY:-180 ~ -100
          50 < moveX && moveX < 100)://moveX: 50 ~ 100
          hoveredButtonIndex = 1
          break;
        case (-180 > moveY && moveY > -260 &&//moveY:-260 ~ -180
          50 < moveX && moveX < 140)://moveX: 50 ~ 140
          hoveredButtonIndex = 2
          break;
        case (-260 > moveY && moveY > -340 &&//moveY:-340 ~ -260
          50 < moveX && moveX < 200)://moveX: 50 ~ 200
          hoveredButtonIndex = 3
          break;
        default:
          break;
      }
    }
    setState({
      ...state,
      hoveredButtonIndex: hoveredButtonIndex
    });
  }
  const handleTouchEnd = (e) => {
    // e && e.stopPropagation();
    let hoveredButtonIndex = state.hoveredButtonIndex;

    if (Math.abs(Number(touchMoveState.moveX)) < CLICK_THR &&//判断为点击
      Math.abs(Number(touchMoveState.moveY)) < CLICK_THR) {
      toggleMode('HORIZONTAL_BAR');
      hoveredButtonIndex = null
    }

    !(hoveredButtonIndex === null) &&  //跳转
      handleChangeTab(currentTabList[hoveredButtonIndex]);//*problem 下面定义的currentTabList居然在这也能用？？？

    setState({  //init
      ...state,
      verticalBarMode: initState.verticalBarMode,
      hoveredButtonIndex: null,
    });
    setTouchMoveState(initTouchMoveState)
  }

  //tab列表
  let currentTabList = props.mode == 'BUYER' ?
    state.tabBarList_buyer.slice(0) : state.tabBarList_seller.slice(0);

  //横tabbar
  let horizontalButtons = tabBarManager.horizontalBarMode === 'NORMAL' ?
    <View className='horizontal_bar'>
      <View className='buttons'>
        {currentTabList.map((it, i) => {
          return (
            <View className={'button'.concat(state.currentTabId == it.id ?
              ' button_choosen' : '')}
              onClick={() => handleChangeTab(it)}
            >
              <View className={'at-icon at-icon-' + it.icon} />
              <View>{it.name}</View>
            </View>
          )
        })}
      </View>
    </View>
    :
    <View className='horizontal_bar_hide_mode'
      onTouchStart={(e) => handleTouchStart(e)}
      onTouchMove={(e) => handleTouchMove(e)}
      onTouchEnd={(e) => handleTouchEnd(e)}
    />
    ;


    //竖tabbar
  let verticalButtons = state.verticalBarMode === 'MODE_0' ? null :
    (state.verticalBarMode === 'MODE_1' ?
      <View className='vertical_bar vertical_bar_mode_1 '>
        <View className='buttons'>
          {currentTabList.map((it, i) => {
            return (
              <View
                className={i == state.hoveredButtonIndex ?
                  'button button_hovered' : 'button '}
              >
                <View className={'at-icon at-icon-' + it.icon} />
                <View>{it.name}</View>
              </View>
            )
          })}
        </View>
      </View> :
      <View className='vertical_bar vertical_bar_mode_2'>
        <View className='buttons'>
          {currentTabList.map((it, i) => {
            return (
              <View
                className={'button curve_button_'.concat(i)
                  .concat(i == state.hoveredButtonIndex ? ' button_hovered' : '')}
              >
                <View className={'at-icon at-icon-' + it.icon} />
                <View>{it.name}</View>
              </View>
            )
          })}
        </View>
      </View>
    );

  return (
    <View className={'tab_bar'}>
      <View className={(props.mode == 'BUYER') ? ' mode_buyer' : ' mode_seller'}>
        {verticalButtons}
        {horizontalButtons}
      </View>
    </View>
  )
}
TabBar.defaultProps = {
  mode: 'BUYER',//'BUYER','SELLER'
};
export default TabBar;