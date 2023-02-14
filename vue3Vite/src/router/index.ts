import { createRouter, createWebHistory } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import Layout from '@/layout/index.vue'
import login from '@/views/login.vue'

const Query = () => import('@/views/vitedemo/test/query/index.vue')
const TTable = () => import('@/views/vitedemo/test/table/index.vue')
const Test1 = () => import('@/views/vitedemo/test/test1/index.vue')

const Menu1 = () => import('@/views/vitedemo/menu/menu1/index.vue')
const Menu2 = () => import('@/views/vitedemo/menu/menu2/index.vue')

export const constantRoutes: any = qiankunWindow.__POWERED_BY_QIANKUN__
  ? [
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
      component: Layout,
      hidden: true,
      children: [
        {
          path: '/redirect/:path(.*)',
          component: () => import('@/views/redirect.vue')
        }
      ]
    },
    {
      path: '/',
      component: Layout,
      name: '基础组件',
      redirect: '/query',
      meta: {
        title: '基础组件',
        "icon":"monitor"
      },
      children: [
        {
          path: '/query',
          name: 'Query&TTable组件使用',
          component: Query,
          meta: { title: 'Query&TTable组件使用',icon:'#' }
        },
        {
          path: '/ttable',
          name: 'TTable组件使用',
          component: TTable,
          meta: { title: 'TTable组件使用',icon:'#' }
        },
        {
          path: '/test1',
          name: '调用接口使用',
          component: Test1,
          meta: { title: '调用接口使用' ,icon:'#'}
        },
      ]
    },
    {
      path: '/menu',
      name: '测试菜单',
      redirect: '/menu/menu1',
      component: Layout,
      meta: { title: '测试菜单' ,"icon":"example"},
      children: [
        {
          path: '/menu1',
          name: 'menu1',
          component: Menu1,
          meta: { title: 'menu1',icon:'#' }
        },
        {
          path: '/menu2',
          name: 'menu2',
          component: Menu2,
          meta: { title: 'menu2',icon:'#' }
        }
      ]
    },
  ]
  : [
    {
      path: '/redirect',
      component: Layout,
      hidden: true,
      children: [
        {
          path: '/redirect/:path(.*)',
          component: () => import('@/views/redirect.vue')
        }
      ]
    },
    {
      path: '/login',
      component: login,
      hidden: true,
      meta: {
        noCache: true
      }
    },
    {
      path: '/404',
      component: () => import('@/views/error/404.vue'),
      hidden: true
    },
    {
      path: '/401',
      component: () => import('@/views/error/401.vue'),
      hidden: true
    },
    {
      path: '/',
      component: Layout,
      name: '基础组件',
      redirect: '/query',
      meta: {
        title: '基础组件',
        "icon":"monitor"
      },
      children: [
        {
          path: '/query',
          name: 'Query&TTable组件使用',
          component: Query,
          meta: { title: 'Query&TTable组件使用',icon:'#' }
        },
        {
          path: '/ttable',
          name: 'TTable组件使用',
          component: TTable,
          meta: { title: 'TTable组件使用',icon:'#' }
        },
        {
          path: '/test1',
          name: '调用接口使用',
          component: Test1,
          meta: { title: '调用接口使用' ,icon:'#'}
        },
      ]
    },
    {
      path: '/menu',
      name: '测试菜单',
      redirect: '/menu/menu1',
      component: Layout,
      meta: { title: '测试菜单' ,"icon":"example"},
      children: [
        {
          path: '/menu1',
          name: 'menu1',
          component: Menu1,
          meta: { title: 'menu1',icon:'#' }
        },
        {
          path: '/menu2',
          name: 'menu2',
          component: Menu2,
          meta: { title: 'menu2',icon:'#' }
        }
      ]
    },
  ]

const router = createRouter({
  history: createWebHistory('/app-vue3vite/'),
  routes: constantRoutes,
})
export default router
