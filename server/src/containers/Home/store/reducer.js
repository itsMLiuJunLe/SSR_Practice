import { CHANGE_LIST } from './constants.js'; 

const defaultState = {
  name: 'dell',
  newsList: []
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case CHANGE_LIST:
      return {
        ...state,
        newsList: action.list//后面这个newsList会取代前面的同名属性
      }
    default:
      return state;
  }
}