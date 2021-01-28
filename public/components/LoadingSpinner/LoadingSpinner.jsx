import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image } from '@tarojs/components'
import gif from "../../resource/Animation/loadingSpinner.gif";
import './LoadingSpinner.scss'

const LoadingSpinner = () => {

  return (
    <View className='loading_spinner'>
      <Image
        className='image'
        src={gif} 
        />
    </View>
  )
}

export default LoadingSpinner;