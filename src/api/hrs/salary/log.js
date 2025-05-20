import request from '@/utils/request'

// 查询薪酬变更日志列表
export function listLog(query) {
  return request({
    url: '/hrs/salary/log/list',
    method: 'get',
    params: query
  })
}

// 查询薪酬变更日志详细
export function getLog(logId) {
  return request({
    url: '/hrs/salary/log/' + logId,
    method: 'get'
  })
}

// 新增薪酬变更日志
export function addLog(data) {
  return request({
    url: '/hrs/salary/log',
    method: 'post',
    data: data
  })
}

// 修改薪酬变更日志
export function updateLog(data) {
  return request({
    url: '/hrs/salary/log',
    method: 'put',
    data: data
  })
}

// 删除薪酬变更日志
export function delLog(logId) {
  return request({
    url: '/hrs/salary/log/' + logId,
    method: 'delete'
  })
}

// 导出薪酬变更日志
export function exportLog(query) {
  return request({
    url: '/hrs/salary/log/export',
    method: 'post',
    params: query
  })
} 