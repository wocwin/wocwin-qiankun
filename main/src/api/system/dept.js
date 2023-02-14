import request from '@/utils/request'



// 查询部门下拉树结构
export function treeselect () {
  return request({
    url: '/portal-user/system/dept/treeselect',
    method: 'get'
  })
}
// 查询部门列表
export function listDept (query) {
  return request({
    url: '/portal-user/system/dept/list',
    method: 'get',
    params: query
  })
}

// 新增部门
export function addDept (data) {
  return request({
    url: '/portal-user/system/dept',
    method: 'post',
    data
  })
}

// 修改部门
export function updateDept (data) {
  return request({
    url: '/portal-user/system/dept',
    method: 'put',
    data
  })
}
// 删除部门
export function delDept (deptId) {
  return request({
    url: '/portal-user/system/dept/' + deptId,
    method: 'delete'
  })
}

// 获取所有绑定菜单
export function getAllSystemList () {
  return request({
    url: '/portal-user/system/menu/listAllSystems',
    method: 'get'
  })
}




// 查询部门详细
export function getDept (deptId) {
  return request({
    url: '/portal-user/system/dept/' + deptId,
    method: 'get'
  })
}


// 根据角色ID查询部门树结构
export function roleDeptTreeselect (roleId) {
  return request({
    url: '/portal-user/system/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}

// 查询车间类型下拉菜单
export function listWorkshopType (query) {
  return request({
    url: '/portal-user/system/dept/listWorkshopType',
    method: 'get',
    params: query
  })
}

// 下载导入部门模板
export function downloadDeptTemplate () {
  return request({
    url: `/portal-user/system/dept/download/template`,
    method: 'get',
    responseType: 'blob',
  })
}

// 导入部门信息
export function importDeptExcel (data) {
  return request({
    url: '/portal-user/system/dept/import',
    method: 'put',
    data
  })
}

// 导出部门信息
export function exportDeptExcel (params) {
  return request({
    url: '/portal-user/system/dept/export',
    method: 'get',
    params
  })
}
