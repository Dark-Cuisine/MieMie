import React, { Component, useState, useReducer, useEffect, useImperativeHandle, forwardRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtModal, AtImagePicker, AtTextarea, AtToast } from 'taro-ui'
import dayjs from 'dayjs'
import * as actions from "../../redux/actions";

import ActionDialog from '../../components/dialogs/ActionDialog/ActionDialog'
import ActionButtons from '../../components/buttons/ActionButtons/ActionButtons'
import Dialog from '../../components/dialogs/Dialog/Dialog'
import SearchBar from './SearchBar/SearchBar'
import ShopProductCard from '../../components/cards/ShopProductCard/ShopProductCard'
import MultipleChoiceButtonsBox from '../../components/MultipleChoiceButtonsBox/MultipleChoiceButtonsBox'


import * as databaseFunctions from '../../utils/functions/databaseFunctions'

import './ShopProductsContainer.scss'

const db = wx.cloud.database();
const _ = db.command;

const MAX_LABEL_NAME_LENGTH = 10;
const MAX_PRODUCT_UNIT_LENGTH = 10;
const MAX_PRODUCT_ICONS_LENGTH = 2;
/**
 * 店内商品列表（包括筛选栏、label切换、商品list）
 * 
<ShopProductsContainer
type={state.type} //'EVENT'活动,'GOODS'商品

shop={state.shop} 
mode={'SELLER_MODIFYING'}
productList={state.productList}
labelList={state.shop.products.labelList}
handleSave={() => handleSave()}

maxProductIconsLength={1}

//choosenProducts={}//when mode === 'SOLITAIRE_SELLER'
// handleChoose={}
// handleUnChoose={}

/>
 */
//LABEL,PRODUCT
const ShopProductsContainer = (props, ref) => {
  const dispatch = useDispatch();
  const shopsManager = useSelector(state => state.shopsManager);
  const userManager = useSelector(state => state.userManager);
  const publicManager = useSelector(state => state.publicManager);
  const layoutManager = useSelector(state => state.layoutManager);
  const initState = {
    shop: props.shop,
    labelList: (props.shop && props.shop.products && props.shop.products.labelList)
      ? props.shop.products.labelList : [{ name: 'All' }],
    productList: (props.productList && props.productList.length > 0) ? props.productList : [],
    deletedProducts: [],//被删除的商品

    launchedProducts: [],//上架的商品
    discontinuedProducts: [],//暂时下架的商品

    currentLabelIndex: 0,//当前label的index，或者'DIS_CONTINUE'（用index是为了防止label重名

    //正在修改的item，同时也能用来init新item
    modifyingLabel: { name: '' },
    modifyingProduct: {
      name: '',
      icon: [],
      price: '',
      stock: null,
      unit: props.type === 'GOODS' ? '' : '人', //单位
      updatedStock: {
        way: '',//'ADD','SUBTRACT'
        quantity: ''
      },
      labels: [],
      des: '',
      status: '',//'LAUNCHED','DISCONTINUED'
    },

    currentItemIndex: null,
    showedToast: null,

    isSearching: false,
  }
  const initDeletedImgList = {
    productIcons: [],
  }
  const [state, setState] = useState(initState);
  const [openedDialog, setOpenedDialog] = useState(null);//'LABEL','PRODUCT','ADD_STOCK','SUBTRACT_STOCK,'DISCONTINUE_PRODUCT',
  //'BUYER','SELLER_MODIFYING','SELLER_PREVIEW','SOLITAIRE_BUYER','SOLITAIRE_SELLER'
  const [mode, setMode] = useState(props.mode);
  const [deletedImgList, setDeletedImgList] = useState(initDeletedImgList);//要从云储存删除的图片

  useEffect(() => {
  }, []);
  useEffect(() => {
    setMode(props.mode)
  }, [props.mode]);
  useEffect(() => {
    doUpdate(state.shop, state.productList, state.labelList)
  }, [shopsManager.searchedProductList]);

  // useEffect(() => {//*problem 这个不记得有什么用了，好像可以删？
  //   console.log('spc-reload-1', props.productList);
  //   doUpdate(initState.shop, initState.productList, initState.labelList, initState.currentLabelIndex)
  // }, [props.productList])
  useEffect(() => {
    // if (!(state.productList === null) &&
    //   props.shop && props.shop._id &&//*problem shop._id变了才重新init，不然manageshoppage切换tab时会被init回去。但加了这个复制接龙又会出现问题
    //   state.shop && state.shop._id &&
    //   (props.shop._id == state.shop._id)) { return }
    if ((props.shop && props.shop.products &&
      props.shop.products.productList && props.shop.products.productList.length > 0) ||
      (props.shop && props.shop.products)) {
      let idList = [];
      props.shop.products.productList &&
        props.shop.products.productList.forEach(it => {
          idList.push(it.id)
        })
      dispatch(actions.toggleLoadingSpinner(true));

      wx.cloud.callFunction({
        name: 'get_data',
        data: {
          collection: 'products',

          operatedItem: '_ID',
          queriedList: idList,
        },
        success: (r) => {
          dispatch(actions.toggleLoadingSpinner(false));
          r.result &&
            doUpdate(initState.shop, r.result.data, initState.labelList, initState.currentLabelIndex);
        },
        fail: () => {
          dispatch(actions.toggleLoadingSpinner(false));
          console.error
        }
      });

    } else {
      doUpdate(initState.shop, initState.productList, initState.labelList, initState.currentLabelIndex)
    }
  }, [props.shop, props.productList])//*problem 这里不能直接用props.shop，否则点了确定上传店铺再取消时，会init成修改前的商品


  useImperativeHandle(ref, () => ({
    getValue: () => {
      // console.log('useImperativeHandle getValue,', state.labelList);
      return ({
        labelList: state.labelList,
        productList: state.productList,
        deletedProducts: state.deletedProducts,
        deletedImgList: deletedImgList
      })
    }
  }));

  const hadleClickLabel = (i) => {//切换商品label页面
    doUpdate(state.shop, state.productList, state.labelList, i)
  }


  const doUpdate = (shop, products, labels, currentLabelIndex = state.currentLabelIndex) => {
    console.log('doUpdate', shop, products, labels, currentLabelIndex)
    if (!products) { return }
    let updated_productList = products.map((it, i) => ({//给每个item加个index，供之后使用
      ...it,
      index: i,
    }));

    setOpenedDialog(null)
    setState({
      ...state,
      shop: shop,
      labelList: labels,
      productList: updated_productList,
      currentLabelIndex: currentLabelIndex,

      modifyingLabel: initState.modifyingLabel,
      modifyingProduct: initState.modifyingProduct,

      currentItemIndex: initState.currentItemIndex,

    });
  }
  const filterProducts = (products, label = null, ifShowDiscontinued = false) => {//返回有label标签的products //*unfinished 现在还不能应对label重名的情况
    let returnV = [];
    if (!products) { return returnV }
    if (ifShowDiscontinued) {//是否显示暂时下架的商品
      returnV = state.isSearching ?
        shopsManager.searchedProductList : products
      return returnV
    }
    let discontinuedProducts = products.filter((it) => {
      return (it.status == 'DISCONTINUED')
    });
    let launchedProducts = products.filter((it) => {
      return (it.status == 'LAUNCHED')
    });
    returnV = state.isSearching ?//如果正在搜索商品，则返回搜索匹配的商品
      shopsManager.searchedProductList :
      ((label && label == 'DIS_CONTINUE') ?
        discontinuedProducts :
        launchedProducts.filter((it => {//筛选当前标签的已上架的商品
          return (it.labels.indexOf(label) > -1)
        })));
    return returnV;
  }


  const toggleSearchBar = (ifOpen) => {//toggle搜索
    setState({
      ...state,
      isSearching: (ifOpen === null) ? !state.isSearching : ifOpen
    });
  }

  const toggleDialog = (way, it = null, i = null, e = null) => {
    e && e.stopPropagation();

    setOpenedDialog(way)
    switch (way) {
      case 'LABEL':
      case 'DELETE_LABEL':
        setState({
          ...state,
          modifyingLabel: (it === null) ? initState.modifyingLabel : it,
          currentItemIndex: i,
        });
        break;
      case 'PRODUCT':
      case 'DISCONTINUE_PRODUCT':
      case 'DELETE_PRODUCT':
        let updatedLabels = state.currentLabelIndex === 'DIS_CONTINUE' ?
          initState.modifyingProduct.labels :
          (state.currentLabelIndex ?//判断是否额外加上'All'标签
            [initState.labelList[0].name, state.labelList[state.currentLabelIndex].name] :
            [state.labelList[state.currentLabelIndex].name]);
        setState({
          ...state,
          modifyingProduct: (it === null) ? {
            ...initState.modifyingProduct,
            labels: updatedLabels
          } : it,
          currentItemIndex: i,
        });
        break;
      case 'CONTINUE_PRODUCT':
        setState({
          ...state,
          modifyingProduct: it,
          currentItemIndex: i,
        });
        break;
      case 'ADD_STOCK':
      case 'SUBTRACT_STOCK':
        setState({
          ...state,
          modifyingProduct: state.productList[i],
          currentItemIndex: i,
        });
        break;
      case '':
        break;
      default:
        break;
    }
  }




  const handleDelete = () => {
    setOpenedDialog(null)
    let updated_labelList = state.labelList;
    switch (openedDialog) {
      case 'DELETE_LABEL':
        let deletedLabel = state.labelList[state.currentItemIndex];//用index是为了防止label重名
        let updatedProductList = state.productList || [];
        updatedProductList.forEach((it) => {//把被删除的标签从product中也删掉
          (it.labels.indexOf(deletedLabel) > -1) &&
            it.labels.splice(deletedLabelIndex, 1);
        });

        let updated_currentLabelIndex = (state.currentLabelIndex < state.currentItemIndex) ?//删除一个label后更新当前label的index
          state.currentLabelIndex : (state.currentLabelIndex - 1);

        updated_labelList.splice(state.currentItemIndex, 1);//删除label
        setState({
          ...state,
          productList: updatedProductList,
          labelList: updated_labelList,
          currentLabelIndex: updated_currentLabelIndex,

          modifyingLabel: initState.modifyingLabel,
          currentItemIndex: initState.currentItemIndex,
        });
        break;
      case 'DELETE_PRODUCT':
        let updated_deletedProducts = state.deletedProducts;//如果被删除的商品已经有_id，则加到deletedProducts里
        state.productList[state.currentItemIndex]._id &&
          updated_deletedProducts.push(state.productList[state.currentItemIndex]);

        let updated_productList = state.productList || [];
        updated_productList.splice(state.currentItemIndex, 1);
        setOpenedDialog(null)
        setState({
          ...state,
          productList: updated_productList,
          deletedProducts: updated_deletedProducts,

          modifyingProduct: initState.modifyingProduct,
          currentItemIndex: initState.currentItemIndex,
        });
        break;
      default:
        break;
    }
  }

  const handleChange = async (way, v = null, i = null) => {
    switch (way) {
      case 'LABEL':
        setState({
          ...state,
          modifyingLabel: {
            ...state.modifyingLabel,
            name: (v && v.length > MAX_LABEL_NAME_LENGTH) ?
              v.slice(0, MAX_LABEL_NAME_LENGTH) : v,
          }
        });
        break;
      case 'PRODUCT_ICONS'://*unfinished 最好在这里就压缩，然后判断一下图片大小
        console.log('PRODUCT_ICONS', v);
        // dispatch(actions.toggleLoadingSpinner(true));

        let deleted = [];
        state.modifyingProduct.icon &&
          state.modifyingProduct.icon.forEach(value => {
            let index = (v && (v.length > 0)) ?
              v.findIndex(va => {
                return (va.url == value.url)
              }) : -1;
            (index < 0 && value.fileID) &&//如果有cloudPath(已经传上过云端)，且已经不在更新的图集里了，则需要从云储存删除
              deleted.push(value)
          })
        deleted.length > 0 &&
          setDeletedImgList({
            ...deletedImgList,
            productIcons: [...deletedImgList.productIcons, ...deleted]
          })

        if (v) {
          setState({
            ...state,
            modifyingProduct: {
              ...state.modifyingProduct,
              icon: v,
            }
          });
        } else {
          setState({
            ...state,
            modifyingProduct: {
              ...state.modifyingProduct,
              icon: [],
            }
          });
        }


        break;
      case 'PRODUCT_NAME':
        setState({
          ...state,
          modifyingProduct: {
            ...state.modifyingProduct,
            name: v
          }
        });
        break;
      case 'PRODUCT_PRICE':
        setState({
          ...state,
          modifyingProduct: {
            ...state.modifyingProduct,
            price: (v && v.length > 0) ? Number(v) : null,
          }
        });
        break;
      case 'PRODUCT_UNIT':
        setState({
          ...state,
          modifyingProduct: {
            ...state.modifyingProduct,
            unit: (v && v.length > MAX_PRODUCT_UNIT_LENGTH) ?
              v.slice(0, MAX_PRODUCT_UNIT_LENGTH) : v,
          }
        });
        break;
      case 'PRODUCT_STOCK_INPUT':
        setState({
          ...state,
          modifyingProduct: {
            ...state.modifyingProduct,
            stock: (v && v.length > 0) ? Number(v) : null,
          }
        });

        break;
      case 'PRODUCT_DES':
        setState({
          ...state,
          modifyingProduct: {
            ...state.modifyingProduct,
            des: v
          }
        });
        break;
      case 'PRODUCT_LABELS':
        setState({
          ...state,
          modifyingProduct: {
            ...state.modifyingProduct,
            labels: v
          }
        });
        break;
      case 'UPDATE_STOCK':
        setState({
          ...state,
          modifyingProduct: {
            ...state.modifyingProduct,
            updatedStock: {
              ...state.modifyingProduct.updatedStock,
              way: (openedDialog === 'ADD_STOCK') ? 'ADD' : 'SUBTRACT',
              quantity: Number(v)
            },
          }
        });
        break;
      case '':

        break;
      default:
        break;
    }
  }

  const handleInit = (e = null) => {
    e && e.stopPropagation();
    setOpenedDialog(null)
    setState({
      ...state,
      modifyingLabel: initState.modifyingLabel,
      modifyingProduct: initState.modifyingProduct,

      currentItemIndex: initState.currentItemIndex,
    });

  }

  const handleSubmit = async (way, updated_product = state.modifyingProduct,
    currentItemIndex = state.currentItemIndex) => {//handle submit
    setOpenedDialog(null)
    let updated_products = state.productList || [];
    let updated_labelList = state.labelList;
    let updated_currentLabelIndex = state.currentLabelIndex;
    switch (way) {
      case 'LABEL':
        if (currentItemIndex === null) {
          updated_labelList.push(state.modifyingLabel);
          updated_currentLabelIndex = state.labelList.length - 1;//*这里有-1
        } else {
          updated_labelList.splice(currentItemIndex, 1, state.modifyingLabel);
        }
        break;
      case 'PRODUCT':
        updated_product = {
          ...state.modifyingProduct,
          status: 'LAUNCHED',
        };
        if (state.modifyingProduct.status === 'DISCONTINUED') {
          let oldStock = state.modifyingProduct.oldStock;
          //let newStock = state.modifyingProduct.stock;
          updated_product = {
            ...updated_product,
            // stock: (newStock && newStock.length > 0) ? Number(oldStock) : null,//*unfinished还不能应对库存改为不限量
            status: 'DISCONTINUED',
            //stock: Number(oldStock),
          };
        }

        // // 接龙mode直接往数据库加商品
        // if (mode === 'SOLITAIRE_SELLER' &&
        //   !updated_product._id) {//*unfinished 需简化
        //   let productId = await databaseFunctions.product_functions.addNewProducts(
        //     'RETURN_ID', [updated_product], state.shop._id, '接龙店', userManager.unionid)
        //   console.log('productId', productId);
        //   updated_product._id = productId
        //   props.handleChoose &&
        //     props.handleChoose(updated_product)
        // }

        console.log('updated_productupdated_product', updated_product);
        (currentItemIndex === null) ?
          updated_products.push(updated_product) :
          updated_products.splice(currentItemIndex, 1, updated_product);
        break;
      case 'UPDATE_STOCK':
        updated_products.splice(currentItemIndex, 1, state.modifyingProduct);
        break;
      case 'DISCONTINUE_PRODUCT':
        let newStock = Number(updated_product.stock);
        let quantity = Number(updated_product.updatedStock.quantity);
        if (updated_product.updatedStock.way && updated_product.updatedStock.way.length > 0) {
          newStock = (updated_product.updatedStock.way === 'ADD') ?
            (newStock + quantity) : (newStock - quantity)
        }
        updated_products.splice(currentItemIndex, 1,
          {
            ...updated_product,
            status: 'DISCONTINUED',
            oldStock: updated_product.stock,//给后面重新上架用
            stock: Number(newStock),
            updatedStock: {
              way: '',
              quantity: ''
            },
          });
        break;
      case 'CONTINUE_PRODUCT':
        let diff = Number(updated_product.stock) - Number(updated_product.oldStock)
        updated_product = {
          ...updated_product,
          updatedStock: {//*重新上架时可以直接使用原来的stock判断，因为下架时商品stock不会再变化了
            way: (diff > 0) ? 'ADD' : (
              (!diff) ? '' : 'SUBTRACT'),
            quantity: Number(Math.abs(updated_product.stock - updated_product.oldStock))
          },
          stock: updated_product.oldStock,
          status: 'LAUNCHED',
        };
        updated_products.splice(currentItemIndex, 1, updated_product);
        break;
      case '':

        break;
      default:
        break;
    }
    doUpdate(state.shop, updated_products, updated_labelList, updated_currentLabelIndex);
  }

  const handleActionButtons = (way, i = null, e = null) => {
    e && e.stopPropagation();

    switch (way) {
      case 'MODIFY':
        setMode('SELLER_MODIFYING')
        break;
      case 'SAVE':
        setMode('SELLER_PREVIEW')
        break;
      case '':
        break;
      default:
        break;
    }
    props.handleSave();
  }


  const judgeIfChoosen = (product) => {
    return (props.choosenProducts && props.choosenProducts.findIndex(it => {
      return it.id == product._id
    }) > -1)
  }


  let labelDialog = (//label的输入框
    <ActionDialog
      type={0}
      closeOnClickOverlay={!(state.modifyingLabel.name && state.modifyingLabel.name.length > 0)}
      title={(state.currentItemIndex === null) ? '添加标签' : '修改标签'}
      isOpened={openedDialog === 'LABEL'}
      onClose={handleInit.bind(this)}//*一定要加上这个否则按遮罩层关闭时虽然关了but不会改变state里的ifOpenLabelDialog！！！！
      onCancel={() => handleInit()}
      onSubmit={handleSubmit.bind(this, 'LABEL')}
      checkedItems={[
        {
          check: state.modifyingLabel.name.length > 0,
          toastText: '请填写标签名'
        }
      ]}
    >
      <AtInput
        name='modifyingLabelInput'
        focus={state.ifOpenLabelDialog}
        type='text'
        value={state.modifyingLabel.name}
        onChange={v => handleChange('LABEL', v)}
      />
    </ActionDialog>
  );


  let labelList = (
    <scroll-view
      className='labels_list'
      scroll-y={true}
    >
      {state.labelList &&
        state.labelList.map((it, i) => {
          return (
            <View className={'label_item'.concat(
              (i == state.currentLabelIndex) ? ' choosen' : ' un_choosen')}
            >
              <View className='label_name'
                onClick={hadleClickLabel.bind(this, i)}
              >
                {it.name}
              </View>
              {mode === 'SELLER_MODIFYING' && (i > 0) &&
                <ActionButtons
                  type={2}
                  position={'LEFT'}
                  actionButtonList={
                    [
                      {
                        word: '修改',
                        onClick: (e) => toggleDialog('LABEL', it, i, e),
                      },
                      {
                        word: '删除',
                        onClick: (e) => toggleDialog('DELETE_LABEL', it, i, e),
                      },
                    ]
                  }
                />
              }
            </View>
          )
        })}
      {(mode === 'SELLER_MODIFYING' || mode === 'SOLITAIRE_SELLER') &&
        <View className={'label_item dis_continue_button_'.concat(
          (state.currentLabelIndex && state.currentLabelIndex === 'DIS_CONTINUE') ? 'choosen' : 'un_choosen')}
          onClick={hadleClickLabel.bind(this, 'DIS_CONTINUE')}
        >
          暂时下架
        </View>
      }
      {(mode === 'SELLER_MODIFYING' || mode === 'SOLITAIRE_SELLER') &&
        <View
          className='at-icon at-icon-add-circle'
          onClick={() => toggleDialog('LABEL')}
        />
      }
    </scroll-view>
  );


  let labelNameList = [];
  state.labelList.slice(1).forEach((it) => {//* 去除'All'的label的name的list
    labelNameList.push(it.name)
  })
  let productCheckedItems = [{
    check: state.modifyingProduct.name.length > 0,
    toastText: props.type === 'GOODS' ? '请填写商品名' : '请填写选项名'
  },
  ]
  props.type === 'GOODS' &&
    productCheckedItems.push({
      check: (state.modifyingProduct.price ||
        state.modifyingProduct.price === 0)
        && String(state.modifyingProduct.price).length > 0,
      toastText: '请填写商品价格'
    }, {
      check: state.modifyingProduct.unit.length > 0,
      toastText: '请商品计量单位！'
    })

  let productDialog = (//product的输入框
    <ActionDialog
      className='product_dialog'
      closeOnClickOverlay={!(state.modifyingProduct.name.length > 0 ||
        (state.modifyingProduct.price && String(state.modifyingProduct.price.length) > 0) ||
        state.modifyingProduct.unit.length > 0)}
      isOpened={openedDialog === 'PRODUCT' || openedDialog === 'CONTINUE_PRODUCT'}
      title={openedDialog === 'CONTINUE_PRODUCT' ? '重新上架' :
        ((state.modifyingProduct.status.length > 0 ? '修改' : '添加') +
          (props.type === 'GOODS' ? '商品' : '报名费'))
      }
      onClose={handleInit.bind(this)}
      onCancel={handleInit.bind(this)}
      onSubmit={handleSubmit.bind(this, openedDialog)}
      checkedItems={productCheckedItems}
    >
      <View className='action_dialog_content'>
        <AtImagePicker
          className={props.maxProductIconsLength > 1 ? '' : 'at-image-picker-small'}
          sizeType={['compressed']}
          files={state.modifyingProduct.icon}
          multiple={true}
          count={props.maxProductIconsLength}
          length={props.maxProductIconsLength}
          onChange={(files) => handleChange('PRODUCT_ICONS', files)}
          showAddBtn={(state.modifyingProduct.icon.length > (props.maxProductIconsLength - 1) || (props.maxProductIconsLength === 0)) ? false : true}
        />
        <View className='input_item'>
          <View className='required_mark'>*</View>
          <AtInput
            focus={state.ifOpenProductDialog}
            name='productNameInput'
            type='text'
            title={props.type === 'GOODS' ? '商品名' : '选项名'}
            placeholder={props.type === 'GOODS' ? '' : '如:普通票'}
            value={state.modifyingProduct.name}
            onChange={v => handleChange('PRODUCT_NAME', v)}
          />
        </View>
        <View className='input_item'>
          {props.type === 'GOODS' &&
            <View className='required_mark'>*</View>}
          <AtInput
            name='productPriceInput'
            type='number'
            title={props.type === 'GOODS' ? '价格' : '报名费'}
            cursor={state.modifyingProduct.price && String(state.modifyingProduct.price).length}
            value={state.modifyingProduct.price}
            onChange={v => handleChange('PRODUCT_PRICE', v)}
          />
        </View>
        {
          (props.type === 'GOODS' &&
            state.modifyingProduct._id && state.modifyingProduct.status == 'LAUNCHED') ||
          <AtInput
            name='productStock'
            type='number'
            title={props.type === 'GOODS' ? '库存' : '名额数'}
            placeholder={props.type === 'GOODS' ? '不填则为不限量' : '不填则为不限人数'}
            cursor={state.modifyingProduct.stock && String(state.modifyingProduct.stock).length}
            value={(!state.modifyingProduct._id ||
              state.modifyingProduct.stock || state.modifyingProduct.stock === 0) ?
              state.modifyingProduct.stock :
              // ( props.type === 'GOODS' ? '不限量' : '不限人数')
              null
            }
            // disabled={state.modifyingProduct._id &&
            //   !(state.modifyingProduct.stock || state.modifyingProduct.stock === 0)}
            onChange={v => handleChange('PRODUCT_STOCK_INPUT', v)}
          />
        }
        {props.type === 'GOODS' &&
          <View className='input_item'>
            <View className='required_mark'>*</View>
            <AtInput
              name='productPriceUnit'
              type='text'
              title='单位'
              placeholder='个'
              value={state.modifyingProduct.unit}
              onChange={v => handleChange('PRODUCT_UNIT', v)}
            />
          </View>}
        <AtTextarea
          name='productDes'
          type='text'
          title='备注'
          height={200}
          maxLength={300}
          value={state.modifyingProduct.des}
          onChange={v => handleChange('PRODUCT_DES', v)}
        />
        <MultipleChoiceButtonsBox
          itemList={labelNameList.map((it, i) => {
            return { name: it, id: i }
          })}
          choosenList={state.modifyingProduct.labels.map((it, i) => {
            return { name: it, id: i }
          })}
          onChoose={itemList => handleChange('PRODUCT_LABELS', itemList.map((it, i) => {
            return it.name
          }))}
        />
      </View>
    </ActionDialog >
  );


  let updateStockDialog = (//更新库存的框
    <ActionDialog
      isOpened={openedDialog === 'ADD_STOCK' ||
        openedDialog === 'SUBTRACT_STOCK'}
      onClose={handleInit.bind(this)}
      onCancel={() => handleInit()}
      onSubmit={() => handleSubmit('UPDATE_STOCK')}
    >
      <AtInput
        title={openedDialog == 'ADD_STOCK' ?
          '库存+' : '库存-'}
        placeholder='0'
        value={
          (((openedDialog === 'ADD_STOCK') && (state.modifyingProduct.updatedStock.way === 'ADD')) ||
            ((openedDialog === 'SUBTRACT_STOCK') && (state.modifyingProduct.updatedStock.way === 'SUBTRACT'))) ?
            (state.modifyingProduct.updatedStock.quantity === 0 ?
              '' : state.modifyingProduct.updatedStock.quantity) : ''
        }
        onChange={(v) => handleChange('UPDATE_STOCK', v)}
      />
    </ActionDialog>
  )

  let discontinueProductDialog = (//暂时下架商品的对话框
    <ActionDialog
      isOpened={openedDialog === 'DISCONTINUE_PRODUCT'}
      type={0}
      onClose={handleInit.bind(this)}
      onCancel={() => handleInit()}
      onSubmit={() => handleSubmit('DISCONTINUE_PRODUCT')}
      textCenter={true}
      >
      <View>确定暂时下架此商品？</View>
    </ActionDialog>
  )

  let showedProducts = (state.labelList && state.labelList.length > 0) ?
    filterProducts(
      state.productList, state.currentLabelIndex === 'DIS_CONTINUE' ?
      state.currentLabelIndex : state.labelList[state.currentLabelIndex].name,
      mode === 'SOLITAIRE_SELLER')
    : [];
  let productList =
    <scroll-view
      // onTouchStart={() => { console.log('onTouchStartonTouchStart'); }}
      className={'product_list '.concat(
        state.isSearching ? ' mode_2' : ' mode_1'
      )}
      style={'height:100%'}
      scroll-y={true}
    >
      {(mode === 'SELLER_MODIFYING' || mode === 'SOLITAIRE_SELLER') &&
        !(state.currentLabelIndex && state.currentLabelIndex == 'DIS_CONTINUE') &&
        !state.isSearching &&
        <View className='flex justify-center position_relative'>
          <View
            className='at-icon at-icon-add-circle'
            onClick={() => toggleDialog('PRODUCT')}
          />
          {/* {mode === 'SOLITAIRE_SELLER' &&
            <View className='now_choosen_word'>
              已选择
              {filterProducts(
                state.productList, state.currentLabelIndex === 'DIS_CONTINUE' ?
                state.currentLabelIndex : state.labelList[state.currentLabelIndex].name,
                false).length}
              /{state.productList.length}个
              {props.type === 'GOODS' ? '商品' : '报名费'}</View>
          } */}
        </View>
      }
      <View >
        {((showedProducts.length > 0) || layoutManager.ifOpenLoadingSpinner) ?
          showedProducts.map((it, i) => {
            return (
              <ShopProductCard
                ifChoosen={judgeIfChoosen(it)}
                product={it}
                key={it._id || it.index}
                type={props.type}
                mode={mode}
                handleModify={(e) => toggleDialog('PRODUCT', it, it.index, e)}
                handleDelete={(e) => toggleDialog('DELETE_PRODUCT', it, it.index, e)}
                handleAddStock={(e) => toggleDialog('ADD_STOCK', it, it.index, e)}
                handleSubtractStock={(e) => toggleDialog('SUBTRACT_STOCK', it, it.index, e)}
                handleStatus={
                  // props.mode === 'SOLITAIRE_SELLER' ?//接龙mode下改状态时不显示提示框
                  //   ((it.status === 'LAUNCHED') ?
                  //     () => handleSubmit('DISCONTINUE_PRODUCT', it, it.index) :
                  //     () => handleSubmit('CONTINUE_PRODUCT', it, it.index)) :
                  ((it.status === 'LAUNCHED') ?
                    (e) => toggleDialog('DISCONTINUE_PRODUCT', it, it.index, e) :
                    (e) => toggleDialog('CONTINUE_PRODUCT', it, it.index, e))}
                handleInit={(e) => handleInit(e)}

                hasDeleteDialog={false}

              // doChoose={props.mode === 'SOLITAIRE_SELLER' ?
              //   () => props.handleChoose(it) : null}
              // doUnChoose={props.mode === 'SOLITAIRE_SELLER' ?
              //   () => props.handleUnChoose(it) : null}
              />
            )
          }) :
          <View className='empty center'>
            暂无{props.type === 'GOODS' ? '商品' : '报名费选项'}
          </View>
        }
      </View>
    </scroll-view>


  let deleteDialog = (
    <ActionDialog
      type={1}
      isOpened={(openedDialog === 'DELETE_LABEL') || (openedDialog === 'DELETE_PRODUCT')}
      cancelText='取消'
      confirmText='删除'
      onClose={() => handleInit()}
      onCancel={() => handleInit()}
      onSubmit={() => handleDelete()}
      textCenter={true}
      >
      {'确定删除该'.concat((openedDialog === 'DELETE_LABEL') ?
        '标签' : '商品').concat('?')}
    </ActionDialog>

  )
  return (
    <View className={'shop_products_container '.concat(
      (props.mode === 'SELLER_MODIFYING') ? 'shop_products_container_modifying' :
        ((props.mode === 'SOLITAIRE_BUYER' || props.mode === 'SOLITAIRE_SELLER') ?
          'shop_products_container_solitaire' : ''
        ))}>
      <AtToast
        className='toast'
        isOpened={state.showedToast}
        text={state.showedToast}
        onClose={() => handleInit(null)}
        duration={2000}
      />
      {deleteDialog}
      {labelDialog}
      {productDialog}
      {updateStockDialog}
      {discontinueProductDialog}
      {!(mode === 'SOLITAIRE_SELLER') &&
        <SearchBar
          productList={state.productList}
          toggleSearchBar={(ifOpen) => toggleSearchBar(ifOpen)}
        />
      }
      {/*  这里分开写是因为商品层级太深会显示不出来 */}
      {(mode === 'SOLITAIRE_BUYER' || mode === 'SOLITAIRE_SELLER') &&
        (mode === 'SELLER_MODIFYING' || mode === 'SOLITAIRE_SELLER') &&
        !(state.currentLabelIndex && state.currentLabelIndex == 'DIS_CONTINUE') &&
        !state.isSearching &&
        <View className='flex justify-center position_relative'>
          <View
            className='at-icon at-icon-add-circle'
            onClick={() => toggleDialog('PRODUCT')}
          />
          {/* {mode === 'SOLITAIRE_SELLER' &&
           <View className='now_choosen_word'>
             已选择
             {filterProducts(
               state.productList, state.currentLabelIndex === 'DIS_CONTINUE' ?
               state.currentLabelIndex : state.labelList[state.currentLabelIndex].name,
               false).length}
             /{state.productList.length}个
             {props.type === 'GOODS' ? '商品' : '报名费'}</View>
         } */}
        </View>
      }
      {//*这里分开写是因为商品层级太深会显示不出来
        (mode === 'SOLITAIRE_BUYER' || mode === 'SOLITAIRE_SELLER') ?
          ((showedProducts.length > 0) || layoutManager.ifOpenLoadingSpinner) ?
            showedProducts.map((it, i) => {
              return (
                <ShopProductCard
                  ifChoosen={judgeIfChoosen(it)}
                  product={it}
                  key={it._id || it.index}
                  type={props.type}
                  mode={mode}
                  handleModify={(e) => toggleDialog('PRODUCT', it, it.index, e)}
                  handleDelete={(e) => toggleDialog('DELETE_PRODUCT', it, it.index, e)}
                  handleAddStock={(e) => toggleDialog('ADD_STOCK', it, it.index, e)}
                  handleSubtractStock={(e) => toggleDialog('SUBTRACT_STOCK', it, it.index, e)}
                  handleStatus={
                    // props.mode === 'SOLITAIRE_SELLER' ?//接龙mode下改状态时不显示提示框
                    //   ((it.status === 'LAUNCHED') ?
                    //     () => handleSubmit('DISCONTINUE_PRODUCT', it, it.index) :
                    //     () => handleSubmit('CONTINUE_PRODUCT', it, it.index)) :
                    ((it.status === 'LAUNCHED') ?
                      (e) => toggleDialog('DISCONTINUE_PRODUCT', it, it.index, e) :
                      (e) => toggleDialog('CONTINUE_PRODUCT', it, it.index, e))}
                  handleInit={(e) => handleInit(e)}

                  hasDeleteDialog={false}

                // doChoose={props.mode === 'SOLITAIRE_SELLER' ?
                //   () => props.handleChoose(it) : null}
                // doUnChoose={props.mode === 'SOLITAIRE_SELLER' ?
                //   () => props.handleUnChoose(it) : null}
                />
              )
            }) :
            <View className='empty center'>
              暂无{props.type === 'GOODS' ? '商品' : '报名费选项'}
            </View>
          :
          <View
            className='shop_products_container_content'
          >
            {state.isSearching ||
              mode === 'SOLITAIRE_BUYER' || mode === 'SOLITAIRE_SELLER' ||
              labelList}
            {productList}
          </View>
      }
      {
        (mode === 'SELLER_MODIFYING' || mode === 'SELLER_PREVIEW') &&
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
ShopProductsContainer.defaultProps = {
  mode: 'BUYER',
  type: 'GOODS',
  maxProductIconsLength: MAX_PRODUCT_ICONS_LENGTH,
};
export default forwardRef(ShopProductsContainer);