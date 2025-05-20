import request from '@/utils/request'

// 查询合同到期提醒列表
export function listReminder(query) {
  return request({
    url: '/hrs/contract/reminder/list',
    method: 'get',
    params: query
  })
}

// 查询合同到期提醒详细
export function getReminder(reminderId) {
  return request({
    url: '/hrs/contract/reminder/' + reminderId,
    method: 'get'
  })
}

// 新增合同到期提醒
export function addReminder(data) {
  return request({
    url: '/hrs/contract/reminder',
    method: 'post',
    data: data
  })
}

// 修改合同到期提醒
export function updateReminder(data) {
  return request({
    url: '/hrs/contract/reminder',
    method: 'put',
    data: data
  })
}

// 删除合同到期提醒
export function delReminder(reminderId) {
  return request({
    url: '/hrs/contract/reminder/' + reminderId,
    method: 'delete'
  })
}

// 导出合同到期提醒
export function exportReminder(query) {
  return request({
    url: '/hrs/contract/reminder/export',
    method: 'post',
    params: query
  })
}

// 查询合同的到期提醒
export function getContractReminders(contractId) {
  return request({
    url: '/hrs/contract/reminder/contract/' + contractId,
    method: 'get'
  })
}

// 查询未处理的提醒
export function getUnhandledReminders() {
  return request({
    url: '/hrs/contract/reminder/unhandled',
    method: 'get'
  })
} 