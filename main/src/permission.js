import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { getLastChild } from '@/utils/getLastChild'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { decrypt } from '@/utils/jsencrypt'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

// 检测是否满足强密码
function isPassword(password) {
  const reg = /^(?=.*?\d+.*?)(?=.*[A-z].*?)[\da-zA-Z\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]{6,20}$/
  return reg.test(password)
}
router.beforeEach(async (to, from, next) => {
  // 解决三级菜单页面缓存问题
  if (to.matched && to.matched.length > 1) {
    for (let i = 0; i < to.matched.length; i++) {
      const element = to.matched[i]
      if (element.components.default.name === 'ViewBox') {
        to.matched.splice(i, 1)
      }
    }
  }
  NProgress.start()
  const token = getToken()
  if (token) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // await store.dispatch('GetMicroApp')
      if (store.getters.permission_sysMenu.length === 0) { // 路由信息是不是组装完
        store.dispatch('GetInfo').then(res => {
          // 拉取user_info
          const roles = res.roles
          store.dispatch('GenerateRoutes', { roles }).then(accessRoutes => {
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            // console.log('我看看路由表', accessRoutes)
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        }).catch(err => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err.message || err.msg || '出现错误，请稍后再试')
            next({ path: '/' })
          })
        })
      } else {
        // 若当前用户只存在一个模块的权限且非大屏、或该模块为大屏且只有一个大屏时，直接进入该系统
        const add_routes = store.getters.permission_sysMenu
        if (to.path === '/' && (add_routes.length === 1 || (add_routes.length <= 1 && add_routes[0].children && add_routes[0].children.length === 1))) {
          const lastChild = getLastChild(add_routes[0])
          if (to.path === lastChild.path) return false
          // console.log('777', lastChild)
          // console.log('路由守卫', decrypt(localStorage.getItem('loginPassword')))
          if (isPassword(decrypt(localStorage.getItem('loginPassword')))) {
            next(lastChild)
          } else {
            next()
          }
          NProgress.done()
        } else {
          // console.log('主项目的next')
          next()
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach((to) => {
  // qiankun子应用跳转回主应用时判断#app是否还有渲染的子应用,如若没有则重新渲染主应用
  setTimeout(() => {
    if (to.path === '/') {
      if (window.wocwin_qiankun) {
        window.wocwin_qiankun.$destroy()
        window.wocwin_qiankun = null
      }
      window.wocwin_qiankun = new Vue({
        router,
        store,
        render: h => h(App)
      }).$mount('#app')
    }
  }, 300)
  if (!to.meta.noCache) { // 新增缓存tag
    store.dispatch('tagsView/addView', to)
  }
  NProgress.done()
})
