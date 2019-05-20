import request from '@/utils/request'

export function getCarouselList(data) {
  return request({
    url: '/routes',
    method: 'post',
    data
  })
}

export function updateCarousel(data) {
  return request({
    url: '/carousel/update',
    method: 'post',
    data
  })
}
