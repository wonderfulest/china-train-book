import request from '../request'

export const submitBooking = (bookForm) => {
  return request({
    url: '/booking/create',
    method: 'post',
    data: bookForm
  })
}

export const getBooking = (bookingId) => {
  return request({
    url: '/booking/get',
    method: 'get',
    params: { bookingId }
  })
}

export const paymentCallback = (bookingId) => {
  return request({
    url: '/booking/payment/callback',
    method: 'post',
    params: { bookingId }
  })
}
