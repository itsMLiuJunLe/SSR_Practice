import axios from 'axios';
import { CHANGE_LIST } from './constants.js'; 

const changeList = (list) => ({
  type: CHANGE_LIST,
  list
})

export const getHomeList = (server) => {
  //http://101.201.249.239:7001/default/getTypeInfo
  return (dispatch) => {
    if (server) {
      return axios.get('http://101.201.249.239:7001/default/getTypeInfo')
      .then((res) => {
        //console.log(res)
        const list = res.data.data;
        dispatch(changeList(list));
      }).catch((e) => {
        console.log(e)
      })
    } else if (!server) {
      return axios.get('/default/getTypeInfo')
      .then((res) => {
        //console.log(res)
        const list = res.data.data;
        dispatch(changeList(list));
      }).catch((e) => {
        console.log(e)
      })
    }
    
  }
}