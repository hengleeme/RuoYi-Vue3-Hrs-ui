import request from '@/utils/request'

// 查询工资信息列表
export function listSalary(query) {
  return request({
    url: '/hrs/salary/list',
    method: 'get',
    params: query
  })
}

// 查询工资信息详细
export function getSalary(salaryId) {
  return request({
    url: '/hrs/salary/' + salaryId,
    method: 'get'
  })
}

// 新增工资信息
export function addSalary(data) {
  return request({
    url: '/hrs/salary',
    method: 'post',
    data: data
  })
}

// 修改工资信息
export function updateSalary(data) {
  return request({
    url: '/hrs/salary',
    method: 'put',
    data: data
  })
}

// 删除工资信息
export function delSalary(salaryId) {
  return request({
    url: '/hrs/salary/' + salaryId,
    method: 'delete'
  })
}

// 导出工资信息
export function exportSalary(query) {
  return request({
    url: '/hrs/salary/export',
    method: 'post',
    params: query
  })
}

// 提交工资信息
export function submitSalary(salaryId) {
  return request({
    url: '/hrs/salary/submit/' + salaryId,
    method: 'put'
  })
}

// 审批工资信息
export function approveSalary(data) {
  return request({
    url: '/hrs/salary/approve',
    method: 'put',
    data: data
  })
}

// 发放工资信息
export function paySalary(salaryId) {
  return request({
    url: '/hrs/salary/pay/' + salaryId,
    method: 'put'
  })
} 