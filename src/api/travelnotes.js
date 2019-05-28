import request from '@/utils/request'

// 所有城市页查询
export function TravelPage() {
  return request({
    method: 'get',
    url: 'area/list'
  })
}
// 活动分页查询
export function TravelBatchDelete(inf) {
  return request({
    method: 'post',
    url: 'active/page',
    data: inf
  })
}
// 活动分页查询
export function TravelSave(inf) {
  return request({
    method: 'post',
    url: 'active/page',
    data: inf
  })
}
// 活动分页查询
export function TravelStatus(inf) {
  return request({
    method: 'post',
    url: 'active/page',
    data: inf
  })
}
// 活动分页查询
export function TravelUpdate(inf) {
  return request({
    method: 'post',
    url: 'active/page',
    data: inf
  })
}
