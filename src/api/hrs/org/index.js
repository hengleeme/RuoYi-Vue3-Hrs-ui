import request from '@/utils/request'

// 查询组织规划列表
export function listOrganization(query) {
  return request({
    url: '/hrs/org/list',
    method: 'get',
    params: query
  })
}

// 查询组织规划详细
export function getOrganization(planId) {
  return request({
    url: '/hrs/org/' + planId,
    method: 'get'
  })
}

// 新增组织规划
export function addOrganization(data) {
  return request({
    url: '/hrs/org',
    method: 'post',
    data: data
  })
}

// 修改组织规划
export function updateOrganization(data) {
  return request({
    url: '/hrs/org',
    method: 'put',
    data: data
  })
}

// 删除组织规划
export function delOrganization(planId) {
  return request({
    url: '/hrs/org/' + planId,
    method: 'delete'
  })
}

// 导出组织规划
export function exportOrganization(query) {
  return request({
    url: '/hrs/org/export',
    method: 'post',
    params: query
  })
} 