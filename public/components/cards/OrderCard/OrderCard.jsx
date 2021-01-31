import React, { Component, useState, useReducer, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../../redux/actions'

import ActionButtons from '../../buttons/ActionButtons/ActionButtons'
import ActionDialog from '../../dialogs/ActionDialog/ActionDialog'
import Dialog from '../../dialogs/Dialog/Dialog'

const databaseFunction = require('../../../public/databaseFunction')

import './OrderCard.scss'

/**接龙卡，可左划右划（用于卖家管理接龙，或者客户查看接龙
 * 
 *  <OrderCard
    order={it} 
 
    ifShowAnnos={true}//是否显示annos

    ifToggleDetil={true}//是否可以展开-缩略
    detail={checkIfShowDetail(it._id)} //0:缩略模式, 1:全显示 ,2:最缩略模式

    buttonTextLeft='拒单'     //右下角的两个按钮
    buttonTextRight='接单'
    handleClickButtonLeft={this.handleRejectOrder.bind(this, it, i)}
    handleClickButtonRight={this.handleAcceptOrder.bind(this, it, i)}

    attentionTextLeft='左划拒单'    //左划右划
    attentionTextRight='右划接单'
 
    beforeLeftButtonText={'xxx?'}      //点击按钮执行handleClickButton前弹出的对话框
    beforeRightButtonText={'确定删除？'}
/>
 */

const SHOW_ATTENTION_TEXT_TH = 30;//左右划显示attentionText的阈值
const DO_ACTION_TH = 150;//左右划执行动作的阈值
const MOVE_ACTION_TH = 30;//左右划card位置移动的阈值


const OrderCard = (props) => {
  const dispatch = useDispatch();
  const userManager = useSelector(state => state.userManager);
  const initState = {
    order: props.order,
    annos: [],

    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    moveX: 0,
    attentionText: '',

    lastClickTime: null,

    openedDialog: null,//'LEFT','RIGHT'

    ifToggleDetil: ((props.ifToggleDetil === false) || (props.detail === 1)) ?
      false : true,
    detail: props.detail,

    mode: props.mode || 'BUYER',//'BUYER','SELLER'
  }
  const [state, setState] = useState(initState);



  useEffect(() => {//*useEffect好像不能定义为async!!!!
    console.log(props.order);
    if (props.order && props.ifShowAnnos) {
      updateAnnos(props.order)
    } else {
      setState({
        ...state,
        order: initState.order,
      });
      console.log('eff-no-anno');
    }
  }, [props.order])

  const updateAnnos = async (order) => {
    let annos = await databaseFunction.getOrderAnnos(order);
    setState({
      ...state,
      order: order,
      annos: annos
    });

  }

  const toggleDetail = () => {//handle toggle detail
    state.ifToggleDetil &&
      setState({
        ...state,
        detail: (state.detail == 1) ? //如不是全显示，则初始化为刚开始的detail
          initState.detail : 1
      });
  }

  const handleClickShopName = () => {//jump to inside shop page
    dispatch(actions.setCurrentShopId(state.order.shopId));
    Taro.navigateTo({
      url: '/pages/PublicPages/InsideShopPage/InsideShopPage',
    });
  }


  const handleClickButton = (way) => {//handle  button
    switch (way) {
      case 'LEFT':
        (props.beforeLeftButtonText) ?//判断是否打开dialog
          setState({
            ...state,
            openedDialog: 'LEFT',
          }) :
          props.handleClickButtonLeft()
        break;
      case 'RIGHT':
        (props.beforeRightButtonText) ?
          setState({
            ...state,
            openedDialog: 'RIGHT',
          }) :
          props.handleClickButtonRight()
        break;
      default:
        break;
    }
  }
  //dialog
  const handleSubmit = () => {
    setState({
      ...state,
      openedDialog: null,
    });
    (state.openedDialog === 'LEFT') ?
      props.handleClickButtonLeft() : props.handleClickButtonRight();
  }
  const handleCancel = () => {
    setState({
      ...state,
      openedDialog: null,
    });
  }


  //handle touch-move
  const handleTouchStart = (e) => {
    setState({
      ...state,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
    });
  }
  const handleTouchMove = (e) => {
    if (props.attentionTextRight || props.attentionTextLeft) {
      let moveX = e.touches[0].clientX - state.startX
      let attentionText = '';

      (moveX > SHOW_ATTENTION_TEXT_TH) &&
        (attentionText = props.attentionTextRight || '');//右移显示attentionTextLeft
      (moveX < -SHOW_ATTENTION_TEXT_TH) &&
        (attentionText = props.attentionTextLeft || '');//左移显示attentionTextLeft

      setState({
        ...state,
        endX: e.touches[0].clientX,
        endY: e.touches[0].clientY,
        moveX: moveX,
        attentionText: attentionText
      });
    }
  }
  const handleTouchEnd = () => {  //移动结束时判断是否执行动作
    if (state.moveX > DO_ACTION_TH) {
      console.log('-->');
      props.handleClickButtonRight && props.handleClickButtonRight();
    } else if (state.moveX < -DO_ACTION_TH) {
      console.log('<--');
      props.handleClickButtonLeft && props.handleClickButtonLeft();
    }

    setState({
      ...state,
      startX: initState.startX,
      startY: initState.startY,
      endX: initState.endX,
      endY: initState.endY,
      moveX: initState.moveX,
      attentionText: initState.attentionText,
    });
  }

  //copy oder_id
  const clickId = (e) => {
    let currentTime = e.timeStamp
    let gap = currentTime - state.lastClickTime
    if (gap > 0 && gap < 300) { // double click
      copyId(state.order._id)
    }
    setState({
      ...state,
      lastClickTime: currentTime
    });
  }
  const copyId = (id) => {
    console.log('copyId', id);
    wx.setClipboardData({
      data: id,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }

  //marks
  const checkIfMarked = (markNum) => {//*unfinished 现在只有一种mark
    let markedOrders = (userManager.userInfo.markedOrders && userManager.userInfo.markedOrders.markA) ?
      userManager.userInfo.markedOrders : { markA: [] };
    if (markedOrders.markA.length < 1) { return -1 }
    switch (markNum) {
      case 'A':
        return markedOrders.markA.indexOf(state.order._id)
        break;

      default:
        break;
    }

  }
  const markOrder = (e, markNum) => {
    e && e.stopPropagation();
    let index = checkIfMarked(markNum)

    dispatch(actions.handleMark('ORDER', userManager.unionid, state.order._id, index < 0))

  }

  let products = state.order && (
    <View className='products'>
      <View className=''>
        {state.order.productList && state.order.productList.map((item, index) => {//商品x数量
          return (
            <View
              key={index}
              className='item'
            >
              <View className='dot_small' />
              <View className='name'>
                {item.product.name}
              </View>
              {item.product.price}JPY x {item.quantity}
            </View>
          )
        })}
      </View>
      <View className='total_price'>
        总价: {String(state.order.totalPrice).toLocaleString()} JPY
       </View>
    </View>
  )


  let pickUpWay = null;
  if (state.order && state.order.pickUpWay) {
    switch (state.order.pickUpWay.way) {
      case 'SELF_PICK_UP':
        pickUpWay = (
          <View className='pick_up_way'>
            <View className='box'> 自提点 </View>
            {
              (state.detail === 1) ?
                <View className=''>
                  <View>{state.order.pickUpWay.place.place} </View>
                  {state.order.pickUpWay.place.placeDetail.length > 0 &&
                    <View>{state.order.pickUpWay.place.placeDetail} </View>
                  }
                </View> :
                <View className=''> ... </View>
            }
          </View>
        )
        break;
      case 'STATION_PICK_UP':
        pickUpWay = (
          <View className='pick_up_way'>
            <View className='box'> 车站取货 </View>
            {
              (state.detail === 1) ?
                <View className=''>
                  <View>{state.order.pickUpWay.place.station} ({state.order.pickUpWay.place.line}) </View>
                  {
                    state.order.pickUpWay.place.des && state.order.pickUpWay.place.des.length > 0 &&
                    <View>(备注:{state.order.pickUpWay.place.des})</View>
                  }
                </View> :
                <View className=''> ... </View>
            }
          </View>
        )
        break;
      case 'EXPRESS_PICK_UP':
        pickUpWay = (
          <View className='pick_up_way'>
            <View className='box'> 邮寄 </View>
            {
              (state.detail === 1) ?
                <View className=''>
                  <View>收件人: {state.order.pickUpWay.place.name} </View>
                  <View>联系电话: {state.order.pickUpWay.place.tel} </View>
                  <View>地址: {state.order.pickUpWay.place.address} </View>
                </View> :
                <View className=''> ... </View>
            }
          </View>
        )
        break;
      default:
        break;
    }
  }
  let actionDialog = (
    <ActionDialog
      isOpened={!(state.openedDialog === null)}
      type={0}
      onClose={() => handleCancel()}
      onCancel={() => handleCancel()}
      onSubmit={() => handleSubmit()}
    >
      {
        state.openedDialog === 'LEFT' ?
          props.beforeLeftButtonText : props.beforeRightButtonText
      }
    </ActionDialog>
  )

  // console.log('state.annos', state.annos);
  return (
    <View
      className='order_card'
    >
      {actionDialog}
      {state.detail == 2 && state.order &&
        <View
          className='card detail_2'
          onClick={() => toggleDetail()}
        >
          <View className='content'>
            {state.order.time &&
              <View className='order_time'>
                {state.order.time}
              </View>
            }
            <View
              className={'marks '.concat(//*unfinished 要加上更多marks
                (checkIfMarked('A') > -1) ? 'marked_1' : '')}
              onClick={(e) => markOrder(e, 1)}
            />
            {state.mode === 'SELLER' &&
              <View className='item buyer_name'>
                <View className='info_title'>买家: </View>
                <View className='info_content'>{state.order.buyerName}</View>
              </View>
            }
            {products}
            <View className='item'>
              <View className='info_title'>付款方式: </View>
              <View className='info_content flex '>
                <View className='box white_space'>
                  {state.order.paymentOption.option}
                </View>
                {state.order.paymentOption.des.length > 0 &&
                  <View className='break_all'>
                    (备注：{state.order.paymentOption.des})
                  </View>
                }
              </View>
            </View>
            {state.order.des && state.order.des.length > 0 &&
              <View className='item'>
                <View className='info_title'>备注: </View>
                <View className='info_content'> {state.order.des}</View>
              </View>
            }
          </View>
        </View>
      }
      {(state.detail == 0 || state.detail == 1) && state.order &&
        <View
          className='card'
          style={
            (Math.abs(state.moveX) > MOVE_ACTION_TH) &&
            'left:'.concat(state.moveX, 'px;').concat(
              (Math.abs(state.moveX) > DO_ACTION_TH) ? 'background:var(--light-0);' : ''
            )
          } //控制左右移动
        >
          <View className='attention_text center'>
            {state.attentionText}
          </View>
          <View className='header'>
            <View
              className='shop_name'
              onClick={() => handleClickShopName()}
            >
              {state.order.shopName}
            </View>
            {state.order._id &&
              <View className=''>
                <View
                  className='order_id'
                  selectable={true}
                  onClick={(e) => clickId(e)}
                  onLongPress={() => copyId(state.order._id)}
                >
                  <View className=''>单号:</View>
                  <View className='big'>{state.order._id.substring(0, 1)}</View>
                  <View className=''>{state.order._id.substring(1, state.order._id.length - 3)}</View>
                  <View className='big'>{state.order._id.substring(state.order._id.length - 3, state.order._id.length)}</View>
                </View>

              </View>
            }
          </View>
          {state.order.time &&
            <View className='order_time'>
              {state.order.time}
            </View>
          }

          <View
            className='content'
            onTouchStart={handleTouchStart.bind(this)}
            onTouchMove={handleTouchMove.bind(this)}
            onTouchEnd={handleTouchEnd.bind(this)}
            onClick={() => toggleDetail()}
          >
            {props.ifShowAnnos && state.annos && state.annos.length > 0 &&
              <View className='announcements'>
                <View className=''> 公告: </View>
                {state.annos.map((it, i) => {
                  return (
                    <View
                      key={i}
                      className='announcement'
                    >
                      {it}
                    </View>
                  )
                })}
              </View>
            }
            {products}
            <View className='info'>
              <View
                className={'marks '.concat(//*unfinished 要加上更多marks
                  (checkIfMarked('A') > -1) ? 'marked_1' : '')}
                onClick={(e) => markOrder(e, 1)}
              />
              {state.mode === 'SELLER' &&
                <View className='item'>
                  <View className='info_title'>买家: </View>
                  <View className='info_content'>{state.order.buyerName}</View>
                </View>
              }
              <View className='item'>
                <View className='info_title'>取货日期: </View>
                <View className='info_content box'> {state.order.pickUpWay.date}</View>
              </View>
              <View className='item'>
                <View className='info_title'>取货方式: </View>
                <View className='info_content'> {pickUpWay}</View>
              </View>
              <View className='item'>
                <View className='info_title'>付款方式: </View>
                <View className='info_content flex'>
                  <View className='box white_space'>
                    {state.order.paymentOption.option}
                  </View>
                  {state.order.paymentOption.des.length > 0 &&
                    <View className='break_all'>
                      (备注：{state.order.paymentOption.des})
                    </View>
                  }
                </View>
              </View>
              {state.order.des && state.order.des.length > 0 &&
                <View className='item'>
                  <View className='info_title'>备注: </View>
                  <View className='info_content'> {state.order.des}</View>
                </View>
              }
            </View>
            {props.children}
          </View>

          <View className={'footer '.concat(
            (state.detail === 0) ? 'footer_detail_0' : 'footer_detail_1'
          )}>
            <View className='status'>
              {state.order.status === 'UN_PURCHASE' && <View className='word color_2'>未提交接龙</View>}
              {state.order.status === 'UN_PROCESSED' && <View className='word color_2'>等待卖家处理</View>}
              {state.order.status === 'ACCEPTED' && <View className='word color_1'>已接单</View>}
              {state.order.status === 'REJECTED' && <View className='word color_3'>
                <View className='flex'>
                  被拒单
              {state.order.rejectedReason && <View className=''>- </View>}
                  <View className=''>
                    {state.order.rejectedReason &&
                      <View className=''>{state.order.rejectedReason.reason} </View>
                    }
                    {state.order.rejectedReason && state.order.rejectedReason.des.length > 0 &&
                      <View className='des'>({state.order.rejectedReason.des}) </View>
                    }
                  </View>
                </View>
              </View>
              }
              {state.order.status === 'FINISHED' && <View className='word color_1'>已完成</View>}
              {state.order.status === 'CANCELED' &&
                <View className='word color_2'>
                  <View className='flex'>
                    已取消
                {state.order.cancelReason && <View className=''>- </View>}
                    <View className=''>
                      {state.order.cancelReason &&
                        <View className=''>{state.order.cancelReason.reason} </View>
                      }
                      {state.order.cancelReason && state.order.cancelReason.des.length > 0 &&
                        <View className='des'>({state.order.cancelReason.des}) </View>
                      }
                    </View>
                  </View>
                </View>
              }
            </View>
            <View className='card_action_buttons'>
              <ActionButtons
                type={1}
                position={'RIGHT'}
                onClickLeftButton={handleClickButton.bind(this, 'LEFT')}
                onClickRightButton={handleClickButton.bind(this, 'RIGHT')}
                leftWord={props.buttonTextLeft && props.buttonTextLeft}
                rightWord={props.buttonTextRight && props.buttonTextRight}
              />
            </View>
          </View>
        </View>
      }
    </View>
  )
}
OrderCard.defaultProps = {
  detail: 1,
  ifShowAnnos: false,
};
export default OrderCard;