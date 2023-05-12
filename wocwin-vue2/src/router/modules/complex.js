/** 地图 路由 **/

import Layout from '@/layout'
/* 定义component */
const TAdaptivePage = () => import('@/views/demo/TAdaptivePage')
const singleEditCell = () => import('@/views/demo/singleEditCell')

const complexRouter = {
  path: '/complex',
  component: Layout,
  redirect: '/complex/TAdaptivePage',
  name: '组合案例',
  meta: {
    title: '组合案例',
    icon: 'skill'
  },
  children: [
    {
      path: 'TAdaptivePage',
      name: '页面一屏展示',
      component: TAdaptivePage,
      meta: { title: '页面一屏展示' }
    },
    {
      path: 'singleEditCell',
      name: '单元格编辑',
      component: singleEditCell,
      meta: { title: '单元格编辑' },
    }
  ]
}

export default complexRouter
