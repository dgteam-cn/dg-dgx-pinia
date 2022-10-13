const fs = require('fs-extra')
const path = require('path')

// const ts = require('rollup-plugin-typescript2')
// const buble = require('@rollup/plugin-buble') // 代码转换库 1 目前发现转换 class 有问题
// const babel = require('rollup-plugin-babel') // 代码转换库 2
const {getBabelOutputPlugin} = require('@rollup/plugin-babel') // 代码转换库 2

// const sourceMaps = require('rollup-plugin-sourcemaps')
const replace = require('@rollup/plugin-replace') // 汇总插件，替换文件中的目标字符串
const {nodeResolve} = require('@rollup/plugin-node-resolve')  // node 下路径解析
const commonjs = require('@rollup/plugin-commonjs') // 加载 Node.js 里面的 CommonJS 模块
const {terser} = require("rollup-plugin-terser") // 代码压缩插件

const pkg = require('./package.json')

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * @author ${pkg.author} 
 * @license MIT
 */`

function createEntries() {

    /**
     * @param {String} input - 入口文件路径
     * @param {String} file - 输出文件路径
     * @param {String} format - 输出格式: es iife commonjs
     * @param {Boolean} minify - 代码是否压缩
     */
    const configs = [
        {input: `src/index.js`, file: `dist/index.mjs.js`, format: 'es', minify: false, browser: true, env: 'development'},
        {input: `src/index.js`, file: `dist/index.mjs.min.js`, format: 'es', minify: true, browser: true, env: 'development'},
        {input: `src/index.js`, file: `dist/index.cjs.js`, format: 'cjs', minify: false, browser: true, env: 'development'},
        {input: `src/index.js`, file: `dist/index.cjs.min.js`, format: 'cjs', minify: true, browser: true, env: 'development'}
    ]
    // const fileNames = fs.readdirSync('./src')
    // fileNames.forEach(fileName => {
    //     const name = fileName.slice(0, fileName.length - 3)
    //     if (fileName.indexOf('.ts') > 0) {
    //         configs.push(
    //             {input: `src/${name}.ts`, file: `dist/${name}.mjs.js`, format: 'es', minify: false, browser: true, env: 'development'},
    //             {input: `src/${name}.ts`, file: `dist/${name}.cjs.js`, format: 'cjs', minify: false, browser: true, env: 'development'}
    //         )
    //     }
    // })

    // const tsPlugin = ts({
    //     // check: true, // !hasTSChecked,
    //     tsconfig: path.resolve(__dirname, './tsconfig.json'),
    //     // cacheRoot: path.resolve(__dirname, './node_modules/.rts2_cache'),
    //     // tsconfigOverride: {
    //     //     compilerOptions: {
    //     //         sourceMap: output.sourcemap,
    //     //         declaration: shouldEmitDeclarations,
    //     //         declarationMap: shouldEmitDeclarations
    //     //     },
    //     //     exclude: ['packages/*/__tests__', 'packages/*/test-dts']
    //     // },
    //     extensions: ['.js', '.ts', '.tsx']
    // })

    const createEntry = config => {

        // const isGlobalBuild = config.format === 'iife'
        // const isBundlerBuild = config.format !== 'iife' && !config.browser
        // const isBundlerESMBuild = config.format === 'es' && !config.browser

        const opt = {
            // external: ['vue'], 将模块 ID 的逗号分隔列表排除
            input: config.input, // 入口文件
            plugins: [
                // tsPlugin,
                // buble({
                //     transforms: {
                //         forOf: false // 忽略 for-of 语法
                //     }
                // }),
                getBabelOutputPlugin({
                    presets: ["@babel/preset-env"]
                }),
                nodeResolve(),
                commonjs(),
                replace({
                    values: {
                        __VERSION__: pkg.version
                    },
                    preventAssignment: true
                })
            ],
            output: {
                banner, // 顶部说明头
                file: config.file,
                format: config.format,
                globals: {
                    // vue: 'Vue'
                }
            },
            watch: {
                include: 'src/**'
            }
            // onwarn: (msg, warn) => {
            //     // 警告信息拦截
            // //     if (!/Circular/.test(msg)) {
            // //     warn(msg)
            // //     }
            // }
        }

        // if (isGlobalBuild) {
        //     c.output.name = c.output.name || 'Vuex' // 生成 UMD 模块的名字
        // }

        // if (!isGlobalBuild) {
        //     c.external.push('@vue/devtools-api')
        // }

        // opt.plugins.push(replace({
        //     preventAssignment: true,
        //     __VERSION__: pkg.version,
        // //   __DEV__: isBundlerBuild
        // //     ? `(process.env.NODE_ENV !== 'production')`
        // //     : config.env !== 'production',
        // //   __VUE_PROD_DEVTOOLS__: isBundlerESMBuild
        // //     ? '__VUE_PROD_DEVTOOLS__'
        // //     : 'false'
        // }))
        // opt.plugins.push(sourceMaps()) //
        if (config.minify) opt.plugins.push(terser({module: config.format === 'es'}))

        return opt
    }
    return configs.map(opt => createEntry(opt))
}

module.exports = createEntries()