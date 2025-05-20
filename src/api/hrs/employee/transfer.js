import request from '@/utils/request'

// 查询人员异动列表
export function listTransfer(query) {
  return request({
    url: '/hrs/employee/transfer/list',
    method: 'get',
    params: query
  })
}

// 查询人员异动详细
export function getTransfer(transferId) {
  return request({
    url: '/hrs/employee/transfer/' + transferId,
    method: 'get'
  })
}

// 新增人员异动
export function addTransfer(data) {
  return request({
    url: '/hrs/employee/transfer',
    method: 'post',
    data: data
  })
}

// 修改人员异动
export function updateTransfer(data) {
  return request({
    url: '/hrs/employee/transfer',
    method: 'put',
    data: data
  })
}

// 删除人员异动
export function delTransfer(transferId) {
  return request({
    url: '/hrs/employee/transfer/' + transferId,
    method: 'delete'
  })
}

// 导出人员异动
export function exportTransfer(query) {
  return request({
    url: '/hrs/employee/transfer/export',
    method: 'get',
    params: query
  })
}

// 审核人员异动
export function auditTransfer(data) {
  return request({
    url: '/hrs/employee/transfer/audit',
    method: 'put',
    data: data
  })
}

// 上传人员异动附件
export function uploadTransferFile(data) {
  return request({
    url: '/hrs/employee/transfer/upload',
    method: 'post',
    data: data
  })
}

// 下载人员异动附件
export function downloadTransferFile(fileName) {
  return request({
    url: '/hrs/employee/transfer/download/' + fileName,
    method: 'get'
  })
} 