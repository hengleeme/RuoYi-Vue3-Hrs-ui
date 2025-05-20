import request from '@/utils/request'

// 查询合同类型列表
export function listType(query) {
  return request({
    url: '/hrs/contract/type/list',
    method: 'get',
    params: query
  })
}

// 查询合同类型详细
export function getType(typeId) {
  return request({
    url: '/hrs/contract/type/' + typeId,
    method: 'get'
  })
}

// 新增合同类型
export function addType(data) {
  return request({
    url: '/hrs/contract/type',
    method: 'post',
    data: data
  })
}

// 修改合同类型
export function updateType(data) {
  return request({
    url: '/hrs/contract/type',
    method: 'put',
    data: data
  })
}

// 删除合同类型
export function delType(typeId) {
  return request({
    url: '/hrs/contract/type/' + typeId,
    method: 'delete'
  })
}

// 导出合同类型
export function exportType(query) {
  return request({
    url: '/hrs/contract/type/export',
    method: 'get',
    params: query
  })
} 