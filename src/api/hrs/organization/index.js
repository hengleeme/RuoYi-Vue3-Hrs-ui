import request from '@/utils/request'

// 查询组织规划列表
export function listOrganization(query) {
  return request({
    url: '/hrs/organization/list',
    method: 'get',
    params: query
  })
}

// 查询组织规划详细
export function getOrganization(orgId) {
  return request({
    url: '/hrs/organization/' + orgId,
    method: 'get'
  })
}

// 新增组织规划
export function addOrganization(data) {
  return request({
    url: '/hrs/organization',
    method: 'post',
    data: data
  })
}

// 修改组织规划
export function updateOrganization(data) {
  return request({
    url: '/hrs/organization',
    method: 'put',
    data: data
  })
}

// 删除组织规划
export function delOrganization(orgId) {
  return request({
    url: '/hrs/organization/' + orgId,
    method: 'delete'
  })
}

// 导出组织规划
export function exportOrganization(query) {
  return request({
    url: '/hrs/organization/export',
    method: 'get',
    params: query
  })
} 