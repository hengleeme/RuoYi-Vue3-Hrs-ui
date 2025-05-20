import request from '@/utils/request'

export function listPersonnel(params) {
  return request({ url: '/hrs/personnel/list', method: 'get', params })
}
export function addPersonnel(data) {
  return request({ url: '/hrs/personnel/add', method: 'post', data })
}
export function updatePersonnel(id, data) {
  return request({ url: `/hrs/personnel/update/${id}`, method: 'put', data })
}
export function deletePersonnel(id) {
  return request({ url: `/hrs/personnel/delete/${id}`, method: 'delete' })
} 