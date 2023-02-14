import request from '@/utils/request'

// 加载配置
export function configLoad () {
  return request({
    url: '/portal-user/system/config/load',
    method: 'get'
  })
}
// 重置配置
export function resetConfig (data) {
  return request({
    url: '/portal-user/system/config/reset',
    method: 'post',
    data
  })
}

// 保存配置
export function addSysConfig (data) {
  return request({
    url: '/portal-user/system/config/update',
    method: 'post',
    data
  })
}

// 获取登录限制配置信息
export function loginRestriction () {
  return request({
    url: '/portal-user/system/config/login-restriction',
    method: 'get'
  })
}