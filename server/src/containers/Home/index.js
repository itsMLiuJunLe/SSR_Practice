import React, { useEffect } from 'react';
import Header from '../../components/Header.js';
import { connect } from 'react-redux';
import { getHomeList } from './store/actions.js'

const Home = (props) => {

  useEffect(() => {
    if (!props.list.length) {
      props.getHomeList(false);
    }
  }, [])

  return (
    <div>
      <Header />
      {getList(props.list)}
      <button onClick={() => {alert('click')}}>click</button>
    </div>
  )
}

const getList = (list) => {
  return list.map((item) => {
    return (
      <div key={item.Id}>{item.typeName}</div>
    )  
  })
}

const mapStateToProps = state => ({//定义reducer里面数据的映射关系
  name: state.home.name,
  list: state.home.newsList
})

const mapDispatchToProps = dispatch => ({//定义改变或者获取reducer数据的方法
  getHomeList() {
    dispatch(getHomeList());
  }
})

export const loadData = (store) => {
  return store.dispatch(getHomeList(true))
}

export const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);
//通过connect把mapStateToProps和mapDispatchToProps里面的东西传给Home组件
