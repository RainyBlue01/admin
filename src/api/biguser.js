import request from '@/utils/request'

export function getBigList() {
  return request({
    url: '/set/bigUserList',
    method: 'post'
  })
}

export function cancelTop(data) {
  return request({
    url: '/set/cancelTop',
    method: 'put',
    data
  })
}

export function setBigUser(data) {
  return request({
    url: '/set/saveBigUser',
    method: 'post',
    data
  })
}
export function setTop() {
  return request({
    url: '/set/setTop',
    method: 'post',
    data
  })
}


