import request from '@/utils/request'

// 查询教育背景列表
export function listEducation(query) {
  return request({
    url: '/hrs/employee/education/list',
    method: 'get',
    params: query
  })
}

// 查询教育背景详细
export function getEducation(educationId) {
  return request({
    url: '/hrs/employee/education/' + educationId,
    method: 'get'
  })
}

// 新增教育背景
export function addEducation(data) {
  return request({
    url: '/hrs/employee/education',
    method: 'post',
    data: data
  })
}

// 修改教育背景
export function updateEducation(data) {
  return request({
    url: '/hrs/employee/education',
    method: 'put',
    data: data
  })
}

// 删除教育背景
export function delEducation(educationId) {
  return request({
    url: '/hrs/employee/education/' + educationId,
    method: 'delete'
  })
}

// 导出教育背景
export function exportEducation(query) {
  return request({
    url: '/hrs/employee/education/export',
    method: 'get',
    params: query
  })
}

// 上传教育背景附件
export function uploadEducationFile(data) {
  return request({
    url: '/hrs/employee/education/upload',
    method: 'post',
    data: data
  })
}

// 下载教育背景附件
export function downloadEducationFile(fileName) {
  return request({
    url: '/hrs/employee/education/download/' + fileName,
    method: 'get'
  })
} 