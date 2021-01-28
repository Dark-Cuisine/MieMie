const cloud = require('wx-server-sdk')
var request = require('request')
var rp = require('request-promise');

cloud.init({
  resourceAppid: 'wx8d82d7c90a0b3eda',
  resourceEnv: 'miemie-buyer-7gemmgzh05a6c577',
})
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

exports.main = async (event, context) => {
  if (event.option == 'TRAIN_LINES') {
    const response = await rp({
      url: 'http://express.heartrails.com/api/json?method=getLines&area=%E9%96%A2%E6%9D%B1',
      header: {
        'content-type': 'application/json'
      },
      json: true,
    });
    return response.response.line
  } else if (event.option == 'TRAIN_STATIONS') {
    let encodedItem = encodeURIComponent(event.line);
    let fullURL = 'http://express.heartrails.com/api/json?method=getStations&line=' + encodedItem;
    const response = await rp({
      url: fullURL,
      header: {
        'content-type': 'application/json'
      },
      json: true,
    });
    let allTrainStationsList = [];
    response && response.response && response.response.station &&
      response.response.station.forEach((it) => {
        allTrainStationsList.push(it.name);
      });
    return allTrainStationsList;
  }
}
