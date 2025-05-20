import request from '@/utils/request'

// 查询薪酬体系列表
export function listSystem(query) {
  return request({
    url: '/hrs/salary/system/list',
    method: 'get',
    params: query
  })
}

// 查询薪酬体系详细
export function getSystem(systemId) {
  return request({
    url: '/hrs/salary/system/' + systemId,
    method: 'get'
  })
}

// 新增薪酬体系
export function addSystem(data) {
  return request({
    url: '/hrs/salary/system',
    method: 'post',
    data: data
  })
}

// 修改薪酬体系
export function updateSystem(data) {
  return request({
    url: '/hrs/salary/system',
    method: 'put',
    data: data
  })
}

// 删除薪酬体系
export function delSystem(systemId) {
  return request({
    url: '/hrs/salary/system/' + systemId,
    method: 'delete'
  })
}

// 导出薪酬体系
export function exportSystem(query) {
  return request({
    url: '/hrs/salary/system/export',
    method: 'post',
    params: query
  })
} 