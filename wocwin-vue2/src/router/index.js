import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
import login from '@/views/login.vue'
import redirect from '@/views/redirect.vue'

/**
 * 静态模块路由
 */
// import commonRouter from './modules/common' // 常用组件
// import TTableRouter from './modules/TTable' // TTable组件
// import TFormRouter from './modules/TForm' // TForm组件
// import TQueryConditionRouter from './modules/TQuery' // 条件查询组件
import mapRouter from './modules/map' // 地图路由
// import complexRouter from './modules/complex' // 组合组件路由

Vue.use(Router)

// 公共路由
export const constantRoutes = window.__POWERED_BY_QIANKUN__
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
				}
			]
		},
		// mapRouter,
		// complexRouter,
		// commonRouter,
		// TTableRouter,
		// TFormRouter,
		// TQueryConditionRouter
	]
	: [
		{
			path: '/redirect',
			component: Layout,
			hidden: true,
			children: [
				{
					path: '/redirect/:path(.*)',
					component: () => import('@/views/redirect')
				}
			]
		},
		{
			path: '/login',
			component: () => import('@/views/login'),
			hidden: true
		},
		{
			path: '/404',
			component: () => import('@/views/error/404'),
			hidden: true
		},
		{
			path: '/401',
			component: () => import('@/views/error/401'),
			hidden: true
		},
		// mapRouter,
		// complexRouter,
		// commonRouter,
		// TTableRouter,
		// TFormRouter,
		// TQueryConditionRouter
	]

const router = new Router({
	base: '/wocwin-vue2/',
	routes: constantRoutes,
	mode: 'history'
})
export default router
