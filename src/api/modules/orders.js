import request from '../request'

export const submitBooking = (bookForm) => {
  return request({
    url: '/booking/create',
    method: 'post',
    data: bookForm
  })
}
