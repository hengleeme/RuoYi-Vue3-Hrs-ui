import request from '@/utils/request'

// 查询考勤记录列表
export function listAttendance(query) {
  return request({
    url: '/hrs/attendance/list',
    method: 'get',
    params: query
  })
}

// 查询考勤记录详细
export function getAttendance(attendanceId) {
  return request({
    url: '/hrs/attendance/' + attendanceId,
    method: 'get'
  })
}

// 新增考勤记录
export function addAttendance(data) {
  return request({
    url: '/hrs/attendance',
    method: 'post',
    data: data
  })
}

// 修改考勤记录
export function updateAttendance(data) {
  return request({
    url: '/hrs/attendance',
    method: 'put',
    data: data
  })
}

// 删除考勤记录
export function delAttendance(attendanceId) {
  return request({
    url: '/hrs/attendance/' + attendanceId,
    method: 'delete'
  })
}

// 导出考勤记录
export function exportAttendance(query) {
  return request({
    url: '/hrs/attendance/export',
    method: 'post',
    params: query
  })
} 