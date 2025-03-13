import request from "../request";


// 创建订单搜索
export const createOrderSearch = (params) => {
  return request({
    url: '/orders/search',
    method: 'post',
    data: {
      from: params.from,
      to: params.to,
      date: params.date,
      isStudent: params.isStudent ?? false
    }
  })
}

// 获取订单时刻表
export const getOrderTimetable = (orderId, params) => {
  return request({
    url: `/orders/${orderId}/timetable`,
    method: 'post',
    data: params || {}
  })
}


export const submitBooking = (bookForm) => {
  return request({
    url: "/booking/create",
    method: "post",
    data: bookForm,
  });
};

export const getBooking = (bookingId, email) => {
  if (bookingId) {
    return request({
      url: "/booking/get",
      method: "get",
      params: {
        bookingId,
      }
    });
  }
  if (email) {
    return request({
      url: "/booking/getByContact",
      method: "get",
      params: {
        email,
      }
    });
  }
  return null;
};

export const paymentCallback = (bookingId) => {
  return request({
    url: "/booking/payment/callback",
    method: "post",
    params: { bookingId },
  });
};
