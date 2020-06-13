import { HomeContainer as Home, loadData } from './containers/Home/index.js'
import Login from './containers/Login/index.js'

export default [
  {
    path: '/',
    component: Home,
    exact: true,
    key: 'home',
    loadData: loadData
  }, {
    path: '/login',
    component: Login,
    key: 'login',
    exact: true
  }
]

