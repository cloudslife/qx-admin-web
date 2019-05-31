﻿const url = 'http://localhost:9991'

let publicPath = './'
module.exports = {
  publicPath: publicPath,
  lintOnSave: false,
  productionSourceMap: false,
  // chainWebpack: config => {
  //   // 忽略的打包文件
  //   config.externals({
  //     'vue': 'Vue',
  //     'vue-router': 'VueRouter',
  //     'vuex': 'Vuex',
  //     'axios': 'axios',
  //     'element-ui': 'ELEMENT'
  //   })
  //   const entry = config.entry('app')
  //   entry
  //     .add('babel-polyfill')
  //     .end()
  //   entry
  //     .add('classlist-polyfill')
  //     .end()
  // },
  // 配置转发代理
  devServer: {
    proxy: {
      '/auth': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/auth': '/auth'
        }
      },
      '/admin': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/admin': '/admin'
        }
      },
      '/captcha': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/captcha': '/captcha'
        }
      },
      '/gen': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/gen': '/gen'
        }
      }
    }
  }
}