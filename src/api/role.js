import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles(data) {
  return request({
    url: '/role/page',
    method: 'get',
    data
  })
}

export function getUpdateRoles(id) {
  return request({
    url: `/role/getRole/${id}`,
    method: 'get',
  })
}

export function addRole(data) {
  return request({
    url: '/role/save',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'put',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/role/del',
    method: 'delete',
    data
  })
}

export function allocateRole(data) {
  return request({
    url: '/role/allocate',
    method: 'post',
    data
  })
}
