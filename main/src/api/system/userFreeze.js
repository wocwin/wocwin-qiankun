import request from '@/utils/request'

// 获取冻结用户
export function getFrozenUsers (params) {
  return request({
    url: '/portal-sso/web/frozen-users',
    method: 'get',
    params
  })
}
// 解冻
export function unFreezeUser (username) {
  return request({
    url: `/portal-sso/web/release/${username}`,
    method: 'post',
  })
}