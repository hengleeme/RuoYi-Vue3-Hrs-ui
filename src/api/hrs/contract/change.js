import request from '@/utils/request'

// 查询合同变更记录列表
export function listChange(query) {
  return request({
    url: '/hrs/contract/change/list',
    method: 'get',
    params: query
  })
}

// 查询合同变更记录详细
export function getChange(changeId) {
  return request({
    url: '/hrs/contract/change/' + changeId,
    method: 'get'
  })
}

// 新增合同变更记录
export function addChange(data) {
  return request({
    url: '/hrs/contract/change',
    method: 'post',
    data: data
  })
}

// 修改合同变更记录
export function updateChange(data) {
  return request({
    url: '/hrs/contract/change',
    method: 'put',
    data: data
  })
}

// 删除合同变更记录
export function delChange(changeId) {
  return request({
    url: '/hrs/contract/change/' + changeId,
    method: 'delete'
  })
}

// 导出合同变更记录
export function exportChange(query) {
  return request({
    url: '/hrs/contract/change/export',
    method: 'post',
    params: query
  })
}

// 查询合同的变更记录
export function getContractChanges(contractId) {
  return request({
    url: '/hrs/contract/change/contract/' + contractId,
    method: 'get'
  })
} 