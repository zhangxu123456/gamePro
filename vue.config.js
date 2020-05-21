// vue.config.js
const path = require('path')
module.exports = {
    lintOnSave: false,
    publicPath: './',
    productionSourceMap: false,
    devServer: {
        // host: '172.16.17.244',
        // host: 'http://www.wuyaoc.xyz/',
        host: 'localhost',
        port: 639,
        proxy: {
            '/apis': {
                target: 'http://www.wuyaoc.xyz',
                changeOrigin: true,
                logLevel: 'debug',
                headers: {
                    Cookie: ''
                },
                pathRewrite: {
                  '^/apis': '/'
                }
            }
        },
    },
    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'less',
        patterns: [
            path.resolve(__dirname, './src/assets/style/common.less') // 配置less全局文件
        ]
      }
    }
}
