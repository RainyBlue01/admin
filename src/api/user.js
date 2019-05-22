import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/login',
    method: 'post',
    data: params
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getUsers(data) {
  return request({
    url: '/set/getUsers',
    method: 'post',
    data
  })
}
