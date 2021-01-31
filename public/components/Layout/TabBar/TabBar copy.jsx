import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { usePageScroll, useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import * as actions from '../../../redux/actions'

import classification from '../../../public/classification'

import './TabBar.scss'

/***
 * mode-'BUYER':逛摊-接龙-收藏-用户, 'SELLER':地摊管理-接龙管理-发货助手-用户
 * 
 * 
 * 
 */
const tabBarList_buyer = classification.tabBar.tabBarList_buyer;
const tabBarList_seller = classification.tabBar.tabBarList_seller;

const SCROLL_TOP_THR = 1000;


/****
 * <TabBar
 * mode='SELLER'
 * tabList=[
 * {
        id: 'marked',
        name: '收藏',
        icon: 'star',
        url: '/pages/BuyerPages/MarkedPage/MarkedPage',
      },
 * ]
 */
const TabBar = (props) => {
  const dispatch = useDispatch();
  const tabBarManager = useSelector(state => state.tabBarManager);
  const initState = {
    tabBarTab: props.mode === 'BUYER' ? tabBarList_buyer[1] : tabBarList_seller[1],

    verticalBarMode: 'MODE_0',//'MODE_0'（不显示）,'MODE_1'（竖直）,'MODE_2'（弯曲）
    hoveredButtonIndex: null,

  }
  const initTouchMoveState = {
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
    console.log('chaneg', tabBarManager.tabBarTab);
    setState({
      ...state,
      tabBarTab: tabBarManager.tabBarTab,
    });
  }, [tabBarManager]);

  usePageScroll(res => {//根据离顶部的距离判断是否开隐藏模式
    (res.scrollTop > SCROLL_TOP_THR) ?
      ((tabBarManager.horizontalBarMode == 'NORMAL') ?
        dispatch(actions.toggleHideMode('HIDED', 'HIDED', 'HIDED')) : null) :
      ((tabBarManager.horizontalBarMode == 'HIDED') ?
        dispatch(actions.toggleHideMode('NORMAL', 'NORMAL', 'NORMAL')) : null);
  })
  const judgeIfCurrentTab = (tabObj) => {
    let ifCurrentTab = false;
    let pages = getCurrentPages();
    // console.log('page:', pages);
    // var url = '/'.concat(pages[pages.length - 1].route);//*这里不能这样写，否则navigateto后从别的页返回时tabbar不会变色([0]才是最初的页面)
    var url = '/'.concat(pages[0].route);

    if (url == tabObj.url) {
      ifCurrentTab = true;
    }
    return ifCurrentTab;
  }
  const toggleMode = (way, mode = null) => {
    switch (way) {
      case 'HORIZONTAL_BAR'://横tabar模式
        let updatedMode = (mode === null) ?
          (tabBarManager.horizontalBarMode == 'HIDED' ? 'NORMAL' : 'HIDED') : mode
        dispatch(actions.toggleHideMode(updatedMode, updatedMode, updatedMode))

        // setState({
        //   ...state,
        //   horizontalBarMode: (mode === null) ?
        //     (tabBarManager.horizontalBarMode == 'HIDED' ? 'NORMAL' : 'HIDED') : mode,
        // });
        break;
      case 'VERTICAL_BAR'://竖tabbar模式
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


  const handleChangeTab = (it) => {//跳转页面
    dispatch(actions.toggleLoadingSpinner(false));

    // console.log('it', it);
    dispatch(actions.changeTabBarTab(it));
  }


  //handle touch
  const handleTouchStart = (e) => {
    setTouchMoveState({
      ...touchMoveState,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
    })
    //console.log('start', e);
  }
  // const handleTouchMove_1 = (e) => {
  //   endX = e.touches[0].clientX;
  //   endY = e.touches[0].clientY;
  //   let moveX = endX - startX;
  //   let moveY = endY - startY;
  //   //console.log('moveX', moveX);
  //   //console.log('moveY', moveY);
  //   if (state.verticalBarMode==='MODE_0') {
  //     setState({
  //       ...state,
  //       verticalBarMode: 'MODE_1',
  //     });
  //     return;
  //   }
  //   if (moveY < -10 && moveY > -240 && moveX < 50) {
  //     switch (true) {
  //       case (-40 > moveY && moveY > -90):
  //         setState({
  //           ...state,
  //           hoveredButtonIndex: 2
  //         });
  //         break;
  //       case (-40 > moveY && moveY > -180):
  //         setState({
  //           ...state,
  //           hoveredButtonIndex: 1
  //         });
  //         break;
  //       case (-40 > moveY && moveY > -240):
  //         setState({
  //           ...state,
  //           hoveredButtonIndex: 0
  //         });
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  //   else {
  //     setState({
  //       ...state,
  //       hoveredButtonIndex: null
  //     });
  //   }
  // }
  const handleTouchMove = (e) => {
    let endX = e.touches[0].clientX;
    let endY = e.touches[0].clientY;
    let moveX = endX - touchMoveState.startX;
    let moveY = endY - touchMoveState.startY;
    console.log('moveX', moveX);
    console.log('moveY', moveY);

    setTouchMoveState({
      ...touchMoveState,
      endX: endX,
      endY: endY,
      moveX: moveX,
      moveY: moveY,
    })


    if (moveX < 50) { //根据纵向移动的距离决定verticalBar的mode
      if (!(state.verticalBarMode === 'MODE_1')) {
        toggleMode('VERTICAL_BAR', 'MODE_1');
        return;  //* remember to 'return',or setState will not work in toggleMode() !!!!
      }
    } else {
      if (!(state.verticalBarMode === 'MODE_2')) {
        toggleMode('VERTICAL_BAR', 'MODE_2');
        return;
      }
    }

    if (state.verticalBarMode == 'MODE_1') {
      if (moveY < -20 && moveY > -420) {
        switch (true) {
          case (-30 > moveY && moveY > -100):
            setState({
              ...state,
              hoveredButtonIndex: 0
            });
            break;
          case (-30 > moveY && moveY > -180):
            setState({
              ...state,
              hoveredButtonIndex: 1
            });
            break;
          case (-30 > moveY && moveY > -260):
            setState({
              ...state,
              hoveredButtonIndex: 2
            });
            break;
          case (-30 > moveY && moveY > -340):
            setState({
              ...state,
              hoveredButtonIndex: 3
            });
            break;
          // case (-30 > moveY && moveY > -420):
          //   setState({
          //     ...state,
          //     hoveredButtonIndex: 4
          //   });
          //   break;
          default:
            setState({
              ...state,
              hoveredButtonIndex: null
            });
            break;
        }
      }
    } else {
      switch (true) {
        case (-30 > moveY && moveY > -100 &&
          50 < moveX && moveX < 60):
          setState({
            ...state,
            hoveredButtonIndex: 0
          });
          break;
        case (-100 > moveY && moveY > -180 &&
          50 < moveX && moveX < 80):
          setState({
            ...state,
            hoveredButtonIndex: 1
          });
          break;
        case (-180 > moveY && moveY > -260 &&
          50 < moveX && moveX < 140):
          setState({
            ...state,
            hoveredButtonIndex: 2
          });
          break;
        case (-260 > moveY && moveY > -340 &&
          50 < moveX && moveX < 200):
          setState({
            ...state,
            hoveredButtonIndex: 3
          });
          break;
        // case (-340 > moveY && moveY > -420 &&
        //   200 < moveX && moveX < 260):
        //   setState({
        //     ...state,
        //     hoveredButtonIndex: 4
        //   });
        //   break;
        default:
          setState({
            ...state,
            hoveredButtonIndex: null
          });
          break;
      }
    }
  }

  const handleTouchEnd = (e) => {
    if (Math.abs(touchMoveState.moveX) < 20 && Math.abs(touchMoveState.moveY < 20)) {//判断为点击
      console.log('clicliclili');
      toggleMode('HORIZONTAL_BAR')
      return
    }

    setState({
      ...state,
      verticalBarMode: 'MODE_0',
    });
    if (!(state.hoveredButtonIndex === null)) {
      handleChangeTab(verticalBarList[state.hoveredButtonIndex]);
    }
    //console.log('end', e); 
  }

  //横tabbar
  let horizontalBarList = props.mode == 'BUYER' ?
    tabBarList_buyer.slice(0) : tabBarList_seller.slice(0);
  let tabBarTabIndex = horizontalBarList.findIndex((it) => {
    return (it.id == state.tabBarTab.id);
  })
  let horizontalButtons = tabBarManager.horizontalBarMode === 'NORMAL' ?
    <View className='horizontal_bar'>
      <View className='buttons'>
        {horizontalBarList.map((it, i) => {
          return (
            <View className={'tab_bar_button'.concat(judgeIfCurrentTab(it) ?
              ' tab_bar_button_choosen' : '')}
              onClick={() => handleChangeTab(it)}
            >
              <View className={'at-icon at-icon-' + it.icon} />
              <View>{it.name}</View>
            </View>
            // <View
            //   className={'tab_bar_button'.concat(   //如果选的是第一个，则显示第二个被选中（因为第一个是切换mode的按钮
            //     ((tabBarTabIndex > 0) && (i == tabBarTabIndex)) ||
            //       ((tabBarTabIndex == 0) && (i == 1))
            //       ? ' tab_bar_button_choosen' : ''
            //   )}
            //   onClick={() => handleChangeTab(it)}
            // >
            //   {
            //     (i === 0) &&
            //     <View
            //       className='touch_box'
            //       onTouchStart={(e) => handleTouchStart(e)}
            //       onTouchMove={(e) => handleTouchMove_1(e)}
            //       onTouchEnd={(e) => handleTouchEnd(e)}
            //     />
            //   }
            //   <View className={'at-icon at-icon-' + it.icon} />
            //   <View>{it.name}</View>
            // </View>
          )
        })}
      </View>
    </View>
    :
    <View className='hide_mode'>
      <View className='horizontal_bar'
        onTouchStart={(e) => handleTouchStart(e)}
        onTouchMove={(e) => handleTouchMove(e)}
        onTouchEnd={(e) => handleTouchEnd(e)}
      />
    </View>
    ;


  //竖tabbar(隐藏模式下，上滑出现
  let verticalBarList = props.mode == 'BUYER' ?
    tabBarList_buyer.slice(0) : tabBarList_seller.slice(0);
  // let verticalBarList = [];
  // if (props.mode == 'BUYER') {
  //   verticalBarList = (tabBarManager.horizontalBarMode == 'NORMAL') ?
  //     tabBarList_seller.slice(1, -1) : tabBarList_buyer.slice(0);
  // } else {
  //   verticalBarList = (tabBarManager.horizontalBarMode == 'NORMAL') ?
  //     tabBarList_buyer.slice(1, -1) : tabBarList_seller.slice(0);
  // }
  let verticalButtons =
    // tabBarManager.horizontalBarMode == 'NORMAL' ?
    //   <View className='buttons_vertical'>
    //     {verticalBarList.map((it, i) => {
    //       return (
    //         <View
    //           className={'vertical_button '.concat(i == state.hoveredButtonIndex ?
    //             'tab_bar_hovered' : '')}
    //         >
    //           <View className={'at-icon at-icon-' + it.icon} />
    //           <View>{it.name}</View>
    //         </View>
    //       )
    //     })}
    //   </View> :
    state.verticalBarMode === 'MODE_0' ? null :
      (state.verticalBarMode === 'MODE_1' ?
        <View className='buttons_vertical_2'>
          {verticalBarList.map((it, i) => {
            return (
              <View
                className={i == state.hoveredButtonIndex ?
                  'vertical_button tab_bar_hovered' : 'vertical_button'}
              >
                <View className={'at-icon at-icon-' + it.icon} />
                <View>{it.name}</View>
              </View>
            )
          })}
        </View> :
        <View className='buttons_vertical_3'>
          {verticalBarList.map((it, i) => {
            return (
              <View
                className={'vertical_button curve_button_'.concat(i)
                  .concat(i == state.hoveredButtonIndex ? ' tab_bar_hovered' : '')}
              >
                <View className={'at-icon at-icon-' + it.icon} />
                <View>{it.name}</View>
              </View>
            )
          })}
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