import React, { Component, useState, useReducer, useEffect, useImperativeHandle, forwardRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Button, Image, Text } from '@tarojs/components'
import { AtInput, AtImagePicker, AtTextarea, AtFloatLayout, AtToast } from 'taro-ui'
import { connect } from 'react-redux'
import * as actions from "../../redux/actions/index";

import Dialog from '../../components/dialogs/Dialog/Dialog'
import ActionButtons from '../../components/buttons/ActionButtons/ActionButtons'
import PickUpWayContainer from '../../containers/PickUpWayContainer/PickUpWayContainer'
import MultipleChoiceButtonsBox from '../../components/MultipleChoiceButtonsBox/MultipleChoiceButtonsBox'
import classification from '../../public/classification'



const MAX_SHOP_NAME_LENGTH = 10;
const MAX_OWNER_NAME_LENGTH = 10;
const MAX_PHONE_NUMBER_LENGTH = 11;
const MAX_PAYMENT_OPTION_OPTION_LENGTH = 10;

import './ShopInfoContainer.scss'
import '../../public/design.scss'
import dayjs from 'dayjs'



/** 
 * <ShopInfoContainer
 * mode={}
    shop={state.shop}
    handleSave={(shopInfo) => handleSave('SHOP_INFO', shopInfo)}
/>
 */
const ShopInfoContainer = (props, ref) => {


  const dispatch = useDispatch();
  const initState = {
    shop: props.shop,
    shopInfo: props.shop.shopInfo,
    announcements: props.shop.announcements || [],

    //付款方式
    paymentOptions: classification.defaultPaymentOptionList,
    ifShowAddPaymentOptionInput: false,
    addPaymentOptionInput: '',

    openedDialog: null,//'ANNOS','SHOP_INFO','PICK_UP_WAY','QR_CODES','DEFAULT_SHOP_ICONS'
    showedToast: null,
    previewingImg: null,

    mode: props.mode ? props.mode : 'BUYER',//'BUYER','SELLER_MODIFYING','SELLER_PREVIEW'
    //  mode: 'SELLER_MODIFYING',
 
  }
  const initDeletedImgList = {
    shopIcons: [],
    qrCodes: [],
  }

  const [defaulShopIcons, setDefaulShopIcons] = useState([]);//默认图集
  const [state, setState] = useState(initState);
  const [deletedImgList, setDeletedImgList] = useState(initDeletedImgList);//要从云储存删除的图片

  useEffect(() => {
    wx.cloud.callFunction({
      name: 'get_data',
      data: {
        collection: 'classifications',
      },
      success: (res) => {
        if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
          return
        }
        let defaulShopIconFileIds = res.result.data[0].defaulShopIcons;
        // console.log('defaulShopIconFileIds',defaulShopIconFileIds);
        wx.cloud.callFunction({
          name: 'get_temp_file_url',
          data: {
            fileList: defaulShopIconFileIds,
          },
          success: (res) => {
            if (res && res.result) {
              // console.log('set默认图集 ', res.result);
              let list = [];
              defaulShopIconFileIds && defaulShopIconFileIds.forEach((it, i) => {
                list.push({
                  cloudPath: defaulShopIconFileIds[i],
                  fileID: defaulShopIconFileIds[i],//*problem 这里是随便填了fileID上去(为应对后面判断是否上传到云储存)，应该填''就好？
                  url: res.result[i]
                })
              })
              setDefaulShopIcons(list)
            }
          },
          fail: () => {
            wx.showToast({
              title: '获取默认图集失败',
              icon: 'none'
            })
            console.error
          }
        });
      },
      fail: () => {
        wx.showToast({
          title: '获取店铺种类失败',
          icon: 'none'
        })
        console.error
      }
    })
  }, []);
  useEffect(() => {
    // console.log('aweawaeaweraraeraweewarawed', props);

    let updatedPaymentOptionList = state.paymentOptions;//把自定义的payment option添加进去
    state.shopInfo && state.shopInfo.paymentOptions &&
      state.shopInfo.paymentOptions.forEach((it) => {
        (state.paymentOptions.indexOf(it.option) < 0) &&
          updatedPaymentOptionList.push(it.option)
      });
    setState({
      ...state,
      shop: initState.shop,
      shopInfo: initState.shopInfo,
      paymentOptions: updatedPaymentOptionList,
      announcements: initState.announcements,
    });
  }, [props]);//status改变时就重新执行

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return ({ shopInfo: state.shopInfo, deletedImgList: deletedImgList })
    }
  }));

  //toggle dialog
  const toggleDialog = (openedDialog) => {
    openedDialog === null ?
      dispatch(actions.toggleHideMode('NORMAL', 'HIDED', 'NORMAL')) :
      dispatch(actions.toggleHideMode('NORMAL', 'NONE', 'NORMAL'))
    setState({
      ...state,
      openedDialog: openedDialog
    });
  }

  const handleInit = () => {
    setState({
      ...state,
      openedDialog: null,
      showedToast: null,
    });
    dispatch(actions.toggleHideMode('NORMAL', 'HIDED', 'NORMAL'))

  }
  //handle basic info
  const handleChange = async (way, value = null, i = null) => {
    // let c1 = null;
    // if ((way === 'CHANGE_SHOP_ICON') || (way === 'ADD_QRCODE')) {
    //   c1 = new wx.cloud.Cloud({
    //     resourceAppid: 'wx8d82d7c90a0b3eda',
    //     resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
    //   })

    //   await c1.init({
    //     secretId: 'AKIDwiHc09xCF3cwDFrESWOHxNZXLCfvRL2W',
    //     secretKey: 'XZfka5K83yeKnAcBCShS4SgS3cBXfXBs',
    //     env: 'miemie-buyer-7gemmgzh05a6c577'
    //   })

    // }
    // let fileDir = dayjs().format('YYYY-MM')
    // let fileName = '';
    // let cloudPath = '';
    // let response = null;
    // let res = null;
    switch (way) {
      case 'CHANGE_SHOP_ICON'://改店头像
        // dispatch(actions.toggleLoadingSpinner(true));
        let v = (value && value.length > 0) ? value[value.length - 1] : null;//单选
        let i_0 = v && defaulShopIcons.findIndex(item => {
          return (v.url == item.url)
        });

        if (state.shopInfo.shopIcon[0] && state.shopInfo.shopIcon[0].url &&
          (i_0 < 0) && state.shopInfo.shopIcon[0].fileID) {//如果有cloudPath(已经传上过云端)，且不在默认图集里，则需要从云储存删除
          // response = await c1.deleteFile({
          //   fileList: [state.shopInfo.shopIcon[0].url]
          // })
          // console.log('delete店头像成功', response.fileList);
          setDeletedImgList({
            ...deletedImgList,
            shopIcons: [...deletedImgList.shopIcons, state.shopInfo.shopIcon[0]]
          })
        }

        if (v) {
          if (i_0 > -1) {//在默认图集里
            console.log('morentuji', v);
            // dispatch(actions.toggleLoadingSpinner(false));
            setState({
              ...state,
              shopInfo: {
                ...state.shopInfo,
                shopIcon: [{
                  ...v,
                  fileID: v.url,
                }],
              },
              openedDialog: null,
            });
          } else {
            setState({
              ...state,
              shopInfo: {
                ...state.shopInfo,
                shopIcon: [{
                  url: v.url
                }],
              }
            });

          }
        } else {
          // dispatch(actions.toggleLoadingSpinner(false));
          setState({
            ...state,
            shopInfo: {
              ...state.shopInfo,
              shopIcon: [],
            }
          });
        }
        break;
      case 'ADD_QRCODE':
        // console.log('QRCode', value);
        // dispatch(actions.toggleLoadingSpinner(true));

        let deleted = [];
        state.shopInfo.QRCodeList &&
          state.shopInfo.QRCodeList.forEach(v => {
            let index = (value && (value.length > 0)) ?
              value.findIndex(va => {
                return (va.url == v.url)
              }) : -1;
            (index < 0 && v.fileID) &&//如果有cloudPath(已经传上过云端)，且已经不在更新的图集里了，则需要从云储存删除
              deleted.push(v)
          })
        deleted.length > 0 &&
          setDeletedImgList({
            ...deletedImgList,
            qrCodes: [...deletedImgList.qrCodes, ...deleted]
          })

        if (value) {
          setState({
            ...state,
            shopInfo: {
              ...state.shopInfo,
              QRCodeList: value,
            }
          });
        } else {
          setState({
            ...state,
            shopInfo: {
              ...state.shopInfo,
              QRCodeList: [],
            }
          });
        }

        // let updatedQRCodeList = [];
        // let unUpLoadValue = [];//还没有cloudPath的文件
        // value && value.forEach(v => {
        //   v.url && (v.cloudPath ||
        //     unUpLoadValue.push(v))
        // });
        // let deletedValueUrl = [];
        // state.shopInfo.QRCodeList &&
        //   state.shopInfo.QRCodeList.forEach(v => {
        //     let index = (value && (value.length > 0)) ?
        //       value.findIndex(va => {
        //         return (va.cloudPath == v.cloudPath)
        //       }) : -1;
        //     index < 0 ?
        //       deletedValueUrl.push(v.url) :
        //       updatedQRCodeList.push(v);
        //   })

        // response = await c1.deleteFile({
        //   fileList: deletedValueUrl
        // })
        // console.log('delete qr code成功', response.fileList);


        // if (unUpLoadValue && unUpLoadValue.length > 0) {
        //   for (const item of unUpLoadValue) {//传上云储存
        //     fileName = item.url
        //       .replace('http://tmp/', '')
        //       .replace('wxfile://', '');
        //     cloudPath = [fileDir, 'shop_qrcodes', fileName].join('/');

        //     res = await c1.uploadFile({
        //       cloudPath: cloudPath,
        //       filePath: item.url,
        //     })
        //     console.log('上传qr code成功', res);

        // wx.cloud.callFunction({
        //   name: 'get_temp_file_url',
        //   data: {
        //     fileList: [res.fileID],
        //   },
        //   success: (r) => {
        //     if (r && r.result && r.result.length > 0) {
        //     updatedQRCodeList.push({ //把新传上云储存的文件也放到updatedQRCodeList
        //       cloudPath: cloudPath,
        //       fileID: res.fileID,
        //       url: r.result[0],
        //     });
        //     setState({
        //       ...state,
        //       shopInfo: {
        //         ...state.shopInfo,
        //         QRCodeList: updatedQRCodeList,
        //       }
        //     });
        //   }
        // },
        //     fail: () => {
        //       setState({
        //         ...state,
        //         showedToast: '获取图片失败',
        //       });
        //       console.error
        //     }
        //   });
        // }
        // } else {
        // setState({
        //   ...state,
        //   shopInfo: {
        //     ...state.shopInfo,
        //     QRCodeList: updatedQRCodeList,
        //   }
        // });
        // }

        // dispatch(actions.toggleLoadingSpinner(false));

        break;
      case 'CHANGE_SHOP_NAME'://改店名
        setState({
          ...state,
          shopInfo: {
            ...state.shopInfo,
            shopName: (value && value.length > MAX_SHOP_NAME_LENGTH) ?
              value.slice(0, MAX_SHOP_NAME_LENGTH) : value,
          }
        });
        break;
      case 'CHANGE_OWNER_NAME'://改摊主昵称
        setState({
          ...state,
          shopInfo: {
            ...state.shopInfo,
            ownerName: (value && value.length > MAX_OWNER_NAME_LENGTH) ?
              value.slice(0, MAX_OWNER_NAME_LENGTH) : value,
          }
        });
        break;
      case 'CHANGE_PHONE_NUMBER'://改联系电话
        setState({
          ...state,
          shopInfo: {
            ...state.shopInfo,
            phoneNumber: (value && value.length > MAX_PHONE_NUMBER_LENGTH) ?
              value.slice(0, MAX_PHONE_NUMBER_LENGTH) : value,
          }
        });
        break;
      case 'CHANGE_SHOP_ADDRESS'://改摊位地址
        setState({
          ...state,
          shopInfo: {
            ...state.shopInfo,
            address: value
          }
        });
        break;
      case 'CHANGE_SHOP_KIND_LARGE'://改店铺大分类
        // let urlIndex = classification.shopKinds.shopKindLargeImg.findIndex((it) => {
        //   return (it.shopKindLarge == value)
        // });
        let updatedIcon = state.shopInfo.shopIcon;
        if (defaulShopIcons && defaulShopIcons.length > 0) {
          let xIndex = state.shopInfo.shopIcon[0] && defaulShopIcons && defaulShopIcons.length > 0 &&
            defaulShopIcons.findIndex((it) => {//判断现在是否在使用默认头像
              return (state.shopInfo && state.shopInfo.shopIcon && state.shopInfo.shopIcon.length > 0 &&
                (state.shopInfo.shopIcon[0].url == it.url))
            })
          // let updatedIcon = ((!(state.shopInfo.shopIcon[0]) || xIndex > -1) && urlIndex > -1) ?//如果还没上传头像或正在使用默认头像，则根据店铺种类换默认头像
          updatedIcon = (!(state.shopInfo.shopIcon[0]) || (xIndex > -1)) ?//如果还没上传头像或正在使用默认头像，则根据店铺种类换默认头像
            [defaulShopIcons[i]] : state.shopInfo.shopIcon;
          console.log('updatedIcon', i, defaulShopIcons, updatedIcon, state.shopInfo.shopIcon);
        }
        setState({
          ...state,
          shopInfo: {
            ...state.shopInfo,
            shopIcon: updatedIcon,
            shopKinds: {
              ...state.shopInfo.shopKinds,
              shopKindLarge: value,
              shopKindSmall: [],
            }
          }
        });
        break;
      case 'CHANGE_SHOP_KIND_SMALL'://改店铺小分类
        setState({
          ...state,
          shopInfo: {
            ...state.shopInfo,
            shopKinds: {
              ...state.shopInfo.shopKinds,
              shopKindSmall: value
            }
          }
        });
        break;
      case 'CHANGE_SHOP_DES'://改店铺简介
        setState({
          ...state,
          shopInfo: {
            ...state.shopInfo,
            des: value
          }
        });
        break;
      case '':

        break;
      default:
        break;
    }
    props.handleSave();//保存
  }



  //handle payment options
  const handlePaymentOptionsOption = (way, v = null, i = null) => {
    // console.log(way);
    switch (way) {
      case 'CLICK_OPTION':
        let updatedOptions = [];
        v.forEach((it) => {
          let index = state.shopInfo.paymentOptions.findIndex(item => {
            return (item.option == it)
          });
          index > -1 ?
            updatedOptions.push({ option: it, account: state.shopInfo.paymentOptions[index].account }) :
            updatedOptions.push({ option: it, account: '' });
        })
        setState({
          ...state,
          shopInfo: {
            ...state.shopInfo,
            paymentOptions: updatedOptions,
          },
          addPaymentOptionInput: initState.addPaymentOptionInput,
          ifShowAddPaymentOptionInput: false,
        });
        break;
      case 'SHOW_ADD_OPTION'://显示添加新payment option的input
        setState({
          ...state,
          ifShowAddPaymentOptionInput: true
        });
        break;
      case 'CHANGE_OPTION_INPUT'://修改新payment option的input
        setState({
          ...state,
          addPaymentOptionInput: (v && v.length > MAX_PAYMENT_OPTION_OPTION_LENGTH)
            ? v.slice(0, MAX_PAYMENT_OPTION_OPTION_LENGTH) : v,
        });
        break;
      case 'CANCEL_ADD_OPTION'://取消添加新payment option
        setState({
          ...state,
          ifShowAddPaymentOptionInput: false,
          addPaymentOptionInput: initState.addPaymentOptionInput,
        });
        break;
      case 'SUBMIT_ADD_OPTION'://确定添加新付款方式的标签
        let newPaymentOption = { option: state.addPaymentOptionInput, account: '' };
        setState({
          ...state,
          shopInfo: {
            ...state.shopInfo,
            paymentOptions: [...state.shopInfo.paymentOptions, newPaymentOption]
          },
          paymentOptions: [...state.paymentOptions, newPaymentOption.option],
          ifShowAddPaymentOptionInput: false,
          addPaymentOptionInput: initState.addPaymentOptionInput
        });
        break;
      case '':
        break;

      default:
        break;
    }
    props.handleSave();//保存

  }
  const handlePaymentOptionsAccount = (way, value = null, i = null) => {
    let updatedItem = null;
    let updated = null;
    switch (way) {
      case 'CHANGE_INPUT'://改变payment account的input
        updatedItem = { ...state.shopInfo.paymentOptions[i], account: value }
        updated = state.shopInfo.paymentOptions;
        updated.splice(i, 1, updatedItem);
        setState({
          ...state,
          shopInfo: {
            ...state.shopInfo,
            paymentOptions: updated
          },
          addPaymentOptionInput: initState.addPaymentOptionInput,
          ifShowAddPaymentOptionInput: false,
        });
        break;
      case 'SET_SAME_AS_ABOVE'://payment account的input设为同上
        // console.log('SET_SAME_AS_ABOVE', state.shopInfo.paymentOptions);
        if ((state.shopInfo.paymentOptions[i - 1].option === '现金') && (i > 1)) {
          updatedItem = { ...state.shopInfo.paymentOptions[i], account: state.shopInfo.paymentOptions[i - 2].account }
        } else {
          updatedItem = { ...state.shopInfo.paymentOptions[i], account: state.shopInfo.paymentOptions[i - 1].account }
        }
        updated = state.shopInfo.paymentOptions;
        updated.splice(i, 1, updatedItem);
        setState({
          ...state,
          shopInfo: {
            ...state.shopInfo,
            paymentOptions: updated
          },
          addPaymentOptionInput: initState.addPaymentOptionInput,
          ifShowAddPaymentOptionInput: false,
        });
        break;
      case '':

        break;
      default:
        break;
    }
    props.handleSave();//保存
  }

  const handleImg = (way, imgUrl = state.previewingImg) => {
    let urls = state.shopInfo.QRCodeList.map(it => { return (it.url) })
    switch (way) {
      case 'PREVIEW_IMG':
        Taro.previewImage({
          current: imgUrl,
          urls: urls,
        })
        break;
      case '':
        break;
      default:
        break;
    }
  }

  //handle action buttons
  const handleActionButtons = (way, value = null, i = null) => {
    switch (way) {
      case 'MODIFY':
        setState({
          ...state,
          mode: 'SELLER_MODIFYING'
        });
        break;
      case 'SAVE':
        setState({
          ...state,
          mode: 'SELLER_PREVIEW'
        });
        break;
      case '':

        break;
      default:
        break;
    }
  }




  let showedLargeKinds = classification.shopKinds.shopKindLarge.slice(1);//过滤掉‘所有’标签
  let smallIndex = classification.shopKinds.shopKindSmall.findIndex((it) => {
    return (it.shopKindLarge == state.shopInfo.shopKinds.shopKindLarge)
  });
  let showedSmallKinds = (smallIndex > -1) ? classification.shopKinds.shopKindSmall
  [smallIndex].shopKindSmall.slice(1) : [];
  let defaultIconDialog =
    <View className='default_icons_dialog'>
      <Dialog
        isOpened={state.openedDialog === 'DEFAULT_SHOP_ICONS'}
        onClose={() => toggleDialog(null)}
        title='默认头像'
      >
        <View className='default_icons'>
          {defaulShopIcons.map((it) => {//默认头像图集
            let imgItem = [{ url: it.url }];
            return (
              <Image
                className='default_icon'
                src={it.url}
                onClick={() => handleChange('CHANGE_SHOP_ICON', imgItem)}
              />
            )
          })}
        </View>
      </Dialog>
    </View>

  let shopIcon = (
    <View className='shop_icon'>
      <AtImagePicker
        files={state.shopInfo.shopIcon}//店铺头像
        multiple={false}
        count={1}
        showAddBtn={state.shopInfo.shopIcon.length > 0 ? false : true}
        length={1}
        onChange={(files) => handleChange('CHANGE_SHOP_ICON', files)}
      />
      <Button
        className='default_icon_button center_vertically'
        onClick={() => toggleDialog('DEFAULT_SHOP_ICONS')}
      >默认头像</Button>
    </View>
  )

  let basicInfo = (
    <View className='basic_info'>
      <View className='shop_info_container_item'>
        <View className='required_mark'>*</View>
        <AtInput
          name='shopName'
          title='摊名'
          type='text'
          cursor={state.shopInfo.shopName && state.shopInfo.shopName.length}//不加这个手机上会默认为0
          value={state.shopInfo.shopName}
          onChange={(value) => handleChange('CHANGE_SHOP_NAME', value)}
        />
      </View>
      <View className='shop_info_container_item'>
        <View className='required_mark'>*</View>
        <AtInput
          name='ownerName'
          title='摊主昵称'
          type='text'
          cursor={state.shopInfo.ownerName && state.shopInfo.ownerName.length}
          value={state.shopInfo.ownerName}
          onChange={(value) => handleChange('CHANGE_OWNER_NAME', value)}
        />
      </View>
      <View className='shop_info_container_item'>
        <View className='required_mark'>*</View>
        <AtInput
          name='phoneNumber'
          title='联系电话'
          type='number'
          cursor={state.shopInfo.phoneNumber && String(state.shopInfo.phoneNumber).length}
          value={state.shopInfo.phoneNumber}
          onChange={(value) => handleChange('CHANGE_PHONE_NUMBER', value)}
        />
      </View>
      <View className='shop_info_container_item'>
        <View className='required_mark'>*</View>
        <AtInput
          name='shopAddress'
          title='摊位地址'
          type='text'
          cursor={state.shopInfo.address && state.shopInfo.address.length}
          value={state.shopInfo.address}
          onChange={(value) => handleChange('CHANGE_SHOP_ADDRESS', value)}
        />
      </View>

      <View className='shop_kinds_chooser'>
        <View className='shop_info_container_item '>
          <View className='required_mark'>*</View>
          <View className='title'> 地摊类型: </View>
          <View className="large_kinds">
            {showedLargeKinds.map((it, i) => {
              return (
                <Button
                  plain={true}
                  className={it == state.shopInfo.shopKinds.shopKindLarge ? 'choosen' : ''}
                  onClick={() => handleChange('CHANGE_SHOP_KIND_LARGE', it, i)}
                >
                  {it}
                </Button>
              )
            })}
          </View>
        </View>
        {state.shopInfo.shopKinds.shopKindLarge &&
          <MultipleChoiceButtonsBox
            itemList={showedSmallKinds}
            choosenList={state.shopInfo.shopKinds.shopKindSmall}
            onChoose={(itemList) => handleChange('CHANGE_SHOP_KIND_SMALL', itemList)}
          />
        }
      </View>
    </View>
  )


  let paymentOptions = state.shopInfo.paymentOptions &&
    state.shopInfo.paymentOptions.map((it) => {
      return (it.option)
    })
  let paymentOption = (
    <View className='shop_info_container_item payment_option'>
      <View className='flex'>
        <View className='required_mark'>*</View>
        <View className='title flex'> 付款方式：<View style={'color:var(--gray-2)'}>(账号只对下单用户可见)</View></View>
      </View>
      <MultipleChoiceButtonsBox
        itemList={state.paymentOptions}
        choosenList={paymentOptions}
        onChoose={(itemList) => handlePaymentOptionsOption('CLICK_OPTION', itemList)}
      >
        {state.ifShowAddPaymentOptionInput ||//*problem 如果这里?:函数，就会有事件未注册在dom的错误
          <View
            className='at-icon at-icon-add-circle '
            onClick={() => handlePaymentOptionsOption('SHOW_ADD_OPTION')}
          />
        }
        {state.ifShowAddPaymentOptionInput &&
          <View className='add_payment_option '>
            <AtInput
              name='add_payment_option_input'
              value={state.addPaymentOptionInput}
              cursor={state.addPaymentOptionInput && state.addPaymentOptionInput.length}
              onChange={(value) => handlePaymentOptionsOption('CHANGE_OPTION_INPUT', value)}
            />
            <View
              className='at-icon at-icon-close action_button'
              onClick={() => handlePaymentOptionsOption('CANCEL_ADD_OPTION')}
            />
            <View
              className='at-icon at-icon-check action_button'
              onClick={() => handlePaymentOptionsOption('SUBMIT_ADD_OPTION')}
            />
          </View>
        }
      </MultipleChoiceButtonsBox>

      <View className='accounts shop_info_container_item'>
        {
          state.shopInfo.paymentOptions && state.shopInfo.paymentOptions.map((it, i) => {
            return (
              (it.option === '现金') ?
                <AtInput
                  key={i}
                  editable={false}
                  name={'payment_option_accout_item_input_'.concat(i)}
                  title={it.option}
                /> :
                <AtInput
                  key={i}
                  name={'payment_option_accout_item_input_'.concat(i)}
                  title={it.option}//* must warp a element witch isn't <text> around it if you use'{}' here !!!!
                  placeholder={it.option + '账号'}
                  cursor={it.account && it.account.length}
                  value={it.account}
                  onChange={(value) => handlePaymentOptionsAccount('CHANGE_INPUT', value, i)}//* not '(value,i) =>' here!!!!
                >
                  {
                    <Button
                      className={'payment_option_buttons'.concat(
                        ((i > 0) &&
                          !((i === 1) && (state.shopInfo.paymentOptions[0].option === '现金'))) ? '' : ' payment_option_buttons_transparent'
                      )}
                      onClick={() => handlePaymentOptionsAccount('SET_SAME_AS_ABOVE', null, i)}
                    >
                      同上
                     </Button>
                  }
                </AtInput>
            )
          })
        }
      </View>


    </View>
  )

  let otherInfo = (
    <View className='wrap other_info'>
      <View className='title'>
        地摊简介:
         </View>
      <AtTextarea
        name='shopDes'
        type='text'
        maxLength={50}
        value={state.shopInfo.des}
        onChange={(value) => handleChange('CHANGE_SHOP_DES', value)}
      />
      <View className='title'>
        微信群二维码:
      </View>
      <AtImagePicker
        files={state.shopInfo.QRCodeList}
        multiple={true}
        onChange={(files) => handleChange('ADD_QRCODE', files)}
      />
    </View>
  )
  // console.log('shop info ', state);
  return (
    <View className={'shop_info_container '.concat(props.className)}>
      {defaultIconDialog}
      <AtToast
        className='toast'
        isOpened={state.showedToast}
        text={state.showedToast}
        onClose={() => handleInit(null)}
        duration={2000}
      />
      {((state.mode == 'BUYER') ||
        (state.mode == 'SELLER_PREVIEW')) &&
        (
          <View className={'preview_mode '.concat((state.mode == 'SELLER_PREVIEW') ? 'mode_saved' : '')}>
            <View className='header'>
              <View className='part_1 flex items-center justify-center'>
                {state.shopInfo.shopIcon && state.shopInfo.shopIcon.length > 0 &&
                  <Image
                    className='shop_img '
                    src={state.shopInfo.shopIcon[0].url} />
                }
              </View>
              <View className='part_2 flex flex-col justify-center'>
                {/* <View className='shop_anno'>
                  {state.shop.announcements && state.shop.announcements.length > 0 &&
                    state.shop.announcements[0].length>0&&state.shop.announcements[0]}
                </View> */}
                <View className='flex' style={'align-items: flex-end;'}>
                  <View className='shop_name'>
                    {state.shopInfo.shopName}
                  </View>
                  <View
                    className='at-icon at-icon-volume-minus'
                    onClick={() => toggleDialog('ANNOS')}
                  />
                </View>
                <View className='shop_kind'>
                  <View className='shop_kind_large'>
                    {state.shopInfo.shopKinds.shopKindLarge}
                  </View>
                  <View className='shop_kind_small'>
                    {state.shopInfo.shopKinds.shopKindSmall.map((it, i) => {
                      return (
                        <View
                          className=''
                          key={i}
                        >{it}</View>
                      );
                    })}
                  </View>
                </View>
                <View className='des'>
                  {state.shopInfo.des}
                </View>
              </View>
              <View className='part_3 lateral_buttons'>
                <View
                  className='lateral_button'
                  onClick={() => toggleDialog('SHOP_INFO')} > 详细信息 </View>
                <View
                  className='lateral_button'
                  onClick={() => toggleDialog('PICK_UP_WAY')} > 送货方式 </View>
                <View
                  className='at-icon at-icon-image lateral_button'
                  onClick={() => toggleDialog('QR_CODES')} />
              </View>
            </View>
            {
              <AtFloatLayout
                className='pick_up_ways_dialog'
                isOpened={state.openedDialog === 'PICK_UP_WAY'}
                title="送货方式"
                onClose={() => handleInit()}
              >
                <PickUpWayContainer
                  mode={'BUYER'}
                  shop={state.shop}
                />
              </AtFloatLayout>
            }
            {
              <AtFloatLayout
                isOpened={state.openedDialog === 'SHOP_INFO'}
                title="详细信息"
                onClose={() => handleInit()}
              >
                <View className='info'>
                  <View className='item'>
                    <View className='title'> 摊主昵称: </View>
                    <View className='content'> {state.shopInfo.ownerName} </View>
                  </View>
                  <View className='item'>
                    <View className='title'> 联系电话: </View>
                    <View className='content'> {state.shopInfo.phoneNumber} </View>
                  </View>
                  <View className='item'>
                    <View className='title'> 摊位地址: </View>
                    <View className='content'> {state.shopInfo.address} </View>
                  </View>
                  <View className='item'>
                    <View className='title'> 付款方式: </View>
                    <View className=''>
                      {state.shopInfo.paymentOptions.map((it, i) => {
                        return (
                          <View
                            key={i}
                            className='item'>
                            <View className='title'>
                              {it.option}
                            </View>
                            <View className='account'>
                              {state.mode == 'SELLER_PREVIEW' &&
                                <View className=''>
                                  (账户：{it.account})
                             </View>
                              }
                            </View>
                          </View>
                        )
                      })}
                    </View>
                  </View>
                </View>

              </AtFloatLayout>
            }

            {
              <AtFloatLayout
                isOpened={state.openedDialog === 'ANNOS'}
                title="地摊公告"
                onClose={() => handleInit()}
              >
                <View className=''>
                  {state.announcements && state.announcements.length > 0 ?
                    state.announcements.map((it, i) => {
                      return (
                        <View className='anno'>
                          <View
                            className='at-icon at-icon-volume-minus'
                          />
                          <View className='word'>
                            {it}
                          </View>
                        </View>
                      )
                    }) :
                    <View className='empty_word'> 暂无公告</View>
                  }
                </View>
              </AtFloatLayout>
            }
            {
              <AtFloatLayout
                isOpened={state.openedDialog === 'QR_CODES'}
                title="群二维码"
                onClose={() => handleInit()}>
                <View className=''>
                  {state.shopInfo.QRCodeList && state.shopInfo.QRCodeList.length > 0 ?
                    state.shopInfo.QRCodeList.map((it, i) => {
                      return (
                        <Image
                          key={i}
                          className='qr_code'
                          src={it.url}
                          onClick={() => handleImg('PREVIEW_IMG', it.url)}
                        />
                      )
                    }) :
                    <View className='empty_word'>暂无微信群</View>
                  }
                </View>
              </AtFloatLayout>
            }
          </View>
        )}
      {state.mode == 'SELLER_MODIFYING' && (
        <View className=''>
          {shopIcon}
          {basicInfo}
          {paymentOption}
          {otherInfo}
        </View>
      )}
      {
        !(state.mode === 'BUYER') &&
        <ActionButtons
          type={3}
          position={'RIGHT'}
          onClickLeftButton={() => handleActionButtons('SAVE')}
          onClickRightButton={() => handleActionButtons('MODIFY')}
          leftWord='预览'
          rightWord='修改'
        />
      }
    </View>
  )
}

export default forwardRef(ShopInfoContainer);