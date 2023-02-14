import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import login from '@/views/login.vue'
import home from '@/views/index.vue'
import redirect from '@/views/redirect.vue'
/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = window.__POWERED_BY_QIANKUN__ ?
  [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: home,
    //   hidden: true,
    //   meta: {
    //     rootPage: true,
    //     noCache: true
    //   }
    // },
    {
      path: '/login',
      name: 'login',
      component: login,
      hidden: true,
      meta: {
        rootPage: true,
        noCache: true
      }
    },
    {
      path: '/redirect',
      name: 'redirect',
      component: Layout,
      hidden: true,
      children: [
        {
          path: ':path(.*)',
          name: 'redirectPage',
          component: redirect,
          meta: {
            noCache: true
          }
        },
      ]
    },
    {
      path: '/',
      component: Layout,
      redirect: '/base',
      // hidden: true,
      children: [
        {
          path: 'base',
          component: () => import('../views/demo/TTable/base.vue'),
          name: 'base',
          meta: { title: 'vue2常规模板', icon: 'monitor' }
        }
      ]
    }
  ] :
  [
    {
      path: '/redirect',
      component: Layout,
      hidden: true,
      children: [{
        path: '/redirect/:path(.*)',
        component: () =>
          import('@/views/redirect')
      }]
    },
    {
      path: '/login',
      component: () =>
        import('@/views/login'),
      hidden: true
    },
    {
      path: '/404',
      component: () =>
        import('@/views/error/404'),
      hidden: true
    },
    {
      path: '/401',
      component: () =>
        import('@/views/error/401'),
      hidden: true
    },
    {
      path: '/',
      component: Layout,
      redirect: '/base',
      // hidden: true,
      children: [
        {
          path: 'base',
          component: () => import('../views/demo/TTable/base.vue'),
          name: 'base',
          meta: { title: 'vue2常规模板', icon: 'monitor' }
        }
      ]
    }
  ]

const router = new Router({
  base: '/wocwin-qiankun/app-vue2/',
  routes: constantRoutes,
  mode: 'history'
})
export default router
