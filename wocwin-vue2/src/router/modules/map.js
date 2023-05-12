/** 地图 路由 **/

import Layout from '@/layout'
/* 定义component */
const circle = () => import('@/views/demo/map/circle')
const circlemarker = () => import('@/views/demo/map/circlemarker')
const geocoding = () => import('@/views/demo/map/geocoding')
const mapControl = () => import('@/views/demo/map/mapControl')
const map = () => import('@/views/demo/map')

const mapRouter = {
  path: '/',
  component: Layout,
  redirect: '/circle',
  name: '高德地图',
  meta: {
    title: '高德地图',
    icon: 'dict'
  },
  children: [
    {
      path: 'circle',
      name: '店面选址测算',
      component: circle,
      meta: { title: '店面选址测算' }
    },
    {
      path: 'circlemarker',
      name: '圆点标记',
      component: circlemarker,
      meta: { title: '圆点标记' },
    },
    {
      path: 'geocoding',
      name: '行政区选择',
      component: geocoding,
      meta: { title: '行政区选择' },
    },
    {
      path: 'mapControl',
      name: '地图控件',
      component: mapControl,
      meta: { title: '地图控件' }
    },
    {
      path: 'map',
      name: '常规操作',
      component: map,
      meta: { title: '常规操作' }
    }
  ]
}

export default mapRouter
