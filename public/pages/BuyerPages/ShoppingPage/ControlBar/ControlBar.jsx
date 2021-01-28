import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtIcon, AtCheckbox } from 'taro-ui'

import * as actions from "../../../../redux/actions";

import ShopKindChooser from './ShopKindChooser/ShopKindChooser'
import PickUpWayChooser from './PickUpWayChooser/PickUpWayChooser'
import LotteryDraw from '../LotteryDraw/LotteryDraw'

import './ControlBar.scss'
@connect(
    ({ shopsManager, userManager }) => ({
        shopsManager, userManager
    }),
)
class ControlBar extends Component {
    state = {
    }

    render() {
        return (
            <View className='control_bar'>
                <ShopKindChooser />
                <PickUpWayChooser />
            </View>
        )
    }
}

export default ControlBar;
