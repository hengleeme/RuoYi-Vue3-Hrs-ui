import request from '@/utils/request'

// 查询薪资标准列表
export function listStandard(query) {
  return request({
    url: '/hrs/salary/standard/list',
    method: 'get',
    params: query
  })
}

// 查询薪资标准详细
export function getStandard(standardId) {
  return request({
    url: '/hrs/salary/standard/' + standardId,
    method: 'get'
  })
}

// 新增薪资标准
export function addStandard(data) {
  return request({
    url: '/hrs/salary/standard',
    method: 'post',
    data: data
  })
}

// 修改薪资标准
export function updateStandard(data) {
  return request({
    url: '/hrs/salary/standard',
    method: 'put',
    data: data
  })
}

// 删除薪资标准
export function delStandard(standardId) {
  return request({
    url: '/hrs/salary/standard/' + standardId,
    method: 'delete'
  })
}

// 导出薪资标准
export function exportStandard(query) {
  return request({
    url: '/hrs/salary/standard/export',
    method: 'post',
    params: query
  })
} 