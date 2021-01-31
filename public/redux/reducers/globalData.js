import * as actionsType from '../constants/globalData'


const INITIAL_STATE = {
  layoutData:null,//{NAV_BAR_HEIGHT:'',}
}

export default function globalData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionsType.SET_LAYOUT_DATA:
      return {
        ...state, ...action.layoutData
      };
    default:
      return state
  }
}