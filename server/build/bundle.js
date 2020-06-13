/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/express-http-proxy/app/steps/buildProxyReq.js":
/*!********************************************************************!*\
  !*** ./node_modules/express-http-proxy/app/steps/buildProxyReq.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var debug = __webpack_require__(/*! debug */ "debug")('express-http-proxy');
var requestOptions = __webpack_require__(/*! ../../lib/requestOptions */ "./node_modules/express-http-proxy/lib/requestOptions.js");

function buildProxyReq(Container) {
  var req = Container.user.req;
  var res = Container.user.res;
  var options = Container.options;
  var host = Container.proxy.host;

  var parseBody = (!options.parseReqBody) ? Promise.resolve(null) : requestOptions.bodyContent(req, res, options);
  var createReqOptions = requestOptions.create(req, res, options, host);

  return Promise
    .all([parseBody, createReqOptions])
    .then(function(responseArray) {
      Container.proxy.bodyContent = responseArray[0];
      Container.proxy.reqBuilder = responseArray[1];
      debug('proxy request options:', Container.proxy.reqBuilder);
      return Container;
    });
}

module.exports = buildProxyReq;


/***/ }),

/***/ "./node_modules/express-http-proxy/app/steps/copyProxyResHeadersToUserRes.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/express-http-proxy/app/steps/copyProxyResHeadersToUserRes.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function copyProxyResHeadersToUserRes(container) {
  return new Promise(function(resolve) {
    var res = container.user.res;
    var rsp = container.proxy.res;

    if (!res.headersSent) {
        res.status(rsp.statusCode);
        Object.keys(rsp.headers)
        .filter(function(item) { return item !== 'transfer-encoding'; })
        .forEach(function(item) {
            res.set(item, rsp.headers[item]);
        });
    }

    resolve(container);
  });
}

module.exports = copyProxyResHeadersToUserRes;



/***/ }),

/***/ "./node_modules/express-http-proxy/app/steps/decorateProxyReqBody.js":
/*!***************************************************************************!*\
  !*** ./node_modules/express-http-proxy/app/steps/decorateProxyReqBody.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var debug = __webpack_require__(/*! debug */ "debug")('express-http-proxy');

function defaultDecorator(proxyReqOptBody/*, userReq */) {
  return proxyReqOptBody;
}

function decorateProxyReqBody(container) {
  var userDecorator = container.options.proxyReqBodyDecorator;
  var resolverFn = userDecorator || defaultDecorator;

  if (userDecorator) {
    debug('using custom proxyReqBodyDecorator');
  }

  return Promise
    .resolve(resolverFn(container.proxy.bodyContent, container.user.req))
    .then(function(bodyContent) {
      container.proxy.bodyContent = bodyContent;
      return Promise.resolve(container);
    });
}

module.exports = decorateProxyReqBody;


/***/ }),

/***/ "./node_modules/express-http-proxy/app/steps/decorateProxyReqOpts.js":
/*!***************************************************************************!*\
  !*** ./node_modules/express-http-proxy/app/steps/decorateProxyReqOpts.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var debug = __webpack_require__(/*! debug */ "debug")('express-http-proxy');

function defaultDecorator(proxyReqOptBuilder /*, userReq */) {
  return proxyReqOptBuilder;
}

function decorateProxyReqOpt(container) {
  var resolverFn = container.options.proxyReqOptDecorator || defaultDecorator;

  return Promise
    .resolve(resolverFn(container.proxy.reqBuilder, container.user.req))
    .then(function (processedReqOpts) {
      delete processedReqOpts.params;
      container.proxy.reqBuilder = processedReqOpts;
      debug('Request options (after processing): %o', processedReqOpts);
      return Promise.resolve(container);
    });
}

module.exports = decorateProxyReqOpt;


/***/ }),

/***/ "./node_modules/express-http-proxy/app/steps/decorateUserRes.js":
/*!**********************************************************************!*\
  !*** ./node_modules/express-http-proxy/app/steps/decorateUserRes.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var as = __webpack_require__(/*! ../../lib/as.js */ "./node_modules/express-http-proxy/lib/as.js");
var debug = __webpack_require__(/*! debug */ "debug")('express-http-proxy');
var zlib = __webpack_require__(/*! zlib */ "zlib");

function isResGzipped(res) {
  return res.headers['content-encoding'] === 'gzip';
}

function zipOrUnzip(method) {
  return function(rspData, res) {
    return new Promise(function (resolve, reject) {
      if (isResGzipped(res) && rspData.length) {
        zlib[method](rspData, function(err, buffer) {
          if(err) {
            reject(err);
          } else {
            resolve(buffer);
          }
        });
      } else {
        resolve(rspData);
      }
    });
  };
}

var maybeUnzipPromise = zipOrUnzip('gunzip');
var maybeZipPromise = zipOrUnzip('gzip');

function verifyBuffer(rspd, reject) {
  if (!Buffer.isBuffer(rspd)) {
    return reject(new Error('userResDecorator should return string or buffer as data'));
  }
}

function updateHeaders(res, rspdBefore, rspdAfter, reject) {
  if (!res.headersSent) {
      res.set('content-length', rspdAfter.length);
  } else if (rspdAfter.length !== rspdBefore.length) {
      var error = '"Content-Length" is already sent,' +
          'the length of response data can not be changed';
      return reject(new Error(error));
  }
}

function decorateProxyResBody(container) {
  var resolverFn = container.options.userResDecorator;

  if (!resolverFn) {
    return Promise.resolve(container);
  }

  var proxyResDataPromise = maybeUnzipPromise(container.proxy.resData, container.proxy.res);
  var proxyRes = container.proxy.res;
  var req = container.user.req;
  var res = container.user.res;
  var originalResData; 

  if (res.statusCode === 304) {
    debug('Skipping userResDecorator on response 304');
    return Promise.resolve(container);
  }

  return proxyResDataPromise
    .then(function(proxyResData){
      originalResData = proxyResData;
      return resolverFn(proxyRes, proxyResData, req, res);
    })
    .then(function(modifiedResData) {
      return new Promise(function(resolve, reject) {
        var rspd = as.buffer(modifiedResData, container.options);
        verifyBuffer(rspd, reject);
        updateHeaders(res, originalResData, rspd, reject);
        maybeZipPromise(rspd, container.proxy.res).then(function(buffer) {
          container.proxy.resData = buffer;
          resolve(container);
        }).catch(function(error){
          reject(error);
        });
      });
    });
}

module.exports = decorateProxyResBody;


/***/ }),

/***/ "./node_modules/express-http-proxy/app/steps/decorateUserResHeaders.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/express-http-proxy/app/steps/decorateUserResHeaders.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



function decorateUserResHeaders(container) {
  var resolverFn = container.options.userResHeaderDecorator;
  var headers = container.user.res.getHeaders ? container.user.res.getHeaders() : container.user.res._headers;

  if (!resolverFn) {
    return Promise.resolve(container);
  }

  return Promise
    .resolve(resolverFn(headers, container.user.req, container.user.res, container.proxy.req, container.proxy.res))
    .then(function(headers) {
      return new Promise(function(resolve) {
        container.user.res.set(headers);
        resolve(container);
      });
    });
}

module.exports = decorateUserResHeaders;


/***/ }),

/***/ "./node_modules/express-http-proxy/app/steps/filterUserRequest.js":
/*!************************************************************************!*\
  !*** ./node_modules/express-http-proxy/app/steps/filterUserRequest.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// No-op version of filter.  Allows everything!

function defaultFilter(proxyReqOptBuilder, userReq) { // eslint-disable-line
  return true;
}

function filterUserRequest(container) {
  var resolverFn = container.options.filter || defaultFilter;

  return Promise
    .resolve(resolverFn(container.user.req, container.user.res))
    .then(function (shouldIContinue) {
      if (shouldIContinue) {
        return Promise.resolve(container);
      } else {
        return Promise.reject(); // reject with no args should simply call next()
      }
    });
}

module.exports = filterUserRequest;



/***/ }),

/***/ "./node_modules/express-http-proxy/app/steps/handleProxyErrors.js":
/*!************************************************************************!*\
  !*** ./node_modules/express-http-proxy/app/steps/handleProxyErrors.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var debug = __webpack_require__(/*! debug */ "debug")('express-http-proxy');

function connectionResetHandler(err, res) {
  if (err && err.code === 'ECONNRESET') {
    debug('Error: Connection reset due to timeout.');
    res.setHeader('X-Timeout-Reason', 'express-http-proxy reset the request.');
    res.writeHead(504, {'Content-Type': 'text/plain'});
    res.end();
  }
}

function handleProxyErrors(err, res, next) {
  switch (err && err.code) {
    case 'ECONNRESET':  { return connectionResetHandler(err, res, next); }
    default:            { next(err); }
  }
}

module.exports = handleProxyErrors;


/***/ }),

/***/ "./node_modules/express-http-proxy/app/steps/maybeSkipToNextHandler.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/express-http-proxy/app/steps/maybeSkipToNextHandler.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function defaultSkipFilter(/* res */) {
  return false;
}

function maybeSkipToNextHandler(container) {
  var resolverFn = container.options.skipToNextHandlerFilter || defaultSkipFilter;

  return Promise
    .resolve(resolverFn(container.proxy.res))
    .then(function (shouldSkipToNext) {
      if (shouldSkipToNext) {
        container.user.res.expressHttpProxy = container.proxy;
        return Promise.reject(container.user.next());
      } else {
        return Promise.resolve(container);
      }
    })
}

module.exports = maybeSkipToNextHandler;


/***/ }),

/***/ "./node_modules/express-http-proxy/app/steps/prepareProxyReq.js":
/*!**********************************************************************!*\
  !*** ./node_modules/express-http-proxy/app/steps/prepareProxyReq.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var as = __webpack_require__(/*! ../../lib/as */ "./node_modules/express-http-proxy/lib/as.js");

function getContentLength(body) {

  var result;
  if (Buffer.isBuffer(body)) { // Buffer
    result = body.length;
  } else if (typeof body === 'string') {
    result = Buffer.byteLength(body);
  }
  return result;
}


function prepareProxyReq(container) {
  return new Promise(function(resolve) {
    var bodyContent = container.proxy.bodyContent;
    var reqOpt = container.proxy.reqBuilder;

    if (bodyContent) {
      bodyContent = container.options.reqAsBuffer ?
        as.buffer(bodyContent, container.options) :
        as.bufferOrString(bodyContent);

      reqOpt.headers['content-length'] = getContentLength(bodyContent);

      if (container.options.reqBodyEncoding) {
        reqOpt.headers['Accept-Charset'] = container.options.reqBodyEncoding;
      }
    }

    container.proxy.bodyContent = bodyContent;
    resolve(container);
  });
}

module.exports = prepareProxyReq;



/***/ }),

/***/ "./node_modules/express-http-proxy/app/steps/resolveProxyHost.js":
/*!***********************************************************************!*\
  !*** ./node_modules/express-http-proxy/app/steps/resolveProxyHost.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var requestOptions = __webpack_require__(/*! ../../lib/requestOptions */ "./node_modules/express-http-proxy/lib/requestOptions.js");

function resolveProxyHost(container) {
  var parsedHost;

  if (container.options.memoizeHost && container.options.memoizedHost) {
    parsedHost = container.options.memoizedHost;
  } else {
    parsedHost = requestOptions.parseHost(container);
  }

  container.proxy.reqBuilder.host = parsedHost.host;
  container.proxy.reqBuilder.port = container.options.port || parsedHost.port;
  container.proxy.requestModule = parsedHost.module;
  return Promise.resolve(container);
}

module.exports = resolveProxyHost;


/***/ }),

/***/ "./node_modules/express-http-proxy/app/steps/resolveProxyReqPath.js":
/*!**************************************************************************!*\
  !*** ./node_modules/express-http-proxy/app/steps/resolveProxyReqPath.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var url = __webpack_require__(/*! url */ "url");
var debug = __webpack_require__(/*! debug */ "debug")('express-http-proxy');

function defaultProxyReqPathResolver(req) {
  return url.parse(req.url).path;
}

function resolveProxyReqPath(container) {
  var resolverFn = container.options.proxyReqPathResolver || defaultProxyReqPathResolver;

  return Promise
    .resolve(resolverFn(container.user.req))
    .then(function(resolvedPath) {
      container.proxy.reqBuilder.path = resolvedPath;
      debug('resolved proxy path:', resolvedPath);
      return Promise.resolve(container);
    });
}

module.exports = resolveProxyReqPath;


/***/ }),

/***/ "./node_modules/express-http-proxy/app/steps/sendProxyRequest.js":
/*!***********************************************************************!*\
  !*** ./node_modules/express-http-proxy/app/steps/sendProxyRequest.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var chunkLength = __webpack_require__(/*! ../../lib/chunkLength */ "./node_modules/express-http-proxy/lib/chunkLength.js");

function sendProxyRequest(Container) {
  var req = Container.user.req;
  var bodyContent = Container.proxy.bodyContent;
  var reqOpt = Container.proxy.reqBuilder;
  var options = Container.options;

  return new Promise(function(resolve, reject) {
    var protocol = Container.proxy.requestModule;
    var proxyReq = Container.proxy.req = protocol.request(reqOpt, function(rsp) {
      if (options.stream) {
        Container.proxy.res = rsp;
        return resolve(Container);
      }

      var chunks = [];
      rsp.on('data', function(chunk) { chunks.push(chunk); });
      rsp.on('end', function() {
        Container.proxy.res = rsp;
        Container.proxy.resData = Buffer.concat(chunks, chunkLength(chunks));
        resolve(Container);
      });
      rsp.on('error', reject);
    });

    proxyReq.on('socket', function(socket) {
      if (options.timeout) {
        socket.setTimeout(options.timeout, function() {
          proxyReq.abort();
        });
      }
    });

    proxyReq.on('error', reject);

    // this guy should go elsewhere, down the chain
    if (options.parseReqBody) {
    // We are parsing the body ourselves so we need to write the body content
    // and then manually end the request.

      //if (bodyContent instanceof Object) {
        //throw new Error
        //debugger;
        //bodyContent = JSON.stringify(bodyContent);
      //}

      if (bodyContent.length) {
        var body = bodyContent;
        var contentType = proxyReq.getHeader('Content-Type');
        if (contentType === 'x-www-form-urlencoded' || contentType === 'application/x-www-form-urlencoded') {
          try {
            var params = JSON.parse(body);
            body = Object.keys(params).map(function(k) { return k + '=' + params[k]; }).join('&');
          } catch (e) {
            // bodyContent is not json-format
          }
        }
        proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
        proxyReq.write(body);
      }
      proxyReq.end();
    } else {
    // Pipe will call end when it has completely read from the request.
      req.pipe(proxyReq);
    }

    req.on('aborted', function() {
    // reject?
      proxyReq.abort();
    });
  });
}


module.exports = sendProxyRequest;


/***/ }),

/***/ "./node_modules/express-http-proxy/app/steps/sendUserRes.js":
/*!******************************************************************!*\
  !*** ./node_modules/express-http-proxy/app/steps/sendUserRes.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function sendUserRes(Container) {
  if (!Container.user.res.headersSent) {
    if (Container.options.stream) {
      Container.proxy.res.pipe(Container.user.res);
    } else {
      Container.user.res.send(Container.proxy.resData);
    }
  }
  return Promise.resolve(Container);
}


module.exports = sendUserRes;


/***/ }),

/***/ "./node_modules/express-http-proxy/index.js":
/*!**************************************************!*\
  !*** ./node_modules/express-http-proxy/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// * Breaks proxying into a series of discrete steps, many of which can be swapped out by authors.
// * Uses Promises to support async.
// * Uses a quasi-Global called Container to tidy up the argument passing between the major work-flow steps.

var ScopeContainer = __webpack_require__(/*! ./lib/scopeContainer */ "./node_modules/express-http-proxy/lib/scopeContainer.js");
var assert = __webpack_require__(/*! assert */ "assert");
var debug = __webpack_require__(/*! debug */ "debug")('express-http-proxy');

var buildProxyReq                = __webpack_require__(/*! ./app/steps/buildProxyReq */ "./node_modules/express-http-proxy/app/steps/buildProxyReq.js");
var copyProxyResHeadersToUserRes = __webpack_require__(/*! ./app/steps/copyProxyResHeadersToUserRes */ "./node_modules/express-http-proxy/app/steps/copyProxyResHeadersToUserRes.js");
var decorateProxyReqBody         = __webpack_require__(/*! ./app/steps/decorateProxyReqBody */ "./node_modules/express-http-proxy/app/steps/decorateProxyReqBody.js");
var decorateProxyReqOpts         = __webpack_require__(/*! ./app/steps/decorateProxyReqOpts */ "./node_modules/express-http-proxy/app/steps/decorateProxyReqOpts.js");
var decorateUserRes              = __webpack_require__(/*! ./app/steps/decorateUserRes */ "./node_modules/express-http-proxy/app/steps/decorateUserRes.js");
var decorateUserResHeaders       = __webpack_require__(/*! ./app/steps/decorateUserResHeaders */ "./node_modules/express-http-proxy/app/steps/decorateUserResHeaders.js");
var filterUserRequest            = __webpack_require__(/*! ./app/steps/filterUserRequest */ "./node_modules/express-http-proxy/app/steps/filterUserRequest.js");
var handleProxyErrors            = __webpack_require__(/*! ./app/steps/handleProxyErrors */ "./node_modules/express-http-proxy/app/steps/handleProxyErrors.js");
var maybeSkipToNextHandler       = __webpack_require__(/*! ./app/steps/maybeSkipToNextHandler */ "./node_modules/express-http-proxy/app/steps/maybeSkipToNextHandler.js");
var prepareProxyReq              = __webpack_require__(/*! ./app/steps/prepareProxyReq */ "./node_modules/express-http-proxy/app/steps/prepareProxyReq.js");
var resolveProxyHost             = __webpack_require__(/*! ./app/steps/resolveProxyHost */ "./node_modules/express-http-proxy/app/steps/resolveProxyHost.js");
var resolveProxyReqPath          = __webpack_require__(/*! ./app/steps/resolveProxyReqPath */ "./node_modules/express-http-proxy/app/steps/resolveProxyReqPath.js");
var sendProxyRequest             = __webpack_require__(/*! ./app/steps/sendProxyRequest */ "./node_modules/express-http-proxy/app/steps/sendProxyRequest.js");
var sendUserRes                  = __webpack_require__(/*! ./app/steps/sendUserRes */ "./node_modules/express-http-proxy/app/steps/sendUserRes.js");

module.exports = function proxy(host, userOptions) {
  assert(host, 'Host should not be empty');

  return function handleProxy(req, res, next) {
    debug('[start proxy] ' + req.path);
    var container = new ScopeContainer(req, res, next, host, userOptions);

    filterUserRequest(container)
      .then(buildProxyReq)
      .then(resolveProxyHost)
      .then(decorateProxyReqOpts)
      .then(resolveProxyReqPath)
      .then(decorateProxyReqBody)
      .then(prepareProxyReq)
      .then(sendProxyRequest)
      .then(maybeSkipToNextHandler)
      .then(copyProxyResHeadersToUserRes)
      .then(decorateUserResHeaders)
      .then(decorateUserRes)
      .then(sendUserRes)
      .catch(function (err) {
        // I sometimes reject without an error to shortcircuit the remaining
        // steps and return control to the host application.

        if (err) {
          var resolver = (container.options.proxyErrorHandler) ?
            container.options.proxyErrorHandler :
            handleProxyErrors;
          resolver(err, res, next);
        } else {
          next();
        }
      });
  };
};



/***/ }),

/***/ "./node_modules/express-http-proxy/lib/as.js":
/*!***************************************************!*\
  !*** ./node_modules/express-http-proxy/lib/as.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * Trivial convenience methods for parsing Buffers
 */

function asBuffer(body, options) {

  var ret;
  if (Buffer.isBuffer(body)) {
    ret = body;
  } else if (typeof body === 'object') {
    ret = new Buffer(JSON.stringify(body), options.reqBodyEncoding);
  } else if (typeof body === 'string') {
    ret = new Buffer(body, options.reqBodyEncodeing);
  }
  return ret;
}

function asBufferOrString(body) {

  var ret;
  if (Buffer.isBuffer(body)) {
    ret = body;
  } else if (typeof body === 'object') {
    ret = JSON.stringify(body);
  } else if (typeof body === 'string') {
    ret = body;
  }
  return ret;
}

module.exports = {
  buffer: asBuffer,
  bufferOrString: asBufferOrString
};


/***/ }),

/***/ "./node_modules/express-http-proxy/lib/chunkLength.js":
/*!************************************************************!*\
  !*** ./node_modules/express-http-proxy/lib/chunkLength.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function chunkLength(chunks) {
  return chunks.reduce(function (len, buf) {
    return len + buf.length;
  }, 0);
}

module.exports = chunkLength;


/***/ }),

/***/ "./node_modules/express-http-proxy/lib/isUnset.js":
/*!********************************************************!*\
  !*** ./node_modules/express-http-proxy/lib/isUnset.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (val) {
  return (typeof val  ===  'undefined' || val === '' || val === null);
};


/***/ }),

/***/ "./node_modules/express-http-proxy/lib/requestOptions.js":
/*!***************************************************************!*\
  !*** ./node_modules/express-http-proxy/lib/requestOptions.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var http = __webpack_require__(/*! http */ "http");
var https = __webpack_require__(/*! https */ "https");
var url = __webpack_require__(/*! url */ "url");
var getRawBody = __webpack_require__(/*! raw-body */ "raw-body");
var isUnset = __webpack_require__(/*! ./isUnset */ "./node_modules/express-http-proxy/lib/isUnset.js");

function extend(obj, source, skips) {

  if (!source) {
    return obj;
  }

  for (var prop in source) {
    if (!skips || skips.indexOf(prop) === -1) {
      obj[prop] = source[prop];
    }
  }

  return obj;
}

function parseHost(Container) {
  var host = Container.params.host;
  var req =  Container.user.req;
  var options = Container.options;
  host = (typeof host === 'function') ? host(req) : host.toString();

  if (!host) {
    return new Error('Empty host parameter');
  }

  if (!/http(s)?:\/\//.test(host)) {
    host = 'http://' + host;
  }

  var parsed = url.parse(host);

  if (!parsed.hostname) {
    return new Error('Unable to parse hostname, possibly missing protocol://?');
  }

  var ishttps = options.https || parsed.protocol === 'https:';

  return {
    host: parsed.hostname,
    port: parsed.port || (ishttps ? 443 : 80),
    module: ishttps ? https : http,
  };
}

function reqHeaders(req, options) {


  var headers = options.headers || {};

  var skipHdrs = [ 'connection', 'content-length' ];
  if (!options.preserveHostHdr) {
    skipHdrs.push('host');
  }
  var hds = extend(headers, req.headers, skipHdrs);
  hds.connection = 'close';

  return hds;
}

function createRequestOptions(req, res, options) {

  // prepare proxyRequest

  var reqOpt = {
    headers: reqHeaders(req, options),
    method: req.method,
    path: req.path,
    params: req.params,
  };

  if (options.preserveReqSession) {
    reqOpt.session = req.session;
  }

  return Promise.resolve(reqOpt);
}

// extract to bodyContent object

function bodyContent(req, res, options) {
  var parseReqBody = isUnset(options.parseReqBody) ? true : options.parseReqBody;

  function maybeParseBody(req, limit) {
    if (req.body) {
      return Promise.resolve(req.body);
    } else {
      // Returns a promise if no callback specified and global Promise exists.

      return getRawBody(req, {
        length: req.headers['content-length'],
        limit: limit,
      });
    }
  }

  if (parseReqBody) {
    return maybeParseBody(req, options.limit);
  }
}


module.exports = {
  create: createRequestOptions,
  bodyContent: bodyContent,
  parseHost: parseHost
};


/***/ }),

/***/ "./node_modules/express-http-proxy/lib/resolveOptions.js":
/*!***************************************************************!*\
  !*** ./node_modules/express-http-proxy/lib/resolveOptions.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var debug = __webpack_require__(/*! debug */ "debug")('express-http-proxy');

var isUnset = __webpack_require__(/*! ../lib/isUnset */ "./node_modules/express-http-proxy/lib/isUnset.js");

function resolveBodyEncoding(reqBodyEncoding) {

  /* For reqBodyEncoding, these is a meaningful difference between null and
    * undefined.  null should be passed forward as the value of reqBodyEncoding,
    * and undefined should result in utf-8.
    */
  return reqBodyEncoding !== undefined ? reqBodyEncoding : 'utf-8';
}

// parse client arguments

function resolveOptions(options) {
  options = options || {};
  var resolved;

  if (options.decorateRequest) {
    throw new Error(
      'decorateRequest is REMOVED; use proxyReqOptDecorator and' +
      ' proxyReqBodyDecorator instead.  see README.md'
    );
  }

  if (options.forwardPath || options.forwardPathAsync) {
    console.warn(
      'forwardPath and forwardPathAsync are DEPRECATED' +
      ' and should be replaced with proxyReqPathResolver'
    );
  }

  if (options.intercept) {
    console.warn(
      'DEPRECATED: intercept. Use userResDecorator instead.' +
      ' Please see README for more information.'
    );
  }

  resolved = {
    limit: options.limit || '1mb',
    proxyReqPathResolver: options.proxyReqPathResolver
        || options.forwardPathAsync
        || options.forwardPath,
    proxyReqOptDecorator: options.proxyReqOptDecorator,
    proxyReqBodyDecorator: options.proxyReqBodyDecorator,
    userResDecorator: options.userResDecorator || options.intercept,
    userResHeaderDecorator: options.userResHeaderDecorator,
    proxyErrorHandler: options.proxyErrorHandler,
    filter: options.filter,
    // For backwards compatability, we default to legacy behavior for newly added settings.

    parseReqBody: isUnset(options.parseReqBody) ? true : options.parseReqBody,
    preserveHostHdr: options.preserveHostHdr,
    memoizeHost: isUnset(options.memoizeHost) ? true : options.memoizeHost,
    reqBodyEncoding: resolveBodyEncoding(options.reqBodyEncoding),
    skipToNextHandlerFilter: options.skipToNextHandlerFilter,
    headers: options.headers,
    preserveReqSession: options.preserveReqSession,
    https: options.https,
    port: options.port,
    reqAsBuffer: options.reqAsBuffer,
    timeout: options.timeout
  };

  // automatically opt into stream mode if no response modifiers are specified

  resolved.stream = !resolved.skipToNextHandlerFilter &&
                    !resolved.userResDecorator &&
                    !resolved.userResHeaderDecorator;

  debug(resolved);
  return resolved;
}

module.exports = resolveOptions;


/***/ }),

/***/ "./node_modules/express-http-proxy/lib/scopeContainer.js":
/*!***************************************************************!*\
  !*** ./node_modules/express-http-proxy/lib/scopeContainer.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var resolveOptions = __webpack_require__(/*! ../lib/resolveOptions */ "./node_modules/express-http-proxy/lib/resolveOptions.js");

// The Container object is passed down the chain of Promises, with each one
// of them mutating and returning Container.  The goal is that (eventually)
// author using this library // could hook into/override any of these
// workflow steps with a Promise or simple function.
// Container for scoped arguments in a promise chain.  Each promise recieves
// this as its argument, and returns it.
//
// Do not expose the details of this to hooks/user functions.

function Container(req, res, next, host, userOptions) {
  return {
    user: {
      req: req,
      res: res,
      next: next,
    },
    proxy: {
      req: undefined,
      res: undefined,
      resData: undefined, // from proxy res
      bodyContent: undefined, // for proxy req
      reqBuilder: {},  // reqOpt, intended as first arg to http(s)?.request
    },
    options: resolveOptions(userOptions),
    params: {
      host: host,
      userOptions: userOptions
    }
  };
}

module.exports = Container;


/***/ }),

/***/ "./src/Routes.js":
/*!***********************!*\
  !*** ./src/Routes.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(/*! ./containers/Home/index.js */ "./src/containers/Home/index.js");

var _index2 = __webpack_require__(/*! ./containers/Login/index.js */ "./src/containers/Login/index.js");

var _index3 = _interopRequireDefault(_index2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [{
  path: '/',
  component: _index.HomeContainer,
  exact: true,
  key: 'home',
  loadData: _index.loadData
}, {
  path: '/login',
  component: _index3.default,
  key: 'login',
  exact: true
}];

/***/ }),

/***/ "./src/components/Header.js":
/*!**********************************!*\
  !*** ./src/components/Header.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "react-router-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Header = function Header() {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      _reactRouterDom.Link,
      { to: '/' },
      'Home'
    ),
    _react2.default.createElement('br', null),
    _react2.default.createElement(
      _reactRouterDom.Link,
      { to: '/login' },
      'Login'
    )
  );
};

exports.default = Header;

/***/ }),

/***/ "./src/containers/Home/index.js":
/*!**************************************!*\
  !*** ./src/containers/Home/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HomeContainer = exports.loadData = undefined;

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _Header = __webpack_require__(/*! ../../components/Header.js */ "./src/components/Header.js");

var _Header2 = _interopRequireDefault(_Header);

var _reactRedux = __webpack_require__(/*! react-redux */ "react-redux");

var _actions = __webpack_require__(/*! ./store/actions.js */ "./src/containers/Home/store/actions.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Home = function Home(props) {

  (0, _react.useEffect)(function () {
    if (!props.list.length) {
      props.getHomeList(false);
    }
  }, []);

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_Header2.default, null),
    getList(props.list),
    _react2.default.createElement(
      'button',
      { onClick: function onClick() {
          alert('click');
        } },
      'click'
    )
  );
};

var getList = function getList(list) {
  return list.map(function (item) {
    return _react2.default.createElement(
      'div',
      { key: item.Id },
      item.typeName
    );
  });
};

var mapStateToProps = function mapStateToProps(state) {
  return { //定义reducer里面数据的映射关系
    name: state.home.name,
    list: state.home.newsList
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    //定义改变或者获取reducer数据的方法
    getHomeList: function getHomeList() {
      dispatch((0, _actions.getHomeList)());
    }
  };
};

var loadData = exports.loadData = function loadData(store) {
  return store.dispatch((0, _actions.getHomeList)(true));
};

var HomeContainer = exports.HomeContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Home);
//通过connect把mapStateToProps和mapDispatchToProps里面的东西传给Home组件

/***/ }),

/***/ "./src/containers/Home/store/actions.js":
/*!**********************************************!*\
  !*** ./src/containers/Home/store/actions.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHomeList = undefined;

var _axios = __webpack_require__(/*! axios */ "axios");

var _axios2 = _interopRequireDefault(_axios);

var _constants = __webpack_require__(/*! ./constants.js */ "./src/containers/Home/store/constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var changeList = function changeList(list) {
  return {
    type: _constants.CHANGE_LIST,
    list: list
  };
};

var getHomeList = exports.getHomeList = function getHomeList(server) {
  //http://101.201.249.239:7001/default/getTypeInfo
  return function (dispatch) {
    if (server) {
      return _axios2.default.get('http://101.201.249.239:7001/default/getTypeInfo').then(function (res) {
        //console.log(res)
        var list = res.data.data;
        dispatch(changeList(list));
      }).catch(function (e) {
        console.log(e);
      });
    } else if (!server) {
      return _axios2.default.get('/default/getTypeInfo').then(function (res) {
        //console.log(res)
        var list = res.data.data;
        dispatch(changeList(list));
      }).catch(function (e) {
        console.log(e);
      });
    }
  };
};

/***/ }),

/***/ "./src/containers/Home/store/constants.js":
/*!************************************************!*\
  !*** ./src/containers/Home/store/constants.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var CHANGE_LIST = exports.CHANGE_LIST = 'HOME/CHANGE_LIST';

/***/ }),

/***/ "./src/containers/Home/store/reducer.js":
/*!**********************************************!*\
  !*** ./src/containers/Home/store/reducer.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = __webpack_require__(/*! ./constants.js */ "./src/containers/Home/store/constants.js");

var defaultState = {
  name: 'dell',
  newsList: []
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments[1];

  switch (action.type) {
    case _constants.CHANGE_LIST:
      return _extends({}, state, {
        newsList: action.list //后面这个newsList会取代前面的同名属性
      });
    default:
      return state;
  }
};

/***/ }),

/***/ "./src/containers/Login/index.js":
/*!***************************************!*\
  !*** ./src/containers/Login/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _Header = __webpack_require__(/*! ../../components/Header.js */ "./src/components/Header.js");

var _Header2 = _interopRequireDefault(_Header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Login = function Login() {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_Header2.default, null),
    _react2.default.createElement(
      'div',
      null,
      'login'
    )
  );
};

exports.default = Login;

/***/ }),

/***/ "./src/server/index.js":
/*!*****************************!*\
  !*** ./src/server/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(/*! express */ "express");

var _express2 = _interopRequireDefault(_express);

var _expressHttpProxy = __webpack_require__(/*! express-http-proxy */ "./node_modules/express-http-proxy/index.js");

var _expressHttpProxy2 = _interopRequireDefault(_expressHttpProxy);

var _utils = __webpack_require__(/*! ./utils */ "./src/server/utils.js");

var _index = __webpack_require__(/*! ../store/index.js */ "./src/store/index.js");

var _reactRouterConfig = __webpack_require__(/*! react-router-config */ "react-router-config");

var _Routes = __webpack_require__(/*! ../Routes */ "./src/Routes.js");

var _Routes2 = _interopRequireDefault(_Routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use(_express2.default.static('public'));

app.use('/default', (0, _expressHttpProxy2.default)('http://101.201.249.239:7001', {
  proxyReqPathResolver: function proxyReqPathResolver(req) {
    return '/default' + req.url;
  }
}));

app.get('*', function (req, res) {
  var store = (0, _index.getStore)();
  var matchedRoutes = (0, _reactRouterConfig.matchRoutes)(_Routes2.default, req.path);
  var promises = [];
  matchedRoutes.forEach(function (item) {
    if (item.route.loadData) {
      promises.push(item.route.loadData(store));
    }
  });

  Promise.all(promises).then(function () {
    res.send((0, _utils.render)(store, _Routes2.default, req));
  }).catch(function (e) {
    console.log(e);
  });
});
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://' + host + ':' + port);
});

/***/ }),

/***/ "./src/server/utils.js":
/*!*****************************!*\
  !*** ./src/server/utils.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = undefined;

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _server = __webpack_require__(/*! react-dom/server */ "react-dom/server");

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "react-router-dom");

var _reactRedux = __webpack_require__(/*! react-redux */ "react-redux");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var render = exports.render = function render(store, Routes, req) {

  var content = (0, _server.renderToString)(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(
      _reactRouterDom.StaticRouter,
      { location: req.path, context: {} },
      _react2.default.createElement(
        'div',
        null,
        Routes.map(function (route) {
          return _react2.default.createElement(_reactRouterDom.Route, route);
        })
      )
    )
  ));

  return '\n  <html>\n    <head>\n      <title>hello</title>\n    </head>\n    <body>\n      <div id=\'root\'>' + content + '</div>\n      <script>\n        window.context = {\n          state: ' + JSON.stringify(store.getState()) + '\n        }\n      </script>\n      <script src=\'/index.js\'></script>\n    </body>\n  </html>';
};

/***/ }),

/***/ "./src/store/index.js":
/*!****************************!*\
  !*** ./src/store/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClientStore = exports.getStore = undefined;

var _redux = __webpack_require__(/*! redux */ "redux");

var _reduxThunk = __webpack_require__(/*! redux-thunk */ "redux-thunk");

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reducer = __webpack_require__(/*! ../containers/Home/store/reducer.js */ "./src/containers/Home/store/reducer.js");

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reducer = (0, _redux.combineReducers)({
  home: _reducer2.default
});

var getStore = exports.getStore = function getStore() {
  return (0, _redux.createStore)(reducer, (0, _redux.applyMiddleware)(_reduxThunk2.default));
};

var getClientStore = exports.getClientStore = function getClientStore() {
  var defaultState = window.context.state;
  return (0, _redux.createStore)(reducer, defaultState, (0, _redux.applyMiddleware)(_reduxThunk2.default));
};

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "raw-body":
/*!***************************!*\
  !*** external "raw-body" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("raw-body");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-dom/server":
/*!***********************************!*\
  !*** external "react-dom/server" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),

/***/ "react-redux":
/*!******************************!*\
  !*** external "react-redux" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),

/***/ "react-router-config":
/*!**************************************!*\
  !*** external "react-router-config" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-router-config");

/***/ }),

/***/ "react-router-dom":
/*!***********************************!*\
  !*** external "react-router-dom" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-router-dom");

/***/ }),

/***/ "redux":
/*!************************!*\
  !*** external "redux" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),

/***/ "redux-thunk":
/*!******************************!*\
  !*** external "redux-thunk" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("redux-thunk");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V4cHJlc3MtaHR0cC1wcm94eS9hcHAvc3RlcHMvYnVpbGRQcm94eVJlcS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZXhwcmVzcy1odHRwLXByb3h5L2FwcC9zdGVwcy9jb3B5UHJveHlSZXNIZWFkZXJzVG9Vc2VyUmVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9leHByZXNzLWh0dHAtcHJveHkvYXBwL3N0ZXBzL2RlY29yYXRlUHJveHlSZXFCb2R5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9leHByZXNzLWh0dHAtcHJveHkvYXBwL3N0ZXBzL2RlY29yYXRlUHJveHlSZXFPcHRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9leHByZXNzLWh0dHAtcHJveHkvYXBwL3N0ZXBzL2RlY29yYXRlVXNlclJlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZXhwcmVzcy1odHRwLXByb3h5L2FwcC9zdGVwcy9kZWNvcmF0ZVVzZXJSZXNIZWFkZXJzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9leHByZXNzLWh0dHAtcHJveHkvYXBwL3N0ZXBzL2ZpbHRlclVzZXJSZXF1ZXN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9leHByZXNzLWh0dHAtcHJveHkvYXBwL3N0ZXBzL2hhbmRsZVByb3h5RXJyb3JzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9leHByZXNzLWh0dHAtcHJveHkvYXBwL3N0ZXBzL21heWJlU2tpcFRvTmV4dEhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V4cHJlc3MtaHR0cC1wcm94eS9hcHAvc3RlcHMvcHJlcGFyZVByb3h5UmVxLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9leHByZXNzLWh0dHAtcHJveHkvYXBwL3N0ZXBzL3Jlc29sdmVQcm94eUhvc3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V4cHJlc3MtaHR0cC1wcm94eS9hcHAvc3RlcHMvcmVzb2x2ZVByb3h5UmVxUGF0aC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZXhwcmVzcy1odHRwLXByb3h5L2FwcC9zdGVwcy9zZW5kUHJveHlSZXF1ZXN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9leHByZXNzLWh0dHAtcHJveHkvYXBwL3N0ZXBzL3NlbmRVc2VyUmVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9leHByZXNzLWh0dHAtcHJveHkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V4cHJlc3MtaHR0cC1wcm94eS9saWIvYXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V4cHJlc3MtaHR0cC1wcm94eS9saWIvY2h1bmtMZW5ndGguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V4cHJlc3MtaHR0cC1wcm94eS9saWIvaXNVbnNldC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZXhwcmVzcy1odHRwLXByb3h5L2xpYi9yZXF1ZXN0T3B0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZXhwcmVzcy1odHRwLXByb3h5L2xpYi9yZXNvbHZlT3B0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZXhwcmVzcy1odHRwLXByb3h5L2xpYi9zY29wZUNvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUm91dGVzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0hlYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udGFpbmVycy9Ib21lL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jb250YWluZXJzL0hvbWUvc3RvcmUvYWN0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udGFpbmVycy9Ib21lL3N0b3JlL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udGFpbmVycy9Ib21lL3N0b3JlL3JlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRhaW5lcnMvTG9naW4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmVyL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NyYy9zdG9yZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJhc3NlcnRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJheGlvc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImRlYnVnXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJhdy1ib2R5XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVhY3RcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdC1kb20vc2VydmVyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVhY3QtcmVkdXhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdC1yb3V0ZXItY29uZmlnXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVhY3Qtcm91dGVyLWRvbVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlZHV4XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVkdXgtdGh1bmtcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1cmxcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ6bGliXCIiXSwibmFtZXMiOlsicGF0aCIsImNvbXBvbmVudCIsIkhvbWUiLCJleGFjdCIsImtleSIsImxvYWREYXRhIiwiTG9naW4iLCJIZWFkZXIiLCJwcm9wcyIsImxpc3QiLCJsZW5ndGgiLCJnZXRIb21lTGlzdCIsImdldExpc3QiLCJhbGVydCIsIm1hcCIsIml0ZW0iLCJJZCIsInR5cGVOYW1lIiwibWFwU3RhdGVUb1Byb3BzIiwibmFtZSIsInN0YXRlIiwiaG9tZSIsIm5ld3NMaXN0IiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwiZGlzcGF0Y2giLCJzdG9yZSIsIkhvbWVDb250YWluZXIiLCJjaGFuZ2VMaXN0IiwidHlwZSIsIkNIQU5HRV9MSVNUIiwic2VydmVyIiwiYXhpb3MiLCJnZXQiLCJ0aGVuIiwicmVzIiwiZGF0YSIsImNhdGNoIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJkZWZhdWx0U3RhdGUiLCJhY3Rpb24iLCJhcHAiLCJ1c2UiLCJleHByZXNzIiwic3RhdGljIiwicHJveHlSZXFQYXRoUmVzb2x2ZXIiLCJyZXEiLCJ1cmwiLCJtYXRjaGVkUm91dGVzIiwiUm91dGVzIiwicHJvbWlzZXMiLCJmb3JFYWNoIiwicm91dGUiLCJwdXNoIiwiUHJvbWlzZSIsImFsbCIsInNlbmQiLCJsaXN0ZW4iLCJob3N0IiwiYWRkcmVzcyIsInBvcnQiLCJyZW5kZXIiLCJjb250ZW50IiwiSlNPTiIsInN0cmluZ2lmeSIsImdldFN0YXRlIiwicmVkdWNlciIsImhvbWVSZWR1Y2VyIiwiZ2V0U3RvcmUiLCJ0aHVuayIsImdldENsaWVudFN0b3JlIiwid2luZG93IiwiY29udGV4dCJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FB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QUFQLENBQVcsVUFBQ3VDLEtBQUQ7QUFBQSxpQkFDViw4QkFBQyxxQkFBRCxFQUFXQSxLQUFYLENBRFU7QUFBQSxTQUFYO0FBREg7QUFERjtBQURGLEdBRGdCLENBQWhCOztBQVlBLGtIQU9xQlUsT0FQckIsNkVBVWlCQyxLQUFLQyxTQUFMLENBQWV4QyxNQUFNeUMsUUFBTixFQUFmLENBVmpCO0FBaUJELENBL0JNLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOUDs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQyxVQUFVLDRCQUFnQjtBQUM5QjlDLFFBQU0rQztBQUR3QixDQUFoQixDQUFoQjs7QUFJTyxJQUFNQyw4QkFBVyxTQUFYQSxRQUFXLEdBQU07QUFDNUIsU0FBTyx3QkFBWUYsT0FBWixFQUFxQiw0QkFBZ0JHLG9CQUFoQixDQUFyQixDQUFQO0FBQ0QsQ0FGTTs7QUFJQSxJQUFNQywwQ0FBaUIsU0FBakJBLGNBQWlCLEdBQU07QUFDbEMsTUFBTS9CLGVBQWVnQyxPQUFPQyxPQUFQLENBQWVyRCxLQUFwQztBQUNBLFNBQU8sd0JBQVkrQyxPQUFaLEVBQXFCM0IsWUFBckIsRUFBbUMsNEJBQWdCOEIsb0JBQWhCLENBQW5DLENBQVA7QUFDRCxDQUhNLEM7Ozs7Ozs7Ozs7O0FDWlAsbUM7Ozs7Ozs7Ozs7O0FDQUEsa0M7Ozs7Ozs7Ozs7O0FDQUEsa0M7Ozs7Ozs7Ozs7O0FDQUEsb0M7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsa0M7Ozs7Ozs7Ozs7O0FDQUEscUM7Ozs7Ozs7Ozs7O0FDQUEsa0M7Ozs7Ozs7Ozs7O0FDQUEsNkM7Ozs7Ozs7Ozs7O0FDQUEsd0M7Ozs7Ozs7Ozs7O0FDQUEsZ0Q7Ozs7Ozs7Ozs7O0FDQUEsNkM7Ozs7Ozs7Ozs7O0FDQUEsa0M7Ozs7Ozs7Ozs7O0FDQUEsd0M7Ozs7Ozs7Ozs7O0FDQUEsZ0M7Ozs7Ozs7Ozs7O0FDQUEsaUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvc2VydmVyL2luZGV4LmpzXCIpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdleHByZXNzLWh0dHAtcHJveHknKTtcbnZhciByZXF1ZXN0T3B0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9yZXF1ZXN0T3B0aW9ucycpO1xuXG5mdW5jdGlvbiBidWlsZFByb3h5UmVxKENvbnRhaW5lcikge1xuICB2YXIgcmVxID0gQ29udGFpbmVyLnVzZXIucmVxO1xuICB2YXIgcmVzID0gQ29udGFpbmVyLnVzZXIucmVzO1xuICB2YXIgb3B0aW9ucyA9IENvbnRhaW5lci5vcHRpb25zO1xuICB2YXIgaG9zdCA9IENvbnRhaW5lci5wcm94eS5ob3N0O1xuXG4gIHZhciBwYXJzZUJvZHkgPSAoIW9wdGlvbnMucGFyc2VSZXFCb2R5KSA/IFByb21pc2UucmVzb2x2ZShudWxsKSA6IHJlcXVlc3RPcHRpb25zLmJvZHlDb250ZW50KHJlcSwgcmVzLCBvcHRpb25zKTtcbiAgdmFyIGNyZWF0ZVJlcU9wdGlvbnMgPSByZXF1ZXN0T3B0aW9ucy5jcmVhdGUocmVxLCByZXMsIG9wdGlvbnMsIGhvc3QpO1xuXG4gIHJldHVybiBQcm9taXNlXG4gICAgLmFsbChbcGFyc2VCb2R5LCBjcmVhdGVSZXFPcHRpb25zXSlcbiAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZUFycmF5KSB7XG4gICAgICBDb250YWluZXIucHJveHkuYm9keUNvbnRlbnQgPSByZXNwb25zZUFycmF5WzBdO1xuICAgICAgQ29udGFpbmVyLnByb3h5LnJlcUJ1aWxkZXIgPSByZXNwb25zZUFycmF5WzFdO1xuICAgICAgZGVidWcoJ3Byb3h5IHJlcXVlc3Qgb3B0aW9uczonLCBDb250YWluZXIucHJveHkucmVxQnVpbGRlcik7XG4gICAgICByZXR1cm4gQ29udGFpbmVyO1xuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ1aWxkUHJveHlSZXE7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGNvcHlQcm94eVJlc0hlYWRlcnNUb1VzZXJSZXMoY29udGFpbmVyKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgdmFyIHJlcyA9IGNvbnRhaW5lci51c2VyLnJlcztcbiAgICB2YXIgcnNwID0gY29udGFpbmVyLnByb3h5LnJlcztcblxuICAgIGlmICghcmVzLmhlYWRlcnNTZW50KSB7XG4gICAgICAgIHJlcy5zdGF0dXMocnNwLnN0YXR1c0NvZGUpO1xuICAgICAgICBPYmplY3Qua2V5cyhyc3AuaGVhZGVycylcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7IHJldHVybiBpdGVtICE9PSAndHJhbnNmZXItZW5jb2RpbmcnOyB9KVxuICAgICAgICAuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICByZXMuc2V0KGl0ZW0sIHJzcC5oZWFkZXJzW2l0ZW1dKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVzb2x2ZShjb250YWluZXIpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5UHJveHlSZXNIZWFkZXJzVG9Vc2VyUmVzO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2V4cHJlc3MtaHR0cC1wcm94eScpO1xuXG5mdW5jdGlvbiBkZWZhdWx0RGVjb3JhdG9yKHByb3h5UmVxT3B0Qm9keS8qLCB1c2VyUmVxICovKSB7XG4gIHJldHVybiBwcm94eVJlcU9wdEJvZHk7XG59XG5cbmZ1bmN0aW9uIGRlY29yYXRlUHJveHlSZXFCb2R5KGNvbnRhaW5lcikge1xuICB2YXIgdXNlckRlY29yYXRvciA9IGNvbnRhaW5lci5vcHRpb25zLnByb3h5UmVxQm9keURlY29yYXRvcjtcbiAgdmFyIHJlc29sdmVyRm4gPSB1c2VyRGVjb3JhdG9yIHx8IGRlZmF1bHREZWNvcmF0b3I7XG5cbiAgaWYgKHVzZXJEZWNvcmF0b3IpIHtcbiAgICBkZWJ1ZygndXNpbmcgY3VzdG9tIHByb3h5UmVxQm9keURlY29yYXRvcicpO1xuICB9XG5cbiAgcmV0dXJuIFByb21pc2VcbiAgICAucmVzb2x2ZShyZXNvbHZlckZuKGNvbnRhaW5lci5wcm94eS5ib2R5Q29udGVudCwgY29udGFpbmVyLnVzZXIucmVxKSlcbiAgICAudGhlbihmdW5jdGlvbihib2R5Q29udGVudCkge1xuICAgICAgY29udGFpbmVyLnByb3h5LmJvZHlDb250ZW50ID0gYm9keUNvbnRlbnQ7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNvbnRhaW5lcik7XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVjb3JhdGVQcm94eVJlcUJvZHk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2V4cHJlc3MtaHR0cC1wcm94eScpO1xuXG5mdW5jdGlvbiBkZWZhdWx0RGVjb3JhdG9yKHByb3h5UmVxT3B0QnVpbGRlciAvKiwgdXNlclJlcSAqLykge1xuICByZXR1cm4gcHJveHlSZXFPcHRCdWlsZGVyO1xufVxuXG5mdW5jdGlvbiBkZWNvcmF0ZVByb3h5UmVxT3B0KGNvbnRhaW5lcikge1xuICB2YXIgcmVzb2x2ZXJGbiA9IGNvbnRhaW5lci5vcHRpb25zLnByb3h5UmVxT3B0RGVjb3JhdG9yIHx8IGRlZmF1bHREZWNvcmF0b3I7XG5cbiAgcmV0dXJuIFByb21pc2VcbiAgICAucmVzb2x2ZShyZXNvbHZlckZuKGNvbnRhaW5lci5wcm94eS5yZXFCdWlsZGVyLCBjb250YWluZXIudXNlci5yZXEpKVxuICAgIC50aGVuKGZ1bmN0aW9uIChwcm9jZXNzZWRSZXFPcHRzKSB7XG4gICAgICBkZWxldGUgcHJvY2Vzc2VkUmVxT3B0cy5wYXJhbXM7XG4gICAgICBjb250YWluZXIucHJveHkucmVxQnVpbGRlciA9IHByb2Nlc3NlZFJlcU9wdHM7XG4gICAgICBkZWJ1ZygnUmVxdWVzdCBvcHRpb25zIChhZnRlciBwcm9jZXNzaW5nKTogJW8nLCBwcm9jZXNzZWRSZXFPcHRzKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoY29udGFpbmVyKTtcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWNvcmF0ZVByb3h5UmVxT3B0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXMgPSByZXF1aXJlKCcuLi8uLi9saWIvYXMuanMnKTtcbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2V4cHJlc3MtaHR0cC1wcm94eScpO1xudmFyIHpsaWIgPSByZXF1aXJlKCd6bGliJyk7XG5cbmZ1bmN0aW9uIGlzUmVzR3ppcHBlZChyZXMpIHtcbiAgcmV0dXJuIHJlcy5oZWFkZXJzWydjb250ZW50LWVuY29kaW5nJ10gPT09ICdnemlwJztcbn1cblxuZnVuY3Rpb24gemlwT3JVbnppcChtZXRob2QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHJzcERhdGEsIHJlcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZiAoaXNSZXNHemlwcGVkKHJlcykgJiYgcnNwRGF0YS5sZW5ndGgpIHtcbiAgICAgICAgemxpYlttZXRob2RdKHJzcERhdGEsIGZ1bmN0aW9uKGVyciwgYnVmZmVyKSB7XG4gICAgICAgICAgaWYoZXJyKSB7XG4gICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZShidWZmZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKHJzcERhdGEpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuXG52YXIgbWF5YmVVbnppcFByb21pc2UgPSB6aXBPclVuemlwKCdndW56aXAnKTtcbnZhciBtYXliZVppcFByb21pc2UgPSB6aXBPclVuemlwKCdnemlwJyk7XG5cbmZ1bmN0aW9uIHZlcmlmeUJ1ZmZlcihyc3BkLCByZWplY3QpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIocnNwZCkpIHtcbiAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcigndXNlclJlc0RlY29yYXRvciBzaG91bGQgcmV0dXJuIHN0cmluZyBvciBidWZmZXIgYXMgZGF0YScpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVIZWFkZXJzKHJlcywgcnNwZEJlZm9yZSwgcnNwZEFmdGVyLCByZWplY3QpIHtcbiAgaWYgKCFyZXMuaGVhZGVyc1NlbnQpIHtcbiAgICAgIHJlcy5zZXQoJ2NvbnRlbnQtbGVuZ3RoJywgcnNwZEFmdGVyLmxlbmd0aCk7XG4gIH0gZWxzZSBpZiAocnNwZEFmdGVyLmxlbmd0aCAhPT0gcnNwZEJlZm9yZS5sZW5ndGgpIHtcbiAgICAgIHZhciBlcnJvciA9ICdcIkNvbnRlbnQtTGVuZ3RoXCIgaXMgYWxyZWFkeSBzZW50LCcgK1xuICAgICAgICAgICd0aGUgbGVuZ3RoIG9mIHJlc3BvbnNlIGRhdGEgY2FuIG5vdCBiZSBjaGFuZ2VkJztcbiAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVjb3JhdGVQcm94eVJlc0JvZHkoY29udGFpbmVyKSB7XG4gIHZhciByZXNvbHZlckZuID0gY29udGFpbmVyLm9wdGlvbnMudXNlclJlc0RlY29yYXRvcjtcblxuICBpZiAoIXJlc29sdmVyRm4pIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNvbnRhaW5lcik7XG4gIH1cblxuICB2YXIgcHJveHlSZXNEYXRhUHJvbWlzZSA9IG1heWJlVW56aXBQcm9taXNlKGNvbnRhaW5lci5wcm94eS5yZXNEYXRhLCBjb250YWluZXIucHJveHkucmVzKTtcbiAgdmFyIHByb3h5UmVzID0gY29udGFpbmVyLnByb3h5LnJlcztcbiAgdmFyIHJlcSA9IGNvbnRhaW5lci51c2VyLnJlcTtcbiAgdmFyIHJlcyA9IGNvbnRhaW5lci51c2VyLnJlcztcbiAgdmFyIG9yaWdpbmFsUmVzRGF0YTsgXG5cbiAgaWYgKHJlcy5zdGF0dXNDb2RlID09PSAzMDQpIHtcbiAgICBkZWJ1ZygnU2tpcHBpbmcgdXNlclJlc0RlY29yYXRvciBvbiByZXNwb25zZSAzMDQnKTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNvbnRhaW5lcik7XG4gIH1cblxuICByZXR1cm4gcHJveHlSZXNEYXRhUHJvbWlzZVxuICAgIC50aGVuKGZ1bmN0aW9uKHByb3h5UmVzRGF0YSl7XG4gICAgICBvcmlnaW5hbFJlc0RhdGEgPSBwcm94eVJlc0RhdGE7XG4gICAgICByZXR1cm4gcmVzb2x2ZXJGbihwcm94eVJlcywgcHJveHlSZXNEYXRhLCByZXEsIHJlcyk7XG4gICAgfSlcbiAgICAudGhlbihmdW5jdGlvbihtb2RpZmllZFJlc0RhdGEpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdmFyIHJzcGQgPSBhcy5idWZmZXIobW9kaWZpZWRSZXNEYXRhLCBjb250YWluZXIub3B0aW9ucyk7XG4gICAgICAgIHZlcmlmeUJ1ZmZlcihyc3BkLCByZWplY3QpO1xuICAgICAgICB1cGRhdGVIZWFkZXJzKHJlcywgb3JpZ2luYWxSZXNEYXRhLCByc3BkLCByZWplY3QpO1xuICAgICAgICBtYXliZVppcFByb21pc2UocnNwZCwgY29udGFpbmVyLnByb3h5LnJlcykudGhlbihmdW5jdGlvbihidWZmZXIpIHtcbiAgICAgICAgICBjb250YWluZXIucHJveHkucmVzRGF0YSA9IGJ1ZmZlcjtcbiAgICAgICAgICByZXNvbHZlKGNvbnRhaW5lcik7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlY29yYXRlUHJveHlSZXNCb2R5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmZ1bmN0aW9uIGRlY29yYXRlVXNlclJlc0hlYWRlcnMoY29udGFpbmVyKSB7XG4gIHZhciByZXNvbHZlckZuID0gY29udGFpbmVyLm9wdGlvbnMudXNlclJlc0hlYWRlckRlY29yYXRvcjtcbiAgdmFyIGhlYWRlcnMgPSBjb250YWluZXIudXNlci5yZXMuZ2V0SGVhZGVycyA/IGNvbnRhaW5lci51c2VyLnJlcy5nZXRIZWFkZXJzKCkgOiBjb250YWluZXIudXNlci5yZXMuX2hlYWRlcnM7XG5cbiAgaWYgKCFyZXNvbHZlckZuKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShjb250YWluZXIpO1xuICB9XG5cbiAgcmV0dXJuIFByb21pc2VcbiAgICAucmVzb2x2ZShyZXNvbHZlckZuKGhlYWRlcnMsIGNvbnRhaW5lci51c2VyLnJlcSwgY29udGFpbmVyLnVzZXIucmVzLCBjb250YWluZXIucHJveHkucmVxLCBjb250YWluZXIucHJveHkucmVzKSlcbiAgICAudGhlbihmdW5jdGlvbihoZWFkZXJzKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICBjb250YWluZXIudXNlci5yZXMuc2V0KGhlYWRlcnMpO1xuICAgICAgICByZXNvbHZlKGNvbnRhaW5lcik7XG4gICAgICB9KTtcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWNvcmF0ZVVzZXJSZXNIZWFkZXJzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBOby1vcCB2ZXJzaW9uIG9mIGZpbHRlci4gIEFsbG93cyBldmVyeXRoaW5nIVxuXG5mdW5jdGlvbiBkZWZhdWx0RmlsdGVyKHByb3h5UmVxT3B0QnVpbGRlciwgdXNlclJlcSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJVc2VyUmVxdWVzdChjb250YWluZXIpIHtcbiAgdmFyIHJlc29sdmVyRm4gPSBjb250YWluZXIub3B0aW9ucy5maWx0ZXIgfHwgZGVmYXVsdEZpbHRlcjtcblxuICByZXR1cm4gUHJvbWlzZVxuICAgIC5yZXNvbHZlKHJlc29sdmVyRm4oY29udGFpbmVyLnVzZXIucmVxLCBjb250YWluZXIudXNlci5yZXMpKVxuICAgIC50aGVuKGZ1bmN0aW9uIChzaG91bGRJQ29udGludWUpIHtcbiAgICAgIGlmIChzaG91bGRJQ29udGludWUpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShjb250YWluZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCk7IC8vIHJlamVjdCB3aXRoIG5vIGFyZ3Mgc2hvdWxkIHNpbXBseSBjYWxsIG5leHQoKVxuICAgICAgfVxuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbHRlclVzZXJSZXF1ZXN0O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2V4cHJlc3MtaHR0cC1wcm94eScpO1xuXG5mdW5jdGlvbiBjb25uZWN0aW9uUmVzZXRIYW5kbGVyKGVyciwgcmVzKSB7XG4gIGlmIChlcnIgJiYgZXJyLmNvZGUgPT09ICdFQ09OTlJFU0VUJykge1xuICAgIGRlYnVnKCdFcnJvcjogQ29ubmVjdGlvbiByZXNldCBkdWUgdG8gdGltZW91dC4nKTtcbiAgICByZXMuc2V0SGVhZGVyKCdYLVRpbWVvdXQtUmVhc29uJywgJ2V4cHJlc3MtaHR0cC1wcm94eSByZXNldCB0aGUgcmVxdWVzdC4nKTtcbiAgICByZXMud3JpdGVIZWFkKDUwNCwgeydDb250ZW50LVR5cGUnOiAndGV4dC9wbGFpbid9KTtcbiAgICByZXMuZW5kKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlUHJveHlFcnJvcnMoZXJyLCByZXMsIG5leHQpIHtcbiAgc3dpdGNoIChlcnIgJiYgZXJyLmNvZGUpIHtcbiAgICBjYXNlICdFQ09OTlJFU0VUJzogIHsgcmV0dXJuIGNvbm5lY3Rpb25SZXNldEhhbmRsZXIoZXJyLCByZXMsIG5leHQpOyB9XG4gICAgZGVmYXVsdDogICAgICAgICAgICB7IG5leHQoZXJyKTsgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFuZGxlUHJveHlFcnJvcnM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTa2lwRmlsdGVyKC8qIHJlcyAqLykge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIG1heWJlU2tpcFRvTmV4dEhhbmRsZXIoY29udGFpbmVyKSB7XG4gIHZhciByZXNvbHZlckZuID0gY29udGFpbmVyLm9wdGlvbnMuc2tpcFRvTmV4dEhhbmRsZXJGaWx0ZXIgfHwgZGVmYXVsdFNraXBGaWx0ZXI7XG5cbiAgcmV0dXJuIFByb21pc2VcbiAgICAucmVzb2x2ZShyZXNvbHZlckZuKGNvbnRhaW5lci5wcm94eS5yZXMpKVxuICAgIC50aGVuKGZ1bmN0aW9uIChzaG91bGRTa2lwVG9OZXh0KSB7XG4gICAgICBpZiAoc2hvdWxkU2tpcFRvTmV4dCkge1xuICAgICAgICBjb250YWluZXIudXNlci5yZXMuZXhwcmVzc0h0dHBQcm94eSA9IGNvbnRhaW5lci5wcm94eTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGNvbnRhaW5lci51c2VyLm5leHQoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNvbnRhaW5lcik7XG4gICAgICB9XG4gICAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXliZVNraXBUb05leHRIYW5kbGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXMgPSByZXF1aXJlKCcuLi8uLi9saWIvYXMnKTtcblxuZnVuY3Rpb24gZ2V0Q29udGVudExlbmd0aChib2R5KSB7XG5cbiAgdmFyIHJlc3VsdDtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihib2R5KSkgeyAvLyBCdWZmZXJcbiAgICByZXN1bHQgPSBib2R5Lmxlbmd0aDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXN1bHQgPSBCdWZmZXIuYnl0ZUxlbmd0aChib2R5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbmZ1bmN0aW9uIHByZXBhcmVQcm94eVJlcShjb250YWluZXIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICB2YXIgYm9keUNvbnRlbnQgPSBjb250YWluZXIucHJveHkuYm9keUNvbnRlbnQ7XG4gICAgdmFyIHJlcU9wdCA9IGNvbnRhaW5lci5wcm94eS5yZXFCdWlsZGVyO1xuXG4gICAgaWYgKGJvZHlDb250ZW50KSB7XG4gICAgICBib2R5Q29udGVudCA9IGNvbnRhaW5lci5vcHRpb25zLnJlcUFzQnVmZmVyID9cbiAgICAgICAgYXMuYnVmZmVyKGJvZHlDb250ZW50LCBjb250YWluZXIub3B0aW9ucykgOlxuICAgICAgICBhcy5idWZmZXJPclN0cmluZyhib2R5Q29udGVudCk7XG5cbiAgICAgIHJlcU9wdC5oZWFkZXJzWydjb250ZW50LWxlbmd0aCddID0gZ2V0Q29udGVudExlbmd0aChib2R5Q29udGVudCk7XG5cbiAgICAgIGlmIChjb250YWluZXIub3B0aW9ucy5yZXFCb2R5RW5jb2RpbmcpIHtcbiAgICAgICAgcmVxT3B0LmhlYWRlcnNbJ0FjY2VwdC1DaGFyc2V0J10gPSBjb250YWluZXIub3B0aW9ucy5yZXFCb2R5RW5jb2Rpbmc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29udGFpbmVyLnByb3h5LmJvZHlDb250ZW50ID0gYm9keUNvbnRlbnQ7XG4gICAgcmVzb2x2ZShjb250YWluZXIpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwcmVwYXJlUHJveHlSZXE7XG5cbiIsIid1c2Ugc3RyaWN0JztcbnZhciByZXF1ZXN0T3B0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9yZXF1ZXN0T3B0aW9ucycpO1xuXG5mdW5jdGlvbiByZXNvbHZlUHJveHlIb3N0KGNvbnRhaW5lcikge1xuICB2YXIgcGFyc2VkSG9zdDtcblxuICBpZiAoY29udGFpbmVyLm9wdGlvbnMubWVtb2l6ZUhvc3QgJiYgY29udGFpbmVyLm9wdGlvbnMubWVtb2l6ZWRIb3N0KSB7XG4gICAgcGFyc2VkSG9zdCA9IGNvbnRhaW5lci5vcHRpb25zLm1lbW9pemVkSG9zdDtcbiAgfSBlbHNlIHtcbiAgICBwYXJzZWRIb3N0ID0gcmVxdWVzdE9wdGlvbnMucGFyc2VIb3N0KGNvbnRhaW5lcik7XG4gIH1cblxuICBjb250YWluZXIucHJveHkucmVxQnVpbGRlci5ob3N0ID0gcGFyc2VkSG9zdC5ob3N0O1xuICBjb250YWluZXIucHJveHkucmVxQnVpbGRlci5wb3J0ID0gY29udGFpbmVyLm9wdGlvbnMucG9ydCB8fCBwYXJzZWRIb3N0LnBvcnQ7XG4gIGNvbnRhaW5lci5wcm94eS5yZXF1ZXN0TW9kdWxlID0gcGFyc2VkSG9zdC5tb2R1bGU7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoY29udGFpbmVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXNvbHZlUHJveHlIb3N0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXJsID0gcmVxdWlyZSgndXJsJyk7XG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdleHByZXNzLWh0dHAtcHJveHknKTtcblxuZnVuY3Rpb24gZGVmYXVsdFByb3h5UmVxUGF0aFJlc29sdmVyKHJlcSkge1xuICByZXR1cm4gdXJsLnBhcnNlKHJlcS51cmwpLnBhdGg7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVQcm94eVJlcVBhdGgoY29udGFpbmVyKSB7XG4gIHZhciByZXNvbHZlckZuID0gY29udGFpbmVyLm9wdGlvbnMucHJveHlSZXFQYXRoUmVzb2x2ZXIgfHwgZGVmYXVsdFByb3h5UmVxUGF0aFJlc29sdmVyO1xuXG4gIHJldHVybiBQcm9taXNlXG4gICAgLnJlc29sdmUocmVzb2x2ZXJGbihjb250YWluZXIudXNlci5yZXEpKVxuICAgIC50aGVuKGZ1bmN0aW9uKHJlc29sdmVkUGF0aCkge1xuICAgICAgY29udGFpbmVyLnByb3h5LnJlcUJ1aWxkZXIucGF0aCA9IHJlc29sdmVkUGF0aDtcbiAgICAgIGRlYnVnKCdyZXNvbHZlZCBwcm94eSBwYXRoOicsIHJlc29sdmVkUGF0aCk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNvbnRhaW5lcik7XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVzb2x2ZVByb3h5UmVxUGF0aDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNodW5rTGVuZ3RoID0gcmVxdWlyZSgnLi4vLi4vbGliL2NodW5rTGVuZ3RoJyk7XG5cbmZ1bmN0aW9uIHNlbmRQcm94eVJlcXVlc3QoQ29udGFpbmVyKSB7XG4gIHZhciByZXEgPSBDb250YWluZXIudXNlci5yZXE7XG4gIHZhciBib2R5Q29udGVudCA9IENvbnRhaW5lci5wcm94eS5ib2R5Q29udGVudDtcbiAgdmFyIHJlcU9wdCA9IENvbnRhaW5lci5wcm94eS5yZXFCdWlsZGVyO1xuICB2YXIgb3B0aW9ucyA9IENvbnRhaW5lci5vcHRpb25zO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcHJvdG9jb2wgPSBDb250YWluZXIucHJveHkucmVxdWVzdE1vZHVsZTtcbiAgICB2YXIgcHJveHlSZXEgPSBDb250YWluZXIucHJveHkucmVxID0gcHJvdG9jb2wucmVxdWVzdChyZXFPcHQsIGZ1bmN0aW9uKHJzcCkge1xuICAgICAgaWYgKG9wdGlvbnMuc3RyZWFtKSB7XG4gICAgICAgIENvbnRhaW5lci5wcm94eS5yZXMgPSByc3A7XG4gICAgICAgIHJldHVybiByZXNvbHZlKENvbnRhaW5lcik7XG4gICAgICB9XG5cbiAgICAgIHZhciBjaHVua3MgPSBbXTtcbiAgICAgIHJzcC5vbignZGF0YScsIGZ1bmN0aW9uKGNodW5rKSB7IGNodW5rcy5wdXNoKGNodW5rKTsgfSk7XG4gICAgICByc3Aub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBDb250YWluZXIucHJveHkucmVzID0gcnNwO1xuICAgICAgICBDb250YWluZXIucHJveHkucmVzRGF0YSA9IEJ1ZmZlci5jb25jYXQoY2h1bmtzLCBjaHVua0xlbmd0aChjaHVua3MpKTtcbiAgICAgICAgcmVzb2x2ZShDb250YWluZXIpO1xuICAgICAgfSk7XG4gICAgICByc3Aub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICB9KTtcblxuICAgIHByb3h5UmVxLm9uKCdzb2NrZXQnLCBmdW5jdGlvbihzb2NrZXQpIHtcbiAgICAgIGlmIChvcHRpb25zLnRpbWVvdXQpIHtcbiAgICAgICAgc29ja2V0LnNldFRpbWVvdXQob3B0aW9ucy50aW1lb3V0LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBwcm94eVJlcS5hYm9ydCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHByb3h5UmVxLm9uKCdlcnJvcicsIHJlamVjdCk7XG5cbiAgICAvLyB0aGlzIGd1eSBzaG91bGQgZ28gZWxzZXdoZXJlLCBkb3duIHRoZSBjaGFpblxuICAgIGlmIChvcHRpb25zLnBhcnNlUmVxQm9keSkge1xuICAgIC8vIFdlIGFyZSBwYXJzaW5nIHRoZSBib2R5IG91cnNlbHZlcyBzbyB3ZSBuZWVkIHRvIHdyaXRlIHRoZSBib2R5IGNvbnRlbnRcbiAgICAvLyBhbmQgdGhlbiBtYW51YWxseSBlbmQgdGhlIHJlcXVlc3QuXG5cbiAgICAgIC8vaWYgKGJvZHlDb250ZW50IGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgIC8vdGhyb3cgbmV3IEVycm9yXG4gICAgICAgIC8vZGVidWdnZXI7XG4gICAgICAgIC8vYm9keUNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShib2R5Q29udGVudCk7XG4gICAgICAvL31cblxuICAgICAgaWYgKGJvZHlDb250ZW50Lmxlbmd0aCkge1xuICAgICAgICB2YXIgYm9keSA9IGJvZHlDb250ZW50O1xuICAgICAgICB2YXIgY29udGVudFR5cGUgPSBwcm94eVJlcS5nZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgICAgICBpZiAoY29udGVudFR5cGUgPT09ICd4LXd3dy1mb3JtLXVybGVuY29kZWQnIHx8IGNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgICAgIGJvZHkgPSBPYmplY3Qua2V5cyhwYXJhbXMpLm1hcChmdW5jdGlvbihrKSB7IHJldHVybiBrICsgJz0nICsgcGFyYW1zW2tdOyB9KS5qb2luKCcmJyk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy8gYm9keUNvbnRlbnQgaXMgbm90IGpzb24tZm9ybWF0XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCBCdWZmZXIuYnl0ZUxlbmd0aChib2R5KSk7XG4gICAgICAgIHByb3h5UmVxLndyaXRlKGJvZHkpO1xuICAgICAgfVxuICAgICAgcHJveHlSZXEuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAvLyBQaXBlIHdpbGwgY2FsbCBlbmQgd2hlbiBpdCBoYXMgY29tcGxldGVseSByZWFkIGZyb20gdGhlIHJlcXVlc3QuXG4gICAgICByZXEucGlwZShwcm94eVJlcSk7XG4gICAgfVxuXG4gICAgcmVxLm9uKCdhYm9ydGVkJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gcmVqZWN0P1xuICAgICAgcHJveHlSZXEuYWJvcnQoKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBzZW5kUHJveHlSZXF1ZXN0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBzZW5kVXNlclJlcyhDb250YWluZXIpIHtcbiAgaWYgKCFDb250YWluZXIudXNlci5yZXMuaGVhZGVyc1NlbnQpIHtcbiAgICBpZiAoQ29udGFpbmVyLm9wdGlvbnMuc3RyZWFtKSB7XG4gICAgICBDb250YWluZXIucHJveHkucmVzLnBpcGUoQ29udGFpbmVyLnVzZXIucmVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgQ29udGFpbmVyLnVzZXIucmVzLnNlbmQoQ29udGFpbmVyLnByb3h5LnJlc0RhdGEpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKENvbnRhaW5lcik7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBzZW5kVXNlclJlcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gKiBCcmVha3MgcHJveHlpbmcgaW50byBhIHNlcmllcyBvZiBkaXNjcmV0ZSBzdGVwcywgbWFueSBvZiB3aGljaCBjYW4gYmUgc3dhcHBlZCBvdXQgYnkgYXV0aG9ycy5cbi8vICogVXNlcyBQcm9taXNlcyB0byBzdXBwb3J0IGFzeW5jLlxuLy8gKiBVc2VzIGEgcXVhc2ktR2xvYmFsIGNhbGxlZCBDb250YWluZXIgdG8gdGlkeSB1cCB0aGUgYXJndW1lbnQgcGFzc2luZyBiZXR3ZWVuIHRoZSBtYWpvciB3b3JrLWZsb3cgc3RlcHMuXG5cbnZhciBTY29wZUNvbnRhaW5lciA9IHJlcXVpcmUoJy4vbGliL3Njb3BlQ29udGFpbmVyJyk7XG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdleHByZXNzLWh0dHAtcHJveHknKTtcblxudmFyIGJ1aWxkUHJveHlSZXEgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL2FwcC9zdGVwcy9idWlsZFByb3h5UmVxJyk7XG52YXIgY29weVByb3h5UmVzSGVhZGVyc1RvVXNlclJlcyA9IHJlcXVpcmUoJy4vYXBwL3N0ZXBzL2NvcHlQcm94eVJlc0hlYWRlcnNUb1VzZXJSZXMnKTtcbnZhciBkZWNvcmF0ZVByb3h5UmVxQm9keSAgICAgICAgID0gcmVxdWlyZSgnLi9hcHAvc3RlcHMvZGVjb3JhdGVQcm94eVJlcUJvZHknKTtcbnZhciBkZWNvcmF0ZVByb3h5UmVxT3B0cyAgICAgICAgID0gcmVxdWlyZSgnLi9hcHAvc3RlcHMvZGVjb3JhdGVQcm94eVJlcU9wdHMnKTtcbnZhciBkZWNvcmF0ZVVzZXJSZXMgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9hcHAvc3RlcHMvZGVjb3JhdGVVc2VyUmVzJyk7XG52YXIgZGVjb3JhdGVVc2VyUmVzSGVhZGVycyAgICAgICA9IHJlcXVpcmUoJy4vYXBwL3N0ZXBzL2RlY29yYXRlVXNlclJlc0hlYWRlcnMnKTtcbnZhciBmaWx0ZXJVc2VyUmVxdWVzdCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9hcHAvc3RlcHMvZmlsdGVyVXNlclJlcXVlc3QnKTtcbnZhciBoYW5kbGVQcm94eUVycm9ycyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9hcHAvc3RlcHMvaGFuZGxlUHJveHlFcnJvcnMnKTtcbnZhciBtYXliZVNraXBUb05leHRIYW5kbGVyICAgICAgID0gcmVxdWlyZSgnLi9hcHAvc3RlcHMvbWF5YmVTa2lwVG9OZXh0SGFuZGxlcicpO1xudmFyIHByZXBhcmVQcm94eVJlcSAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL2FwcC9zdGVwcy9wcmVwYXJlUHJveHlSZXEnKTtcbnZhciByZXNvbHZlUHJveHlIb3N0ICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9hcHAvc3RlcHMvcmVzb2x2ZVByb3h5SG9zdCcpO1xudmFyIHJlc29sdmVQcm94eVJlcVBhdGggICAgICAgICAgPSByZXF1aXJlKCcuL2FwcC9zdGVwcy9yZXNvbHZlUHJveHlSZXFQYXRoJyk7XG52YXIgc2VuZFByb3h5UmVxdWVzdCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vYXBwL3N0ZXBzL3NlbmRQcm94eVJlcXVlc3QnKTtcbnZhciBzZW5kVXNlclJlcyAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9hcHAvc3RlcHMvc2VuZFVzZXJSZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwcm94eShob3N0LCB1c2VyT3B0aW9ucykge1xuICBhc3NlcnQoaG9zdCwgJ0hvc3Qgc2hvdWxkIG5vdCBiZSBlbXB0eScpO1xuXG4gIHJldHVybiBmdW5jdGlvbiBoYW5kbGVQcm94eShyZXEsIHJlcywgbmV4dCkge1xuICAgIGRlYnVnKCdbc3RhcnQgcHJveHldICcgKyByZXEucGF0aCk7XG4gICAgdmFyIGNvbnRhaW5lciA9IG5ldyBTY29wZUNvbnRhaW5lcihyZXEsIHJlcywgbmV4dCwgaG9zdCwgdXNlck9wdGlvbnMpO1xuXG4gICAgZmlsdGVyVXNlclJlcXVlc3QoY29udGFpbmVyKVxuICAgICAgLnRoZW4oYnVpbGRQcm94eVJlcSlcbiAgICAgIC50aGVuKHJlc29sdmVQcm94eUhvc3QpXG4gICAgICAudGhlbihkZWNvcmF0ZVByb3h5UmVxT3B0cylcbiAgICAgIC50aGVuKHJlc29sdmVQcm94eVJlcVBhdGgpXG4gICAgICAudGhlbihkZWNvcmF0ZVByb3h5UmVxQm9keSlcbiAgICAgIC50aGVuKHByZXBhcmVQcm94eVJlcSlcbiAgICAgIC50aGVuKHNlbmRQcm94eVJlcXVlc3QpXG4gICAgICAudGhlbihtYXliZVNraXBUb05leHRIYW5kbGVyKVxuICAgICAgLnRoZW4oY29weVByb3h5UmVzSGVhZGVyc1RvVXNlclJlcylcbiAgICAgIC50aGVuKGRlY29yYXRlVXNlclJlc0hlYWRlcnMpXG4gICAgICAudGhlbihkZWNvcmF0ZVVzZXJSZXMpXG4gICAgICAudGhlbihzZW5kVXNlclJlcylcbiAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIC8vIEkgc29tZXRpbWVzIHJlamVjdCB3aXRob3V0IGFuIGVycm9yIHRvIHNob3J0Y2lyY3VpdCB0aGUgcmVtYWluaW5nXG4gICAgICAgIC8vIHN0ZXBzIGFuZCByZXR1cm4gY29udHJvbCB0byB0aGUgaG9zdCBhcHBsaWNhdGlvbi5cblxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgdmFyIHJlc29sdmVyID0gKGNvbnRhaW5lci5vcHRpb25zLnByb3h5RXJyb3JIYW5kbGVyKSA/XG4gICAgICAgICAgICBjb250YWluZXIub3B0aW9ucy5wcm94eUVycm9ySGFuZGxlciA6XG4gICAgICAgICAgICBoYW5kbGVQcm94eUVycm9ycztcbiAgICAgICAgICByZXNvbHZlcihlcnIsIHJlcywgbmV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV4dCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuLypcbiAqIFRyaXZpYWwgY29udmVuaWVuY2UgbWV0aG9kcyBmb3IgcGFyc2luZyBCdWZmZXJzXG4gKi9cblxuZnVuY3Rpb24gYXNCdWZmZXIoYm9keSwgb3B0aW9ucykge1xuXG4gIHZhciByZXQ7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoYm9keSkpIHtcbiAgICByZXQgPSBib2R5O1xuICB9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnb2JqZWN0Jykge1xuICAgIHJldCA9IG5ldyBCdWZmZXIoSlNPTi5zdHJpbmdpZnkoYm9keSksIG9wdGlvbnMucmVxQm9keUVuY29kaW5nKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXQgPSBuZXcgQnVmZmVyKGJvZHksIG9wdGlvbnMucmVxQm9keUVuY29kZWluZyk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gYXNCdWZmZXJPclN0cmluZyhib2R5KSB7XG5cbiAgdmFyIHJldDtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihib2R5KSkge1xuICAgIHJldCA9IGJvZHk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0ID0gYm9keTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYnVmZmVyOiBhc0J1ZmZlcixcbiAgYnVmZmVyT3JTdHJpbmc6IGFzQnVmZmVyT3JTdHJpbmdcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGNodW5rTGVuZ3RoKGNodW5rcykge1xuICByZXR1cm4gY2h1bmtzLnJlZHVjZShmdW5jdGlvbiAobGVuLCBidWYpIHtcbiAgICByZXR1cm4gbGVuICsgYnVmLmxlbmd0aDtcbiAgfSwgMCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2h1bmtMZW5ndGg7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbCkge1xuICByZXR1cm4gKHR5cGVvZiB2YWwgID09PSAgJ3VuZGVmaW5lZCcgfHwgdmFsID09PSAnJyB8fCB2YWwgPT09IG51bGwpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBodHRwID0gcmVxdWlyZSgnaHR0cCcpO1xudmFyIGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKTtcbnZhciB1cmwgPSByZXF1aXJlKCd1cmwnKTtcbnZhciBnZXRSYXdCb2R5ID0gcmVxdWlyZSgncmF3LWJvZHknKTtcbnZhciBpc1Vuc2V0ID0gcmVxdWlyZSgnLi9pc1Vuc2V0Jyk7XG5cbmZ1bmN0aW9uIGV4dGVuZChvYmosIHNvdXJjZSwgc2tpcHMpIHtcblxuICBpZiAoIXNvdXJjZSkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgIGlmICghc2tpcHMgfHwgc2tpcHMuaW5kZXhPZihwcm9wKSA9PT0gLTEpIHtcbiAgICAgIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiBwYXJzZUhvc3QoQ29udGFpbmVyKSB7XG4gIHZhciBob3N0ID0gQ29udGFpbmVyLnBhcmFtcy5ob3N0O1xuICB2YXIgcmVxID0gIENvbnRhaW5lci51c2VyLnJlcTtcbiAgdmFyIG9wdGlvbnMgPSBDb250YWluZXIub3B0aW9ucztcbiAgaG9zdCA9ICh0eXBlb2YgaG9zdCA9PT0gJ2Z1bmN0aW9uJykgPyBob3N0KHJlcSkgOiBob3N0LnRvU3RyaW5nKCk7XG5cbiAgaWYgKCFob3N0KSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignRW1wdHkgaG9zdCBwYXJhbWV0ZXInKTtcbiAgfVxuXG4gIGlmICghL2h0dHAocyk/OlxcL1xcLy8udGVzdChob3N0KSkge1xuICAgIGhvc3QgPSAnaHR0cDovLycgKyBob3N0O1xuICB9XG5cbiAgdmFyIHBhcnNlZCA9IHVybC5wYXJzZShob3N0KTtcblxuICBpZiAoIXBhcnNlZC5ob3N0bmFtZSkge1xuICAgIHJldHVybiBuZXcgRXJyb3IoJ1VuYWJsZSB0byBwYXJzZSBob3N0bmFtZSwgcG9zc2libHkgbWlzc2luZyBwcm90b2NvbDovLz8nKTtcbiAgfVxuXG4gIHZhciBpc2h0dHBzID0gb3B0aW9ucy5odHRwcyB8fCBwYXJzZWQucHJvdG9jb2wgPT09ICdodHRwczonO1xuXG4gIHJldHVybiB7XG4gICAgaG9zdDogcGFyc2VkLmhvc3RuYW1lLFxuICAgIHBvcnQ6IHBhcnNlZC5wb3J0IHx8IChpc2h0dHBzID8gNDQzIDogODApLFxuICAgIG1vZHVsZTogaXNodHRwcyA/IGh0dHBzIDogaHR0cCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVxSGVhZGVycyhyZXEsIG9wdGlvbnMpIHtcblxuXG4gIHZhciBoZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIHx8IHt9O1xuXG4gIHZhciBza2lwSGRycyA9IFsgJ2Nvbm5lY3Rpb24nLCAnY29udGVudC1sZW5ndGgnIF07XG4gIGlmICghb3B0aW9ucy5wcmVzZXJ2ZUhvc3RIZHIpIHtcbiAgICBza2lwSGRycy5wdXNoKCdob3N0Jyk7XG4gIH1cbiAgdmFyIGhkcyA9IGV4dGVuZChoZWFkZXJzLCByZXEuaGVhZGVycywgc2tpcEhkcnMpO1xuICBoZHMuY29ubmVjdGlvbiA9ICdjbG9zZSc7XG5cbiAgcmV0dXJuIGhkcztcbn1cblxuZnVuY3Rpb24gY3JlYXRlUmVxdWVzdE9wdGlvbnMocmVxLCByZXMsIG9wdGlvbnMpIHtcblxuICAvLyBwcmVwYXJlIHByb3h5UmVxdWVzdFxuXG4gIHZhciByZXFPcHQgPSB7XG4gICAgaGVhZGVyczogcmVxSGVhZGVycyhyZXEsIG9wdGlvbnMpLFxuICAgIG1ldGhvZDogcmVxLm1ldGhvZCxcbiAgICBwYXRoOiByZXEucGF0aCxcbiAgICBwYXJhbXM6IHJlcS5wYXJhbXMsXG4gIH07XG5cbiAgaWYgKG9wdGlvbnMucHJlc2VydmVSZXFTZXNzaW9uKSB7XG4gICAgcmVxT3B0LnNlc3Npb24gPSByZXEuc2Vzc2lvbjtcbiAgfVxuXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVxT3B0KTtcbn1cblxuLy8gZXh0cmFjdCB0byBib2R5Q29udGVudCBvYmplY3RcblxuZnVuY3Rpb24gYm9keUNvbnRlbnQocmVxLCByZXMsIG9wdGlvbnMpIHtcbiAgdmFyIHBhcnNlUmVxQm9keSA9IGlzVW5zZXQob3B0aW9ucy5wYXJzZVJlcUJvZHkpID8gdHJ1ZSA6IG9wdGlvbnMucGFyc2VSZXFCb2R5O1xuXG4gIGZ1bmN0aW9uIG1heWJlUGFyc2VCb2R5KHJlcSwgbGltaXQpIHtcbiAgICBpZiAocmVxLmJvZHkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVxLmJvZHkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBpZiBubyBjYWxsYmFjayBzcGVjaWZpZWQgYW5kIGdsb2JhbCBQcm9taXNlIGV4aXN0cy5cblxuICAgICAgcmV0dXJuIGdldFJhd0JvZHkocmVxLCB7XG4gICAgICAgIGxlbmd0aDogcmVxLmhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10sXG4gICAgICAgIGxpbWl0OiBsaW1pdCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwYXJzZVJlcUJvZHkpIHtcbiAgICByZXR1cm4gbWF5YmVQYXJzZUJvZHkocmVxLCBvcHRpb25zLmxpbWl0KTtcbiAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGU6IGNyZWF0ZVJlcXVlc3RPcHRpb25zLFxuICBib2R5Q29udGVudDogYm9keUNvbnRlbnQsXG4gIHBhcnNlSG9zdDogcGFyc2VIb3N0XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdleHByZXNzLWh0dHAtcHJveHknKTtcblxudmFyIGlzVW5zZXQgPSByZXF1aXJlKCcuLi9saWIvaXNVbnNldCcpO1xuXG5mdW5jdGlvbiByZXNvbHZlQm9keUVuY29kaW5nKHJlcUJvZHlFbmNvZGluZykge1xuXG4gIC8qIEZvciByZXFCb2R5RW5jb2RpbmcsIHRoZXNlIGlzIGEgbWVhbmluZ2Z1bCBkaWZmZXJlbmNlIGJldHdlZW4gbnVsbCBhbmRcbiAgICAqIHVuZGVmaW5lZC4gIG51bGwgc2hvdWxkIGJlIHBhc3NlZCBmb3J3YXJkIGFzIHRoZSB2YWx1ZSBvZiByZXFCb2R5RW5jb2RpbmcsXG4gICAgKiBhbmQgdW5kZWZpbmVkIHNob3VsZCByZXN1bHQgaW4gdXRmLTguXG4gICAgKi9cbiAgcmV0dXJuIHJlcUJvZHlFbmNvZGluZyAhPT0gdW5kZWZpbmVkID8gcmVxQm9keUVuY29kaW5nIDogJ3V0Zi04Jztcbn1cblxuLy8gcGFyc2UgY2xpZW50IGFyZ3VtZW50c1xuXG5mdW5jdGlvbiByZXNvbHZlT3B0aW9ucyhvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgcmVzb2x2ZWQ7XG5cbiAgaWYgKG9wdGlvbnMuZGVjb3JhdGVSZXF1ZXN0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ2RlY29yYXRlUmVxdWVzdCBpcyBSRU1PVkVEOyB1c2UgcHJveHlSZXFPcHREZWNvcmF0b3IgYW5kJyArXG4gICAgICAnIHByb3h5UmVxQm9keURlY29yYXRvciBpbnN0ZWFkLiAgc2VlIFJFQURNRS5tZCdcbiAgICApO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuZm9yd2FyZFBhdGggfHwgb3B0aW9ucy5mb3J3YXJkUGF0aEFzeW5jKSB7XG4gICAgY29uc29sZS53YXJuKFxuICAgICAgJ2ZvcndhcmRQYXRoIGFuZCBmb3J3YXJkUGF0aEFzeW5jIGFyZSBERVBSRUNBVEVEJyArXG4gICAgICAnIGFuZCBzaG91bGQgYmUgcmVwbGFjZWQgd2l0aCBwcm94eVJlcVBhdGhSZXNvbHZlcidcbiAgICApO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuaW50ZXJjZXB0KSB7XG4gICAgY29uc29sZS53YXJuKFxuICAgICAgJ0RFUFJFQ0FURUQ6IGludGVyY2VwdC4gVXNlIHVzZXJSZXNEZWNvcmF0b3IgaW5zdGVhZC4nICtcbiAgICAgICcgUGxlYXNlIHNlZSBSRUFETUUgZm9yIG1vcmUgaW5mb3JtYXRpb24uJ1xuICAgICk7XG4gIH1cblxuICByZXNvbHZlZCA9IHtcbiAgICBsaW1pdDogb3B0aW9ucy5saW1pdCB8fCAnMW1iJyxcbiAgICBwcm94eVJlcVBhdGhSZXNvbHZlcjogb3B0aW9ucy5wcm94eVJlcVBhdGhSZXNvbHZlclxuICAgICAgICB8fCBvcHRpb25zLmZvcndhcmRQYXRoQXN5bmNcbiAgICAgICAgfHwgb3B0aW9ucy5mb3J3YXJkUGF0aCxcbiAgICBwcm94eVJlcU9wdERlY29yYXRvcjogb3B0aW9ucy5wcm94eVJlcU9wdERlY29yYXRvcixcbiAgICBwcm94eVJlcUJvZHlEZWNvcmF0b3I6IG9wdGlvbnMucHJveHlSZXFCb2R5RGVjb3JhdG9yLFxuICAgIHVzZXJSZXNEZWNvcmF0b3I6IG9wdGlvbnMudXNlclJlc0RlY29yYXRvciB8fCBvcHRpb25zLmludGVyY2VwdCxcbiAgICB1c2VyUmVzSGVhZGVyRGVjb3JhdG9yOiBvcHRpb25zLnVzZXJSZXNIZWFkZXJEZWNvcmF0b3IsXG4gICAgcHJveHlFcnJvckhhbmRsZXI6IG9wdGlvbnMucHJveHlFcnJvckhhbmRsZXIsXG4gICAgZmlsdGVyOiBvcHRpb25zLmZpbHRlcixcbiAgICAvLyBGb3IgYmFja3dhcmRzIGNvbXBhdGFiaWxpdHksIHdlIGRlZmF1bHQgdG8gbGVnYWN5IGJlaGF2aW9yIGZvciBuZXdseSBhZGRlZCBzZXR0aW5ncy5cblxuICAgIHBhcnNlUmVxQm9keTogaXNVbnNldChvcHRpb25zLnBhcnNlUmVxQm9keSkgPyB0cnVlIDogb3B0aW9ucy5wYXJzZVJlcUJvZHksXG4gICAgcHJlc2VydmVIb3N0SGRyOiBvcHRpb25zLnByZXNlcnZlSG9zdEhkcixcbiAgICBtZW1vaXplSG9zdDogaXNVbnNldChvcHRpb25zLm1lbW9pemVIb3N0KSA/IHRydWUgOiBvcHRpb25zLm1lbW9pemVIb3N0LFxuICAgIHJlcUJvZHlFbmNvZGluZzogcmVzb2x2ZUJvZHlFbmNvZGluZyhvcHRpb25zLnJlcUJvZHlFbmNvZGluZyksXG4gICAgc2tpcFRvTmV4dEhhbmRsZXJGaWx0ZXI6IG9wdGlvbnMuc2tpcFRvTmV4dEhhbmRsZXJGaWx0ZXIsXG4gICAgaGVhZGVyczogb3B0aW9ucy5oZWFkZXJzLFxuICAgIHByZXNlcnZlUmVxU2Vzc2lvbjogb3B0aW9ucy5wcmVzZXJ2ZVJlcVNlc3Npb24sXG4gICAgaHR0cHM6IG9wdGlvbnMuaHR0cHMsXG4gICAgcG9ydDogb3B0aW9ucy5wb3J0LFxuICAgIHJlcUFzQnVmZmVyOiBvcHRpb25zLnJlcUFzQnVmZmVyLFxuICAgIHRpbWVvdXQ6IG9wdGlvbnMudGltZW91dFxuICB9O1xuXG4gIC8vIGF1dG9tYXRpY2FsbHkgb3B0IGludG8gc3RyZWFtIG1vZGUgaWYgbm8gcmVzcG9uc2UgbW9kaWZpZXJzIGFyZSBzcGVjaWZpZWRcblxuICByZXNvbHZlZC5zdHJlYW0gPSAhcmVzb2x2ZWQuc2tpcFRvTmV4dEhhbmRsZXJGaWx0ZXIgJiZcbiAgICAgICAgICAgICAgICAgICAgIXJlc29sdmVkLnVzZXJSZXNEZWNvcmF0b3IgJiZcbiAgICAgICAgICAgICAgICAgICAgIXJlc29sdmVkLnVzZXJSZXNIZWFkZXJEZWNvcmF0b3I7XG5cbiAgZGVidWcocmVzb2x2ZWQpO1xuICByZXR1cm4gcmVzb2x2ZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVzb2x2ZU9wdGlvbnM7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgcmVzb2x2ZU9wdGlvbnMgPSByZXF1aXJlKCcuLi9saWIvcmVzb2x2ZU9wdGlvbnMnKTtcblxuLy8gVGhlIENvbnRhaW5lciBvYmplY3QgaXMgcGFzc2VkIGRvd24gdGhlIGNoYWluIG9mIFByb21pc2VzLCB3aXRoIGVhY2ggb25lXG4vLyBvZiB0aGVtIG11dGF0aW5nIGFuZCByZXR1cm5pbmcgQ29udGFpbmVyLiAgVGhlIGdvYWwgaXMgdGhhdCAoZXZlbnR1YWxseSlcbi8vIGF1dGhvciB1c2luZyB0aGlzIGxpYnJhcnkgLy8gY291bGQgaG9vayBpbnRvL292ZXJyaWRlIGFueSBvZiB0aGVzZVxuLy8gd29ya2Zsb3cgc3RlcHMgd2l0aCBhIFByb21pc2Ugb3Igc2ltcGxlIGZ1bmN0aW9uLlxuLy8gQ29udGFpbmVyIGZvciBzY29wZWQgYXJndW1lbnRzIGluIGEgcHJvbWlzZSBjaGFpbi4gIEVhY2ggcHJvbWlzZSByZWNpZXZlc1xuLy8gdGhpcyBhcyBpdHMgYXJndW1lbnQsIGFuZCByZXR1cm5zIGl0LlxuLy9cbi8vIERvIG5vdCBleHBvc2UgdGhlIGRldGFpbHMgb2YgdGhpcyB0byBob29rcy91c2VyIGZ1bmN0aW9ucy5cblxuZnVuY3Rpb24gQ29udGFpbmVyKHJlcSwgcmVzLCBuZXh0LCBob3N0LCB1c2VyT3B0aW9ucykge1xuICByZXR1cm4ge1xuICAgIHVzZXI6IHtcbiAgICAgIHJlcTogcmVxLFxuICAgICAgcmVzOiByZXMsXG4gICAgICBuZXh0OiBuZXh0LFxuICAgIH0sXG4gICAgcHJveHk6IHtcbiAgICAgIHJlcTogdW5kZWZpbmVkLFxuICAgICAgcmVzOiB1bmRlZmluZWQsXG4gICAgICByZXNEYXRhOiB1bmRlZmluZWQsIC8vIGZyb20gcHJveHkgcmVzXG4gICAgICBib2R5Q29udGVudDogdW5kZWZpbmVkLCAvLyBmb3IgcHJveHkgcmVxXG4gICAgICByZXFCdWlsZGVyOiB7fSwgIC8vIHJlcU9wdCwgaW50ZW5kZWQgYXMgZmlyc3QgYXJnIHRvIGh0dHAocyk/LnJlcXVlc3RcbiAgICB9LFxuICAgIG9wdGlvbnM6IHJlc29sdmVPcHRpb25zKHVzZXJPcHRpb25zKSxcbiAgICBwYXJhbXM6IHtcbiAgICAgIGhvc3Q6IGhvc3QsXG4gICAgICB1c2VyT3B0aW9uczogdXNlck9wdGlvbnNcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGFpbmVyO1xuIiwiaW1wb3J0IHsgSG9tZUNvbnRhaW5lciBhcyBIb21lLCBsb2FkRGF0YSB9IGZyb20gJy4vY29udGFpbmVycy9Ib21lL2luZGV4LmpzJ1xyXG5pbXBvcnQgTG9naW4gZnJvbSAnLi9jb250YWluZXJzL0xvZ2luL2luZGV4LmpzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgW1xyXG4gIHtcclxuICAgIHBhdGg6ICcvJyxcclxuICAgIGNvbXBvbmVudDogSG9tZSxcclxuICAgIGV4YWN0OiB0cnVlLFxyXG4gICAga2V5OiAnaG9tZScsXHJcbiAgICBsb2FkRGF0YTogbG9hZERhdGFcclxuICB9LCB7XHJcbiAgICBwYXRoOiAnL2xvZ2luJyxcclxuICAgIGNvbXBvbmVudDogTG9naW4sXHJcbiAgICBrZXk6ICdsb2dpbicsXHJcbiAgICBleGFjdDogdHJ1ZVxyXG4gIH1cclxuXVxyXG5cclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xyXG5cclxuY29uc3QgSGVhZGVyID0gKCkgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8TGluayB0bz0nLyc+SG9tZTwvTGluaz5cclxuICAgICAgPGJyLz5cclxuICAgICAgPExpbmsgdG89Jy9sb2dpbic+TG9naW48L0xpbms+XHJcbiAgICA8L2Rpdj5cclxuICApXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhlYWRlcjtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IEhlYWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL0hlYWRlci5qcyc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IGdldEhvbWVMaXN0IH0gZnJvbSAnLi9zdG9yZS9hY3Rpb25zLmpzJ1xyXG5cclxuY29uc3QgSG9tZSA9IChwcm9wcykgPT4ge1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKCFwcm9wcy5saXN0Lmxlbmd0aCkge1xyXG4gICAgICBwcm9wcy5nZXRIb21lTGlzdChmYWxzZSk7XHJcbiAgICB9XHJcbiAgfSwgW10pXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8SGVhZGVyIC8+XHJcbiAgICAgIHtnZXRMaXN0KHByb3BzLmxpc3QpfVxyXG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHthbGVydCgnY2xpY2snKX19PmNsaWNrPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuICApXHJcbn1cclxuXHJcbmNvbnN0IGdldExpc3QgPSAobGlzdCkgPT4ge1xyXG4gIHJldHVybiBsaXN0Lm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBrZXk9e2l0ZW0uSWR9PntpdGVtLnR5cGVOYW1lfTwvZGl2PlxyXG4gICAgKSAgXHJcbiAgfSlcclxufVxyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gc3RhdGUgPT4gKHsvL+WumuS5iXJlZHVjZXLph4zpnaLmlbDmja7nmoTmmKDlsITlhbPns7tcclxuICBuYW1lOiBzdGF0ZS5ob21lLm5hbWUsXHJcbiAgbGlzdDogc3RhdGUuaG9tZS5uZXdzTGlzdFxyXG59KVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gZGlzcGF0Y2ggPT4gKHsvL+WumuS5ieaUueWPmOaIluiAheiOt+WPlnJlZHVjZXLmlbDmja7nmoTmlrnms5VcclxuICBnZXRIb21lTGlzdCgpIHtcclxuICAgIGRpc3BhdGNoKGdldEhvbWVMaXN0KCkpO1xyXG4gIH1cclxufSlcclxuXHJcbmV4cG9ydCBjb25zdCBsb2FkRGF0YSA9IChzdG9yZSkgPT4ge1xyXG4gIHJldHVybiBzdG9yZS5kaXNwYXRjaChnZXRIb21lTGlzdCh0cnVlKSlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IEhvbWVDb250YWluZXIgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShIb21lKTtcclxuLy/pgJrov4djb25uZWN05oqKbWFwU3RhdGVUb1Byb3Bz5ZKMbWFwRGlzcGF0Y2hUb1Byb3Bz6YeM6Z2i55qE5Lic6KW/5Lyg57uZSG9tZee7hOS7tlxyXG4iLCJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgeyBDSEFOR0VfTElTVCB9IGZyb20gJy4vY29uc3RhbnRzLmpzJzsgXHJcblxyXG5jb25zdCBjaGFuZ2VMaXN0ID0gKGxpc3QpID0+ICh7XHJcbiAgdHlwZTogQ0hBTkdFX0xJU1QsXHJcbiAgbGlzdFxyXG59KVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldEhvbWVMaXN0ID0gKHNlcnZlcikgPT4ge1xyXG4gIC8vaHR0cDovLzEwMS4yMDEuMjQ5LjIzOTo3MDAxL2RlZmF1bHQvZ2V0VHlwZUluZm9cclxuICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICBpZiAoc2VydmVyKSB7XHJcbiAgICAgIHJldHVybiBheGlvcy5nZXQoJ2h0dHA6Ly8xMDEuMjAxLjI0OS4yMzk6NzAwMS9kZWZhdWx0L2dldFR5cGVJbmZvJylcclxuICAgICAgLnRoZW4oKHJlcykgPT4ge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2cocmVzKVxyXG4gICAgICAgIGNvbnN0IGxpc3QgPSByZXMuZGF0YS5kYXRhO1xyXG4gICAgICAgIGRpc3BhdGNoKGNoYW5nZUxpc3QobGlzdCkpO1xyXG4gICAgICB9KS5jYXRjaCgoZSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2UgaWYgKCFzZXJ2ZXIpIHtcclxuICAgICAgcmV0dXJuIGF4aW9zLmdldCgnL2RlZmF1bHQvZ2V0VHlwZUluZm8nKVxyXG4gICAgICAudGhlbigocmVzKSA9PiB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhyZXMpXHJcbiAgICAgICAgY29uc3QgbGlzdCA9IHJlcy5kYXRhLmRhdGE7XHJcbiAgICAgICAgZGlzcGF0Y2goY2hhbmdlTGlzdChsaXN0KSk7XHJcbiAgICAgIH0pLmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIFxyXG4gIH1cclxufSIsImV4cG9ydCBjb25zdCBDSEFOR0VfTElTVCA9ICdIT01FL0NIQU5HRV9MSVNUJyIsImltcG9ydCB7IENIQU5HRV9MSVNUIH0gZnJvbSAnLi9jb25zdGFudHMuanMnOyBcclxuXHJcbmNvbnN0IGRlZmF1bHRTdGF0ZSA9IHtcclxuICBuYW1lOiAnZGVsbCcsXHJcbiAgbmV3c0xpc3Q6IFtdXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSA9IGRlZmF1bHRTdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgc3dpdGNoKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIENIQU5HRV9MSVNUOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIG5ld3NMaXN0OiBhY3Rpb24ubGlzdC8v5ZCO6Z2i6L+Z5LiqbmV3c0xpc3TkvJrlj5bku6PliY3pnaLnmoTlkIzlkI3lsZ7mgKdcclxuICAgICAgfVxyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufSIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9IZWFkZXIuanMnO1xyXG5cclxuY29uc3QgTG9naW4gPSAoKSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxIZWFkZXIgLz5cclxuICAgICAgPGRpdj5sb2dpbjwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpbjtcclxuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCBwcm94eSBmcm9tICdleHByZXNzLWh0dHAtcHJveHknO1xyXG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgZ2V0U3RvcmUgfSBmcm9tICcuLi9zdG9yZS9pbmRleC5qcyc7XHJcbmltcG9ydCB7IG1hdGNoUm91dGVzIH0gZnJvbSAncmVhY3Qtcm91dGVyLWNvbmZpZyc7XHJcbmltcG9ydCBSb3V0ZXMgZnJvbSAnLi4vUm91dGVzJ1xyXG5cclxuY29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG5hcHAudXNlKGV4cHJlc3Muc3RhdGljKCdwdWJsaWMnKSk7XHJcblxyXG5hcHAudXNlKCcvZGVmYXVsdCcscHJveHkoJ2h0dHA6Ly8xMDEuMjAxLjI0OS4yMzk6NzAwMScsIHtcclxuICBwcm94eVJlcVBhdGhSZXNvbHZlcjogZnVuY3Rpb24gKHJlcSkge1xyXG4gICAgcmV0dXJuICcvZGVmYXVsdCcgKyByZXEudXJsIFxyXG4gIH1cclxufSkpO1xyXG5cclxuXHJcbmFwcC5nZXQoJyonLCBmdW5jdGlvbiAocmVxLCByZXMpIHtcclxuICBjb25zdCBzdG9yZSA9IGdldFN0b3JlKCk7XHJcbiAgY29uc3QgbWF0Y2hlZFJvdXRlcyA9IG1hdGNoUm91dGVzKFJvdXRlcywgcmVxLnBhdGgpO1xyXG4gIGNvbnN0IHByb21pc2VzID0gW107XHJcbiAgbWF0Y2hlZFJvdXRlcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgaWYoaXRlbS5yb3V0ZS5sb2FkRGF0YSkge1xyXG4gICAgICBwcm9taXNlcy5wdXNoKGl0ZW0ucm91dGUubG9hZERhdGEoc3RvcmUpKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xyXG4gICAgcmVzLnNlbmQocmVuZGVyKHN0b3JlLCBSb3V0ZXMsIHJlcSkpO1xyXG4gIH0pLmNhdGNoKChlKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9KVxyXG4gIFxyXG59KVxyXG52YXIgc2VydmVyID0gYXBwLmxpc3RlbigzMDAwLCBmdW5jdGlvbigpIHtcclxuICB2YXIgaG9zdCA9IHNlcnZlci5hZGRyZXNzKCkuYWRkcmVzcztcclxuICB2YXIgcG9ydCA9IHNlcnZlci5hZGRyZXNzKCkucG9ydDtcclxuXHJcbiAgY29uc29sZS5sb2coYEV4YW1wbGUgYXBwIGxpc3RlbmluZyBhdCBodHRwOi8vJHtob3N0fToke3BvcnR9YClcclxufSk7XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHJlbmRlclRvU3RyaW5nIH0gZnJvbSAncmVhY3QtZG9tL3NlcnZlcic7XHJcbmltcG9ydCB7IFN0YXRpY1JvdXRlciwgUm91dGUgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJzsgXHJcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXIgPSAoc3RvcmUsIFJvdXRlcywgcmVxKSA9PiB7XHJcblxyXG4gIGNvbnN0IGNvbnRlbnQgPSByZW5kZXJUb1N0cmluZygoXHJcbiAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XHJcbiAgICA8U3RhdGljUm91dGVyIGxvY2F0aW9uPXtyZXEucGF0aH0gY29udGV4dD17e319PlxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgIHtSb3V0ZXMubWFwKChyb3V0ZSkgPT4gKFxyXG4gICAgICAgICAgPFJvdXRlIHsuLi5yb3V0ZX0+PC9Sb3V0ZT5cclxuICAgICAgICApKX1cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L1N0YXRpY1JvdXRlcj5cclxuICA8L1Byb3ZpZGVyPlxyXG4pKTtcclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgYFxyXG4gIDxodG1sPlxyXG4gICAgPGhlYWQ+XHJcbiAgICAgIDx0aXRsZT5oZWxsbzwvdGl0bGU+XHJcbiAgICA8L2hlYWQ+XHJcbiAgICA8Ym9keT5cclxuICAgICAgPGRpdiBpZD0ncm9vdCc+JHtjb250ZW50fTwvZGl2PlxyXG4gICAgICA8c2NyaXB0PlxyXG4gICAgICAgIHdpbmRvdy5jb250ZXh0ID0ge1xyXG4gICAgICAgICAgc3RhdGU6ICR7SlNPTi5zdHJpbmdpZnkoc3RvcmUuZ2V0U3RhdGUoKSl9XHJcbiAgICAgICAgfVxyXG4gICAgICA8L3NjcmlwdD5cclxuICAgICAgPHNjcmlwdCBzcmM9Jy9pbmRleC5qcyc+PC9zY3JpcHQ+XHJcbiAgICA8L2JvZHk+XHJcbiAgPC9odG1sPmBcclxuICApXHJcbn0iLCJpbXBvcnQgeyBjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlLCBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCc7XHJcbmltcG9ydCB0aHVuayBmcm9tICdyZWR1eC10aHVuayc7XHJcbmltcG9ydCBob21lUmVkdWNlciBmcm9tICcuLi9jb250YWluZXJzL0hvbWUvc3RvcmUvcmVkdWNlci5qcydcclxuXHJcbmNvbnN0IHJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gIGhvbWU6IGhvbWVSZWR1Y2VyXHJcbn0pXHJcblxyXG5leHBvcnQgY29uc3QgZ2V0U3RvcmUgPSAoKSA9PiB7XHJcbiAgcmV0dXJuIGNyZWF0ZVN0b3JlKHJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZSh0aHVuaykpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0Q2xpZW50U3RvcmUgPSAoKSA9PiB7XHJcbiAgY29uc3QgZGVmYXVsdFN0YXRlID0gd2luZG93LmNvbnRleHQuc3RhdGU7XHJcbiAgcmV0dXJuIGNyZWF0ZVN0b3JlKHJlZHVjZXIsIGRlZmF1bHRTdGF0ZSwgYXBwbHlNaWRkbGV3YXJlKHRodW5rKSk7XHJcbn1cclxuXHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFzc2VydFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJheGlvc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkZWJ1Z1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmF3LWJvZHlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3RcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3QtZG9tL3NlcnZlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdC1yZWR1eFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXItY29uZmlnXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0LXJvdXRlci1kb21cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVkdXhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVkdXgtdGh1bmtcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXJsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInpsaWJcIik7Il0sInNvdXJjZVJvb3QiOiIifQ==