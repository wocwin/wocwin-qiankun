import { constantRoutes } from '@/router'
import Layout from '@/layout/index'
import ViewBox from '@/views/viewBox/index'
import { Message } from 'element-ui'
import Notification from '@/utils/Notification'
import { removeToken } from '@/utils/auth'
import RoutersData from './getData/routersData.json'
const permission = {
  state: {
    routes: [],
    addRoutes: [],
    sysMenu: [],
    activeMenus: [],
    ssoMenu: [],
    isSocket: false,
    sessionId: null
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_MENU: (state, sysMenu) => {
      state.sysMenu = sysMenu
    },
    SET_IS_SOCKET(state, isSocket) {
      state.isSocket = isSocket
    },
    SET_SESSION_ID(state, sessionId) {
      state.sessionId = sessionId
    }
  },
  actions: {
    // 启动用户socket监听
    async setWebSocket({ commit, state }) {
      if (!state.isSocket) {
        await Notification()
        commit('SET_IS_SOCKET', true)
      }
    },
    async setSessionId({ commit }, sessionId) {
      commit('SET_SESSION_ID', sessionId)
    },
    // 生成系统路由和系统按钮权限
    GenerateRoutes({ commit }) {
      return new Promise((resolve) => {
        // 获取路由数据
        const routerRes = RoutersData
        console.log('routerRes', routerRes?.data)
        rebuildRouter(routerRes?.data)
        const newRouter = filterAsyncRouter(routerRes.data && routerRes.data[0].children, 1)
        // console.log('走了嘛生成系统路由', newRouter)
        // newRouter.length === 0 && Message.warning('您没有该系统的访问权限，请联系管理员')
        if (routerRes.data == null || newRouter.length === 0) {
          Message.warning('您没有该系统的访问权限，请联系管理员')
          removeToken()
          return
        }
        resolve(addRouter(commit, newRouter))
      })
    }
  }
}

function addRouter(commit, newRouter) {
  commit('SET_MENU', newRouter)
  const accessedRoutes = newRouter
  commit('SET_ROUTES', accessedRoutes)
  return accessedRoutes
}

function rebuildRouter(router, path = '') {
  if (router?.length) {
    for (let i = 0; i < router.length; i++) {
      if (router[i].hasOwnProperty('path')) {
        const reset = router[i].path.replace(/(^\/|\/$)/g, '')
        router[i].path = path == '/' ? (path + reset) : (path + '/' + reset)
      }
      if (router[i].hasOwnProperty('children') && router[i].children) {
        rebuildRouter(router[i].children, router[i].path)
      }
    }
  }
  return router
}
function filterAsyncRouter(asyncRouterMap, hier, systemIndex, moduleIndex) {
  if (!asyncRouterMap) return []
  return asyncRouterMap.reduce((acc, route, index) => {
    // 组织组件名称，用于缓存识别组件
    let name = 'no-name'
    if (route.path) {
      const pathNames = route.path.match(/\w+/g)
      if (pathNames) {
        if (pathNames[pathNames.length - 1] !== 'index') {
          name = pathNames[pathNames.length - 1].replace(/\w/, (str) => {
            return str.toUpperCase()
          })
        } else {
          name = pathNames[pathNames.length - 2].replace(/\w/, (str) => {
            return str.toUpperCase()
          })
        }
      }
    }
    if (route.menuType === 'M') {
      route.component = (hier === 1 && route.component !== 'bigScreen') ? Layout : ViewBox
      if (route.children && route.children.length > 0) {
        route.children = filterAsyncRouter(route.children, hier + 1, hier === 1 ? index : systemIndex, hier === 2 ? index : moduleIndex)
      }
    } else {
      // 如果是菜单,则匹配是否是微前端子应用激活路径,是的话则用ViewBox代替避免报错
      route.component = loadView(route.component)
      const appList = sessionStorage.getItem('appList')
      if (appList) {
        const apps = JSON.parse(appList)
        for (let i = 0; i < apps.length; i++) {
          if (route.path.indexOf(apps[i].activeRule) > -1) route.component = ViewBox
        }
      }
      if (route.children && route.children.length > 0) { // 菜单下隐藏子菜单
        const hideMenus = filterAsyncRouter(route.children, hier + 1, hier === 1 ? index : systemIndex, hier === 2 ? index : moduleIndex)
        hideMenus.forEach(menu => {
          menu.meta.activePath = route.path
        })
        acc = acc.concat(hideMenus)
      }
    }
    acc.push({
      name: name,
      hidden: route.hidden,
      domainVisible: route.domainVisible,
      path: route.path || '',
      children: (route.children && route.children.length > 0) ? route.children : null,
      meta: {
        title: route.meta.title,
        icon: route.meta.icon,
        visible: route.visible,
        systemIndex: [hier === 1 ? index : systemIndex, hier === 2 ? index : moduleIndex]
      },
      component: route.component
    })
    return acc
  }, [])
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission
