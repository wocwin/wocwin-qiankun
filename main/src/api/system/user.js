import request from '@/utils/request'

// 获取岗位数据/角色
export function getRoleData (params) {
  return request({
    url: '/portal-user/system/user/',
    method: 'get',
    params
  })
}
// 查询用户列表
export function listUser (params) {
  return request({
    url: '/portal-user/system/user/list',
    method: 'get',
    params
  })
}
// 用户状态修改
export function changeUserStatus (data) {
  return request({
    url: '/portal-user/system/user/changeStatus',
    method: 'put',
    data
  })
}

// 新增用户
export function addUser (data) {
  return request({
    url: '/portal-user/system/user',
    method: 'post',
    data
  })
}
// 修改用户
export function updateUser (data) {
  return request({
    url: '/portal-user/system/user',
    method: 'put',
    data
  })
}

// 获取用户信息
export function getUserInfo (id) {
  return request({
    url: `/portal-user/system/user/${id}`,
    method: 'get'
  })
}
// 删除用户
export function delUser (userId) {
  return request({
    url: '/portal-user/system/user/' + userId,
    method: 'delete'
  })
}

// 用户密码重置
export function resetUserPwd (data) {
  return request({
    url: '/portal-user/system/user/resetPwd',
    method: 'put',
    data
  })
}

// 修改密码
export function changePassword (data) {
  return request({
    url: '/portal-user/system/user/changePassword',
    method: 'put',
    data
  })
}
