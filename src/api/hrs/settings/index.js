import request from '@/utils/request'

// 查询系统设置列表
export function listSettings(query) {
  return request({
    url: '/hrs/settings/list',
    method: 'get',
    params: query
  })
}

// 查询系统设置详细
export function getSettings(settingsId) {
  return request({
    url: '/hrs/settings/' + settingsId,
    method: 'get'
  })
}

// 新增系统设置
export function addSettings(data) {
  return request({
    url: '/hrs/settings',
    method: 'post',
    data: data
  })
}

// 修改系统设置
export function updateSettings(data) {
  return request({
    url: '/hrs/settings',
    method: 'put',
    data: data
  })
}

// 删除系统设置
export function delSettings(settingsId) {
  return request({
    url: '/hrs/settings/' + settingsId,
    method: 'delete'
  })
}

// 导出系统设置
export function exportSettings(query) {
  return request({
    url: '/hrs/settings/export',
    method: 'post',
    params: query
  })
} 