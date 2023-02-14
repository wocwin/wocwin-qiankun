import request from '@/utils/request'


// 查询PDA录入列表
export function listPda (params) {
  return request({
    url: '/portal-user/system/pda/list',
    method: 'get',
    params
  })
}

// 新增PDA录入
export function savePda (data) {
  return request({
    url: '/portal-user/system/pda/save',
    method: 'post',
    data
  })
}

// 编辑PDA录入
export function editPda (data) {
  return request({
    url: '/portal-user/system/pda/edit',
    method: 'put',
    data
  })
}


// 切换状态PDA录入
export function changeStatusPda (data) {
  return request({
    url: '/portal-user/system/pda/switch-status',
    method: 'put',
    data
  })
}

// 删除PDA录入
export function delPda (ids) {
  return request({
    url: `/portal-user/system/pda/delete/${ids}`,
    method: 'delete'
  })
}

// 下载PDA录入模板
export function downloadTemplate () {
  return request({
    url: `/portal-user/system/pda/template/download`,
    method: 'get',
    responseType: 'blob',
  })
}

// 导入PDA设备信息
export function importExcel (data) {
  return request({
    url: '/portal-user/system/pda/import',
    method: 'put',
    data
  })
}

// 导出PDA录入信息
export function exportExcel (params) {
  return request({
    url: '/portal-user/system/pda/export',
    method: 'get',
    params
  })
}
