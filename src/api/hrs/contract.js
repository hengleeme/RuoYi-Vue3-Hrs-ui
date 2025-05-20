import request from '@/utils/request'

export function listContract(params) {
  return request({ url: '/hrs/contract/list', method: 'get', params })
}
export function addContract(data) {
  return request({ url: '/hrs/contract/add', method: 'post', data })
}
export function updateContract(id, data) {
  return request({ url: `/hrs/contract/update/${id}`, method: 'put', data })
}
export function deleteContract(id) {
  return request({ url: `/hrs/contract/delete/${id}`, method: 'delete' })
} 