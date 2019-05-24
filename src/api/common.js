import request from '@/utils/request'

// 获取文件上传签名

export function SignatureGET(pv) {
  return request({
    method: 'get',
    url: 'oss/upload/signature?fileName=' + pv
  })
}

export function getAllArea() {
  return request({
    method: 'get',
    url: 'area/list'
  })
}
