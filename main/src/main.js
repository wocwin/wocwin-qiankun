/* eslint-disable no-undef */
import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/index.scss' // global css
import '@/assets/font/fonts.scss'
import '@/assets/iconfont/iconfont.css'
import App from './App'
import store from './store'
import permission from './directive/permission'
import './directive/index' // 全局自定义指令
import * as filters from './utils/filters' // 全局过滤
import GlobalConstant from './utils/constants' // 静态字典
import './assets/icons' // icon
import './permission' // permission control
import api from '@/api'
import { checkdomain, selectDictLabel, handleTree } from '@/utils'
import download from '@/utils/download'
import { message } from '@/utils/resetMessage' // 防止重复点击重复弹出message弹框
import VueClipboard from 'vue-clipboard2' // 复制插件
import Tui from '@wocwin/t-ui'
import router from './router'

Vue.use(Tui)
Vue.use(VueClipboard)
// 全局方法挂载
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.$download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.checkdomain = checkdomain
Vue.prototype.$api = api
Vue.prototype.$constant = GlobalConstant // 静态字典
Vue.prototype.$resetMessage = message // 防止重复点击重复弹出message弹框

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg)
}

Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// 过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 全局修改el-dialog 默认点击遮照为不关闭
Element.Dialog.props.closeOnClickModal.default = false

import { registerMicroApps, start } from 'qiankun'
// 获取所有子应用
import microApps from './micro-app'
// console.log('clientType=B', res)
// 给子应用配置加上loader方法
const apps = microApps.map(item => {
  // console.log('app', item)
  return {
    ...item
  }
})
// console.log('app333', apps)
registerMicroApps(apps, {
  beforeLoad: (app) => {
    console.log('before load', app)
    switch (app.name) {
      case 'wocwin-vue2':
        document.title = 'wocwin-vue2'
        break
      case 'wocwin-admin':
        document.title = 'wocwin-admin'
        break
    }
  },
  beforeMount: [(app) => {
    console.log('before mount', app.name)
  }]
})
start({
  prefetch: false // 取消预加载
})

window.wocwin_qiankun = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
