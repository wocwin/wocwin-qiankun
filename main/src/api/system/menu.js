import request from '@/utils/request'


// 查询菜单下拉树结构
export function menuTreeselect (params) {
  return request({
    url: '/portal-user/system/menu/treeselect',
    method: 'get',
    params
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect (params) {
  return request({
    url: '/portal-user/system/menu/roleMenuTreeselect',
    method: 'get',
    params
  })
}

// 查询菜单列表
export function listMenu (query) {
  return request({
    url: '/portal-user/system/menu/list',
    method: 'get',
    params: query
  })
}
// 获取子应用
export function getAllAppList () {
  return request({
    url: '/portal-user/sys/micro/list-for-menu',
    method: 'get'
  })
}

// 获取应用已分组下拉项
export function listAppGrouped () {
  return request({
    url: '/portal-user/sys/micro/list-app-grouped',
    method: 'get'
  })
}

// 新增菜单
export function addMenu (data) {
  return request({
    url: '/portal-user/system/menu',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu (data) {
  return request({
    url: '/portal-user/system/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu (menuId) {
  return request({
    url: '/portal-user/system/menu/' + menuId,
    method: 'delete'
  })
}


// 查询菜单详细
export function getMenu (menuId) {
  return request({
    url: '/portal-user/system/menu/' + menuId,
    method: 'get'
  })
}

// 导出菜单(parentId==menuId)
export function exportMenu (parentId) {
  return request({
    url: '/portal-user/data/export/Menu/' + parentId,
    method: 'get'
  })
}

// 同步菜单-新增和更新(导入)
export function importMenu (data) {
  return request({
    url: '/portal-user/data/import/addChangeMenu',
    method: 'put',
    data
  })
}
