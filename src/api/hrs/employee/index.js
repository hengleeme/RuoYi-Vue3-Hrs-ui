import request from '@/utils/request'

// 查询员工列表
export function listEmployee(query) {
  return request({
    url: '/hrs/employee/list',
    method: 'get',
    params: query
  })
}

// 查询员工详细
export function getEmployee(empId) {
  return request({
    url: '/hrs/employee/' + empId,
    method: 'get'
  })
}

// 新增员工
export function addEmployee(data) {
  return request({
    url: '/hrs/employee',
    method: 'post',
    data: data
  })
}

// 修改员工
export function updateEmployee(data) {
  return request({
    url: '/hrs/employee',
    method: 'put',
    data: data
  })
}

// 删除员工
export function delEmployee(empId) {
  return request({
    url: '/hrs/employee/' + empId,
    method: 'delete'
  })
}

// 导出员工
export function exportEmployee(query) {
  return request({
    url: '/hrs/employee/export',
    method: 'get',
    params: query
  })
} 