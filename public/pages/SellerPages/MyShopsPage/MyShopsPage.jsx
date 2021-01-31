import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtIcon, AtInput, AtTextarea } from 'taro-ui'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actions/index'

import LoginDialog from '../../../components/dialogs/LoginDialog/LoginDialog'
import ActionButtons from '../../../components/buttons/ActionButtons/ActionButtons'
import ActionDialog from '../../../components/dialogs/ActionDialog/ActionDialog'
import Layout from '../../../components/Layout/Layout'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'

import './MyShopsPage.scss'

const databaseFunction = require('../../../public/databaseFunction')
const db = wx.cloud.database();
const _ = db.command


@connect(
  ({ userManager, publicManager }) => ({
    userManager, publicManager
  }),
  (dispatch) => ({
    toggleLoadingSpinner(ifOpen) {
      dispatch(actions.toggleLoadingSpinner(ifOpen))
    },
    setCurrentShopId(shopId) {
      dispatch(actions.setCurrentShopId(shopId))
    },
  })
)

/**
 * 管理已发布的地摊and发布新地摊
 */
class MyShopsPage extends Component {

  initState = {
    myShops: [],
    annos: [],//{shopId:'',announcements:[]}


    annoInput: '',

    currentShopId: null,
    openedDialog: null,//'ANNO','LOGIN'
  }

  state = this.initState;

  componentDidMount() {
    this.doUpdate();
  }
  onPullDownRefresh() {
    console.log('onPullDownRefresh--');
    //wx.startPullDownRefresh()
    this.doUpdate();
    Taro.stopPullDownRefresh()
  }
  componentWillReceiveProps(nextProps) {
    // console.log('myshops-new p',nextProps,'old p',this.props);
    if (!(nextProps.userManager.unionid == this.props.userManager.unionid)) {
      this.doUpdate(nextProps.userManager.unionid);
    }
  }
  doUpdate(unionid = this.props.userManager.unionid, ifShowLoadingSpinner = true) {
    // console.log('myshops-doUpdate');
    if (!(unionid && unionid.length > 0)) { return }
    ifShowLoadingSpinner &&
      this.props.toggleLoadingSpinner(true);
    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'shops',

        queryTerm: { shopInfo: { ownerId: unionid } },//*unfinished， 可能改成从userinfo里shopidlist找比较好
      },
      success: (res) => {
        ifShowLoadingSpinner &&
          this.props.toggleLoadingSpinner(false);
        if (res && res.result && res.result.data && res.result.data.length > 0) {
          let annos = [];
          res.result.data.forEach((it) => {
            it.announcements &&
              annos.push({
                shopId: it._id,
                announcements: it.announcements
              })
          })
          this.setState({
            ...this.state,
            myShops: res.result.data,
            annos: annos,
            openedDialog: null,
            annoInput: this.initState.annoInput,
            currentShopId: null,
          });
        }
      },
      fail: () => {
        console.error
        ifShowLoadingSpinner &&
          this.props.toggleLoadingSpinner(false);
      }
    });
  }
  //shops
  handleAddNewShop() {
    if (this.props.userManager.unionid && this.props.userManager.unionid.length > 0) {
      Taro.navigateTo({
        url: '/pages/SellerPages/MyShopsPage/ManageShopPage/ManageShopPage'
      });
    } else {
      this.toggleDialog('LOGIN')
    }
  }


  handleModifyShop = (tab, shopId) => {//tab:一进修改页面最先出现的tab页 (0:shopInfo,1:pickUpWay,2:products)
    console.log('handleModifyShop', tab, shopId);
    Taro.navigateTo({  //*注意是`不是‘ ！！！！
      url: `/pages/SellerPages/MyShopsPage/ManageShopPage/ManageShopPage?tab=${tab}&shopId=${shopId}`
    });
  };

  toggleDialog = (openedDialog) => {
    this.setState({
      ...this.state,
      openedDialog: openedDialog
    });
  }


  //annos
  filterAnnos = (annos, shopId) => {//筛选当前店铺的annos
    let returnV = [];
    let index = annos.length > 0 ?//*unfinished 没想好anno只允许一条or多条
      annos.findIndex((it) => {
        return (it.shopId == shopId)
      }) : -1;
    index > -1 &&
      (returnV = (annos[index].announcements));
    // console.log('filterAnnos', returnV);
    return (returnV);
  }
  handleAnno = async (way, v = null) => {
    switch (way) {
      case 'BEGIN':
        this.setState({
          ...this.state,
          annoInput: this.filterAnnos(this.state.annos, v),
          openedDialog: 'ANNO',
          currentShopId: v,
        });
        break;
      case 'CHANGE':
        this.setState({
          ...this.state,
          annoInput: v,
        });
        break;
      case 'SUBMIT':
        let currentShopId = this.state.currentShopId
        this.setState({
          ...this.state,
          currentShopId: null,
          openedDialog: null,
        });
        await databaseFunction.sendShopAnno(currentShopId, this.state.annoInput);

        // let updatedAnno = this.state.annos;
        // let index = updatedAnno.findIndex(it => {
        //   return (it.shopId == this.state.currentShopId)
        // })
        // updatedAnno.splice(index, 1, {
        //   ...updatedAnno[index],
        //   announcements: [this.state.annoInput],
        // })
        // // console.log('updatedAnno', updatedAnno);
        // this.setState({
        //   ...this.state,
        //   openedDialog: null,
        //   annoInput: this.initState.annoInput,
        //   currentShopId: this.initState.currentShopId,
        //   annos: updatedAnno,
        // });
        this.doUpdate(this.props.userManager.unionid, false);
        break;
      default:
        break;
    }
  }


  handleInit = () => {
    this.setState({
      ...this.state,
      openedDialog: null,
      annoInput: this.initState.annoInput,
      currentShopId: this.initState.currentShopId,
    });
  }


  render() {
    let annoDialog = (
      <ActionDialog
        title=' 公告'
        type={0}
        isOpened={this.state.openedDialog === 'ANNO'}
        onClose={() => this.handleInit()}
        onCancel={() => this.handleInit()}
        onSubmit={() => this.handleAnno('SUBMIT')}
      >
        <AtTextarea
          name={'myshopspageAnnodialog'}
          value={this.state.annoInput}
          maxLength={150}
          height={300}
          onChange={v => this.handleAnno('CHANGE', v)}
        />
        {/* <View className=''>
            <View className=''>
              当前公告:
        </View>
            {this.filterAnnos(this.state.annos, this.state.currentShopId).map((it, i) => {
              return (
                <View className=''>
                  {it}
                </View>
              )
            })}
          </View> */}
      </ActionDialog>
    )

    let myShops =
      <View className='shops'>
        {(this.state.myShops.length > 0 || this.props.publicManager.ifOpenLoadingSpinner) ?
          this.state.myShops.map((it, i) => {
            return (
              <View
                key={i}
                className='shop flex'
              >
                <View
                  className='shop_name flex flex-1 items-center justify-center'
                  onClick={() => this.handleModifyShop(0, it._id)}
                >
                  {it.shopInfo.shopName}
                </View>

                <View className='button_list flex flex-1 items-center justify-center'>
                  <View
                    className='button'
                    onClick={() => this.handleModifyShop(0, it._id)}
                  >
                    <View className='text'>地摊信息</View>
                  </View>
                  <View
                    className='button'
                    onClick={() => this.handleModifyShop(1, it._id)}>
                    <View className='text'>提货方式</View>
                  </View>
                  <View
                    className='button'
                    onClick={() => this.handleModifyShop(2, it._id)}>
                    <View className='text'>商品管理</View>
                  </View>
                  <View
                    className='at-icon at-icon-volume-minus'
                    onClick={() => this.handleAnno('BEGIN', it._id)}
                  />
                </View>
              </View>
            )
          }) :
          <View className='empty_word'>暂无地摊</View>
        }
      </View>


    return (
      <Layout
        version={this.props.version}
        className='my_shop_page'
        mode='SELLER'
        navBarKind={3}
        navBarTitle='我的地摊'
      >
        <LoginDialog
          words='请先登录'
          version={this.props.version}
          isOpened={this.state.openedDialog === 'LOGIN'}
          onClose={() => this.handleInit()}
          onCancel={() => this.handleInit()}
          onSubmit={() => this.handleAddNewShop()}
        />
        {annoDialog}
        <View className='add_new_button'>
          <View
            className='at-icon at-icon-add-circle'
            onClick={() => this.handleAddNewShop()}
          >
            <View>新建地摊</View>
          </View>
        </View>
        <View className='title'> 我的地摊 </View>
        <View className='line_horizontal' />
        {myShops}
      </Layout>
    )
  }
}

export default MyShopsPage;
