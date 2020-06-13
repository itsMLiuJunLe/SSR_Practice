import express from 'express';
import proxy from 'express-http-proxy';
import { render } from './utils';
import { getStore } from '../store/index.js';
import { matchRoutes } from 'react-router-config';
import Routes from '../Routes'

const app = express();
app.use(express.static('public'));

app.use('/default',proxy('http://101.201.249.239:7001', {
  proxyReqPathResolver: function (req) {
    return '/default' + req.url 
  }
}));


app.get('*', function (req, res) {
  const store = getStore();
  const matchedRoutes = matchRoutes(Routes, req.path);
  const promises = [];
  matchedRoutes.forEach(item => {
    if(item.route.loadData) {
      promises.push(item.route.loadData(store));
    }
  });

  Promise.all(promises).then(() => {
    res.send(render(store, Routes, req));
  }).catch((e) => {
    console.log(e);
  })
  
})
var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`)
});
