import request from '@/utils/request'


// 查询微前端配置列表
export function listMicro (query) {
  return request({
    url: '/portal-user/sys/micro/list',
    method: 'get',
    params: query
  })
}

// 新增/编辑微前端配置,有id修改,无id添加
export function saveMicro (data) {
  return request({
    url: '/portal-user/sys/micro/save',
    method: 'post',
    data
  })
}

// 删除微前端配置
export function delMicro (appId) {
  return request({
    url: '/portal-user/sys/micro/delete/' + appId,
    method: 'delete'
  })
}

// 应用分组下拉列表（系统）
export function listAppGroup (params) {
  return request({
    url: '/portal-user/sys/micro/list-app-group',
    method: 'get',
    params
  })
}