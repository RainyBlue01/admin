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

export function updateStatusRoadbook(data) {
  return request({
    url: '/roadbook/update-status/',
    method: 'post',
    data
  })
}

export function delRoadBook(data) {
  return request({
    url: '/roadbook/del',
    method: 'delete',
    data
  })
}

export function getRoadBookDes(id) {
  return request({
    url: 'roadbook/detail/' + id,
    method: 'get'
  })
}
