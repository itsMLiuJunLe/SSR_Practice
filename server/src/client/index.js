import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Routes from '../Routes'
import { getClientStore } from '../store/index.js'
import { Provider } from 'react-redux';

const store = getClientStore();
const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div>
          {Routes.map((route) => (
            <Route {...route}></Route>
          ))}
        </div>
      </BrowserRouter>
    </Provider>
  )
}

ReactDom.render(<App />, document.getElementById('root'))