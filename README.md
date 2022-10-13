## 安装插件
> /plugins/dgx-pinia.js

```javascript
import {dgx} from '@dgteam/dgx-pinia'
import ajax from 'ajax'

/**
 * Nuxt2
 */
// import * as composition from '@nuxtjs/composition-api'
// const myPlugin = ({pinia}) => {
//     const _dgx = new dgx({
//         composition,
//         primaryKey: 'id',
//         defaultConfig: {
//             GET: {interact: true},
//             POST: {interact: false},
//             PUT: {interact: true},
//             DELETE: {interact: true}
//         },
//         httpClient: ajax,
//         enable: true // process.client // 仅在客户端才启用
//     })
//     const dgxPiniaPlugin = _dgx.createPiniaPlugin()
//     pinia.use(dgxPiniaPlugin)
// }
// export default myPlugin


/**
 * Nuxt3
 */
import * as composition from 'vue'
export default defineNuxtPlugin(nuxtApp => {
    const _dgx = new dgx({
        composition,
        primaryKey: 'id',
        defaultConfig: {
            GET: {interact: true},
            POST: {interact: false},
            PUT: {interact: true},
            DELETE: {interact: true}
        },
        httpClient: ajax,
        enable: true // process.client // 仅在客户端才启用
    })
    const dgxPiniaPlugin = _dgx.createPiniaPlugin()
    nuxtApp.$pinia.use(dgxPiniaPlugin)
})
```

## 声明数据模型
> /stores/test.js

```javascript
import {defineStore} from 'pinia'
export const useStore = defineStore('main', {
    tables: {
        // dgx tables
        product: {url: 'business/structure/product'},
        order: 'api/order'
    },
    state: () => ({
        // ...custom state
    }),
    actions: {
        // ...custom actions
    }
})
```

## 使用数据模型