const path = require('path')
const webpack = require('webpack')
const port = process.env.port || process.env.npm_config_port || 8100 // 端口
const { name } = require('./package.json')
const isProduction = process.env.NODE_ENV === 'production'
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
// 这里只列一部分，具体配置参考文档
module.exports = {
  // publicPath: process.env.BASE_URL ? process.env.BASE_URL : '/',
  outputDir: '../dist/main',
  lintOnSave: false,
  productionSourceMap: false,
  assetsDir: 'static',
  runtimeCompiler: true,
  chainWebpack: config => {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test
    // set svg-sprite-loader 添加自定义的icons用作公共菜单图标
    config.module
      .rule('svg')
      .exclude.add(path.resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    // config.optimization.minimizer('terser').tap((args) => {
    //   args[0].terserOptions.compress.drop_console = true
    //   return args
    // })
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('src')
      }
    },
    name: 'vue2主应用',
    plugins: isProduction ? [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      //使用gzip打包
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ] : [],
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`,
      filename: `[name].[hash].js`,
      chunkFilename: `[name].[hash].js`,
    },
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    host: '0.0.0.0',
    port: port,
    open: false,
    proxy: {
      '^/portal-user': {
        target: `http://10.0.10.240:8172`, // 开发
        changeOrigin: true,
        pathRewrite: {
          '^/portal-user': '/portal-user'
        }
      }, '^/portal-sso': {
        target: `http://10.0.10.240:8171`, // 开发
        changeOrigin: true,
        pathRewrite: {
          '^/portal-sso': '/portal-sso'
        },
      }
    },
    disableHostCheck: true
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import 'src/assets/styles/variables.scss';`
      },
      less: {
        modifyVars: {
          'primary-color': '#1890ff',
          'menu-dark-bg': '#304156'
        },
        javascriptEnabled: true
      }
    }
  }
}
