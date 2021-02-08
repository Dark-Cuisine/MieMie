import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import { connect } from 'react-redux'
import * as actions from '../../../../../redux/actions'

import './ShopKindChooser.scss'


const app = getApp()
const db = wx.cloud.database();
const _ = db.command;

@connect(
  ({ shopsManager }) => ({
    shopsManager
  }),
  (dispatch) => ({
    filterShops(option, shopKind, pickUpWay, stations, classifications) {
      dispatch(actions.filterShops(option, shopKind, pickUpWay, stations, classifications));
    }
  }),
)
class ShopKindChooser extends Component {
  classifications = app.$app.globalData.classifications
  shopKindLarge = this.classifications.shopKinds.shopKindLarge;
  shopKindSmall = this.classifications.shopKinds.shopKindSmall;
  initState = {
    currentKind: {
      shopKindLarge: this.shopKindLarge[0],//默认为'所有'
      shopKindSmall: [this.shopKindSmall[0].shopKindSmall[0]],
    },

    currentList: null,//'LARGE_KIND','SMALL_KIND'
    hoveredKindIndex: null,
  }
  state = this.initState;


  handleSetShopKind = (largeKind, smallKind = this.state.currentKind.smallKind) => {//设置当前分类,筛选
    let kind = {
      shopKindLarge: largeKind,
      shopKindSmall: smallKind,
    };
    this.setState({
      ...this.state,
      currentKind: kind,
      hoveredKindIndex: null,
      currentList: null,
    });
    this.props.filterShops('SHOP_KIND',
      kind, this.props.shopsManager.filterOptions.pickUpWay, this.props.shopsManager.filterOptions.stations,
      app.$app.globalData.classifications);

    // console.log('handleSetShopKind', largeKind, smallKind);
  }


  toggleShowList = (way) => {//打开关闭buttonList//'LARGE_KIND','SMALL_KIND'
    this.setState({
      ...this.state,
      currentList: way,
    });
  }

  handleTouchStart = (touchedButton, e) => {//touchedButton:'LARGE_KIND','SMALL_KIND'
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;

    this.setState({
      ...this.state,
      currentList: touchedButton
    });
    // console.log('start', e);
  }
  handleTouchMove = (e) => {
    this.endX = e.touches[0].clientX;
    this.endY = e.touches[0].clientY;
    let moveDistanceX = this.endX - this.startX;
    let moveDistanceY = this.endY - this.startY;
    //console.log('moveDistanceX', moveDistanceX);
    //console.log('moveDistanceY', moveDistanceY);
    // console.log('move', e);

    if (moveDistanceY > 10 && moveDistanceY < 250 && moveDistanceX < 50) {
      this.state.currentList == 'LARGE_KIND' || this.toggleShowList('LARGE_KIND');
      this.state.currentList == 'SMALL_KIND' || this.toggleShowList('SMALL_KIND');

      switch (true) {
        case (moveDistanceY < 50):
          this.setState({
            ...this.state,
            hoveredKindIndex: 0
          });
          break;
        case (moveDistanceY < 90):
          this.setState({
            ...this.state,
            hoveredKindIndex: 1
          });
          break;
        case (moveDistanceY < 130):
          this.setState({
            ...this.state,
            hoveredKindIndex: 2
          });
          break;
        case (moveDistanceY < 170):
          this.setState({
            ...this.state,
            hoveredKindIndex: 3
          });
          break;
        case (moveDistanceY < 210):
          this.setState({
            ...this.state,
            hoveredKindIndex: 4
          });
          break;
        case (moveDistanceY < 250):
          this.setState({
            ...this.state,
            hoveredKindIndex: 5
          });
          break;
        default:
          break;
      }
    }
    else {
      this.setState({
        ...this.state,
        hoveredKindIndex: null,
        currentList: null,
      });
    }

  }
  handleTouchEnd = (e) => {
    if (!(this.state.hoveredKindIndex === null)) {
      if (this.state.currentList == 'LARGE_KIND') {
        this.state.hoveredKindIndex < this.shopKindLarge.length ?
          this.handleSetShopKind(this.shopKindLarge[this.state.hoveredKindIndex], this.initState.currentKind.shopKindSmall) :
          this.setState({
            ...this.state,
            hoveredKindIndex: null,
            currentList: null,
          });
      } else if (this.state.currentList == 'SMALL_KIND') {
        let smallKindIndex = this.shopKindSmall.findIndex((it) => {//* can't use indexOf here!!!!
          return (it.shopKindLarge == this.state.currentKind.shopKindLarge)
        });
        let smallKindList = (smallKindIndex > -1) ? this.shopKindSmall[smallKindIndex].shopKindSmall : [];
        this.state.hoveredKindIndex < smallKindList.length ?
          this.handleSetShopKind(this.state.currentKind.shopKindLarge, smallKindList[this.state.hoveredKindIndex]) :
          this.setState({
            ...this.state,
            hoveredKindIndex: null,
            currentList: null,
          });
      }
    }

  }

  render() {
    //大分类
    let largeKindButton = (
      <View className='large_kind shop_kind'>
        <View
          ref='currentLargeKindButton'
          className='current_button'
          onClick={() => this.toggleShowList('LARGE_KIND')}
          onTouchStart={(e) => this.handleTouchStart('LARGE_KIND', e)}
          onTouchMove={(e) => this.handleTouchMove(e)}
          onTouchEnd={(e) => this.handleTouchEnd(e)}
        >
          {this.state.currentKind.shopKindLarge}
        </View>
        <View
          ref='shopKindButtonList'
          className='button_list '
        >
          {(this.state.currentList === 'LARGE_KIND') && this.shopKindLarge.map((it, i) => {
            return (
              <View
                ref={'largeKindButton_' + i}
                className={((this.state.currentList === 'LARGE_KIND') && (i == this.state.hoveredKindIndex)) ? 'button button_choosen' : 'button'}
                key={i}
                onClick={this.handleSetShopKind.bind(this, it, this.initState.currentKind.shopKindSmall)}
              >
                {it}
              </View>
            )
          })}
        </View> </View>
    );

    //小分类
    let smallKindIndex = this.shopKindSmall.findIndex((it) => {
      return (it.shopKindLarge == this.state.currentKind.shopKindLarge)
    });
    let smallKindList = (smallKindIndex > -1) ? this.shopKindSmall[smallKindIndex].shopKindSmall : [];
    let smallKindButton = (
      <View className='small_kind shop_kind'>
        <View
          className='current_button'
          onClick={() => this.toggleShowList('SMALL_KIND')}
          onTouchStart={(e) => this.handleTouchStart('SMALL_KIND', e)}
          onTouchMove={(e) => this.handleTouchMove(e)}
          onTouchEnd={(e) => this.handleTouchEnd(e)}
        >
          {smallKindList.length > 0 && this.state.currentKind.shopKindSmall}
        </View>
        {
          !(this.state.currentKind.shopKindLarge == this.shopKindLarge[0]) &&
          smallKindList.length > 0 && (
            <View
              ref='smallKindButtons'
              className='button_list'
            >
              {(this.state.currentList == 'SMALL_KIND') && smallKindList.map((it, i) => {
                return (
                  <View
                    ref={'smallKindButton_' + i}
                    className={((this.state.currentList === 'SMALL_KIND') && (i == this.state.hoveredKindIndex)) ? 'button button_choosen' : 'button'}
                    key={i}
                    onClick={this.handleSetShopKind.bind(this, this.state.currentKind.shopKindLarge, it)}
                  >
                    {it}
                  </View>
                )
              })}
            </View>
          )
        }
      </View>
    );

    return (
      <View className='shop_kind_chooser'>
        {largeKindButton}
        {smallKindButton}
        {!(this.state.currentList === null) &&
          <View className='mask_transparent'
            onClick={() => this.toggleShowList(null)}
          />}
      </View>
    )
  }
}

export default ShopKindChooser;