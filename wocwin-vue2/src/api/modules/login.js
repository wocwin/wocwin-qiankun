import request from '@/utils/request'

// 登录方法
export function login(data) {
	return request({
		url: '/auth/login',
		method: 'POST',
		data
	})
}

// 获取当前登录用户所有按钮权限
export function getPermBtm() {
	return request({
		url: '/auth/buttons'
	})
}

// 获取user账号按钮权限
export function getUserPermBtm() {
	return request({
		url: '/auth/userButtons'
	})
}

// 获取用户详细信息
export function getInfo() {
	return request({
		url: '/userinfo',
		method: 'get'
	})
}

// 退出方法
export function logout() {
	return request({
		url: '/auth/logout',
		method: 'post'
	})
}

// 修改密码
export function updateUserPwd(data) {
	return request({
		url: '/auth/updateUserPwd',
		method: 'post',
		data
	})
}
// 获取路由
export function getRouters() {
	return request({
		url: '/menu/getRouters',
		method: 'get'
	})
}

// 获取user账号路由
export function getUserRouters() {
	return request({
		url: '/menu/getUserRouters',
		method: 'get'
	})
}
// 获取子应用父级path
export const getRouterPrefix = (menuId) => {
	return request({
		url: '/menu/routerPrefix',
		method: 'get',
		params: {
			menuId
		}
	})
}
// 获取子应用的menuId
export const getMenuId = (packageName) => {
	return request({
		url: `/getMenuId`,
		method: 'get',
		params: {
			packageName
		}
	})
}
