import React, { Component, useState, useReducer, useImperativeHandle, forwardRef, useEffect, useContext } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtForm, AtCheckbox, AtTabs, AtTabsPane } from 'taro-ui'
import { Context } from '../../public/context'

import './MatchInput.scss'


const MATCHED_ITEM_HEIGHT = '47';//每条item的大约高度

/***
 * 联想匹配输入框
 * 
 * < MatchInput
    name='trainLineChooser'//AtInput标识，必须保证唯一
    title={<View>{props.title || null}</View>}
    type={props.type || 'text'}
    placeholder={props.placeholder || null}
    defaultInput=''
    allItemList={this.state.allTrainLinesList}
    handleSetItem={(item) => this.handleSetTrainLine.bind(this, item)}

    loadingWord={loadingWord}
   handleClickLoadingWord={()=>reLoad()}

    maxItem=10 

    ref={stationsMatchInputRef}//可用ref

    />
 */
const MatchInput = (props, ref) => {
  const initState = {
    allItemList: props.allItemList ? props.allItemList : [],//所有项目list
    matchedList: [],//匹配到的项目list
    input: props.defaultInput ? props.defaultInput : '',

    ifInputFocused: false,
    ifOpenMatchedList: false,

    maxItem: props.maxItem || 6,//list中一页最多显示的item数量

    startY: 0,
    moveY: 0,
  }

  const [state, setState] = useState(initState);


  useEffect(() => {
    // console.log('re_1');
    // console.log('initState.allItemList',initState.allItemList);
    if (!(props.allItemList)) { return }
    setState({
      ...state,
      allItemList: initState.allItemList,//*不然不会随props更新而更新！
      input: initState.input,
      matchedList: filterMachedItems(initState.allItemList, initState.input),
    });
  }, [props.allItemList, props.defaultInput])

  useImperativeHandle(ref, () => ({
    getState: () => {
      console.log('t-matci-state');
      return state
    },
  }));

  const filterMachedItems = (list, matchValue) => {//筛选符合匹配条件的items
    // console.log('filterMachedItems', list);
    let patt = props.patt ? props.patt :
      (new RegExp(matchValue, 'i'));// /input/i
    let matched = [];
    list && list.length > 0 && list.forEach((it) => {
      let index = it && it.search(patt);
      if (index > -1) {
        matched.push(it);
      }
    });
    return matched;
  }

  //input
  const handleFocus = () => {
    props.handleFocus && props.handleFocus();

    if (state.ifOpenMatchedList || state.ifInputFocused) {
      setState({
        ...state,
        ifInputFocused: true,
      });
      return
    }
    console.log('handleFocus');
    if (state.input && state.input.length < 1) {//*如果还没输入，则显示所有item
      setState({
        ...state,
        matchedList: props.allItemList,
        ifInputFocused: true,
        ifOpenMatchedList: true,
      })
    } else {
      setState({
        ...state,
        ifInputFocused: true,
        ifOpenMatchedList: true,
      })
    }
  }
  const handleChange = (v) => {//*注：每次调用onblur后会自动调用一次onchange
    if (state.ifInputFocused) {//未失焦（正在输入）
      setState({  //*一个函数只能调用一次setstate，否则前面一个会失效！！！！
        ...state,
        matchedList: filterMachedItems(props.allItemList, v),
        input: v,
      })
    } else {//已失焦

    }

  };
  const handleBlur = (way, e = null) => {
    // e && e.stopPropagation();
    console.log('handleBlur', e);
    switch (way) {
      case 'INPUT':
        setState({
          ...state,
          ifInputFocused: false,
        });
        break;
      case 'ALL':
        props.handleBlur && props.handleBlur();

        if (state.matchedList && state.matchedList.length == 1) {//失焦时有且只有一个匹配,则视为选中它
          handleSetItem(state.matchedList[0]);
        }
        else {//失焦时无匹配or有多个匹配,则初始化 
          setState({
            ...state,
            matchedList: initState.allItemList,
            input: '',
            ifInputFocused: false,
            ifOpenMatchedList: false,
          })
        }


        break;
      default:
        break;
    }

  }

  const handleTouchStart = (e) => {//拖动候选列表
    setState({
      ...state,
      startY: e.touches[0].clientY,
    });
  }
  const handleTouchMove = (e) => {
    e && e.stopPropagation();
    setState({
      ...state,
      moveY: e.touches[0].clientY - state.startY
    });
  }
  const handleTouchEnd = (it, e) => {//根据state.moveY绝对值判断是拖动还是点击
    // console.log('handleTouchEnd', e,state.moveY);
    if (Math.abs(state.moveY) < 10) {//绝对值
      handleSetItem(it)
    } else {
      setState({
        ...state,
        startY: 0,
        moveY: 0,
      });
    }
  }


  const handleSetItem = (item, e = null) => {
    //e && e.stopPropagation();
    console.log('match input-handleSetItem');
    setState({
      ...state,
      input: item,
      matchedList: filterMachedItems(props.allItemList, item),
      ifInputFocused: false,
      ifOpenMatchedList: false,
    });
    props.handleSetItem(item);
  }

  const handleClickLoadingWord = () => {//重新加载
    props.handleClickLoadingWord && props.handleClickLoadingWord()
  }

  let input = (
    <AtInput
      className='input'
      name={props.name}
      type={props.type || 'text'}
      focus={state.ifInputFocused}
      placeholder={props.placeholder || null}
      cursor={state.input && state.input.length}
      value={state.input}
      onFocus={handleFocus.bind(this)}
      onBlur={e => handleBlur('INPUT', e)}
      onChange={handleChange.bind(this)}
    />
  )

  let matchedList = (
    <scroll-view
      className='matched_list scroll-view-item'
      scroll-y="true"
      style={(state.matchedList && (state.matchedList.length > state.maxItem)) ?
        'height: '.concat((state.maxItem + 0.5) * MATCHED_ITEM_HEIGHT, 'rpx') : ''}
    >
      {props.loadingWord ?
        <View
          className='empty_word'
          onClick={() => handleClickLoadingWord()}
        >{props.loadingWord}</View> :
        (
          state.matchedList && state.matchedList.length > 0 ?
            state.matchedList.map((it, i) => {
              return (
                <View
                  key={i}
                  className='matched_item'
                  onTouchStart={e => handleTouchStart(e)}
                  onTouchMove={e => handleTouchMove(e)}
                  onTouchEnd={e => handleTouchEnd(it, e)}
                // onBlur={(e) => blur(e)}
                >
                  {it}
                </View>
              )
            }) :
            <View className='empty_word'>暂无匹配项目</View>
        )
      }
    </scroll-view>
  )

  return (
    <View className={'match_input '.concat(props.className ? props.className : '')}>
      {props.title && props.title.length > 0 &&
        <View className='title'>{props.title}</View>
      }
      {input}
      {state.ifOpenMatchedList && matchedList}
      {state.ifOpenMatchedList &&
        <View className='mask_transparent'
          onClick={(e) => handleBlur('ALL', e)}
        />
      }
    </View>
  )
}

export default forwardRef(MatchInput);




