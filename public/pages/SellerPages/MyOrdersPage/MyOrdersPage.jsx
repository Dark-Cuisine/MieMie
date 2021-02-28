import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtIcon, AtTextarea, AtInput } from 'taro-ui'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actions/index'

import ActionDialog from '../../../components/dialogs/ActionDialog/ActionDialog'
import Dialog from '../../../components/dialogs/Dialog/Dialog'
import SearchBar from '../../../components/SearchBar/SearchBar'
import TabPage from '../../../components/formats/TabPage/TabPage'
import ActionButtons from '../../../components/buttons/ActionButtons/ActionButtons'
import Layout from '../../../components/Layout/Layout'
import OrderCard from '../../../components/cards/OrderCard/OrderCard'

import * as databaseFunctions from '../../../utils/functions/databaseFunctions'

import './MyOrdersPage.scss'


const db = wx.cloud.database();
const _ = db.command

const rejectOrderReasons = ['缺货', '日期不合适', '其他']

@connect(
  ({ userManager, publicManager, layoutManager }) => ({
    userManager, publicManager, layoutManager
  }),
  (dispatch) => ({
    toggleLoadingSpinner(ifOpen) {
      dispatch(actions.toggleLoadingSpinner(ifOpen))
    },
  })
)

/**
 * 管理接收的订单
 */
class MyOrdersPage extends Component {

  initState = {
    myShops: [],

    ordersReceived: {
      allOrders: [],

      unProcessed: [],
      processed: {
        accepted: [],
        rejected: [],
        finished: []
      }
    },

    rejectReason: {
      reason: '',
      des: ''
    },

    currentOrderIndex: null,

    isRejectOrderDialogOpen: false,
    isRejectFromAcceptedDialogOpen: false,
    isAcceptFromRejectedDialogOpen: false,
    isFinishOrderDialogOpen: false,

    currentTab: 0,

    isSearching: false,
    searchedOrders: [],


  }

  state = this.initState;

  onPullDownRefresh() {
    console.log('onPullDownRefresh');
    this.doUpdate();
    Taro.stopPullDownRefresh()
  }
  componentDidMount() {
    this.doUpdate();
  }
  componentWillReceiveProps(nextProps) {
    const app = getApp()
    //  console.log('abab-nextProps,nextProps', nextProps.userManager, 'thisprops', this.props.userManager);
    if (!(nextProps.userManager.unionid == this.props.userManager.unionid) ||
      (!(nextProps.layoutManager.currentTabId == this.props.layoutManager.currentTabId) &&
        (nextProps.layoutManager.currentTabId == app.$app.globalData.classifications.tabBar.tabBarList_seller[1].id))
    ) {
      // console.log('abab-1');
      this.doUpdate(nextProps);
    }
  }

  doUpdate(props = this.props) {
    console.log('update-myorders', props.userManager);
    if (!(props.userManager.unionid && props.userManager.unionid.length > 0 &&
      props.userManager.userInfo)) { return }

    props.toggleLoadingSpinner(true);
    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'shops',

        operatedItem: '_ID',
        queriedList: props.userManager.userInfo.myShops,
        // queryTerm: { shopInfo: { ownerId: this.props.userManager.unionid } },
      },
      success: (res) => {
        console.log('asasasasa', res);
        if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
          props.toggleLoadingSpinner(false);
          return
        }
        let myShops = res.result.data;
        let orderIdList = [];
        myShops.forEach(shop => {
          (shop.orders && shop.orders.length > 0) &&
            orderIdList.push(...shop.orders)
        });
        let allOrders = [];
        let unProcessed = [];
        let accepted = [];
        let rejected = [];
        let finished = [];
        if (orderIdList.length > 0) {
          wx.cloud.callFunction({
            name: 'get_data',
            data: {
              collection: 'orders',
              operatedItem: '_ID',
              orderBy: 'createTime',//根据时间排序
              desc: 'asc',//新后旧前
              queriedList: orderIdList,
            },
            success: (r) => {
              // console.log('rerearaecsgsdrvgyrbhd', r);
              if (!(r && r.result && r.result.data && r.result.data.length > 0)) {
                props.toggleLoadingSpinner(false);
                return
              }
              allOrders = r.result.data;
              r.result.data.forEach((item) => {
                switch (item.status) {
                  case 'UN_PROCESSED':
                    unProcessed.push(item);
                    break;
                  case 'ACCEPTED':
                    accepted.push(item);
                    break;
                  case 'REJECTED':
                    rejected.push(item);
                    break;
                  case 'FINISHED':
                  case 'CANCELED':
                    finished.push(item);
                    break;
                  default:
                    break;
                }
              });
              this.setState({//*注：must setState inside .then() or it will get empty []!
                ...this.state,
                myShops: myShops,
                ordersReceived: {
                  ...this.state.ordersReceived,
                  allOrders: allOrders,
                  unProcessed: unProcessed,
                  processed: {
                    ...this.state.ordersReceived.processed,
                    accepted: accepted,
                    rejected: rejected,
                    finished: finished
                  }
                }
              });
            },
            fail: () => {
              wx.showToast({
                title: '获取orders数据失败',
                icon: 'none'
              })
              console.error
            }
          });
        }
        props.toggleLoadingSpinner(false);
      },
      fail: () => {
        wx.showToast({
          title: '获取shops数据失败',
          icon: 'none'
        })
        props.toggleLoadingSpinner(false);
      }
    });


  }

  handleToggleTab = (i) => { //切换tab页
    this.setState({
      ...this.state,
      currentTab: i
    });
  }


  sengOrderMsg = async (type, order) => {
    let title = '';
    let content = '';
    switch (type) {
      case 'ORDER_ACCEPTED':
        title = '摊主已接单';
        content = '您的订单' + order._id + '已被接单。';
        break;
      case 'ORDER_REJECTED':
        title = '您有一个订单被拒';
        content = '您的订单' + order._id + '已被拒单。' + '\n拒单原因-' + order.rejectedReason.reason +
          ((order.rejectedReason.des.length > 0) && (' : ' + order.rejectedReason.des));
        break;
      case 'ORDER_FINISHED':
        title = '摊主已完成订单';
        content = '您的订单' + order._id + '已被摊主完成。';
        break;

      default:
        break;
    }

    let msg = {
      from: {
        unionid: this.props.userManager.unionid,
        nickName: this.props.userManager.userInfo.nickName,
      },
      to: {
        unionid: order.buyerId,
      },
      type: type,
      title: title,
      content: content,
    }
    await databaseFunctions.msg_functions.sendMessage(msg, this.props.userManager.unionid);
    dispatch(actions.setUser(userManager.unionid, userManager.openid));//更新用户信息
  }

  handleChangeInput = (way, v) => {
    switch (way) {
      case 'REJECT_REASON':
        this.setState({
          ...this.state,
          rejectReason: {
            ...this.state.rejectReason,
            reason: v,
          }
        });
        break;
      case 'REJECT_REASON_DES':
        this.setState({
          ...this.state,
          rejectReason: {
            ...this.state.rejectReason,
            des: v,
          }
        });
        break;
      case '':

        break;
      default:
        break;
    }
  }

  handleBeforeSubmit = (way, i = null) => {
    switch (way) {
      case 'REJECT':
        this.setState({
          ...this.state,
          currentOrderIndex: i,
          isRejectOrderDialogOpen: true
        });
        break;
      case 'FINISH':
        this.setState({
          ...this.state,
          currentOrderIndex: i,
          isFinishOrderDialogOpen: true
        });
        break;
      case 'REJECT_FROM_ACCEPTED':
        this.setState({
          ...this.state,
          currentOrderIndex: i,
          isRejectFromAcceptedDialogOpen: true
        });
        break;
      case 'ACCEPT_FROM_REJECTED':
        this.setState({
          ...this.state,
          currentOrderIndex: i,
          isAcceptFromRejectedDialogOpen: true
        });
        break;
      default:
        break;
    }
  }

  handleSubmit = async (way, i = null) => {
    let c1 = new wx.cloud.Cloud({//*不知为何云函数update不了
      resourceAppid: 'wx8d82d7c90a0b3eda',
      resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
    })

    await c1.init({
      secretId: 'AKIDwiHc09xCF3cwDFrESWOHxNZXLCfvRL2W',
      secretKey: 'XZfka5K83yeKnAcBCShS4SgS3cBXfXBs',
      env: 'miemie-buyer-7gemmgzh05a6c577'
    })
    let db_1 = c1.database({
      env: 'miemie-buyer-7gemmgzh05a6c577'
    });

    let updated_1 = null;
    let updated_2 = null;
    let order = null;
    let updatedOrder = null;
    let index = (i === null) ? this.state.currentOrderIndex : i;
    switch (way) {
      case 'ACCEPT_FROM_UNPROCESSED':
        updated_1 = this.state.ordersReceived.unProcessed;
        updated_2 = this.state.ordersReceived.processed.accepted;
        order = this.state.ordersReceived.unProcessed[index];

        if (!(order && order._id && order._id.length > 0)) { return }

        updated_1.splice(index, 1);
        updated_2.push({
          ...order,
          status: 'ACCEPTED',
        });

        this.setState({
          ...this.state,
          ordersReceived: {
            ...this.state.ordersReceived,
            unProcessed: updated_1,
            processed: {
              ...this.state.ordersReceived.processed,
              accepted: updated_2,
            }
          }
        });

        // wx.cloud.callFunction({//*problem不知为何云函数update不了
        //   name: 'update_data',
        //   data: {
        //     collection: 'users',
        //     queryTerm: {
        //       _id: order._id
        //     },
        //     updateData: {status: 'ACCEPTED'},
        //   },
        //   success: (res) => { 
        //     console.log('update_data-ACCEPTED',res);
        //   },
        //   fail: console.error
        // });


        db_1.collection('orders').where({
          _id: order._id
        }).update({
          data: {
            status: 'ACCEPTED'
          }
        });

        this.sengOrderMsg('ORDER_ACCEPTED', order);

        break;
      case 'ACCEPT_FROM_REJECTED':
        updated_1 = this.state.ordersReceived.processed.rejected;
        updated_2 = this.state.ordersReceived.processed.accepted;
        order = this.state.ordersReceived.processed.rejected[index];

        if (!(order && order._id && order._id.length > 0)) { return }

        updated_1.splice(index, 1);
        updated_2.push({
          ...order,
          status: 'ACCEPTED',
        });

        this.setState({
          ...this.state,
          ordersReceived: {
            ...this.state.ordersReceived,
            processed: {
              ...this.state.ordersReceived.processed,
              accepted: updated_2,
              rejected: updated_1,
            }
          },
          isAcceptFromRejectedDialogOpen: false,
        });

        // wx.cloud.callFunction({
        //   name: 'update_data',
        //   data: {
        //     collection: 'users',
        //     queryTerm: { _id: order._id },
        //     updateData: { status: 'ACCEPTED' }
        //   },
        //   success: (res) => {
        //   },
        //   fail: console.error
        // });
        db_1.collection('orders').where({
          _id: order._id
        }).update({
          data: {
            status: 'ACCEPTED'
          }
        });

        order.productList.forEach((it) => {
          !(it.product.stock === null) &&
            wx.cloud.callFunction({//减回库存
              name: 'inc_data',
              data: {
                collection: 'products',
                queryTerm: {
                  _id: it.product._id
                },
                operatedItem: 'STOCK',
                incNum: Number(-it.quantity),
              },
              success: (res) => { },
              fail: () => {
                wx.showToast({
                  title: '减少商品库存失败',
                  icon: 'none'
                })
                console.error
              }
            });

        })
        this.sengOrderMsg('ORDER_ACCEPTED', order);
        break;
      case 'REJECT_FROM_UNPROCESSED':
        updated_1 = this.state.ordersReceived.unProcessed;
        updated_2 = this.state.ordersReceived.processed.rejected;
        order = this.state.ordersReceived.unProcessed[index];

        if (!(order && order._id && order._id.length > 0)) { return }

        updated_1.splice(index, 1);
        updated_2.push({
          ...order,
          status: 'REJECTED',
        });

        this.setState({
          ...this.state,
          ordersReceived: {
            ...this.state.ordersReceived,
            unProcessed: updated_1,
            processed: {
              ...this.state.ordersReceived.processed,
              rejected: updated_2,
            }
          },
          isRejectOrderDialogOpen: false,
        });

        updatedOrder = {
          ...order,
          status: 'REJECTED',
          rejectedReason: this.state.rejectReason,
        }

        // wx.cloud.callFunction({
        //   name: 'update_data',
        //   data: {
        //     collection: 'users',
        //     queryTerm: { _id: order._id },
        //     updateData: {
        //       status: 'REJECTED',
        //       rejectedReason: this.state.rejectReason,
        //     }
        //   },
        //   success: (res) => {
        //   },
        //   fail: console.error
        // });
        db_1.collection('orders').where({
          _id: order._id
        }).update({
          data: {
            status: 'REJECTED',
            rejectedReason: this.state.rejectReason,
          }
        });

        order.productList.forEach((it) => {
          !(it.product.stock === null) &&
            wx.cloud.callFunction({//加回库存
              name: 'inc_data',
              data: {
                collection: 'products',
                queryTerm: {
                  _id: it.product._id
                },
                operatedItem: 'STOCK',
                incNum: Number(it.quantity),
              },
              success: (res) => { },
              fail: () => {
                wx.showToast({
                  title: '加回商品库存失败',
                  icon: 'none'
                })
                console.error
              }
            });
          // db.collection('products').where({//加回库存
          //   _id: it.product._id
          // }).update({
          //   data: {
          //     stock: _.inc(Number(it.quantity))
          //   }
          // });
        })
        this.sengOrderMsg('ORDER_REJECTED', updatedOrder);
        break;
      case 'REJECT_FROM_ACCEPTED':
        updated_1 = this.state.ordersReceived.processed.accepted;
        updated_2 = this.state.ordersReceived.processed.rejected;
        order = updated_1[index];

        if (!(order && order._id && order._id.length > 0)) { return }

        updated_1.splice(index, 1);
        updated_2.push({
          ...order,
          status: 'REJECTED',
          rejectedReason: this.state.rejectReason,
        });

        this.setState({
          ...this.state,
          ordersReceived: {
            ...this.state.ordersReceived,
            processed: {
              ...this.state.ordersReceived.processed,
              accepted: updated_1,
              rejected: updated_2,
            }
          },
          isRejectFromAcceptedDialogOpen: false,

        });

        updatedOrder = {
          ...order,
          status: 'REJECTED',
          rejectedReason: this.state.rejectReason,
        }

        // wx.cloud.callFunction({
        //   name: 'update_data',
        //   data: {
        //     collection: 'users',
        //     queryTerm: { _id: order._id },
        //     updateData: {
        //       status: 'REJECTED',
        //       rejectedReason: this.state.rejectReason,
        //     }
        //   },
        //   success: (res) => {
        //   },
        //   fail: console.error
        // });
        db_1.collection('orders').where({
          _id: order._id
        }).update({
          data: {
            status: 'REJECTED',
            rejectedReason: this.state.rejectReason,
          }
        });

        order && order.productList &&
          order.productList.forEach((it) => {
            !(it.product.stock === null) &&
              wx.cloud.callFunction({//加回库存
                name: 'inc_data',
                data: {
                  collection: 'products',
                  queryTerm: {
                    _id: it.product._id
                  },
                  operatedItem: 'STOCK',
                  incNum: Number(it.quantity),
                },
                success: (res) => { },
                fail: () => {
                  wx.showToast({
                    title: '加回商品库存失败',
                    icon: 'none'
                  })
                  console.error
                }
              });
            // db.collection('products').where({//加回库存
            //   _id: it.product._id
            // }).update({
            //   data: {
            //     stock: _.inc(Number(it.quantity))
            //   }
            // });
          })
        this.sengOrderMsg('ORDER_REJECTED', updatedOrder);
        break;
      case 'FINISH':
        updated_1 = this.state.ordersReceived.processed.accepted;
        updated_2 = this.state.ordersReceived.processed.finished;
        order = this.state.ordersReceived.processed.accepted[index];

        if (!(order && order._id && order._id.length > 0)) { return }

        updated_1.splice(index, 1);
        updated_2.push({
          ...order,
          status: 'FINISHED',
        });

        this.setState({
          ...this.state,
          ordersReceived: {
            ...this.state.ordersReceived,
            processed: {
              ...this.state.ordersReceived.processed,
              accepted: updated_1,
              finished: updated_2,
            }
          },
          isFinishOrderDialogOpen: false,

        });

        // wx.cloud.callFunction({
        //   name: 'update_data',
        //   data: {
        //     collection: 'users',
        //     queryTerm: { _id: order._id },
        //     updateData: { status: 'FINISHED' }
        //   },
        //   success: (res) => {
        //   },
        //   fail: console.error
        // });
        db_1.collection('orders').where({
          _id: order._id
        }).update({
          data: {
            status: 'FINISHED'
          }
        });

        this.sengOrderMsg('ORDER_FINISHED', order);
        break;
      case 'DELETE_FROM_REJECTED':
        updated_1 = this.state.ordersReceived.processed.rejected;
        order = this.state.ordersReceived.processed.rejected[i];

        if (!(order && order._id && order._id.length > 0)) { return }

        updated_1.splice(i, 1);

        db_1.collection('shops').where({
          _id: order.shopId
        }).update({
          data: {
            orders: _.pull(order._id)
          }
        });

        this.setState({
          ...this.state,
          ordersReceived: {
            ...this.state.ordersReceived,
            processed: {
              ...this.state.ordersReceived.processed,
              rejected: updated_1,
            }
          },
        });
        break;
      case 'DELETE':
        updated_1 = this.state.ordersReceived.processed.finished;
        order = this.state.ordersReceived.processed.finished[i];

        if (!(order && order._id && order._id.length > 0)) { return }

        updated_1.splice(i, 1);

        // wx.cloud.callFunction({
        //   name: 'pull_data',
        //   data: {
        //     collection: 'shops',
        //     queryTerm: { _id: order.shopId },
        //     updateData: order._id
        //   },
        //   success: (res) => {
        //   },
        //   fail: console.error
        // });
        db_1.collection('shops').where({
          _id: order.shopId
        }).update({
          data: {
            orders: _.pull(order._id)
          }
        });

        this.setState({
          ...this.state,
          ordersReceived: {
            ...this.state.ordersReceived,
            processed: {
              ...this.state.ordersReceived.processed,
              finished: updated_1,
            }
          },
        });

        break;
      case '':
        break;
      default:
        break;
    }
  }

  handelCancel = () => {
    this.setState({
      ...this.state,
      rejectReason: this.initState.rejectReason,

      currentOrderIndex: null,

      isRejectOrderDialogOpen: false,
      isRejectFromAcceptedDialogOpen: false,
      isAcceptFromRejectedDialogOpen: false,
      isFinishOrderDialogOpen: false,
    });

  }

  toggleSearch = (isSearching) => {
    isSearching ?
      this.setState({
        ...this.state,
        isSearching: isSearching,
      }) :
      this.setState({
        ...this.state,
        isSearching: isSearching,
        searchedOrders: [],
      })
  }
  setSearchedOrders = (searchedOrders) => {
    this.setState({
      ...this.state,
      searchedOrders: searchedOrders
    });
  }
  render() {
    // console.log('ordersReceived', this.state.ordersReceived);
    let rejectDialogInput = (
      <View className=''>
        <View className='flex'>
          {rejectOrderReasons.map((it, i) => {
            return (
              <View
                key={i}
                className={'mie_button '.concat(it == this.state.rejectReason.reason ?
                  'mie_button_choosen' : '')}
                onClick={this.handleChangeInput.bind(this, 'REJECT_REASON', it)}//* no '(it)=> 'here !!!!
              >
                {it}
              </View>
            )
          })}
        </View>
        <View className=''>补充说明：</View>
        <AtTextarea
          name='MyOrdersRejectOrderDialogDes'
          height={200}
          maxLength={200}
          value={this.state.rejectReason.des}
          onChange={value => this.handleChangeInput('REJECT_REASON_DES', value)}
        />
      </View>
    )
    let rejectOrderDialog = (
      <ActionDialog
        title='拒单原因'
        closeOnClickOverlay={!(this.state.rejectReason.des && this.state.rejectReason.des.length > 0)}
        isOpened={this.state.isRejectOrderDialogOpen}
        onClose={() => this.handelCancel()}
        onCancel={() => this.handelCancel()}
        onSubmit={() => this.handleSubmit('REJECT_FROM_UNPROCESSED')}
        checkedItems={[
          {
            check: this.state.rejectReason.reason &&
              this.state.rejectReason.reason.length > 0,
            toastText: '请选择拒单原因',
          }
        ]}
      >
        {rejectDialogInput}

      </ActionDialog>
    );
    let rejectFromAcceptedDialog = (
      <ActionDialog
        title='拒单原因'
        isOpened={this.state.isRejectFromAcceptedDialogOpen}
        onClose={() => this.handelCancel()}
        onCancel={() => this.handelCancel()}
        onSubmit={() => this.handleSubmit('REJECT_FROM_ACCEPTED')}
        checkedItems={[
          {
            check: this.state.rejectReason.reason &&
              this.state.rejectReason.reason.length > 0,
            toastText: '请选择拒单原因',
          }
        ]} >
        {rejectDialogInput}
        <View>你确定要反悔此单？</View>
      </ActionDialog>
    );
    let acceptFromRejectedDialog = (
      <ActionDialog
        isOpened={this.state.isAcceptFromRejectedDialogOpen}
        onClose={() => this.handelCancel()}
        onCancel={() => this.handelCancel()}
        onSubmit={() => this.handleSubmit('ACCEPT_FROM_REJECTED')}
      >
        <View>你确定要重接此单？</View>
      </ActionDialog>
    );
    let finishOrderDialog = (
      <ActionDialog
        isOpened={this.state.isFinishOrderDialogOpen}
        onClose={() => this.handelCancel()}
        onCancel={() => this.handelCancel()}
        onSubmit={() => this.handleSubmit('FINISH')}
      >
        <View>点击完成后，该单在买家处也会标记为已完成，请确保交易已结束。你确定要现在完成该订单?</View>
      </ActionDialog>
    )
    let unProcessedOrders = (
      <View
        className='seller_page_order_item'
        style={'display:flex; flex-direction:column;'}//未处理订单中，越早的订单排越前
      >
        {this.state.ordersReceived.unProcessed.map((it, i) => {
          return (
            <View
              key={it._id}
            >
              <OrderCard
                mode='SELLER'
                order={it}
                buttonTextLeft='拒单'
                buttonTextRight='接单'
                attentionTextLeft='左划拒单'
                attentionTextRight='右划接单'
                handleClickButtonLeft={this.handleBeforeSubmit.bind(this, 'REJECT', i)}
                handleClickButtonRight={this.handleSubmit.bind(this, 'ACCEPT_FROM_UNPROCESSED', i)}
              />
            </View>
          )
        })}
      </View>
    );

    let acceptedOrders = (
      <View className='seller_page_order_item'>
        {this.state.ordersReceived.processed.accepted.map((it, i) => {
          return (
            <View
              key={it._id}
            >
              <OrderCard
                mode='SELLER'
                order={it}
                buttonTextLeft='拒单'
                buttonTextRight='完成订单'
                attentionTextLeft='左划拒单'
                attentionTextRight='右划完成订单'
                handleClickButtonLeft={this.handleBeforeSubmit.bind(this, 'REJECT_FROM_ACCEPTED', i)}
                handleClickButtonRight={this.handleBeforeSubmit.bind(this, 'FINISH', i)}
              />
            </View>
          )
        })}
      </View>
    );

    let rejectedOrders = (
      <View className='seller_page_order_item'>
        {this.state.ordersReceived.processed.rejected.map((it, i) => {
          return (
            <View
              key={it._id}
            >
              <OrderCard
                mode='SELLER'
                order={it}

                buttonTextRight='删除订单'
                beforeRightButtonText={'确定删除该订单?'}
                handleClickButtonRight={() => this.handleSubmit('DELETE_FROM_REJECTED', i)}
              // buttonTextRight='重新接单'
              // handleClickButtonRight={this.handleBeforeSubmit.bind(this, 'ACCEPT_FROM_REJECTED', i)}
              />
            </View>
          )
        })}
      </View>
    );
    let finishedOrders = (
      <View className='seller_page_order_item'>
        {this.state.ordersReceived.processed.finished.map((it, i) => {
          return (
            <View
              key={it._id}
            >
              <OrderCard
                mode='SELLER'
                order={it}

                buttonTextRight='删除订单'
                beforeRightButtonText={'确定删除该订单?'}
                handleClickButtonRight={() => this.handleSubmit('DELETE', i)}
              />
            </View>
          )
        })}
      </View>
    );

    let orderTabPage = null;
    switch (this.state.currentTab) {
      case 0:
        orderTabPage = (
          <View className='' >
            {(this.state.ordersReceived.unProcessed.length > 0 ||
              this.props.layoutManager.ifOpenLoadingSpinner) ?
              unProcessedOrders :
              <View className='empty_word'>暂无订单</View>
            }
          </View>
        );
        break;
      case 1:
        orderTabPage = (
          <View className=''>
            {(this.state.ordersReceived.processed.rejected.length > 0 ||
              this.props.layoutManager.ifOpenLoadingSpinner) ?
              rejectedOrders :
              <View className='empty_word'>暂无订单</View>
            }
          </View>
        );
        break;
      case 2:
        orderTabPage = (
          <View className=''>
            {this.state.ordersReceived.processed.accepted.length > 0 ?
              acceptedOrders :
              <View className='empty_word'>暂无订单</View>
            }
          </View>
        );
        break;
      case 3:
        orderTabPage = (
          <View className=''>
            {this.state.ordersReceived.processed.finished.length > 0 ?
              finishedOrders :
              <View className='empty_word'>暂无订单</View>
            }
          </View>
        );
        break;

      default:
        break;
    }

    let ordersTabList = [{ title: '未处理' }, { title: '已拒单' }, { title: '已接单' }, { title: '已完成' }]
    let orders = (
      <TabPage
        tabList={ordersTabList}
        currentTab={this.state.currentTab}
        onClick={i => this.handleToggleTab(i)}
      >
        {orderTabPage}
      </TabPage>

    );

    return (
      <Layout
        version={this.props.version}
        className='my_orders_page'
        mode='SELLER'
        navBarKind={3}
        navBarTitle='管理订单'
      >
        {rejectOrderDialog}
        {rejectFromAcceptedDialog}
        {acceptFromRejectedDialog}
        {finishOrderDialog}
        <SearchBar
          itemList={this.state.ordersReceived.allOrders}
          beginSearching={() => this.toggleSearch(true)}
          stopSearching={() => this.toggleSearch(false)}
          getMatchedList={(matched) => this.setSearchedOrders(matched)}
        />
        {this.state.isSearching ?
          <View className=''>
            {
              this.state.searchedOrders.map((it, i) => {
                return (
                  it.status === 'UN_PROCESSED' ?
                    <OrderCard
                      mode='SELLER'
                      order={it}
                      buttonTextLeft='拒单'
                      buttonTextRight='接单'
                      attentionTextLeft='左划拒单'
                      attentionTextRight='右划接单'
                      handleClickButtonLeft={this.handleBeforeSubmit.bind(this, 'REJECT', i)}
                      handleClickButtonRight={this.handleSubmit.bind(this, 'ACCEPT_FROM_UNPROCESSED', i)}
                    /> :
                    (it.status === 'ACCEPTED' ?
                      <OrderCard
                        mode='SELLER'
                        order={it}
                        buttonTextLeft='拒单'
                        buttonTextRight='完成'
                        attentionTextLeft='左划拒单'
                        attentionTextRight='右划完成订单'
                        handleClickButtonLeft={this.handleBeforeSubmit.bind(this, 'REJECT_FROM_ACCEPTED', i)}
                        handleClickButtonRight={this.handleBeforeSubmit.bind(this, 'FINISH', i)}
                      /> : (
                        it.status === 'REJECTED' ?
                          <OrderCard
                            mode='SELLER'
                            order={it}

                            buttonTextRight='删除订单'
                            beforeRightButtonText={'确定删除该订单?'}
                            handleClickButtonRight={() => this.handleSubmit('DELETE_FROM_REJECTED', i)}
                          // buttonTextRight='重新接单'
                          // handleClickButtonRight={this.handleBeforeSubmit.bind(this, 'ACCEPT_FROM_REJECTED', i)}
                          /> :
                          //(it.status === 'FINISHED' || it.status === 'CANCELED') ?
                          <OrderCard
                            mode='SELLER'
                            order={it}

                            buttonTextRight='删除订单'
                            beforeRightButtonText={'确定删除该订单?'}
                            handleClickButtonRight={() => this.handleSubmit('DELETE', i)}
                          />
                      )
                    )
                )
              })
            }
          </View>
          :
          orders
        }
      </Layout>
    )
  }
}

export default MyOrdersPage;
