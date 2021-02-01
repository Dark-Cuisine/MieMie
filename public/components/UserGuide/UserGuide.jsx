import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import * as actions from '../../redux/actions'
import classification from '../../public/classification'

import './UserGuide.scss'

const tabBarList_buyer = classification.tabBar.tabBarList_buyer;
const tabBarList_seller = classification.tabBar.tabBarList_seller;

const stepsLength = 8;//有多少条step


/****
 * <UserGuide
 * mode='SELLER'
 *  
 */
const UserGuide = (props) => {
  const dispatch = useDispatch();
  const publicManager = useSelector(state => state.publicManager);
  const layoutManager = useSelector(state => state.layoutManager);
  const initState = {
    currentStep: layoutManager.userGuideIndex,
    returnPage: layoutManager.userGuideReturnPage ? layoutManager.userGuideReturnPage :
      (props.mode === 'BUYER' ? tabBarList_buyer[1] : tabBarList_seller[1])
    ,

  }
  const [state, setState] = useState(initState);

  useEffect(() => {
    setState({
      ...state,
      currentStep: initState.currentStep,
      returnPage: initState.returnPage,
    });
  }, [publicManager])

  const handleNextStep = (i = null, e) => {
    e && e.stopPropagation();

    let step = (i === null) ? (state.currentStep + 1) : i;
    if (step > stepsLength) {
      step = null;
      props.handleFinish && props.handleFinish();
      dispatch(actions.changeTabBarTab(state.returnPage));
      wx.setStorage({
        key: 'ifShowUserGuide',
        data: false
      })
    };
    dispatch(actions.userGuideNextStep(step));
    if (props.mode === 'BUYER') {
      switch (step) {
        case 3:
          dispatch(actions.changeTabBarTab(tabBarList_buyer[1]));
          break;
        case 5:
          dispatch(actions.changeTabBarTab(tabBarList_buyer[0]));
          break;
        case 6:
          dispatch(actions.changeTabBarTab(tabBarList_buyer[2]));
          break;
        default:
          break;
      }
    } else {
      switch (step) {
        case 3:
          dispatch(actions.changeTabBarTab(tabBarList_seller[0]));
          break;
        case 4:
          dispatch(actions.changeTabBarTab(tabBarList_seller[1]));
          break;
        case 6:
          dispatch(actions.changeTabBarTab(tabBarList_seller[2]));
          break;
        default:
          break;
      }
    }

  }


  let step_1 = props.mode === 'BUYER' ? (
    <View className=''>
      <View className='title'> 欢迎使用咩咩摆摊。 </View>
      <View className=''>
        这是一个面向在日华人的拼单买菜、发布活动小程序。
    </View>
    </View>
  ) :
    <View className=''>
      <View className='title'> 欢迎使用咩咩摆摊-卖家版。 </View>
      <View className=''>
        这是一个面向在日华人的拼单买菜、发布活动小程序。
        你可以在这里摆摊售卖商品、发布活动。
    </View>
    </View>
    ;
  let step_2 = (
    <View className='box'>
      <View
        className='title'
        style={'color:var(--red-2);'}
      >
        使用前须知:
      </View>
      <View className=''>
        咩咩摆摊暂没开通线上支付功能，
  </View>
      <View className=''>
        接龙支付需要根据商家提供的账户自己去转账, 请买卖家双方注意交易安全。
      </View>
    </View>
  );
  let step_3 = props.mode === 'BUYER' ? (
    <View className=''>
      <View className='arrow'> ↑</View>
      <View className=''>
        这是逛摊页。
      </View>
      <View className=''>
        你可以在这里设置取货车站。
      </View>
      <View
        className='line_horizontal'
        style={'margin:10rpx 0;border-color: var(--gray-4);'}
      />
      <View className='words flex'>
        <View className=''>然后在这里选择取货的方式, 以此来匹配合适的店铺。</View>
        <View className='arrow'>→</View>
      </View>
    </View>
  ) :
    <View className=''>
      <View className=''>这是地摊页，</View>
      <View className=''>你可以在这里发布或管理自己的地摊。</View>
    </View>
    ;
  let step_4 = props.mode === 'BUYER' ? (
    <View className=''>
      <View className='arrow'> ↑</View>
      选择困难的时候可以试试点这个按钮随机抽选店铺。
    </View>
  ) :
    <View className=''>
      <View className=''>这是接龙处理页，</View>
      <View className=''>你可以在这里处理收到的接龙。</View>
    </View >
    ;
  let step_5 = props.mode === 'BUYER' ? (
    <View className=''>
      <View className=''>这是收藏页，</View>
      <View className=''>你可以在这里查看自己收藏的店铺。</View>
    </View >
  ) :
    <View className='flex items-center'>
      <View className=''>← </View>
      <View className=''>你可以左右滑动接龙实现快捷操作</View>
      <View className=''>→ </View>
    </View>
    ;
  let step_6 = props.mode === 'BUYER' ? (
    <View className=''>
      <View className=''>这是接龙页，</View>
      <View className=''>你可以在这里查看或管理接龙。</View>
    </View>
  ) :
    <View className=''>
      <View className=''>这是接龙管理页，</View>
      <View className=''>已确认接受的接龙会统一出现在这里以供管理。</View>
    </View>
  let step_7 = (
    <View className=''>
      <View className=''>
        如果在使用过程中有什么意见或建议, 请不要客气地在用户页-反馈中联系我。
</View>
      <View className=''>--咩咩集市市长猫草</View>
    </View>
  );
  let step_8 = (
    <View className=''>
      如有需要, 可以在用户页-使用指南中重新打开使用教程。
      <View className='arrow'> ↓ </View>
    </View>
  );


console.log('atep',state.currentStep);
  return (
    <View
      className='user_guide'
    >
      {state.currentStep < stepsLength &&
        <View
          className='at-icon at-icon-close-circle'
          onClick={(e) => handleNextStep(stepsLength, e)}
        />
      }
      {state.currentStep === null ||
        <View
          className={'content '.concat(props.mode === 'BUYER' ?
            'mode_buyer' : 'mode_seller')}
          onClick={() => handleNextStep()}
        >
          <View className={'step step_'.concat(state.currentStep)}>
            {state.currentStep === 1 && step_1}
            {state.currentStep === 2 && step_2}
            {state.currentStep === 3 && step_3}
            {state.currentStep === 4 && step_4}
            {state.currentStep === 5 && step_5}
            {state.currentStep === 6 && step_6}
            {state.currentStep === 7 && step_7}
            {state.currentStep === 8 && step_8}
            {state.currentStep < stepsLength &&
              <View className='step_footer'>
                ({state.currentStep}/{stepsLength})
                </View>
            }
          </View>
          {/* {state.currentStep < stepsLength &&//最后一步不显示mask *problem不知为何一加这个最后一步就消失了 */
            <View className='mask' />
          }
        </View>
      }
    </View>
  )
}
UserGuide.defaultProps = {
  mode: 'BUYER',//'BUYER','SELLER'
};

export default UserGuide;