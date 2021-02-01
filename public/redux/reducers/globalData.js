import * as actionsType from '../constants/globalData'


const INITIAL_STATE = {
  classifications: null, //各种默认分类（存在数据库里）
  layoutData: null, //{NAV_BAR_HEIGHT:'',}
}

export default function globalData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionsType.SET_CLASSIFICATIONS:
      return {
        ...state, classifications: action.classifications
      };
    case actionsType.SET_LAYOUT_DATA:
      return {
        ...state, ...action.layoutData
      };
    default:
      return state
  }
}