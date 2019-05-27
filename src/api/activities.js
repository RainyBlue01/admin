import request from '@/utils/request'

// 所有城市页查询
export function AllCityGet() {
  return request({
    method: 'get',
    url: 'area/list'
  })
}
// 活动分页查询
export function ActivtiesGet(inf) {
  return request({
    method: 'post',
    url: 'active/page',
    data: inf
  })
}
// 活动删除
export function ActiveDel(inf) {
  return request({
    method: 'delete',
    url: 'active/del',
    data: inf
  })
}
// 活动状态修改
export function ActivePublish(inf) {
  return request({
    method: 'put',
    url: 'active/publish',
    data: inf
  })
}
// 活动状态修改
export function ActiveAdd(inf) {
  return request({
    method: 'post',
    url: 'active/add',
    data: inf
  })
}
// 活动详情查询
export function ActivtiesDetailsGet(id) {
  return request({
    method: 'post',
    url: 'active/getOne/' + id
  })
}
// 活动收藏状态查询
export function ActivtiesCollectStatusGet(id) {
  return request({
    method: 'post',
    url: 'active/getCollectStatus/' + id
  })
}
