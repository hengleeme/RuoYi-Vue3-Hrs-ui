import request from '@/utils/request'

// 查询考勤结果上报列表
export function listReport(query) {
  return request({
    url: '/hrs/attendance/report/list',
    method: 'get',
    params: query
  })
}

// 查询考勤结果上报详细
export function getReport(reportId) {
  return request({
    url: '/hrs/attendance/report/' + reportId,
    method: 'get'
  })
}

// 新增考勤结果上报
export function addReport(data) {
  return request({
    url: '/hrs/attendance/report',
    method: 'post',
    data: data
  })
}

// 修改考勤结果上报
export function updateReport(data) {
  return request({
    url: '/hrs/attendance/report',
    method: 'put',
    data: data
  })
}

// 删除考勤结果上报
export function delReport(reportId) {
  return request({
    url: '/hrs/attendance/report/' + reportId,
    method: 'delete'
  })
}

// 导出考勤结果上报
export function exportReport(query) {
  return request({
    url: '/hrs/attendance/report/export',
    method: 'get',
    params: query
  })
} 