import request from '@/utils/request'

// 获取数据范围
export function dataScope (params) {
  return request({
    url: '/portal-user/system/role/data-scope',
    method: 'get',
    params
  })
}

// 查询角色列表 /portal-user/system/role/data-scope
export function listRole (params) {
  return request({
    url: '/portal-user/system/role/list',
    method: 'get',
    params
  })
}


// 新增角色
export function addRole (data) {
  return request({
    url: '/portal-user/system/role',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole (data) {
  return request({
    url: '/portal-user/system/role',
    method: 'put',
    data: data
  })
}
// 角色状态修改
export function changeRoleStatus (data) {
  return request({
    url: '/portal-user/system/role/changeStatus',
    method: 'put',
    data
  })
}

// 删除角色
export function delRole (roleId) {
  return request({
    url: '/portal-user/system/role/' + roleId,
    method: 'delete'
  })
}
