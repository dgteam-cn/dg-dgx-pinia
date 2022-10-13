// const fs = require('fs-extra') // fs 类风窗
// const chalk = require('chalk') // // 命令行 log 输入
const execa = require('execa') // 命令行执行
// const {gzipSync} = require('zlib')
// const {compress} = require('brotli') // 数据压缩程序库

async function run() {
    await Promise.all([build(), copy()])
    // checkAllSizes()
}

async function build() {
    await execa('npx', ['rollup', '-c', 'rollup.config.js'], {stdio: 'inherit'})
}

async function copy() {
    // mjs = ESModule, 由于不需要编译，可直接使用
    // await fs.copy('src/index.mjs', 'dist/index.mjs')
    return Promise.resolve()
}

//   function checkAllSizes() {
//     console.log()
//     const files = [
//         'dist/vuex.esm-browser.js',
//         'dist/vuex.esm-browser.prod.js',
//         'dist/vuex.esm-bundler.js',
//         'dist/vuex.global.js',
//         'dist/vuex.global.prod.js',
//         'dist/vuex.cjs.js'
//     ]
//     files.map((f) => checkSize(f))
//     console.log()
//   }

//   function checkSize(file) {
//     const f = fs.readFileSync(file)
//     const minSize = (f.length / 1024).toFixed(2) + 'kb'
//     const gzipped = gzipSync(f)
//     const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb'
//     const compressed = compress(f)
//     const compressedSize = (compressed.length / 1024).toFixed(2) + 'kb'
//     console.log(
//       `${chalk.gray(
//         chalk.bold(file)
//       )} size:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`
//     )
//   }

run()