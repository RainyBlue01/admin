import request from '@/utils/request'

export function getRoadbookList(data) {
  return request({
    url: '/roadbook/list',
    method: 'post',
    data
  })
}

export function saveRoadbook(data) {
  return request({
    url: '/roadbook/save',
    method: 'post',
    data
  })
}

export function updateRoadbook(data) {
  return request({
    url: '/roadbook/update',
    method: 'post',
    data
  })
}

export function updateStatusRoadbook(id) {
  return request({
    url: '/roadbook/update-status/'+id,
    method: 'post'
  })
}

export function delRoadBook(id) {
  return request({
    url: '/roadbook/del/'+id,
    method: 'delete',
  })
}

