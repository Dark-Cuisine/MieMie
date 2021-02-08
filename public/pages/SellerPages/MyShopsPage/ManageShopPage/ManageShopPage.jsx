import React, { Component, useState, useReducer, useEffect, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtModal, AtInput, AtForm, AtCheckbox, AtTabs, AtTabsPane, AtSegmentedControl } from 'taro-ui'
import { connect } from 'react-redux'
import * as actions from "../../../../redux/actions/index";
import dayjs from 'dayjs'

import ActionDialog from '../../../../components/dialogs/ActionDialog/ActionDialog'
import Layout from '../../../../components/Layout/Layout'
import TabPage from '../../../../components/formats/TabPage/TabPage'
import CheckRequiredButton from '../../../../components/buttons/CheckRequiredButton/CheckRequiredButton'
import ShopInfoContainer from '../../../../containers/ShopInfoContainer/ShopInfoContainer'
import PickUpWayContainer from '../../../../containers/PickUpWayContainer/PickUpWayContainer'
import ShopProductsContainer from '../../../../containers/ShopProductsContainer/ShopProductsContainer'

const databaseFunction = require('../../../../public/databaseFunction');
const db = wx.cloud.database();
const _ = db.command;




import './ManageShopPage.scss'


/**
 * 创建新店铺or修改現有店鋪   //*problem 修改之后不能马上更新（比如加了车站再去提交订单页
 */

const ManageShopPage = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userManager = useSelector(state => state.userManager);

  const initState = {
    //for test
    // shop: {
    // shopInfo: {
    //   ownerId: userManager.unionid,

    //   shopName: '咩咩羊肉铺',
    //   shopIcon: [{ url: test_img }],
    //   shopKinds: {
    //     shopKindLarge: '菜市',
    //     shopKindSmall: ['蔬菜水果', '中华物产']
    //   },
    //   ownerName: '咩咩',
    //   phoneNumber: '123',
    //   address: '三鹰',
    //   des: '挂羊头卖狗肉',
    //   paymentOptions: [{ option: '支付宝', account: '123' }, { option: '现金', account: '' }, { option: 'Line Pay', account: '321' }],//{option:'',account:''}
    //   QRCodeList: [{ url: test_img }, { url: test_img }]
    // },
    // pickUpWay: {
    //   selfPickUp: {
    //     list: [{
    //       place: '三鹰邮局',
    //       placeDetail: '西久保',
    //       nearestStation: { line: 'JR上越線', stations: { list: ['高崎'], from: '高崎', to: '高崎' } }
    //     },
    //     {
    //       place: 'ok超市前',
    //       placeDetail: '180-0011超市门口',
    //       nearestStation: { line: 'JR中央線', stations: { list: ['神田'], from: '神田', to: '神田' } }
    //     }],//{place:'',placeDetail:'',nearestStation:{line: '', stations: { list: [], from: '', to: '' }}}
    //     des: '别迟到了',
    //   },
    //   stationPickUp: {
    //     list: [
    //       {
    //         line: 'JR中央本線',
    //         stations: {
    //           list: [
    //             { station: '大月', announcements: [{ date: '', list: [''] }] },
    //             { station: '坂下', announcements: [{ date: '', list: [''] }] },
    //             { station: '落河川', announcements: [{ date: '', list: [''] }] }
    //           ],
    //           from: '大月', to: '落河川'
    //         },
    //         floorPrice: 0
    //       },
    //       {
    //         line: 'JR両毛線',
    //         stations: {
    //           list: [{ station: '小山', announcements: [{ date: '', list: [''] }] },],
    //           from: '大月', to: '落河川'
    //         },
    //         floorPrice: 1000
    //       },
    //     ],
    //     des: '不用出站，站内取货',
    //   },
    //   expressPickUp: {
    //     isAble: true,
    //     list: [{ area: '关东', floorPrice: '0' }, { area: '关西', floorPrice: '200' }, { area: '北海道', floorPrice: '3000' }], //{area:'',floorPrice: ''}//满额包邮list
    //     des: '冷冻邮费会贵一倍',
    //   },
    // },
    // products: {
    //   labelList: [{ name: 'All' }, { name: '蔬果' }, { name: '限时特惠' }],
    //   productIdList: []
    // },
    shop: {
      shopInfo: {
        ownerId: userManager.unionid,

        shopName: '',
        shopIcon: [],
        shopKinds: {
          shopKindLarge: '',
          shopKindSmall: []
        },
        ownerName: '',
        phoneNumber: '',
        address: '',
        des: '',
        paymentOptions: [],//{option:'',account:''}
        QRCodeList: []//{url:''}
      },
      pickUpWay: {
        selfPickUp: {
          list: [],//{place:'',placeDetail:',nearestStation:{line: '', stations: { list: [], from: '', to: '' }}}
          des: '',
        },
        stationPickUp: {
          list: [],//{line:'',stations:{list:[{station:'',announcements: [{date:'',list:['']}]}],from:'',to:''},floorPrice:0}
          des: '',
        },
        expressPickUp: {
          isAble: false,
          list: [], //{area:'',floorPrice: ''}//满额包邮list
          des: '',
        },
      },
      products: {
        labelList: [{ name: 'All' }],
        productIdList: []//{id:''}
      },

    },
    // productList: [{ name: '苹果', price: 10000, unit: '个', stock: 0, des: '很好吃',labels: ['All', '蔬果', '限时特惠'], status: 'LAUNCHED', updatedStock: { way: '', quantity: 0 } },
    // { name: '雪梨', price: 10, unit: '半个', stock: 10,des: '真的很好吃', labels: ['All', '蔬果'], status: 'LAUNCHED', updatedStock: { way: '', quantity: 0 } },
    // { name: '哈密瓜', price: 30, unit: '箱（12个）', stock: 1000, labels: ['All', '蔬果'], status: 'LAUNCHED', updatedStock: { way: '', quantity: 0 } },
    // { name: '番鬼荔枝', price: 20, unit: '个', stock: 20, labels: ['All', '蔬果'], status: 'LAUNCHED', updatedStock: { way: '', quantity: 0 } }],
    productList: [],//{name:'',icon:[],price:0,unit: '',stock:0,labels:[''],des: '',status: '',updatedStock:{way: '', quantity: 0 }}
    deletedProducts: [],

    // currentTab: Number(router.params.tab) || 0,//*must transfer to Number!!  
    currentTab: Number(router.params.tab) || 0,

    way: 'ADD',//'ADD' 'MODIFY'
  }
  //要从云储存删除的图片
  const initDeletedImgList = {
    productIcons: [],
    shopIcons: [],
    qrCodes: [],

  }
  const [state, setState] = useState(initState);
  const [openedDialog, setOpenedDialog] = useState(null);//'UPLOAD_SHOP','DELETE_SHOP'
  const [deletedImgList, setDeletedImgList] = useState(initDeletedImgList);//要从云储存删除的图片
  const shopInfoContainerRef = useRef();
  const pickUpWayContainerRef = useRef();
  const shopProductsContainerRef = useRef();

  useEffect(() => {
    if (router.params.shopId) { //如果传了店铺进来，就修改该店铺
      dispatch(actions.toggleLoadingSpinner(true));

      wx.cloud.callFunction({
        name: 'get_data',
        data: {
          collection: 'shops',

          queryTerm: { _id: router.params.shopId },
        },
        success: (res) => {
          dispatch(actions.toggleLoadingSpinner(false));
          if (res && res.result && res.result.data && res.result.data.length > 0) {
            setState({
              ...state,
              shop: res.result.data[0],
              way: 'MODIFY',
            });
          }
        },
        fail: () => {
          dispatch(actions.toggleLoadingSpinner(false));
          wx.showToast({
            title: '获取店铺数据失败',
            icon: 'none'
          })
          console.error
        }
      });
    }
  }, [userManager.unionid, userManager.userInfo]);

  //delete shop
  const deleteShop = async () => {

    let deletedProductIcons = [];
    state.productList && state.productList.length > 0 &&
      state.productList.forEach(it => {
        deletedProductIcons.push(...it.icon)
      })
    let deletedImg = state.shop.shopInfo.shopIcon.concat(state.shop.shopInfo.QRCodeList, deletedProductIcons)
    let deletedUrl = [];
    // console.log('deletedProductIcons',deletedProductIcons,'deletedImg',deletedImg);
    deletedImg && deletedImg.length > 0 &&
      deletedImg.forEach(it => {
        it.fileID && //删除有fileID的图片
          deletedUrl.push(it.url)
      })
    deletedUrl.length > 0 &&
      deleteImgs(deletedUrl)


    await databaseFunction.deleteShop(state.shop, userManager.unionid);
    dispatch(actions.setUser(userManager.openid, userManager.unionid));//更新用户信息
    Taro.navigateTo({
      url: '/pages/SellerPages/MyShopsPage/MyShopsPage'
    });
  }

  //upload shop
  const uploadShop = async () => {
    setOpenedDialog(null)
    // if (state.way == 'ADD') {
    //   await databaseFunction.addNewShop(state.shop, state.productList);
    //   dispatch(actions.setUser(userManager.openid, userManager.unionid));//更新用户信息
    // } else {
    dispatch(actions.toggleLoadingSpinner(true));

    //从云储存删除图片
    let deleted = [];
    // console.log('deletedImgList', deletedImgList);
    deletedImgList.productIcons && deletedImgList.productIcons.length > 0 &&//unfinished 好像一开始直接放一起就好....
      deleted.push(...deletedImgList.productIcons)
    deletedImgList.shopIcons && deletedImgList.shopIcons.length > 0 &&
      deleted.push(...deletedImgList.shopIcons)
    deletedImgList.qrCodes && deletedImgList.qrCodes.length > 0 &&
      deleted.push(...deletedImgList.qrCodes)
    // console.log('de-0', deleted);
    if (state.deletedProducts && state.deletedProducts.length > 0) {
      deletedProducts.forEach(p => {//把要被删除的商品的icon也删了
        if (p.icon && p.icon.length > 0) {
          p.icon.fileID &&
            deleted.push({ url: p.icon.fileID })
        }
      })
    }
    //console.log('de-1', deleted);
    let deletedUrl = [];
    deleted && deleted.length > 0 && deleted.forEach(it => {
      deletedUrl.push(it.fileID)//*unfinished 一开始应该只要放url就好
    })
    // console.log('de-2', deletedUrl);
    deletedUrl.length > 0 &&
      deleteImgs(deletedUrl)
    //向云储存上传还没有fileId的图片
    let fileDir = dayjs().format('YYYY-MM');

    // let unUpLoadShopIcons = [];
    // state.shop.shopInfo.shopIcon.forEach(it => {
    //   !it.fileID &&
    //     unUpLoadShopIcons.push(it)
    // })
    let updatedShopIcons = [];
    for (let it of state.shop.shopInfo.shopIcon) {
      let updated = it.fileID ? it :
        await compressAndUploadImg(it, fileDir, 'shop_icons')
      // console.log('im-1', updated);
      if ((updated == null) || (!updated.fileID)) {
        wx.showToast({
          title: '上传店铺头像失败',
          icon: 'none'
        })
      } else {
        updatedShopIcons.push(updated)
      }

      // console.log('im-2', updatedShopIcons);
      // let unUpLoadQRCodes = [];
      // state.shop.shopInfo.QRCodeList.forEach(it => {
      //   !it.fileID &&
      //     unUpLoadQRCodes.push(it)
      // })
      let updatedQRCodes = [];
      for (let it of state.shop.shopInfo.QRCodeList) {
        let updated = it.fileID ? it :
          await compressAndUploadImg(it, fileDir, 'shop_qrcodes')
        if ((updated == null) || (!updated.fileID)) {
          wx.showToast({
            title: '上传群二维码失败',
            icon: 'none'
          })
        } else {
          updatedQRCodes.push(updated)
        }
      }
      // let unUpLoadProductIcons = [];
      // state.productList.forEach(p => {
      //   if (p.icon && p.icon.length > 0) {
      //     p.icon.forEach(it => {
      //       !it.fileID &&
      //         unUpLoadProductIcons.push(it)
      //     })
      //   }
      // });

      let updatedProductList = []
      for (let p of state.productList) {
        let updatedProductIcons = [];
        if (p.icon && p.icon.length > 0) {
          for (let it of p.icon) {
            let updated = it.fileID ? it :
              await compressAndUploadImg(it, fileDir, 'product_icons')
            if ((updated == null) || (!updated.fileID)) {
              wx.showToast({
                title: '上传商品图片失败',
                icon: 'none'
              })
            } else {
              updatedProductIcons.push(updated)
            }
          }
        }
        // console.log('state.productList,', state.productList, 'p', p, 'updatedProductIcons', updatedProductIcons);
        // p.icon = updatedProductIcons
        // console.log('ppp',p);

        //*problem 不知为何不能配置_id,所以这两个方法都不能用!!!!
        updatedProductList.push({
          ...p,
          icon: updatedProductIcons
        })
        // console.log('updatedProductList-1', updatedProductList);
        // updatedProductList.push({
        //   ...p,
        //   _id: p._id, 
        //   icon: updatedProductIcons
        // })
        // console.log('updatedProductList-1', updatedProductList);
      };
      // console.log('state.productList-1', state.productList);

      let updatedShop = {
        ...state.shop,
        shopInfo: {
          ...state.shop.shopInfo,
          shopIcon: updatedShopIcons,
          QRCodeList: updatedQRCodes,
        }
      }

      // console.log('mmmmmmmmm shop:', updatedShop,'updatedProductList',updatedProductList);


      dispatch(actions.toggleLoadingSpinner(false));

      if (state.way == 'ADD') {
        await databaseFunction.addNewShop(userManager.unionid, state.shop, state.productList);
      } else {
        await databaseFunction.modifyShop(updatedShop, updatedProductList, state.deletedProducts)
      }
      dispatch(actions.setUser(userManager.openid, userManager.unionid));//更新用户信息

      // };

      Taro.switchTab({
        url: '/pages/SellerPages/MyShopsPage/MyShopsPage'
      });

      setState(initState);
    }
  }

  //save ref-value
  const handleSave = (newTab = state.currentTab, oldTab = state.currentTab, isUploading = false) => {//isUploading用来判断是否打开确认上传店铺的dialog        
    (newTab == oldTab) ||//切换tab时回到顶部
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 50
      })
    let value = null;
    switch (oldTab) {
      case 0://SHOP_INFO
        value = shopInfoContainerRef.current.getValue();
        setOpenedDialog(isUploading ? 'UPLOAD_SHOP' : null)
        setState({
          ...state,
          shop: {
            ...state.shop,
            shopInfo: {
              ...state.shop.shopInfo,
              ...value.shopInfo
            }
          },
          currentTab: newTab,
        });
        setDeletedImgList({
          ...deletedImgList,
          shopIcons: (value.deletedImgList.shopIcons && value.deletedImgList.shopIcons.length > 0) ?
            [...deletedImgList.shopIcons, ...value.deletedImgList.shopIcons] : [],
          qrCodes: (value.deletedImgList.qrCodes && value.deletedImgList.qrCodes.length > 0) ?
            [...deletedImgList.qrCodes, ...value.deletedImgList.qrCodes] : [],
        })
        break;
      case 1://PICK_UP_WAY
        value = pickUpWayContainerRef.current.getValue();
        setOpenedDialog(isUploading ? 'UPLOAD_SHOP' : null)
        setState({
          ...state,
          shop: {
            ...state.shop,
            pickUpWay: {
              ...state.shop.pickUpWay,
              ...value
            }
          },
          currentTab: newTab,
        });
        break;
      case 2://PRODUCT
        value = shopProductsContainerRef.current.getValue();
        setOpenedDialog(isUploading ? 'UPLOAD_SHOP' : null)
        setState({
          ...state,
          shop: {
            ...state.shop,
            products: {
              ...state.shop.products,
              labelList: value.labelList,
            }
          },
          productList: value.productList,//*不直接改newShop里的products，products会留在上传时改
          deletedProducts: value.deletedProducts,

          currentTab: newTab,
        });
        setDeletedImgList({
          ...deletedImgList,
          productIcons: (value.deletedImgList.productIcons && value.deletedImgList.productIcons.length > 0) ?
            [...deletedImgList.productIcons, ...value.deletedImgList.productIcons] : [],
        })
        break;
      default:
        break;
    }
  }

  const deleteImgs = async (deletedUrl) => {//从云储存删除图片
    console.log('deletedUrl,deletedUrl', deletedUrl);
    let c1 = null;
    c1 = new wx.cloud.Cloud({
      resourceAppid: 'wx8d82d7c90a0b3eda',
      resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
    })
    await c1.init({
      secretId: 'AKIDwiHc09xCF3cwDFrESWOHxNZXLCfvRL2W',
      secretKey: 'XZfka5K83yeKnAcBCShS4SgS3cBXfXBs',
      env: 'miemie-buyer-7gemmgzh05a6c577'
    })
    let response = await c1.deleteFile({
      fileList: deletedUrl
    })
    console.log('从云储存删除图片成功', response);
  }
  const compressAndUploadImg = async (img, fileDir, prefix) => {//压缩和上传图片到云储存
    console.log('compressAndUploadImg', img, fileDir, prefix);
    let c1 = null;
    c1 = new wx.cloud.Cloud({
      resourceAppid: 'wx8d82d7c90a0b3eda',
      resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
    })
    await c1.init({
      secretId: 'AKIDwiHc09xCF3cwDFrESWOHxNZXLCfvRL2W',
      secretKey: 'XZfka5K83yeKnAcBCShS4SgS3cBXfXBs',
      env: 'miemie-buyer-7gemmgzh05a6c577'
    })

    let res_0 = await wx.compressImage({//压缩图片*unfinished compressImage只对jpg有效
      src: img.url,
      quality: 20,
    })
    if (!(res_0 && res_0.tempFilePath && res_0.tempFilePath.length > 0)) { return null }
    let tempFilePath = res_0.tempFilePath;//压缩后图片的临时文件路径
    let fileName = tempFilePath
      .replace('http://tmp/', '')
      .replace('wxfile://', '');
    let cloudPath = [fileDir, prefix, fileName].join('/');
    let res = await c1.uploadFile({
      cloudPath: cloudPath,
      // filePath: item.url,
      filePath: tempFilePath,
    })
    if (!(res && res.fileID && res.fileID.length > 0)) { return null }
    console.log('上传', prefix, '到云储存成功', res);
    let r = await wx.cloud.callFunction({
      name: 'get_temp_file_url',
      data: {
        fileList: [res.fileID],
      },
    })
    // console.log('im-0', r);
    if (!(r && r.result && r.result.length > 0)) { return null }
    return {
      cloudPath: cloudPath,
      fileID: res.fileID,
      url: r.result[0],
    }

  }
  const toggleDialog = (openedDialog) => {
    setOpenedDialog(openedDialog)
  }
  //init
  const handleCancel = () => {
    setOpenedDialog(null)
  }

  let submitDialog = (
    <ActionDialog
      type={1}
      isOpened={openedDialog === 'UPLOAD_SHOP'}
      cancelText='取消'
      confirmText='上传'
      onClose={() => handleCancel()}
      onCancel={() => handleCancel()}
      onSubmit={() => uploadShop()}
    >确定上传？（图片较多时上传比较慢，请耐心等待）</ActionDialog>
  )
  let deleteDialog = (
    <ActionDialog
      type={1}
      isOpened={openedDialog === 'DELETE_SHOP'}
      cancelText='取消'
      confirmText='删除'
      onClose={() => handleCancel()}
      onCancel={() => handleCancel()}
      onSubmit={() => deleteShop()}
    >确定删除？</ActionDialog>
  )


  let checkedItems = [
    {
      check: state.shop.shopInfo.shopName.length > 0,
      toastText: '请输入地摊名！'
    },
    {
      check: state.shop.shopInfo.ownerName.length > 0,
      toastText: '请输入摊主名字！'
    },
    {
      check: state.shop.shopInfo.phoneNumber.length > 0,
      toastText: '请输入联系电话！'
    },
    {
      check: state.shop.shopInfo.address.length > 0,
      toastText: '请输入地摊地址！'
    },
    {
      check: state.shop.shopInfo.shopIcon.length > 0,
      toastText: '请选择地摊头像！'
    },
    {
      check: state.shop.shopInfo.shopKinds.shopKindLarge.length > 0,
      toastText: '请选择地摊类型！'
    },
    {
      check: state.shop.shopInfo.paymentOptions.length > 0,
      toastText: '请添加付款方式！'
    },
  ]

  return (
    <Layout
      version={props.version}
      className='manage_shop_page'
      navBarKind={2}
      lateralBarKind={0}
      navBarTitle='创建地摊'
      ifShowTabBar={false}
    >
      {deleteDialog}
      {submitDialog}
      {
        state.way == 'ADD' ?
          <View className='manage_shop_page_header'>
            <CheckRequiredButton
              checkedItems={checkedItems}
              doAction={handleSave.bind(this, state.currentTab, state.currentTab, true)}
            >
              上传地摊
            </CheckRequiredButton>
          </View>
          :
          <View className='manage_shop_page_header'>
            <View
              className='delete_button'
              onClick={toggleDialog.bind(this, 'DELETE_SHOP')}
            >
              删除地摊
            </View>
            <CheckRequiredButton
              className='button'
              checkedItems={checkedItems}
              doAction={handleSave.bind(this, state.currentTab, state.currentTab, true)}
            >
              确定更新
            </CheckRequiredButton>
          </View>
      }
      <View className='manage_shop_page_header_place_holder' />
      <TabPage
        className='manage_shop_page_tab_page'
        tabList={[{ title: '地摊信息' }, { title: '取货方式' }, { title: '商品管理' }]}
        currentTab={state.currentTab}
        onClick={(v) => handleSave(v)}
      >
        {state.currentTab === 0 &&
          <ShopInfoContainer
            ref={shopInfoContainerRef}
            mode={'SELLER_MODIFYING'}
            shop={state.shop}
            handleSave={() => handleSave()}
          />
        }
        {state.currentTab === 1 &&
          <PickUpWayContainer
            ref={pickUpWayContainerRef}
            mode='SELLER_MODIFYING'
            shop={state.shop}
            handleSave={() => handleSave()}
          />
        }
        {state.currentTab === 2 &&
          <ShopProductsContainer
            ref={shopProductsContainerRef}
            mode={'SELLER_MODIFYING'}
            shop={state.shop}
            productList={state.productList}
            handleSave={() => handleSave()}
          />
        }
      </TabPage>
    </Layout>
  )
}


export default ManageShopPage;
