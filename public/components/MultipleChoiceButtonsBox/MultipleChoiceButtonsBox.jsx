import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import ActionDialog from '../dialogs/ActionDialog/ActionDialog'

import './MultipleChoiceButtonsBox.scss'

/**多选框
 * <MultipleChoiceButtonsBox
    itemList={showedKind} //[{index:'',name:''}]
    choosenList={state.choosenList}
    onChoose={this.props.handleClickShopKindsButton.bind(this, itemList)}

    isDeletable={true}
    />
 */
const MultipleChoiceButtonsBox = (props) => {
  const initState = {
    choosenList: props.choosenList ? props.choosenList : [],

    openedDialog: null,//'DELET’
    currentIndex: null,
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
    let index = state.choosenList.findIndex((item, i) => {
      return item.index == it.index
    });
    if (index > -1) {
      upadted.splice(index, 1)
    } else {
      upadted.push(it)
    }
    setState({
      ...state,
      choosenList: upadted
    });

    // console.log('p-itemList', props.itemList);
    // console.log('p-choosenList', state.choosenList);
    props.onChoose(upadted)
  }

  const toggleDialog = (e, dialog = null, i = null) => {
    e && e.stopPropagation();

    setState({
      ...state,
      openedDialog: dialog,
      currentIndex: i,
    });
  }
  const handleInit = () => {
    setState({
      ...state,
      openedDialog: null,
      currentIndex: null,
    });

  }
  const handleSubmit = (way) => {
    switch (way) {
      case 'DELETE':
        props.handleDelete(state.currentIndex)
        handleInit()
        break;
      case '':
        break;
      default:
        break;
    }
  }
  let deleteDialog = (
    <ActionDialog
      type={1}
      isOpened={state.openedDialog === 'DELETE'}
      onClose={() => toggleDialog()}
      onCancel={() => handleInit()}
      onSubmit={() => handleSubmit('DELETE')}
      cancelText='取消'
      confirmText='确认'
    >确定删除？</ActionDialog>
  );
  return (
    <View className={'multiple_choice_buttons_box '.concat(
      props.className ? props.className : ''
    )}>
      {deleteDialog}
      {props.itemList.map((it, i) => {
        return (
          <View className='position_relative'>
            {props.isDeletable &&
              <View
                className='at-icon at-icon-close-circle'
                onClick={(e) => toggleDialog(e, 'DELETE', i)}
              />
            }
            <View
              className={'mie_button '.concat(
                (state.choosenList.findIndex((item) => { return (item.index == it.index) }) > -1) ?
                'mie_button_choosen' : '')}
              onClick={handleChooseItem.bind(this, it)}
              key={i}
            >
              {it.name}
            </View>
          </View>

        );
      })}
      {props.children}
    </View>
  )
}
MultipleChoiceButtonsBox.defaultProps = {
  isDeletable: false,
};

export default MultipleChoiceButtonsBox;