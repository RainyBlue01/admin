import request from '@/utils/request'

// 游记列表查询
export function TravelPage(inf) {
  return request({
    method: 'post',
    url: 'travel/page',
    data: inf
  })
}
// 批量删除
export function TravelBatchDelete(inf) {
  return request({
    method: 'delete',
    url: 'travel/batchDelete',
    data: inf
  })
}
// 游记发布保存
export function TravelSave(inf) {
  return request({
    method: 'post',
    url: 'travel/save',
    data: inf
  })
}
// 游记状态修改
export function TravelStatus(inf) {
  return request({
    method: 'post',
    url: 'travel/status',
    data: inf
  })
}
// 游记编辑更新
export function TravelUpdate(inf) {
  return request({
    method: 'post',
    url: 'travel/update',
    data: inf
  })
}
