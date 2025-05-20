import request from '@/utils/request'

// 查询定薪调薪列表
export function listAdjust(query) {
  return request({
    url: '/hrs/salary/adjust/list',
    method: 'get',
    params: query
  })
}

// 查询定薪调薪详细
export function getAdjust(adjustId) {
  return request({
    url: '/hrs/salary/adjust/' + adjustId,
    method: 'get'
  })
}

// 新增定薪调薪
export function addAdjust(data) {
  return request({
    url: '/hrs/salary/adjust',
    method: 'post',
    data: data
  })
}

// 修改定薪调薪
export function updateAdjust(data) {
  return request({
    url: '/hrs/salary/adjust',
    method: 'put',
    data: data
  })
}

// 删除定薪调薪
export function delAdjust(adjustId) {
  return request({
    url: '/hrs/salary/adjust/' + adjustId,
    method: 'delete'
  })
}

// 导出定薪调薪
export function exportAdjust(query) {
  return request({
    url: '/hrs/salary/adjust/export',
    method: 'post',
    params: query
  })
}

// 提交定薪调薪
export function submitAdjust(adjustId) {
  return request({
    url: '/hrs/salary/adjust/submit/' + adjustId,
    method: 'put'
  })
}

// 审批定薪调薪
export function approveAdjust(data) {
  return request({
    url: '/hrs/salary/adjust/approve',
    method: 'put',
    data: data
  })
} 