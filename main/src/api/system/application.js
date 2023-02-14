import request from '@/utils/request'

// 系统下拉接口 /portal-user/biz-system/draw-down
export function systemDrawDown (params) {
  return request({
    url: '/portal-user/biz-system/draw-down',
    method: 'get',
    params
  })
}
// 获取业务系统树结构
export function systemTree (params) {
  return request({
    url: '/portal-user/biz-system/tree/',
    method: 'get',
    params
  })
}

// 查询应用管理列表
export function listSystem (params) {
  return request({
    url: '/portal-user/biz-system/list',
    method: 'get',
    params
  })
}

// 新增/编辑应用管理,有id修改,无id添加
export function saveSystem (data) {
  return request({
    url: '/portal-user/biz-system/save',
    method: 'post',
    data
  })
}

// 删除应用管理
export function delSystem (systemId) {
  return request({
    url: '/portal-user/biz-system/delete/' + systemId,
    method: 'delete'
  })
}