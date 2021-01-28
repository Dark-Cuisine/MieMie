import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { connect } from 'react-redux'

import ShoppingCar from '../../ShoppingCar/ShoppingCar'

import * as actions from "../../../redux/actions";
import './LateralBar.scss'

/**
 * 侧边栏（放购物车
 * <LateralBar
    kind={this.props.lateralBarKind}  //0:不显示lateralBar, 1:ShoppingCar
/>
 */

class LateralBar extends Component {



    render() {
        let lateralBar = null;

        switch (this.props.kind) {
            case 0:
                break;
            case 1: {
                lateralBar = (
                    <ShoppingCar />
                )
            }
                break;

            default:
                break;
        }

        return (
            <View className='lateral_bar'>
                {lateralBar}
            </View>
        )
    }
}

export default LateralBar;
