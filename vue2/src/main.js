import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/index.scss' // global css
import '@/assets/font/fonts.scss'
import App from './App'
import store from './store'
import permission from './directive/permission' // 按钮权限指令
import './directive/index' // 全局自定义指令
import './components/index.js' // 全局基础组件注入
import * as filters from './utils/filters' // 全局过滤
import './assets/icons' // icon
import './permission' // 全局路由守卫
import { FloatAdd, FloatSub, FloatMul, FloatDiv, download } from "@/utils" // 浮点运算加减乘除
import { message } from "@/utils/resetMessage" // 防止重复点击重复弹出message弹框
import VueClipboard from 'vue-clipboard2' // 复制插件
import router from "./router"
import api from "./api" // 接口api
import moment from "moment"
import print from 'vue-print-nb'

Vue.use(print)//注册打印插件
Vue.use(VueClipboard)
// 全局方法挂载
Vue.prototype.FloatAdd = FloatAdd //  浮点运算加
Vue.prototype.FloatSub = FloatSub //  浮点运算减
Vue.prototype.FloatMul = FloatMul //  浮点运算乘
Vue.prototype.FloatDiv = FloatDiv //  浮点运算除
Vue.prototype.moment = moment
Vue.prototype.$messageUpload = message // 防止重复点击重复弹出message弹框
Vue.prototype.download = download // 导出
Vue.prototype.$api = api

Vue.use(permission) // 按钮权限指令

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
// 注册基础组件
// Vue.use(KBui)

// 过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 全局修改el-dialog 默认点击遮照为不关闭
Element.Dialog.props.closeOnClickModal.default = false


let instance = null;
export function render(props = {}) {
  console.log('执行子应用渲染')
  if (window.__POWERED_BY_QIANKUN__) {
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
  }
  const { container } = props;

  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
  console.log('开始加载相关内容')
}

//TODO:非qiankun环境下单独运行
//@ts-ignore
if (!window.__POWERED_BY_QIANKUN__) {
  console.log('并不是qiankun渲染')
  render();
}


/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('react app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log('应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法', props)
  props.onGlobalStateChange((state) => {
    console.log('子应用接收的参数', state)
    if (state.menuId) {
      store.commit('SET_MENU_ID', state.menuId)
    }
  }, true)
  render(props)
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  if (instance) {
    instance.$destroy();
    instance = null;
  }
  await store.dispatch('tagsView/delAllViews')
  console.log('应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例', props)
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log('update props', props);
}

