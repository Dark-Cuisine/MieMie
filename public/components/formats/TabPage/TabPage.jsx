import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import './TabPage.scss'

/****
 * <TabPage
 * tabList={[{ title: 'a' }, { title: 'b' }]}
 * currentTab={}
 * onClick={i=>handleClickTab(i)}
 * 
 * ifScrollToTop={true}  //切换tab时是否回到顶部
 */
const TabPage = (props) => {
  const initState = {

  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])

  const handleClickTabTitle = (i) => {
    props.onClick(i)
    props.ifScrollToTop &&
      wx.pageScrollTo({//切换tab时回到顶部
        scrollTop: 0,
        duration: 50
      })
  }

  return (
    <View className={'tab_page '.concat(props.className)}>
      <View className='tab_titles'>
        {
          props.tabList.map((it, i) => {
            return (
              <View
                key={i}
                className={'title title_'.concat(i).concat(
                  (i === props.currentTab) ? ' selected' : ''
                )}
                onClick={() => handleClickTabTitle(i)}
              >
                <View>
                  {it.title}
                </View>
              </View>
            )
          })
        }
      </View>
      <View className='tab_titles_place_holder' />
      {props.children &&
        <scroll-view
          className='tab_content'
          scroll-y="true"
        >
          {props.children}
        </scroll-view>
      }
    </View>
  )
}

TabPage.defaultProps = {
  currentTab: 0,
  ifScrollToTop: false,
};

export default TabPage;