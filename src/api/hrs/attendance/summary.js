import request from '@/utils/request'

// 查询考勤汇总列表
export function listSummary(query) {
  return request({
    url: '/hrs/attendance/summary/list',
    method: 'get',
    params: query
  })
}

// 查询考勤汇总详细
export function getSummary(summaryId) {
  return request({
    url: '/hrs/attendance/summary/' + summaryId,
    method: 'get'
  })
}

// 新增考勤汇总
export function addSummary(data) {
  return request({
    url: '/hrs/attendance/summary',
    method: 'post',
    data: data
  })
}

// 修改考勤汇总
export function updateSummary(data) {
  return request({
    url: '/hrs/attendance/summary',
    method: 'put',
    data: data
  })
}

// 删除考勤汇总
export function delSummary(summaryId) {
  return request({
    url: '/hrs/attendance/summary/' + summaryId,
    method: 'delete'
  })
}

// 导出考勤汇总
export function exportSummary(query) {
  return request({
    url: '/hrs/attendance/summary/export',
    method: 'post',
    params: query
  })
}

// 提交考勤汇总
export function submitSummary(summaryId) {
  return request({
    url: '/hrs/attendance/summary/submit/' + summaryId,
    method: 'put'
  })
}

// 审批考勤汇总
export function approveSummary(data) {
  return request({
    url: '/hrs/attendance/summary/approve',
    method: 'put',
    data: data
  })
} 