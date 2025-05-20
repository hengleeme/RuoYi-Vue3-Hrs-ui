import request from '@/utils/request'

// 查询人员综合信息列表
export function listSearch(query) {
  return request({
    url: '/hrs/employee/search/list',
    method: 'get',
    params: query
  })
}

// 导出人员综合信息
export function exportSearch(query) {
  return request({
    url: '/hrs/employee/search/export',
    method: 'get',
    params: query
  })
} 