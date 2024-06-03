import axios from 'axios'
import { Notification, MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

export default function (config) {
	// 创建axios实例
	const service = axios.create({
		// axios中请求配置有baseURL选项，表示请求URL公共部分
		baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/api',
		// 超时 b
		timeout: 50000
	})

	// request拦截器
	service.interceptors.request.use(
		config => {
			// Do something before request is sentconfig.headers['Content-Type'] = 'application/json';
			getToken() && (config.headers['Authorization'] = getToken())
			config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json'
			// 8080
			if (config.type == 'file') {
				config.headers['content-type'] = 'application/multipart/form-data'
			} else if (config.type == 'form') {
				config.headers['Content-type'] = 'application/x-www-form-urlencoded'
			}
			if (config.method.toLowerCase() === 'get') {
				config.data = true
			}
			return config
		},
		error => {
			console.log(error)
			Promise.reject(error)
		}
	)

	// 响应拦截器
	service.interceptors.response.use(
		res => {
			const code = res.data.code
			if (code === 401) {
				MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
					confirmButtonText: '重新登录',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					store.dispatch('FedLogOut').then(() => {
						if (!window.__POWERED_BY_QIANKUN__) {
							// 为了重新实例化vue-router对象 避免bug
							location.reload()
						} else {
							window.location.href = '/'
						}
					})
				})
			} else if (code !== 200) {
				Notification.error({
					title: res.data.msg
				})
				return Promise.reject('error')
			} else {
				return res.data
			}
		},
		error => {
			console.log('err' + error)
			Message({
				message: error.message,
				type: 'error',
				duration: 5 * 1000
			})
			return Promise.reject(error)
		}
	)

	return service(config)
}

// export default service
