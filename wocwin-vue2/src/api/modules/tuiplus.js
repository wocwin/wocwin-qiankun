import request from '@/utils/request'

// 下拉选择表格接口数据
export function getSelectTableList(params) {
	return request({
		url: '/tui/getSelectTableList',
		method: 'get',
		params
	})
}

// 级联接口数据
export function getCascaderList(params) {
	return request({
		url: '/tui/getCascaderList',
		method: 'get',
		params
	})
}
// 用户编辑回显接口
export function editUser(params) {
	return request({
		url: '/sys/user/edit',
		method: 'get',
		params
	})
}
