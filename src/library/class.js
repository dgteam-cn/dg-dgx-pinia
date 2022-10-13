import {
    FETCH, RESTFUL, TABLE_CHECK,
    TABLE_ROWS_JOIN, TABLE_ROW_EXTEND, TABLE_ROW_REMOVE
} from './actions'
import * as helper from './helper.js'

/**
 * @param {Object} app - vue 实例
 * @param {Boolean} [enable = true] - 是否启用
 */
export class DgxClient {

    constructor(config) {

        // 合并配置项
        const opt = Object.assign({
            primaryKey: 'id',
            defaultConfig: {
                GET: {interact: true},
                POST: {interact: false},
                PUT: {interact: true},
                PATCH: {interact: true},
                DELETE: {interact: true}
            },
            httpClient: null,
            httpClientType: 'axios', // 'uniapp' 'axios'
            enable: true
        }, config)

        // 获取组合式 api
        const {set, ref, reactive, isRef, isProxy} = config && config.composition || {}
        this.composition = {set, ref, reactive, isRef, isProxy}
        if (!this.composition.set || typeof this.composition.set !== 'function') {
            // vue3 不需要传 set 方法
            this.composition.set = function(obj, key, value) {
                if (isRef(obj.key)) {
                    obj.key.value = value
                } else {
                    obj[key] = value
                }
            }
        }

        this.id = helper.randomString(24)
        this.isDev = process.env.NODE_ENV === 'development'
        this.version = '__VERSION__'
        this.primaryKey = opt.primaryKey
        this.defaultConfig = opt.defaultConfig
        this.httpClient = opt.httpClient
        this.httpClientType = opt.httpClientType
        this.stores = {}
        this.enable = opt.enable
    }

    createPiniaPlugin() {

        if (!this.enable) return new Function() // 未开启
        const {isDev} = this
        /**
         * @param {Object} context.pinia - 使用 `createPinia()` 创建的 pinia
         * @param {Object} context.app - 使用 `createApp()` 创建的当前应用程序（仅限 Vue 3）
         * @param {Object} context.store - 插件正在扩充的 store
         * @param {Object} context.options - 定义存储的选项对象传递给`defineStore()`
         */
        const client = this
        const {set, reactive} = this.composition
        return function piniaPlugin({pinia, app, store, options}) {

            // 仅携带 options.tables 参数才会进行拓展，避免污染其他数据
            if (options.tables) {

                const {$id} = store
                const opts = options.options || {}

                // 预留功能：
                client.stores[$id] = {
                    tables: {},
                    options: opts
                }

                Object.keys(options.tables).forEach(name => {
                    const table = new DgxTable(name, options.tables[name], opts, client, store)
                    if (isDev) {
                        set(store.$state, name, table)
                        if (store._customProperties !== undefined) {
                            store._customProperties.add(name) // in dev mode only (debug it in devtools)
                        }
                    }
                    set(store, name, table)
                    client.stores[$id].tables[name] = table // 预留功能
                })

                // 设置默认网络请求器
                set(store, 'FETCH', function(config) {
                    return FETCH.call(this, client, config)
                })
            }
        }
    }
}

// export class DgxList extends Array {
//     constructor(list) {
//         super()
//         if (helper.isArray(list) && list.length) {
//             this.push(...list)
//         }
//     }
// }
// const CLIENT = Symbol('client')

export class DgxTable {

    constructor(name, config, opts, client, store) {

        if (typeof config === 'string') {
            config = {url: config}
        }
        const opt = Object.assign({name: ''}, opts.define, {name}, config)

        this.name = opt.name //model // 模型名称
        this.init = false // 是否初始化（至少 GET 过一次）
        this.error = false // 最后一 GET 是否错误
        this.loading = false // 当请求队列中 GET 数量大于 0 时返回真
        this.editing = false // 当请求队列中 POST PUT DELETE 数量大于 0 时返回真
        this.fetchs = [] // 请求队列
        this.page = 1 // 当前请求的页码
        this.total = undefined
        this.count = undefined
        this.empty = false
        this.filter = {} // 过滤器缓存
        this.list = [] // 数据表
        this.marker = undefined // 下一页地址
        this.next = undefined // 下一页标记
        this.active = undefined // 焦点在数据的索引
        this.item = undefined // 焦点对象
        this.syncAt = undefined

        const table = this

        Object.defineProperty(this, '_id', {value: helper.randomString(24)}) // 生成随机字符串作为主键

        // 对象映射
        Object.defineProperty(this, 'client', {get: () => client})
        Object.defineProperty(this, 'options', {get: () => opt})

        // ========== 加载（读取）数据 ==========

        /**
         * @param {Number} page - 列表页码，默认: 1
         * @param {Object} filter - 过滤器（筛选参数），不传则默认从 this.Filter 中获取
         * @param {Object} opt - 参数集，会传递到 FETCH 方法中，可见相关参数说明
         * @param {Boolean} opt.clean - 请求前是否先清空模型 list 数据
         * @param {Any} opt[key] - 其他参数会保留并传递给其他中间件
         * @returns {Promise}
         */
        const getFun = function(page, filter, opt = {}) {
            if (typeof page === 'object') {
                filter = page
                opt = filter
                page = 1
            }
            const params = helper.originJSON(filter || {})
            params.page = page ? page : 1
            if (opt.clean) table.reset()
            return RESTFUL.call(this, client, table, {...opt, action: 'GET', table: table.name, params})
        }
        Object.defineProperty(this, 'get', {value: getFun.bind(store)})


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
        const getInitFun = function(filter, opt = {}) {
            const {cache, strict, immediate, clean} = opt
            let needFetch = !this.init || Boolean(immediate)
            if (typeof filter !== 'object') filter = {}
            const fetchHandle = () => {
                if (clean) this.reset()
                const params = helper.originJSON(filter || {})
                return RESTFUL.call(this, client, table, {...opt, action: 'GET', table: this.name, params}).then(res => {
                    if (!res.err) {
                        client.composition.set(this, 'syncAt', new Date())
                        return {...res, filter, fetch: true}
                    }
                    return {...res, result: [], filter, fetch: true}
                })
            }
            if (this.list.length === 0) {
                needFetch = true // 如果列表为空表示则缓存无效
            } else if (typeof cache === 'number' && this.syncAt && !needFetch) {
                // 判断是否缓存超时需要重新拉取
                const update = new Date(this.syncAt).getTime()
                const expire = update + cache * 1000
                needFetch = Date.now() > expire // 如果 当前时间 > 到期时间 需要重新加载
            } else if (strict) {
                // 如果是严格的，需要坚持筛选条件
                try {
                    needFetch = JSON.stringify(this.filter) !== JSON.stringify(filter)
                } catch (err) {
                    helper.consoleWarn('getInit: filter is invalid.')
                }
            }
            return needFetch ? fetchHandle() : Promise.resolve({err: 0, msg: 'cache data', result: this.list, filter: this.filter, fetch: false})
        }
        Object.defineProperty(this, 'getInit', {value: getInitFun.bind(store)})


        /**
         * 重新加载列表数据
         */
        Object.defineProperty(this, 'getFilter', {value: (filter, opt = {}) => {
            if (opt.clean === undefined) opt.clean = true
            return this.get(1, filter, opt)
        }})


        /**
         * 加载单行数据
         * @overview 通过主键拉取单行数据，如果拉取成功会联动触发 this.Active(item) 方法
         * @param {String | Number | RowObject} primaryKey - 数据主键值
         * @param {Object} filter - 筛选参数
         * @param {Object} opt - 参数集，会传递到 Fetch 方法中
         * @returns {Promise}
         */
        const getItemFun = function(primaryKey, filter, opt = {}) {
            if (typeof primaryKey === 'object') {
                if (!opt.primaryKey) opt.primaryKey = client.primaryKey
                primaryKey = primaryKey[opt.primaryKey]
            }
            const params = helper.originJSON(filter || {})
            return RESTFUL.call(this, client, table, {...opt, action: 'GET', id: primaryKey, table: table.name, params})
        }
        Object.defineProperty(this, 'getItem', {value: getItemFun.bind(store)})


        /**
         * 加载更多数据
         * @overview 一般用在移动端的 "触底加载" 的效果，拉取的数据会连接上一页的列表
         * @param {Object} filter - 过滤器（筛选参数）
         * @param {Object} opt - 参数集，会传递到 Fetch 方法中
         * @returns {Promise}
         */
        const getMoreFun = function(filter, opt = {}) {
            const {init, loading, more, empty} = table
            if (init && !loading && more && !empty) {
                const params = helper.originJSON(filter || {})
                return RESTFUL.call(this, client, table, {...opt, action: 'MORE', table: table.name, params})
            }
            return Promise.resolve(null)
        }
        Object.defineProperty(this, 'getMore', {value: getMoreFun.bind(store)})


        // ========== 非持久化更新数据 ==========


        /**
         * 行数据创建（不触发持久化）
         * @param {Object} item - 行对象 row 实例，必须要包含主键
         * @param {String | Number} item - 插入位置 ['start', 'end', 0, -1, 或者指定索引]
         */
        const buildFun = function (item, position) {
            // TODO 注意可能会影响 size total empty 等值 & 没有 ID 需要本地创建一个虚拟 id
            const instance = this[table.name]
            return TABLE_ROWS_JOIN(client, instance, item, position)
        }
        Object.defineProperty(this, 'build', {value: buildFun.bind(store)})

        /**
         * 行数据更新（不触发持久化）
         * @param {Object} item - 行对象 row 实例，必须要包含主键
         */
        const saveFun = function (item, opt = {}) {
            // 需要支持本地虚拟 id
            const instance = this[table.name]
            return TABLE_ROW_EXTEND(client, instance, item, opt)
        }
        Object.defineProperty(this, 'save', {value: saveFun.bind(store)})

        /**
         * 行数据移除（不触发持久化）
         * @param {Object} item - 行对象 row 实例，必须要包含主键
         */
        const removeFun = function (item, opt = {}) {
            // TODO 注意可能会影响 size total empty 等值 & 需要支持本地虚拟 id
            const instance = this[table.name]
            return TABLE_ROW_REMOVE(client, instance, item, opt)
        }
        Object.defineProperty(this, 'remove', {value: removeFun.bind(store)})


        // ========== 持久化更新数据 ==========


        /**
         * 提交数据行
         * @param {Object | RowObject} data - 提交数据，不传则默认从 this.Params 中获取
         * @param {Object} opt - 附加参数
         * @returns {Promise}
         */
        const postFun = function (data, opt = {}) {
            return RESTFUL.call(this, client, table, {...opt, action: 'POST', table: table.name, data})
        }
        Object.defineProperty(this, 'create', {value: postFun.bind(store)})
        Object.defineProperty(this, 'post', {value: postFun.bind(store)})


        /**
         * 修改数据行
         * @param {Object | RowObject} data - 提交数据，不传则默认从 this.Params 中获取
         * @param {Object} opt - 附加参数
         * @returns {Promise}
         */
        const putFun = function (data, opt = {}) {
            if (!opt.primaryKey) opt.primaryKey = client.primaryKey
            return RESTFUL.call(this, client, table, {...opt, action: 'PUT', id: data[opt.primaryKey], table: table.name, data})
        }
        Object.defineProperty(this, 'update', {value: putFun.bind(store)})
        Object.defineProperty(this, 'put', {value: putFun.bind(store)})

        const patchFun = function (data, opt = {}) {
            if (!opt.primaryKey) opt.primaryKey = client.primaryKey
            return RESTFUL.call(this, client, table, {...opt, action: 'PATCH', id: data[opt.primaryKey], table: table.name, data})
        }
        Object.defineProperty(this, 'patch', {value: patchFun.bind(store)})


        /**
         * 删除数据行
         * @param {Object | RowObject} data - 提交数据，不传则默认从 this.Params 中获取
         * @param {Object} opt - 参数集
         * @returns {Promise}
         */
        const deleteFun = function (data, opt = {}) {
            if (!opt.primaryKey) opt.primaryKey = client.primaryKey
            return RESTFUL.call(this, client, table, {...opt, action: 'DELETE', id: data[opt.primaryKey], table: table.name, data})
        }
        Object.defineProperty(this, 'destroy', {value: deleteFun.bind(store)})
        Object.defineProperty(this, 'delete', {value: deleteFun.bind(store)})


        /**
         * 提交表单
         * 根据是否有主键判断是新增还是修改
         * @param {Object | RowObject} data - 提交数据，不传则默认从 this.Params 中获取
         * @param {Object} opt - 参数集
         * @param {Object} opt.callback - 回调函数
         * @returns {Promise}
         */
        Object.defineProperty(this, 'submit', {value: (data, opt) => {
            if (!opt.primaryKey) opt.primaryKey = client.primaryKey
            return data[opt.primaryKey] ? this.put(data, opt) : this.post(data, opt)
        }})


        // ========== 其他模型操作 ==========


        /**
         * 行数据设为焦点
         * @param {RowObject} item - 被设为焦点的实例
         * @returns {Promise}
         */
        const checkFun = function(item) {
            const instance = this[table.name]
            return TABLE_CHECK(client, instance, item)
        }
        Object.defineProperty(this, 'check', {value: checkFun.bind(store)})

        /**
         * 数据表重置
         * 请不要在 loading 状态下重置
         */
        const resetFun = function() {
            const instance = this[table.name]
            client.composition.set(instance, 'init', false)
            client.composition.set(instance, 'error', false)
            client.composition.set(instance, 'page', 1)
            client.composition.set(instance, 'total', undefined)
            client.composition.set(instance, 'count', undefined)
            client.composition.set(instance, 'empty', false)
            client.composition.set(instance, 'filter', {})
            client.composition.set(instance, 'list', [])
            client.composition.set(instance, 'marker', undefined)
            client.composition.set(instance, 'next', undefined)
            client.composition.set(instance, 'active', undefined)
            client.composition.set(instance, 'item', undefined)
        }
        Object.defineProperty(this, 'reset', {value: resetFun.bind(store)})

        // ==============================

        return this.opt
    }


    // 兼容 nuxt 服务端渲染
    // 当 toJSON 类中注释添加方法中的讨论解决了在客户端中设置状态时的问题
    // 但是在服务器中设置状态时，状态将变为 undefined
    toJSON() {
        return helper.toJSON(this)
    }
}