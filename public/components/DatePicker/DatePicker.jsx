import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtCalendar, AtModal } from 'taro-ui'

import Dialog from '../../components/dialogs/Dialog/Dialog'
import './DatePicker.scss'

/****
 * <DatePicker
    currentDate={state.currentDate}
    minDate={props.minDate}
    validDates={state.validDates}
    handleClickDate={(date) => handleClickDate(date)}
>
</DatePicker>
 */
const DatePicker = (props) => {
  const initState = {
    isCalendarOpen: false,
  }
  const [state, setState] = useState(initState);

  useEffect(() => {
  }, [])

  const toggleCalendar = () => {
    setState({
      ...state,
      isCalendarOpen: !state.isCalendarOpen,
    });
  }
  const handleClickDate = (date) => {
    props.handleClickDate(date);
    toggleCalendar();
  }


  return (
    <View className={'date_picker '.concat(props.className)}>
      <Dialog
        isOpened={state.isCalendarOpen}
        onClose={() => toggleCalendar()}
      >
        <AtCalendar //注:套太多层时AtCalendar会报一堆套多一层非<text>元素的warning
          minDate={props.minDate}
          validDates={props.validDates}
          onDayClick={(v) => handleClickDate(v.value)}
          currentDate={props.currentDate}
        />
      </Dialog>
      <View
        className='toggle_button'
        onClick={() => toggleCalendar()}
      >
        <View className='at-icon at-icon-calendar' />
        <View className=''>{props.currentDate}</View>
      </View>
    </View>
  )
}

export default DatePicker;