/*!
 * @dgteam/dgx-pinia v0.1.1
 * @author 2681137811 <donguayx@qq.com> 
 * @license MIT
 */
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, '__esModule', {
  value: true
});
/**
 * 判断样本是否继承了某个类，效果类似 es6 的 instanceof 语法
 * @param {Any} sample - 样本
 * @param {Function} parent - 父类
 * @returns {Boolean}
 */

function instanceOf(sample, parent) {
  if (sample === undefined || sample === null || typeof parent !== 'function') return false;
  var O = parent.prototype;
  sample = sample.__proto__;

  while (O) {
    if (sample === null) return false;
    if (O === sample) return true;
    sample = sample.__proto__;
  }
}

function originJSON(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function isArray(sample) {
  if (Array.isArray) return Array.isArray(sample);
  return objectToString(sample) === '[object Array]';
}

function randomString() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
  var result = '';
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

  for (var i = 0; i <= 16; i++) {
    var _index = Math.random() * length | 0;

    result += chars[_index];
  }

  return result;
}

function consoleWarn() {
  var _console;

  for (var _len = arguments.length, str = new Array(_len), _key = 0; _key < _len; _key++) {
    str[_key] = arguments[_key];
  }

  (_console = console).warn.apply(_console, ["[dgx-pinia]"].concat(str));
}

function _toJSON(obj) {
  // Object.keys(): 返回对象所有可枚举属性名
  // Object.getOwnPropertyNames(): 返回对象所有自身属性名（包含不可枚举，但不包含 Symbol 值的属性名）
  return Object.keys(obj).reduce(function (a, b) {
    a[b] = obj[b];
    return a;
  }, {}); // return Object.assign({}, this)
}
/**
 * FETCH 请求
 * @param {String} config.method - 请求方式: GET POST PUT DELETE
 * @param {Object} config.params - 请求参数，会自动拼接到 url 中
 * @param {Object} config.paths - 路由参数，会自动替换到 url 中（若 paths 无法找到必要参数，框架自动从 params 中寻找）
 * @param {Object} config.data - 请求体
 * @param {Object} config.header - 请求头
 * @param {Boolean | String} config.only - 时执行相同唯一键的请求，前一个请求会被作废; 传 true 由框架自动生成唯一键，也可以手动传入字符串
 * @returns Promise
 */


var FETCH = function FETCH(client) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (typeof config === 'string') config = {
    url: config
  };
  var _config = config,
      _config$method = _config.method,
      method = _config$method === void 0 ? 'GET' : _config$method,
      silent = _config.silent,
      only = _config.only; // 尝试获取表对象实例

  var table = config.table && this[config.table] && instanceOf(this[config.table], DgxTable) ? this[config.table] : null;

  var updateTableFetchsState = function updateTableFetchsState() {
    if (table) {
      client.composition.set(table, 'loading', !!table.fetchs.find(function (item) {
        return item.method === 'GET';
      }));
      client.composition.set(table, 'editing', !!table.fetchs.find(function (item) {
        return ~['POST', 'PUT', 'DELETE'].indexOf(item.method);
      }));
    }
  };

  var updateTableFetchs = function updateTableFetchs(matchFun) {
    if (table && table.fetchs) {
      table.fetchs.forEach(function (fetch, index) {
        if (matchFun(fetch, index)) {
          try {
            fetch.cancel({
              table: table,
              only: only
            });
          } catch (e) {
            consoleWarn('need cancelHandler.');
          }

          table.fetchs.splice(index, 1);
          updateTableFetchsState();
        }
      });
    }
  };
  /**
   * 请求体格式转换器
   */


  var requestConfigAdapter = function requestConfigAdapter(config) {
    switch (client.httpClientType) {
      case 'axios':
        {
          return config;
        }

      case 'uniapp':
        {
          var result = originJSON(config); // headers > header

          if (result.headers && _typeof(result.headers) === 'object') {
            result.header = originJSON(result.headers);
            delete result.headers;
          } // 拼接 params 查询参数


          if (result.params && _typeof(result.params) === 'object') {
            if (result.url.indexOf('?') === -1) result.url += '?';

            for (var key in result.params) {
              if (result.params[key] !== undefined) {
                if (typeof result.params[key] === 'string' || typeof result.params[key] === 'number') {
                  result.url += "".concat(key, "=").concat(result.params[key], "&");
                } else {
                  result.url += "".concat(key, "=").concat(JSON.stringify(result.params[key]), "&");
                }
              }
            }
          }

          return result;
        }

      default:
        {
          return config;
        }
    }
  };

  if (only) updateTableFetchs(function (fetch) {
    return fetch.only === only;
  }); // 检测是否重复，如果重复则取消之前相同的方法

  if (!config.headers) config.headers = {}; // 整合请求头

  var paths = []; // 自动填充路由参数，例如 /user/:id 等，默认从 paths 中获取，若获取不到则尝试从 params 中获取

  var _iterator = _createForOfIteratorHelper(config.url.split('/')),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var route = _step.value;

      if (route[0] === ':' && route.length > 1) {
        var key = route.substr(1);

        if (config.paths && config.paths[key] !== undefined && typeof config.paths[key].toString === 'function') {
          paths.push(config.paths[key].toString());
        } else if (config.params && config.params[key] !== undefined && typeof config.params[key].toString === 'function') {
          paths.push(config.params[key].toString());
        } else {
          paths.push('');
        }
      } else {
        paths.push(route);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  config.url = paths.join('/');
  return new Promise(function (resolve) {
    // 内部请求 id
    var id = randomString(16);
    var callback = {
      // 成功回调
      success: function success(res) {
        // 兼容原生 uni.request
        if (client.httpClientType === 'uniapp' && isArray(res) && res.length === 2) {
          var _res$ = res[1],
              data = _res$.data,
              headers = _res$.header,
              status = _res$.statusCode;
          res = {
            config: config,
            status: status,
            headers: headers,
            data: data
          };
        }

        updateTableFetchs(function (fetch) {
          return fetch.id === id;
        }); // 移除请求从队列，并更新请求状态

        if (table) {
          table.init = true; // TODO 此处判定需要更加精准，要求判断必须是原生 table.get() 方法

          table.error = false;
        }

        if (typeof config.responseType === 'string' && config.responseType.toLowerCase() === "arraybuffer") {
          resolve({
            data: res.data,
            config: Object.assign({}, config, res.config)
          });
        } else {
          resolve(_objectSpread(_objectSpread({}, res.data), {}, {
            config: Object.assign({}, config, res.config)
          }));
        }
      },
      // 失败回调
      error: function error(res) {
        updateTableFetchs(function (fetch) {
          return fetch.id === id;
        }); // 移除请求从队列，并更新请求状态

        if (table) {
          table.error = true; // TODO 此处判定需要更加精准，要求判断必须是原生 table.get() 方法
        }

        resolve(_objectSpread(_objectSpread({}, res.data), {}, {
          config: Object.assign({}, config, res.config)
        }));
      }
    };

    if (client.httpClient) {
      if (table && table.fetchs) {
        table.fetchs.push({
          id: id,
          table: table,
          only: only,
          method: method,
          silent: silent
        });
        updateTableFetchsState();
      }

      var getCancel = function getCancel(requestId, cancel) {
        if (table) {
          var instance = table.fetchs.find(function (fetch) {
            return fetch.id === id;
          });

          if (instance) {
            client.composition.set(instance, 'requestId', requestId);
            client.composition.set(instance, 'cancel', cancel); // 取消事件注册，需要获取 cancel 方法，以便之后取消时候执行
          }
        }
      };

      var requestConfig = requestConfigAdapter(config);
      return client.httpClient(_objectSpread({
        getCancel: getCancel
      }, requestConfig)).then(callback.success, callback.error);
    } else {
      consoleWarn('need httpClient');
    }
  });
};

var RESTFUL = function RESTFUL(client, table, config) {
  var _this = this;

  if (_typeof(table) === 'object' && table.name) {
    table = this[table.name];
  }

  if (typeof table === 'string') {
    table = this[table];
  }

  var _Object$assign = Object.assign({
    action: 'GET'
  }, config),
      action = _Object$assign.action;

  if (config.primaryKey) config.primaryKey = client.primaryKey;
  var methods = {
    'GET': 'GET',
    'MORE': 'GET',
    'POST': 'POST',
    'PUT': 'PUT',
    'PATCH': 'PATCH',
    'DELETE': 'DELETE'
  };
  var method = methods[action];

  if (table && method) {
    /**
     * @name 获取配置项目
     * @param {string} key [only, interact, debounce, throttle, silent, loading]
     * @param {string} method [GET, POST, PUT, DELETE]
     */
    var opt = table.options;

    var getRESTfulConfig = function getRESTfulConfig(key) {
      var result = false;

      if (typeof key === 'string') {
        if (config[key] !== undefined) {
          // #1 - 优先从 action 的 fetchData 中获取
          result = config[key];
        } else if (opt[method] && opt[method][key] !== undefined) {
          // #2 否则从 Table 的 options[method] 中获取
          result = opt[method][key];
        } else if (opt[key] !== undefined) {
          // #3 否则从 Table 的 options 中获取
          result = opt[key];
        } else if (_typeof(client.defaultConfig) === 'object') {
          // #4 最终尝试在 client 的静态属性 defaultConfig[method] 中获取
          if (_typeof(client.defaultConfig[method]) === 'object' && client.defaultConfig[method][key] !== undefined) {
            result = client.defaultConfig[method][key];
          }
        }

        if (result === true && key === 'only') {
          result = method; // only 特性，如果未传 onlyKey 则自动指定 method 字段为 onlyKey
        }
      }

      if (typeof result === 'function') {
        result = result({
          client: client,
          table: table,
          options: opt,
          config: config
        }); // 新增（未来考虑支持 await 方式）
      }

      return result;
    }; // 封装 fetch 数据


    var fetchData = _objectSpread(_objectSpread({}, config), {}, {
      options: opt,
      method: method,
      table: config.table,
      url: "".concat(opt.url).concat(config.id ? '/' + config.id : ''),
      data: config.data || {},
      // 请求体
      params: config.params || {},
      // url 参数
      paths: config.paths || {},
      // url path 参数
      headers: config.headers || {},
      // 请求头
      limit: getRESTfulConfig('limit') || {},
      // 请求限制
      only: getRESTfulConfig('only'),
      // 是否是禁止重复请求
      silent: getRESTfulConfig('silent'),
      // 是否静默加载
      loading: getRESTfulConfig('loading') // 是否显示加载中动画 （移动端）

    }); // 设置查询限制


    if (_typeof(fetchData.limit) === 'object') {
      for (var key in fetchData.limit) {
        for (var _i = 0, _arr = ['params', 'paths', 'data']; _i < _arr.length; _i++) {
          var name = _arr[_i];

          if (method === 'GET' && name === 'params' || method !== 'GET' && name === 'data' || name === 'paths') {
            fetchData[name][key] = fetchData.limit[key];
          }
        }
      }
    } // 加载更多时，自动区分 marker 模式与 page 模式


    if (action === 'MORE') {
      if (table.marker !== undefined) {
        fetchData.params.marker = table.marker;
      } else {
        fetchData.params.page = table.page + 1;
      }
    } // 封装 vuex 方法方便之后的 table 操作调用


    var tableCtrl = {
      update: function update(key, value) {
        return TABLE_UPDATE.call(_this, client, table, key, value);
      },
      // 更新 table 的属性
      rows: {
        add: function add(item, position) {
          return TABLE_ROWS_JOIN.call(_this, client, table, item, position);
        },
        // 新增 row 到 table.list: TABLE_ROWS_JOIN
        update: function update(item) {
          return TABLE_ROW_EXTEND.call(_this, client, table, item, config);
        },
        // 更新 row 到 table.list
        merge: function merge(list) {
          return TABLE_ROWS_MERGE.call(_this, client, table, list);
        },
        // TODO 需要支持合并方向，目前暂时只能向下合并
        remove: function remove(id) {
          // 移除 row 到 table.list: TABLE_ROW_REMOVE
          if (id && _typeof(id) === 'object') {
            try {
              id = id[config.primaryKey]; // 兼容对象写法
            } catch (e) {}
          }

          return TABLE_ROW_REMOVE.call(this, client, table, id, config);
        }
      }
    }; // 数据联动

    var interactHandles = {
      GET: function GET(res) {
        var interact = getRESTfulConfig('interact');

        if (config.id) {
          if (interact) {
            // TODO 此方式无法触发 model.active 字段
            tableCtrl.update('item', res.result);
          }
        } else if (isArray(res.result)) {
          if (interact) {
            if (action === 'MORE') {
              tableCtrl.rows.merge(res.result);
            } else {
              tableCtrl.update('list', res.result);
            }
          }

          var page = res.page || config.params && config.params.page || 1;
          var marker = res.marker !== undefined ? res.marker : undefined;
          var count = res.count != undefined && res.count >= 0 ? Number(res.count) : undefined;
          var total = res.total; // TODO 如果 total 不传但是有 count & size 值，那么应该手动计算 total 值

          var empty = !!(res.page == 1 && !res.result.length);
          var more = res.page < res.total;
          var filter = config.params ? originJSON(config.params) : {};
          tableCtrl.update({
            page: page,
            marker: marker,
            count: count,
            total: total,
            empty: empty,
            more: more,
            filter: filter
          });
        } else if (interact) {
          tableCtrl.update('list', res.result || res);
        }
      },
      POST: function POST(res) {
        var interact = getRESTfulConfig('interact');

        if (interact && res.result && res.result[config.primaryKey]) {
          var position = 'end'; // 判定增加数据的位置

          if (_typeof(interact) === 'object' && interact.position) {
            position = interact.position;
          } else if (typeof interact === 'number' || ~['start', 'begin', 'head', 'end', 'finish', 'foot', 'last'].indexOf(interact)) {
            position = interact;
          }

          tableCtrl.rows.add(res.result, position);

          if (table.count != undefined && table.count >= 0) {
            tableCtrl.update('count', table.count + 1); // commit('TABLE_UPDATE', [model, 'count', state[model].count + 1])
          }

          if (table.empty) {
            tableCtrl.update('empty', false); // 判断是否已经脱离 “空列表” 状态 commit('TABLE_UPDATE', [model, 'empty', false])
          }
        }
      },
      PUT: function PUT(res) {
        var interact = getRESTfulConfig('interact');

        if (interact && res.result && res.result[config.primaryKey]) {
          tableCtrl.rows.update(res.result);
        }
      },
      DELETE: function DELETE() {
        var interact = getRESTfulConfig('interact');

        if (interact) {
          tableCtrl.rows.remove(config.id);

          if (table.item && table.item[config.primaryKey] === config.id) {
            tableCtrl.update({
              active: null,
              item: null
            });
          } // 影响统计数


          if (table.count != undefined && table.count > 0) {
            tableCtrl.update({
              count: table.count - 1
            });
          }

          if (table.page === 1 && table.list.length === 0) {
            tableCtrl.update({
              empty: true,
              more: false
            }); // 判断是否需要触发 “空列表” 状态
          }
        }
      }
    };
    interactHandles.PATCH = interactHandles.PUT; // patch 语法糖
    // fetch 主函数
    // const store = {[config.table]: table}

    return FETCH.call(this, client, fetchData).then(function (res) {
      if (res && res.result) {
        interactHandles[method](res); // 事件联动
      }

      return res;
    });
  }

  return Promise.resolve({
    err: 1
  });
}; // 更新表字段


var TABLE_UPDATE = function TABLE_UPDATE(client, table, key, value) {
  if (typeof key === 'string') {
    client.composition.set(table, key, value);
  } else if (_typeof(key) === 'object' && key !== null) {
    for (var k in key) {
      client.composition.set(table, k, key[k]);
    }
  }
}; // 新增行数据


var TABLE_ROWS_JOIN = function TABLE_ROWS_JOIN(client, table, item, position) {
  if (typeof position === 'string') {
    if (~['start', 'begin', 'head'].indexOf(position)) {
      position = 0;
    } else if (~['end', 'foot', 'last'].indexOf(position)) {
      position = -1;
    } else {
      position = parseInt(position);
    }
  }

  if (position === 0) {
    table.list.unshift(item);
  } else if (position === -1) {
    table.list.push(item);
  } else if (Number.isInteger(position)) {
    table.list.splice(position, 0, item);
  }
}; // 更新行数据


var TABLE_ROW_EXTEND = function TABLE_ROW_EXTEND(client, table, item) {
  var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    if (!opt.primaryKey) opt.primaryKey = client.primaryKey;

    if (item[opt.primaryKey]) {
      var _iterator2 = _createForOfIteratorHelper(table.list),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _row = _step2.value;

          if (_row[opt.primaryKey] && _row[opt.primaryKey] === item[opt.primaryKey]) {
            Object.assign(_row, item);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      if (table.item) {
        var row = table.item;

        if (row[opt.primaryKey] && row[opt.primaryKey] === item[opt.primaryKey]) {
          Object.assign(row, item);
        }
      }
    }
  } catch (error) {}
}; // 合并行数据


var TABLE_ROWS_MERGE = function TABLE_ROWS_MERGE(client, table, list) {
  var _table$list;

  (_table$list = table.list).push.apply(_table$list, _toConsumableArray(list));
}; // 移除行数据


var TABLE_ROW_REMOVE = function TABLE_ROW_REMOVE(client, table, id) {
  var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  if (!opt.primaryKey) opt.primaryKey = client.primaryKey;
  if (id && _typeof(id) === 'object') id = id[opt.primaryKey];
  var index = id ? table.list.findIndex(function (item) {
    return item[opt.primaryKey] === id;
  }) : undefined;
  if (index >= 0) table.list.splice(index, 1);
}; // 指定焦点


var TABLE_CHECK = function TABLE_CHECK(client, table, active) {
  var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (isArray(active) && active[0]) {
    active = active[0];
  }

  if (active === undefined || active === null) {
    // 重置
    TABLE_CHECK_RESET(client, table);
  } else if (_typeof(active) === "object") {
    // 以 对象条件 来确定焦点
    var item = active;
    var list = table.list;
    if (!opt.primaryKey) opt.primaryKey = client.primaryKey;

    for (var i = 0; i < list.length; i++) {
      if (item[opt.primaryKey] && list[i][opt.primaryKey] && list[i][opt.primaryKey] === item[opt.primaryKey]) {
        var _TABLE_CHECK_CHANGE;

        return TABLE_CHECK_CHANGE(client, table, (_TABLE_CHECK_CHANGE = {}, _defineProperty(_TABLE_CHECK_CHANGE, opt.primaryKey, list[i][opt.primaryKey] || undefined), _defineProperty(_TABLE_CHECK_CHANGE, "active", i), _defineProperty(_TABLE_CHECK_CHANGE, "item", list[i]), _TABLE_CHECK_CHANGE));
      }
    }
  } else {
    // 以索引来确定焦点，（ -1 = 选择数组的最后一个）
    if (active == -1) {
      active = table.list.length > 0 ? table.list.length - 1 : 0;
    } // 如果焦点不存在则默认使用原焦点，如果原焦点不存在则默认使用 0


    var queue = [active, table.active, 0];

    for (var _i2 = 0; _i2 < queue.length; _i2++) {
      if (table.list[queue[_i2]]) {
        active = queue[_i2];
        break;
      }
    } // 如果列表存在键值


    if (table.list && table.list[active]) {
      var _TABLE_CHECK_CHANGE2;

      if (!opt.primaryKey) opt.primaryKey = client.primaryKey;
      return TABLE_CHECK_CHANGE(client, table, (_TABLE_CHECK_CHANGE2 = {}, _defineProperty(_TABLE_CHECK_CHANGE2, opt.primaryKey, table.list[active][opt.primaryKey]), _defineProperty(_TABLE_CHECK_CHANGE2, "active", active), _defineProperty(_TABLE_CHECK_CHANGE2, "item", table.list[active]), _TABLE_CHECK_CHANGE2));
    }

    TABLE_CHECK_RESET();
  }
}; // 【内部】切换焦点


var TABLE_CHECK_CHANGE = function TABLE_CHECK_CHANGE(client, table, config) {
  for (var _i3 = 0, _arr2 = ['active', 'item']; _i3 < _arr2.length; _i3++) {
    var key = _arr2[_i3];

    if (config[key] || config[key] == 0) {
      TABLE_UPDATE(client, table, key, config[key]);
    }
  }

  return config.item;
}; // 【内部】重置焦点


var TABLE_CHECK_RESET = function TABLE_CHECK_RESET(client, table) {
  for (var _i4 = 0, _arr3 = ['active', 'item']; _i4 < _arr3.length; _i4++) {
    var key = _arr3[_i4];
    TABLE_UPDATE(client, table, key, undefined);
  }
};
/**
 * @param {Object} app - vue 实例
 * @param {Boolean} [enable = true] - 是否启用
 */


var DgxClient = /*#__PURE__*/function () {
  function DgxClient(config) {
    _classCallCheck(this, DgxClient);

    // 合并配置项
    var opt = Object.assign({
      primaryKey: 'id',
      defaultConfig: {
        GET: {
          interact: true
        },
        POST: {
          interact: false
        },
        PUT: {
          interact: true
        },
        PATCH: {
          interact: true
        },
        DELETE: {
          interact: true
        }
      },
      httpClient: null,
      httpClientType: 'axios',
      // 'uniapp' 'axios'
      enable: true
    }, config); // 获取组合式 api

    var _ref = config && config.composition || {},
        set = _ref.set,
        ref = _ref.ref,
        reactive = _ref.reactive,
        isRef = _ref.isRef,
        isProxy = _ref.isProxy;

    this.composition = {
      set: set,
      ref: ref,
      reactive: reactive,
      isRef: isRef,
      isProxy: isProxy
    };

    if (!this.composition.set || typeof this.composition.set !== 'function') {
      // vue3 不需要传 set 方法
      this.composition.set = function (obj, key, value) {
        if (isRef(obj.key)) {
          obj.key.value = value;
        } else {
          obj[key] = value;
        }
      };
    }

    this.id = randomString(24);
    this.isDev = process.env.NODE_ENV === 'development';
    this.version = '0.1.1';
    this.primaryKey = opt.primaryKey;
    this.defaultConfig = opt.defaultConfig;
    this.httpClient = opt.httpClient;
    this.httpClientType = opt.httpClientType;
    this.stores = {};
    this.enable = opt.enable;
  }

  _createClass(DgxClient, [{
    key: "createPiniaPlugin",
    value: function createPiniaPlugin() {
      if (!this.enable) return new Function(); // 未开启

      var isDev = this.isDev;
      /**
       * @param {Object} context.pinia - 使用 `createPinia()` 创建的 pinia
       * @param {Object} context.app - 使用 `createApp()` 创建的当前应用程序（仅限 Vue 3）
       * @param {Object} context.store - 插件正在扩充的 store
       * @param {Object} context.options - 定义存储的选项对象传递给`defineStore()`
       */

      var client = this;
      var _this$composition = this.composition,
          set = _this$composition.set,
          reactive = _this$composition.reactive;
      return function piniaPlugin(_ref2) {
        var pinia = _ref2.pinia,
            app = _ref2.app,
            store = _ref2.store,
            options = _ref2.options;

        // 仅携带 options.tables 参数才会进行拓展，避免污染其他数据
        if (options.tables) {
          var $id = store.$id;
          var opts = options.options || {}; // 预留功能：

          client.stores[$id] = {
            tables: {},
            options: opts
          };
          Object.keys(options.tables).forEach(function (name) {
            var table = new DgxTable(name, options.tables[name], opts, client, store);

            if (isDev) {
              set(store.$state, name, table);

              if (store._customProperties !== undefined) {
                store._customProperties.add(name); // in dev mode only (debug it in devtools)

              }
            }

            set(store, name, table);
            client.stores[$id].tables[name] = table; // 预留功能
          }); // 设置默认网络请求器

          set(store, 'FETCH', function (config) {
            return FETCH.call(this, client, config);
          });
        }
      };
    }
  }]);

  return DgxClient;
}(); // export class DgxList extends Array {
//     constructor(list) {
//         super()
//         if (helper.isArray(list) && list.length) {
//             this.push(...list)
//         }
//     }
// }
// const CLIENT = Symbol('client')


var DgxTable = /*#__PURE__*/function () {
  function DgxTable(name, config, opts, client, store) {
    var _this3 = this;

    _classCallCheck(this, DgxTable);

    if (typeof config === 'string') {
      config = {
        url: config
      };
    }

    var opt = Object.assign({
      name: ''
    }, opts.define, {
      name: name
    }, config);
    this.name = opt.name; //model // 模型名称

    this.init = false; // 是否初始化（至少 GET 过一次）

    this.error = false; // 最后一 GET 是否错误

    this.loading = false; // 当请求队列中 GET 数量大于 0 时返回真

    this.editing = false; // 当请求队列中 POST PUT DELETE 数量大于 0 时返回真

    this.fetchs = []; // 请求队列

    this.page = 1; // 当前请求的页码

    this.total = undefined;
    this.count = undefined;
    this.empty = false;
    this.filter = {}; // 过滤器缓存

    this.list = []; // 数据表

    this.marker = undefined; // 下一页地址

    this.next = undefined; // 下一页标记

    this.active = undefined; // 焦点在数据的索引

    this.item = undefined; // 焦点对象

    this.syncAt = undefined;
    var table = this;
    Object.defineProperty(this, '_id', {
      value: randomString(24)
    }); // 生成随机字符串作为主键
    // 对象映射

    Object.defineProperty(this, 'client', {
      get: function get() {
        return client;
      }
    });
    Object.defineProperty(this, 'options', {
      get: function get() {
        return opt;
      }
    }); // ========== 加载（读取）数据 ==========

    /**
     * @param {Number} page - 列表页码，默认: 1
     * @param {Object} filter - 过滤器（筛选参数）
     * @param {Object} opt - 参数集，会传递到 FETCH 方法中，可见相关参数说明
     * @param {Boolean} opt.clean - 请求前是否先清空模型 list 数据
     * @param {Any} opt[key] - 其他参数会保留并传递给其他中间件
     * @returns {Promise}
     */

    var getFun = function getFun(page, filter) {
      var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (_typeof(page) === 'object') {
        filter = page;
        opt = filter;
        page = 1;
      }

      var params = originJSON(filter || {});
      params.page = page ? page : 1;
      if (opt.clean) table.reset();
      return RESTFUL.call(this, client, table, _objectSpread(_objectSpread({}, opt), {}, {
        action: 'GET',
        table: table.name,
        params: params
      }));
    };

    Object.defineProperty(this, 'get', {
      value: getFun.bind(store)
    });
    /**
     * 初始化数据
     * @overview 初始化列表，此方法初始化过一次后便不会重复拉取请求，一般用于拉取固定数据
     * @param {Object} filter - 筛选参数，默认没有 page 参数，若有 page 的需求可以在此对象中传递
     * @param {Object} opt - 参数集，会传递到 Fetch 方法中
     * @param {Number} opt.cache - 缓存时间，秒为单位，超时后会强制重新来去
     * @param {boolean} opt.strict - 严格的，将会比对 filter 条件，如果不同将会触发重新来去
     * @param {boolean} opt.immediate - 立即执行，强制重新拉取
     * @param {boolean} opt.clean - 触发请求前清空源列表（若判断读取缓存，该参数无效）
     * @returns {Promise}
     */

    var getInitFun = function getInitFun(filter) {
      var _this2 = this;

      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var cache = opt.cache,
          strict = opt.strict,
          immediate = opt.immediate,
          clean = opt.clean;
      var needFetch = !table.init || Boolean(immediate);
      if (_typeof(filter) !== 'object') filter = {};

      var fetchHandle = function fetchHandle() {
        if (clean) table.reset();
        var params = originJSON(filter || {});
        return RESTFUL.call(_this2, client, table, _objectSpread(_objectSpread({}, opt), {}, {
          action: 'GET',
          table: table.name,
          params: params
        })).then(function (res) {
          if (!res.err) {
            client.composition.set(table, 'syncAt', new Date());
            return _objectSpread(_objectSpread({}, res), {}, {
              filter: filter,
              fetch: true
            });
          }

          return _objectSpread(_objectSpread({}, res), {}, {
            result: [],
            filter: filter,
            fetch: true
          });
        });
      };

      if (table.list.length === 0) {
        needFetch = true; // 如果列表为空表示则缓存无效
      } else if (typeof cache === 'number' && table.syncAt && !needFetch) {
        // 判断是否缓存超时需要重新拉取
        var update = new Date(table.syncAt).getTime();
        var expire = update + cache * 1000;
        needFetch = Date.now() > expire; // 如果 当前时间 > 到期时间 需要重新加载
      } else if (strict) {
        // 如果是严格的，需要坚持筛选条件
        try {
          needFetch = JSON.stringify(table.filter) !== JSON.stringify(filter);
        } catch (err) {
          consoleWarn('getInit: filter is invalid.');
        }
      }

      return needFetch ? fetchHandle() : Promise.resolve({
        err: 0,
        msg: 'cache data',
        result: table.list,
        filter: table.filter,
        fetch: false
      });
    };

    Object.defineProperty(this, 'getInit', {
      value: getInitFun.bind(store)
    });
    /**
     * 重新加载列表数据
     */

    Object.defineProperty(this, 'getFilter', {
      value: function value(filter) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        if (opt.clean === undefined) opt.clean = true;
        return _this3.get(1, filter, opt);
      }
    });
    /**
     * 加载单行数据
     * @overview 通过主键拉取单行数据，如果拉取成功会联动触发 this.Active(item) 方法
     * @param {String | Number | RowObject} primaryKey - 数据主键值
     * @param {Object} filter - 筛选参数
     * @param {Object} opt - 参数集，会传递到 Fetch 方法中
     * @returns {Promise}
     */

    var getItemFun = function getItemFun(primaryKey, filter) {
      var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (_typeof(primaryKey) === 'object') {
        if (!opt.primaryKey) opt.primaryKey = client.primaryKey;
        primaryKey = primaryKey[opt.primaryKey];
      }

      var params = originJSON(filter || {});
      return RESTFUL.call(this, client, table, _objectSpread(_objectSpread({}, opt), {}, {
        action: 'GET',
        id: primaryKey,
        table: table.name,
        params: params
      }));
    };

    Object.defineProperty(this, 'getItem', {
      value: getItemFun.bind(store)
    });
    /**
     * 加载更多数据
     * @overview 一般用在移动端的 "触底加载" 的效果，拉取的数据会连接上一页的列表
     * @param {Object} filter - 过滤器（筛选参数）
     * @param {Object} opt - 参数集，会传递到 Fetch 方法中
     * @returns {Promise}
     */

    var getMoreFun = function getMoreFun(filter) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var init = table.init,
          loading = table.loading,
          more = table.more,
          empty = table.empty;

      if (init && !loading && more && !empty) {
        var params = originJSON(filter || {});
        return RESTFUL.call(this, client, table, _objectSpread(_objectSpread({}, opt), {}, {
          action: 'MORE',
          table: table.name,
          params: params
        }));
      }

      return Promise.resolve(null);
    };

    Object.defineProperty(this, 'getMore', {
      value: getMoreFun.bind(store)
    }); // ========== 非持久化更新数据 ==========

    /**
     * 行数据创建（不触发持久化）
     * @param {Object} item - 行对象 row 实例，必须要包含主键
     * @param {String | Number} item - 插入位置 ['start', 'end', 0, -1, 或者指定索引]
     */

    var buildFun = function buildFun(item, position) {
      // TODO 注意可能会影响 size total empty 等值 & 没有 ID 需要本地创建一个虚拟 id
      var instance = this[table.name];
      return TABLE_ROWS_JOIN(client, instance, item, position);
    };

    Object.defineProperty(this, 'build', {
      value: buildFun.bind(store)
    });
    /**
     * 行数据更新（不触发持久化）
     * @param {Object} item - 行对象 row 实例，必须要包含主键
     */

    var saveFun = function saveFun(item) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // 需要支持本地虚拟 id
      var instance = this[table.name];
      return TABLE_ROW_EXTEND(client, instance, item, opt);
    };

    Object.defineProperty(this, 'save', {
      value: saveFun.bind(store)
    });
    /**
     * 行数据移除（不触发持久化）
     * @param {Object} item - 行对象 row 实例，必须要包含主键
     */

    var removeFun = function removeFun(item) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // TODO 注意可能会影响 size total empty 等值 & 需要支持本地虚拟 id
      var instance = this[table.name];
      return TABLE_ROW_REMOVE(client, instance, item, opt);
    };

    Object.defineProperty(this, 'remove', {
      value: removeFun.bind(store)
    }); // ========== 持久化更新数据 ==========

    /**
     * 提交数据行
     * @param {Object | RowObject} data - 提交数据
     * @param {Object} opt - 附加参数
     * @returns {Promise}
     */

    var postFun = function postFun(data) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return RESTFUL.call(this, client, table, _objectSpread(_objectSpread({}, opt), {}, {
        action: 'POST',
        table: table.name,
        data: data
      }));
    };

    Object.defineProperty(this, 'create', {
      value: postFun.bind(store)
    });
    Object.defineProperty(this, 'post', {
      value: postFun.bind(store)
    });
    /**
     * 修改数据行
     * @param {Object | RowObject} data - 提交数据
     * @param {Object} opt - 附加参数
     * @returns {Promise}
     */

    var putFun = function putFun(data) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!opt.primaryKey) opt.primaryKey = client.primaryKey;
      return RESTFUL.call(this, client, table, _objectSpread(_objectSpread({}, opt), {}, {
        action: 'PUT',
        id: data[opt.primaryKey],
        table: table.name,
        data: data
      }));
    };

    Object.defineProperty(this, 'update', {
      value: putFun.bind(store)
    });
    Object.defineProperty(this, 'put', {
      value: putFun.bind(store)
    });

    var patchFun = function patchFun(data) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!opt.primaryKey) opt.primaryKey = client.primaryKey;
      return RESTFUL.call(this, client, table, _objectSpread(_objectSpread({}, opt), {}, {
        action: 'PATCH',
        id: data[opt.primaryKey],
        table: table.name,
        data: data
      }));
    };

    Object.defineProperty(this, 'patch', {
      value: patchFun.bind(store)
    });
    /**
     * 删除数据行
     * @param {Object | RowObject} data - 提交数据
     * @param {Object} opt - 参数集
     * @returns {Promise}
     */

    var deleteFun = function deleteFun(data) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!opt.primaryKey) opt.primaryKey = client.primaryKey;
      return RESTFUL.call(this, client, table, _objectSpread(_objectSpread({}, opt), {}, {
        action: 'DELETE',
        id: data[opt.primaryKey],
        table: table.name,
        data: data
      }));
    };

    Object.defineProperty(this, 'destroy', {
      value: deleteFun.bind(store)
    });
    Object.defineProperty(this, 'delete', {
      value: deleteFun.bind(store)
    });
    /**
     * 提交表单
     * 根据是否有主键判断是新增还是修改
     * @param {Object | RowObject} data - 提交数据
     * @param {Object} opt - 参数集
     * @param {Object} opt.callback - 回调函数
     * @returns {Promise}
     */

    Object.defineProperty(this, 'submit', {
      value: function value(data, opt) {
        if (!opt.primaryKey) opt.primaryKey = client.primaryKey;
        return data[opt.primaryKey] ? _this3.put(data, opt) : _this3.post(data, opt);
      }
    }); // ========== 其他模型操作 ==========

    /**
     * 行数据设为焦点
     * @param {RowObject} item - 被设为焦点的实例
     * @returns {Promise}
     */

    var checkFun = function checkFun(item) {
      var instance = this[table.name];
      return TABLE_CHECK(client, instance, item);
    };

    Object.defineProperty(this, 'check', {
      value: checkFun.bind(store)
    });
    /**
     * 数据表重置
     * 请不要在 loading 状态下重置
     */

    var resetFun = function resetFun() {
      var instance = this[table.name];
      client.composition.set(instance, 'init', false);
      client.composition.set(instance, 'error', false);
      client.composition.set(instance, 'page', 1);
      client.composition.set(instance, 'total', undefined);
      client.composition.set(instance, 'count', undefined);
      client.composition.set(instance, 'empty', false);
      client.composition.set(instance, 'filter', {});
      client.composition.set(instance, 'list', []);
      client.composition.set(instance, 'marker', undefined);
      client.composition.set(instance, 'next', undefined);
      client.composition.set(instance, 'active', undefined);
      client.composition.set(instance, 'item', undefined);
    };

    Object.defineProperty(this, 'reset', {
      value: resetFun.bind(store)
    }); // ==============================

    return this.opt;
  } // 兼容 nuxt 服务端渲染
  // 当 toJSON 类中注释添加方法中的讨论解决了在客户端中设置状态时的问题
  // 但是在服务器中设置状态时，状态将变为 undefined


  _createClass(DgxTable, [{
    key: "toJSON",
    value: function toJSON() {
      return _toJSON(this);
    }
  }]);

  return DgxTable;
}();

var version = '0.1.1';
var dgx = DgxClient;
var index = {
  version: version,
  dgx: dgx,
  DgxClient: DgxClient,
  DgxTable: DgxTable
};
exports.DgxClient = DgxClient;
exports.DgxTable = DgxTable;
exports["default"] = index;
exports.dgx = dgx;
exports.version = version;
