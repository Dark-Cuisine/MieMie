import * as actionsType from '../constants/publicManager'



const INITIAL_STATE = {
  classifications: null, //classification存在数据库里

  ifOpenLoadingSpinner: false,
  ifMarkMsgButton: false,

  userGuideReturnPage: null,
  userGuideIndex: null,
};
const toggleLoadingSpinner = (state, action) => {
  // console.log('toggleLoadingSpinner', (action.ifOpen === null) ? !state.ifOpenLoadingSpinner : action.ifOpen);
  return {
    ...state,
    ifOpenLoadingSpinner: (action.ifOpen === null) ? !state.ifOpenLoadingSpinner : action.ifOpen,
    //ifOpenLoadingSpinner: true,
  };
}
const toggleMarkMsgButton = (state, action) => {
  return {
    ...state,
    ifMarkMsgButton: action.ifMark,
  };
}
const userGuideNextStep = (state, action) => {
  return {
    ...state,
    userGuideIndex: action.nextStep,
    userGuideReturnPage: (action.returnPage === null) ?
      state.userGuideReturnPage : action.returnPage,
  };
}

export default function publicManager(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionsType.INIT_CLASSIFICATION:
      return {
        ...state, classifications: action.classifications
      };
    case actionsType.TOGGLE_LOADING_SPINNER:
      return toggleLoadingSpinner(state, action);
    case actionsType.TOGGLE_MARK_MSG_BUTTON:
      return toggleMarkMsgButton(state, action);
    case actionsType.USER_GUIDE_NEXT_STEP:
      return userGuideNextStep(state, action);
    default:
      return state
  }
}