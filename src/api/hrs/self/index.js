import request from '@/utils/request'

// 查询员工自助服务列表
export function listSelfService(query) {
  return request({
    url: '/hrs/self/list',
    method: 'get',
    params: query
  })
}

// 查询员工自助服务详细
export function getSelfService(serviceId) {
  return request({
    url: '/hrs/self/' + serviceId,
    method: 'get'
  })
}

// 新增员工自助服务
export function addSelfService(data) {
  return request({
    url: '/hrs/self',
    method: 'post',
    data: data
  })
}

// 修改员工自助服务
export function updateSelfService(data) {
  return request({
    url: '/hrs/self',
    method: 'put',
    data: data
  })
}

// 删除员工自助服务
export function delSelfService(serviceId) {
  return request({
    url: '/hrs/self/' + serviceId,
    method: 'delete'
  })
}

// 导出员工自助服务
export function exportSelfService(query) {
  return request({
    url: '/hrs/self/export',
    method: 'post',
    params: query
  })
} 