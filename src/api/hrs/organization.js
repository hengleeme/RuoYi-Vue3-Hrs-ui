import request from '@/utils/request'

export function getOrgTree() {
  return request({ url: '/hrs/organization/tree', method: 'get' })
}
export function listOrganization(params) {
  return request({ url: '/hrs/organization/list', method: 'get', params })
}
export function addOrganization(data) {
  return request({ url: '/hrs/organization/add', method: 'post', data })
}
export function updateOrganization(id, data) {
  return request({ url: `/hrs/organization/update/${id}`, method: 'put', data })
}
export function deleteOrganization(id) {
  return request({ url: `/hrs/organization/delete/${id}`, method: 'delete' })
}
export function orgDropdown() {
  return request({ url: '/hrs/organization/dropdown', method: 'get' })
} 