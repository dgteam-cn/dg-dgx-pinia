/**
 * 判断样本是否继承了某个类，效果类似 es6 的 instanceof 语法
 * @param {Any} sample - 样本
 * @param {Function} parent - 父类
 * @returns {Boolean}
 */
export function instanceOf(sample, parent) {
    if (sample === undefined || sample === null || typeof parent !== 'function') return false
    let O = parent.prototype
    sample = sample.__proto__
    while (O) {
        if (sample === null) return false
        if (O === sample) return true
        sample = sample.__proto__
    }
}

export function originJSON(obj) {
    return JSON.parse(JSON.stringify(obj))
}

export function objectToString(o) {
    return Object.prototype.toString.call(o)
}

export function isArray(sample) {
    if (Array.isArray) return Array.isArray(sample)
    return objectToString(sample) === '[object Array]'
}

export function isObject(sample, strict) {
    if (sample && typeof sample === 'object') {
        if (strict && objectToString(sample) !== "[object Object]") {
            return false // 严格模式下只有 {} 的对象可以返回 true
        }
        return true // 非严格模式，[] 等也会返回 true
    }
    return false
}

export function extend(target, ...args) {
    let i = 0
    const length = args.length
    let options, name, src, copy
    if (!target) {
        target = this.isArray(args[0]) ? [] : {}
    }
    for (; i < length; i++) {
        options = args[i]
        if (!options) {
            continue
        }
        for (name in options) {
            src = target[name]
            copy = options[name]
            if (src && src === copy) {
                continue;
            }
            if (this.isArray(copy)) {
                target[name] = this.extend([], copy)
            } else if (this.isObject(copy)) {
                target[name] = this.extend(src && this.isObject(src) ? src : {}, copy)
            } else {
                target[name] = copy
            }
        }
    }
    return target
}

export function randomString(length = 16) {
    let result = ''
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    for (let i = 0; i <= 16; i++) {
        const index = Math.random() * length | 0
        result += chars[index]
    }
    return result
}

export function consoleWarn(...str) {
    console.warn("[dgx-pinia]", ...str)
}

export function toJSON(obj) {
    // Object.keys(): 返回对象所有可枚举属性名
    // Object.getOwnPropertyNames(): 返回对象所有自身属性名（包含不可枚举，但不包含 Symbol 值的属性名）
    return Object.keys(obj).reduce((a, b) => {
        a[b] = obj[b]
        return a
    }, {})
    // return Object.assign({}, this)
}