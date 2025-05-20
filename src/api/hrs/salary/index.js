import request from '@/utils/request'

// 查询薪资列表
export function listSalary(query) {
  return request({
    url: '/hrs/salary/list',
    method: 'get',
    params: query
  })
}

// 查询薪资详细
export function getSalary(salaryId) {
  return request({
    url: '/hrs/salary/' + salaryId,
    method: 'get'
  })
}

// 新增薪资
export function addSalary(data) {
  return request({
    url: '/hrs/salary',
    method: 'post',
    data: data
  })
}

// 修改薪资
export function updateSalary(data) {
  return request({
    url: '/hrs/salary',
    method: 'put',
    data: data
  })
}

// 删除薪资
export function delSalary(salaryId) {
  return request({
    url: '/hrs/salary/' + salaryId,
    method: 'delete'
  })
}

// 导出薪资
export function exportSalary(query) {
  return request({
    url: '/hrs/salary/export',
    method: 'get',
    params: query
  })
} 