import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import './MultipleChoiceButtonsBox.scss'

/**多选框
 * <MultipleChoiceButtonsBox
    itemList={showedKind}
    choosenList={state.choosenList}
    onChoose={this.props.handleClickShopKindsButton.bind(this, itemList)}
/>
 */
const MultipleChoiceButtonsBox = (props) => {
  const initState = {
    choosenList: props.choosenList ? props.choosenList : [],
  }
  const [state, setState] = useState(initState);

  useEffect(() => { //* props更新时子组件的state不会自动更新，如果不在这里刷新就会导致props.choosenList一直保持为初始值！！！！
    setState({
      ...state,
      choosenList: initState.choosenList
    });
  }, [props.choosenList])

  //console.log('choosenList',state.choosenList);
  const handleChooseItem = (it) => {
     let upadted = state.choosenList;
    let index = state.choosenList.indexOf(it);
    if (index > -1) {
      upadted.splice(index, 1)
    } else {
      upadted.push(it)
    }

    setState({
      ...state,
      choosenList: upadted
    });
    props.onChoose(upadted)
  }


  return (
    <View className={'multiple_choice_buttons_box '.concat(
      props.className?props.className:''
    )}>
      {props.itemList.map((it, i) => {
        return (
          <Button
            plain={true}
            className={(state.choosenList.indexOf(it) > -1) ? 'button choosen' : 'button unchoosen'}
            onClick={handleChooseItem.bind(this, it)}
            key={i}
          >
            {it}
          </Button>
        );
      })}
      {props.children}
    </View>)
}

export default MultipleChoiceButtonsBox;