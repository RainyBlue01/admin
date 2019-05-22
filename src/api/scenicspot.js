import request from '@/utils/request'

export function getScenicList(data) {
  return request({
    url: '/spot/query',
    method: 'post',
    data
  })
}


export function getScenicDes(id) {
  return request({
    url: '/spot/'+ id,
    method: 'get',
  })
}

export function addScenic(data) {
  return request({
    url: '/spot/add',
    method: 'post',
    data
  })
}

export function updateScenic(data) {
  return request({
    url: '/spot/update',
    method: 'post',
    data
  })
}

export function updateScenicStatus(data) {
  return request({
    url: '/spot/updateStatus',
    method: 'put',
    data
  })
}

export function delScenic(data) {
  return request({
    url: '/spot/delete',
    method: 'delete',
    data
  })
}

