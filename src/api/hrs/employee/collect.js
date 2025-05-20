import request from '@/utils/request'

// 查询人员信息采集列表
export function listCollect(query) {
  return request({
    url: '/hrs/employee/collect/list',
    method: 'get',
    params: query
  })
}

// 查询人员信息采集详细
export function getCollect(collectId) {
  return request({
    url: '/hrs/employee/collect/' + collectId,
    method: 'get'
  })
}

// 新增人员信息采集
export function addCollect(data) {
  return request({
    url: '/hrs/employee/collect',
    method: 'post',
    data: data
  })
}

// 修改人员信息采集
export function updateCollect(data) {
  return request({
    url: '/hrs/employee/collect',
    method: 'put',
    data: data
  })
}

// 删除人员信息采集
export function delCollect(collectId) {
  return request({
    url: '/hrs/employee/collect/' + collectId,
    method: 'delete'
  })
}

// 导出人员信息采集
export function exportCollect(query) {
  return request({
    url: '/hrs/employee/collect/export',
    method: 'get',
    params: query
  })
}

// 审核人员信息采集
export function auditCollect(data) {
  return request({
    url: '/hrs/employee/collect/audit',
    method: 'post',
    data: data
  })
}

// 上传人员信息采集附件
export function uploadCollectFile(data) {
  return request({
    url: '/hrs/employee/collect/upload',
    method: 'post',
    data: data
  })
}

// 下载人员信息采集附件
export function downloadCollectFile(fileName) {
  return request({
    url: '/hrs/employee/collect/download/' + fileName,
    method: 'get'
  })
} 