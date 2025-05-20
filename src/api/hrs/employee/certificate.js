import request from '@/utils/request'

// 查询资格证执业证列表
export function listCertificate(query) {
  return request({
    url: '/hrs/employee/certificate/list',
    method: 'get',
    params: query
  })
}

// 查询资格证执业证详细
export function getCertificate(certificateId) {
  return request({
    url: '/hrs/employee/certificate/' + certificateId,
    method: 'get'
  })
}

// 新增资格证执业证
export function addCertificate(data) {
  return request({
    url: '/hrs/employee/certificate',
    method: 'post',
    data: data
  })
}

// 修改资格证执业证
export function updateCertificate(data) {
  return request({
    url: '/hrs/employee/certificate',
    method: 'put',
    data: data
  })
}

// 删除资格证执业证
export function delCertificate(certificateId) {
  return request({
    url: '/hrs/employee/certificate/' + certificateId,
    method: 'delete'
  })
}

// 导出资格证执业证
export function exportCertificate(query) {
  return request({
    url: '/hrs/employee/certificate/export',
    method: 'get',
    params: query
  })
}

// 上传资格证执业证附件
export function uploadCertificateFile(data) {
  return request({
    url: '/hrs/employee/certificate/upload',
    method: 'post',
    data: data
  })
}

// 下载资格证执业证附件
export function downloadCertificateFile(fileName) {
  return request({
    url: '/hrs/employee/certificate/download/' + fileName,
    method: 'get'
  })
} 