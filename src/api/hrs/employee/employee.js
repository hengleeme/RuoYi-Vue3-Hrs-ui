import request from '@/utils/request'

// 查询人员列表
export function listEmployee(query) {
  return request({
    url: '/hrs/employee/list',
    method: 'get',
    params: query
  })
}

// 查询人员详细
export function getEmployee(employeeId) {
  return request({
    url: '/hrs/employee/' + employeeId,
    method: 'get'
  })
}

// 新增人员
export function addEmployee(data) {
  return request({
    url: '/hrs/employee',
    method: 'post',
    data: data
  })
}

// 修改人员
export function updateEmployee(data) {
  return request({
    url: '/hrs/employee',
    method: 'put',
    data: data
  })
}

// 删除人员
export function delEmployee(employeeId) {
  return request({
    url: '/hrs/employee/' + employeeId,
    method: 'delete'
  })
}

// 导出人员
export function exportEmployee(query) {
  return request({
    url: '/hrs/employee/export',
    method: 'get',
    params: query
  })
}

// 根据工号查询人员
export function getEmployeeByNo(employeeNo) {
  return request({
    url: '/hrs/employee/no/' + employeeNo,
    method: 'get'
  })
}

// 根据身份证号查询人员
export function getEmployeeByIdCard(idCard) {
  return request({
    url: '/hrs/employee/idcard/' + idCard,
    method: 'get'
  })
}

// 更新工作年限
export function updateWorkYears(employeeId) {
  return request({
    url: '/hrs/employee/workyears/' + employeeId,
    method: 'put'
  })
}

// 批量更新工作年限
export function updateWorkYearsBatch() {
  return request({
    url: '/hrs/employee/workyears/batch',
    method: 'put'
  })
} 