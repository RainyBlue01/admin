import request from '@/utils/request'

export function getScenicList(data) {
  return request({
    url: '/routes',
    method: 'post',
    data
  })
}

export function addScenic(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

