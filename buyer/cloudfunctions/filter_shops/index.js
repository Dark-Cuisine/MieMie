// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  resourceAppid: 'wx8d82d7c90a0b3eda',
  resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
})
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

//*problem:不知为何云函数里拿到的data是空的，但是直接小程序里filter_shops却能正常拿到data

// 筛选店铺
/****
 * wx.cloud.callFunction({
      name: 'filter_shops',
      data: {
          shopKind:shopKind ,
          pickUpWay: pickUpWay,
          stations: stations,
      },
      success: (res) => {
      if (res && res.result && res.result.data){
     }},
            fail: () => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        console.error
      }
   });
 */
exports.main = async (event, context) => {
  let res = await cloud.callFunction({
    name: 'get_data',
    data: {
      collection: 'classifications',
    },
  })
  if (!(res && res.result && res.result.data && res.result.data.length > 0)) {
    return
  }
  let classifications = res.result.data[0];

  let shopKind = event.shopKind;
  let pickUpWay = event.pickUpWay;
  let stations = event.stations;

  let filterOptionAndList = [];
  let filterOptionOrList = [];
  shopKind && !(shopKind.shopKindLarge == classifications.shopKinds.shopKindLarge[0]) &&
    filterOptionAndList.push({
      shopInfo: {
        shopKinds: {
          shopKindLarge: shopKind.shopKindLarge,
        }
      }
    });
  shopKind && !(shopKind.shopKindSmall == classifications.shopKinds.shopKindSmall[0].shopKindSmall[0]) &&
    filterOptionAndList.push({
      shopInfo: {
        shopKinds: {
          shopKindSmall: shopKind.shopKindSmall
        }
      }
    });
  let selfPickUpIndex = pickUpWay.indexOf(classifications.pickUpWayList[0])
  let stationsPickUpIndex = pickUpWay.indexOf(classifications.pickUpWayList[1])
  let expressPickUpIndex = pickUpWay.indexOf(classifications.pickUpWayList[2])
  stations && selfPickUpIndex > -1 && stations.stations.list.length > 0 &&
    filterOptionOrList.push({
      selfPickUp: {
        list: _.elemMatch({
          nearestStation: {
            stations: {
              list: _.in(stations.stations.list) //查询时只查车站不查路线
            }
          }
        })
      }
    });
  stations && stationsPickUpIndex > -1 && stations.stations.list.length > 0 &&
    filterOptionOrList.push({
      stationPickUp: {
        list: _.elemMatch({
          stations: {
            list: _.in(stations.stations.list)
          }
        })
      }
    });
  (stations || (selfPickUpIndex < 0 && stationsPickUpIndex < 0)) && //设置了车站or其他两个选项都没被勾选时,才查询是否可邮寄//*unfinished没设置车站时应该禁止那两个选项button
  expressPickUpIndex > -1 &&
    filterOptionOrList.push({
      expressPickUp: {
        isAble: true,
      }
    });
  filterOptionOrList.length > 0 && filterOptionAndList.push({
    pickUpWay: _.or(filterOptionOrList)
  })

  console.log('filterOptionAndList', filterOptionAndList);
  console.log('filterOptionOrList', filterOptionOrList);
  console.log('stations.stations.list', stations.stations.list);


  if (filterOptionAndList.length > 0) {
    return await db.collection('shops')
      .where(_.and(filterOptionAndList)).get()
    // let test = await db.collection('shops')
    //   .where(_.and({
    //     pickUpWay: _.or([{
    //       selfPickUp: {
    //         list: _.elemMatch({
    //           nearestStation: {
    //             stations: {
    //               list: _.in(['三鷹'])
    //             }
    //           }
    //         })
    //       }
    //     }, {
    //       stationPickUp: {
    //         list: _.elemMatch({
    //           stations: {
    //             list: _.in(['三鷹'])
    //           }
    //         })
    //       }
    //     }, {
    //       expressPickUp: {
    //         isAble: true,
    //       }
    //     }])
    //   })).get()
    // console.log('ttttttt', test);
    // return test
  } else {
    return await db.collection('shops').get()
  }

}
