import {DgxTable} from './class'
import * as helper from './helper.js'

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
export const FETCH = function(client, config = {}) {

    if (typeof config === 'string') config = {url: config}
    const {method = 'GET', silent, only} = config

    // 尝试获取表对象实例
    const table = config.table && this[config.table] && helper.instanceOf(this[config.table], DgxTable) ?
        this[config.table] :
        null

    const updateTableFetchsState = () => {
        if (table) {
            client.composition.set(table, 'loading', !!table.fetchs.find(item => item.method === 'GET'))
            client.composition.set(table, 'editing', !!table.fetchs.find(item => ~['POST', 'PUT', 'DELETE'].indexOf(item.method)))
        }
    }
    const updateTableFetchs = matchFun => {
        if (table && table.fetchs) {
            table.fetchs.forEach((fetch, index) => {
                if (matchFun(fetch, index)) {
                    try {
                        fetch.cancel({table, only})
                    } catch (e) {
                        helper.consoleWarn('need cancelHandler.')
                    }
                    table.fetchs.splice(index, 1)
                    updateTableFetchsState()
                }
            })
        }
    }

    /**
     * 请求体格式转换器
     */
    const requestConfigAdapter = config => {
        switch (client.httpClientType) {
            case 'axios': {
                return config
            }
            case 'uniapp': {
                const result = helper.originJSON(config)
                // headers > header
                if (result.headers && typeof result.headers === 'object') {
                    result.header = helper.originJSON(result.headers)
                    delete result.headers
                }
                // 拼接 params 查询参数
                if (result.params && typeof result.params === 'object') {
                    if (result.url.indexOf('?') === -1) result.url += '?'
                    for (let key in result.params) {
                        if (result.params[key] !== undefined) {
                            if (typeof result.params[key] === 'string' || typeof result.params[key] === 'number') {
                                result.url += `${key}=${result.params[key]}&`
                            } else {
                                result.url += `${key}=${JSON.stringify(result.params[key])}&`
                            }
                        }
                    }
                }
                return result
            }
            default: {
                return config
            }
        }
    }


    if (only) updateTableFetchs(fetch => fetch.only === only) // 检测是否重复，如果重复则取消之前相同的方法
    if (!config.headers) config.headers = {} // 整合请求头

    const paths = []  // 自动填充路由参数，例如 /user/:id 等，默认从 paths 中获取，若获取不到则尝试从 params 中获取
    for (const route of config.url.split('/')) {
        if (route[0] === ':' && route.length > 1) {
            const key = route.substr(1)
            if (config.paths && config.paths[key] !== undefined && typeof config.paths[key].toString === 'function') {
                paths.push(config.paths[key].toString())
            } else if (config.params && config.params[key] !== undefined && typeof config.params[key].toString === 'function') {
                paths.push(config.params[key].toString())
            } else {
                paths.push('')
            }
        } else {
            paths.push(route)
        }
    }
    config.url = paths.join('/')


    return new Promise(resolve => {

        // 内部请求 id
        const id = helper.randomString(16)

        const callback = {

            // 成功回调
            success: function(res) {

                // 兼容原生 uni.request
                if (client.httpClientType === 'uniapp' && helper.isArray(res) && res.length === 2) {
                    const {data, header: headers, statusCode: status} = res[1]
                    res = {config, status, headers, data}
                }

                updateTableFetchs(fetch => fetch.id === id) // 移除请求从队列，并更新请求状态
                if (table) {
                    table.init = true // TODO 此处判定需要更加精准，要求判断必须是原生 table.get() 方法
                    table.error = false
                }

                if (typeof config.responseType === 'string' && config.responseType.toLowerCase() === "arraybuffer") {
                    resolve({data: res.data, config: Object.assign({}, config, res.config)})
                } else {
                    resolve({...res.data, config: Object.assign({}, config, res.config)})
                }
            },

            // 失败回调
            error: function(res) {
                updateTableFetchs(fetch => fetch.id === id) // 移除请求从队列，并更新请求状态
                if (table) {
                    table.error = true // TODO 此处判定需要更加精准，要求判断必须是原生 table.get() 方法
                }
                resolve({...res.data, config: Object.assign({}, config, res.config)})
            }
        }

        if (client.httpClient) {
            if (table && table.fetchs) {
                table.fetchs.push({id, table, only, method, silent})
                updateTableFetchsState()


            }
            const getCancel = (requestId, cancel) => {
                if (table) {
                    const instance = table.fetchs.find(fetch => fetch.id === id)
                    if (instance) {
                        client.composition.set(instance, 'requestId', requestId)
                        client.composition.set(instance, 'cancel', cancel) // 取消事件注册，需要获取 cancel 方法，以便之后取消时候执行
                    }
                }
            }
            const requestConfig = requestConfigAdapter(config)
            return client.httpClient({getCancel, ...requestConfig}).then(callback.success, callback.error)
        } else {
            helper.consoleWarn('need httpClient')
        }
    })
}


export const RESTFUL = function(client, table, config) {

    if (typeof table === 'object' && table.name) {
        table = this[table.name]
    } if (typeof table === 'string') {
        table = this[table]
    }

    const {action} = Object.assign({action: 'GET'}, config)
    if (config.primaryKey) config.primaryKey = client.primaryKey
    const methods = {
        'GET': 'GET',
        'MORE': 'GET',
        'POST': 'POST',
        'PUT': 'PUT',
        'PATCH': 'PATCH',
        'DELETE': 'DELETE'
    }
    const method = methods[action]

    if (table && method) {

        /**
         * @name 获取配置项目
         * @param {string} key [only, interact, debounce, throttle, silent, loading]
         * @param {string} method [GET, POST, PUT, DELETE]
         */
        const opt = table.options
        const getRESTfulConfig = key => {
            let result = false
            if (typeof key === 'string') {
                if (config[key] !== undefined) {
                    // #1 - 优先从 action 的 fetchData 中获取
                    result = config[key]
                } else if (opt[method] && opt[method][key] !== undefined) {
                    // #2 否则从 Table 的 options[method] 中获取
                    result = opt[method][key]
                } else if (opt[key] !== undefined) {
                    // #3 否则从 Table 的 options 中获取
                    result = opt[key]
                } else if (typeof client.defaultConfig === 'object') {
                    // #4 最终尝试在 client 的静态属性 defaultConfig[method] 中获取
                    if (typeof client.defaultConfig[method] === 'object' && client.defaultConfig[method][key] !== undefined) {
                        result = client.defaultConfig[method][key]
                    }
                }
                if (result === true && key === 'only') {
                    result = method // only 特性，如果未传 onlyKey 则自动指定 method 字段为 onlyKey
                }
            }
            if (typeof result === 'function') {
                result = result({client, table, options: opt, config}) // 新增（未来考虑支持 await 方式）
            }
            return result
        }

        // 封装 fetch 数据
        const fetchData = {
            ...config,
            options: opt,
            method,
            table: config.table,
            url: `${opt.url}${config.id ? '/' + config.id : ''}`,
            data: config.data || {}, // 请求体
            params: config.params || {}, // url 参数
            paths: config.paths || {}, // url path 参数
            headers: config.headers || {}, // 请求头
            limit: getRESTfulConfig('limit') || {}, // 请求限制
            only: getRESTfulConfig('only'), // 是否是禁止重复请求
            silent: getRESTfulConfig('silent'), // 是否静默加载
            loading: getRESTfulConfig('loading') // 是否显示加载中动画 （移动端）
        }

        // 设置查询限制
        if (typeof fetchData.limit === 'object') {
            for (const key in fetchData.limit) {
                for (const name of ['params', 'paths', 'data']) {
                    if (
                        method === 'GET' && name === 'params' ||
                        method !== 'GET' && name === 'data' ||
                        name === 'paths'
                    ) {
                        fetchData[name][key] = fetchData.limit[key]
                    }
                }
            }
        }
        // 加载更多时，自动区分 marker 模式与 page 模式
        if (action === 'MORE') {
            if (table.marker !== undefined) {
                fetchData.params.marker = table.marker
            } else {
                fetchData.params.page = table.page + 1
            }
        }

        // 封装 vuex 方法方便之后的 table 操作调用
        const tableCtrl = {
            update: (key, value) => TABLE_UPDATE.call(this, client, table, key, value), // 更新 table 的属性
            rows: {
                add: (item, position) => TABLE_ROWS_JOIN.call(this, client, table, item, position), // 新增 row 到 table.list: TABLE_ROWS_JOIN
                update: item => TABLE_ROW_EXTEND.call(this, client, table, item, config), // 更新 row 到 table.list
                merge: list => TABLE_ROWS_MERGE.call(this, client, table, list), // TODO 需要支持合并方向，目前暂时只能向下合并
                remove(id) {
                    // 移除 row 到 table.list: TABLE_ROW_REMOVE
                    if (id && typeof id === 'object') {
                        try {
                            id = id[config.primaryKey] // 兼容对象写法
                        } catch (e) {}
                    }
                    return TABLE_ROW_REMOVE.call(this, client, table, id, config)
                }
            }
        }

        // 数据联动
        const interactHandles = {

            GET: res => {
                const interact = getRESTfulConfig('interact')
                if (config.id) {
                    if (interact) {
                        // TODO 此方式无法触发 model.active 字段
                        tableCtrl.update('item', res.result)
                    }
                } else if (helper.isArray(res.result)) {
                    if (interact) {
                        if (action === 'MORE') {
                            tableCtrl.rows.merge(res.result)
                        } else {
                            tableCtrl.update('list', res.result)
                        }
                    }
                    const page = res.page || config.params && config.params.page || 1
                    const marker = res.marker !== undefined ? res.marker : undefined
                    const count = res.count != undefined && res.count >= 0 ? Number(res.count) : undefined
                    const total = res.total // TODO 如果 total 不传但是有 count & size 值，那么应该手动计算 total 值
                    const empty = !!(res.page == 1 && !res.result.length)
                    const more = res.page < res.total
                    const filter = config.params ? helper.originJSON(config.params) : {}
                    tableCtrl.update({page, marker, count, total, empty, more, filter})
                } else if (interact) {
                    tableCtrl.update('list', res.result || res)
                }
            },

            POST: res => {
                const interact = getRESTfulConfig('interact', 'POST')
                if (interact && res.result && res.result[config.primaryKey]) {
                    let position = 'end' // 判定增加数据的位置
                    if (typeof interact === 'object' && interact.position) {
                        position = interact.position
                    } else if (typeof interact === 'number' || ~['start', 'begin', 'head', 'end', 'finish', 'foot', 'last'].indexOf(interact)) {
                        position = interact
                    }
                    tableCtrl.rows.add(res.result, position)
                    if (table.count != undefined && table.count >= 0) {
                        tableCtrl.update('count', table.count + 1)  // commit('TABLE_UPDATE', [model, 'count', state[model].count + 1])
                    }
                    if (table.empty) {
                        tableCtrl.update('empty', false) // 判断是否已经脱离 “空列表” 状态 commit('TABLE_UPDATE', [model, 'empty', false])
                    }
                }
            },

            PUT: res => {
                const interact = getRESTfulConfig('interact', 'PUT')
                if (interact && res.result && res.result[config.primaryKey]) {
                    tableCtrl.rows.update(res.result)
                }
            },

            DELETE: () => {
                const interact = getRESTfulConfig('interact', 'DELETE')
                if (interact) {
                    tableCtrl.rows.remove(config.id)
                    if (table.item && table.item[config.primaryKey] === config.id) {
                        tableCtrl.update({active: null, item: null})
                    }
                    // 影响统计数
                    if (table.count != undefined && table.count > 0) {
                        tableCtrl.update({count: table.count - 1})
                    }
                    if (table.page === 1 && table.list.length === 0) {
                        tableCtrl.update({empty: true, more: false})  // 判断是否需要触发 “空列表” 状态
                    }
                }
            }
        }
        interactHandles.PATCH = interactHandles.PUT // patch 语法糖

        // fetch 主函数
        // const store = {[config.table]: table}
        return FETCH.call(this, client, fetchData).then(res => {
            if (res && res.result) {
                interactHandles[method](res) // 事件联动
            }
            return res
        })
    }
    return Promise.resolve({err: 1})
}

// 更新表字段
export const TABLE_UPDATE = function(client, table, key, value) {
    if (typeof key === 'string') {
        client.composition.set(table, key, value)
    } else if (typeof key === 'object' && key !== null) {
        for (let k in key) {
            client.composition.set(table, k, key[k])
        }
    }
}

// 新增行数据
export const TABLE_ROWS_JOIN = function(client, table, item, position) {
    if (typeof position === 'string') {
        if (~['start', 'begin', 'head'].indexOf(position)) {
            position = 0
        } else if (~['end', 'foot', 'last'].indexOf(position)) {
            position = -1
        } else {
            position = parseInt(position)
        }
    }
    if (position === 0) {
        table.list.unshift(item)
    } else if (position === -1) {
        table.list.push(item)
    } else if (Number.isInteger(position)) {
        table.list.splice(position, 0, item)
    }
}

// 更新行数据
export const TABLE_ROW_EXTEND = function(client, table, item, opt = {}) {
    try {
        if (!opt.primaryKey) opt.primaryKey = client.primaryKey
        if (item[opt.primaryKey]) {
            for (let row of table.list) {
                if (row[opt.primaryKey] && row[opt.primaryKey] === item[opt.primaryKey]) {
                    Object.assign(row, item)
                }
            }
            if (table.item) {
                let row = table.item
                if (row[opt.primaryKey] && row[opt.primaryKey] === item[opt.primaryKey]) {
                    Object.assign(row, item)
                }
            }
        }
    } catch (error) {}
}

// 合并行数据
export const TABLE_ROWS_MERGE = function(client, table, list) {
    table.list.push(...list)
}

// 移除行数据
export const TABLE_ROW_REMOVE = function(client, table, id, opt = {}) {
    if (!opt.primaryKey) opt.primaryKey = client.primaryKey
    if (id && typeof id === 'object') id = id[opt.primaryKey]
    const index = id ? table.list.findIndex(item => item[opt.primaryKey] === id) : undefined
    if (index >= 0) table.list.splice(index, 1)
}


// 指定焦点
export const TABLE_CHECK = function(client, table, active, opt = {}) {
    if (helper.isArray(active) && active[0]) {
        active = active[0]
    }
    if (active === undefined || active === null) {
        // 重置
        TABLE_CHECK_RESET(client, table)
    } else if (typeof active === "object") {
        // 以 对象条件 来确定焦点
        const item = active
        const list = table.list
        if (!opt.primaryKey) opt.primaryKey = client.primaryKey
        for (let i = 0; i < list.length; i++) {
            if (item[opt.primaryKey] && list[i][opt.primaryKey] && list[i][opt.primaryKey] === item[opt.primaryKey]) {
                return TABLE_CHECK_CHANGE(client, table, {[opt.primaryKey]: list[i][opt.primaryKey] || undefined, active: i, item: list[i]})
            }
        }
    } else {
        // 以索引来确定焦点，（ -1 = 选择数组的最后一个）
        if (active == -1) {
            active = table.list.length > 0 ? table.list.length - 1 : 0
        }
        // 如果焦点不存在则默认使用原焦点，如果原焦点不存在则默认使用 0
        let queue = [active, table.active, 0]
        for (let i=0; i< queue.length; i++) {
            if (table.list[queue[i]]) {
                active = queue[i]
                break
            }
        }
        // 如果列表存在键值
        if (table.list && table.list[active]) {
            if (!opt.primaryKey) opt.primaryKey = client.primaryKey
            return TABLE_CHECK_CHANGE(client, table, {[opt.primaryKey]: table.list[active][opt.primaryKey], active, item: table.list[active]})
        }
        TABLE_CHECK_RESET()
    }
}

// 【内部】切换焦点
export const TABLE_CHECK_CHANGE = function(client, table, config) {
    for (const key of ['active', 'item']) {
        if (config[key] || config[key] == 0) {
            TABLE_UPDATE(client, table, key, config[key])
        }
    }
    return config.item
}

// 【内部】重置焦点
export const TABLE_CHECK_RESET = function(client, table) {
    for (const key of ['active', 'item']) {
        TABLE_UPDATE(client, table, key, undefined)
    }
}