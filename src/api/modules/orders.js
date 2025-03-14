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

// 获取订单详情
export const getOrderById = (orderId) => {
  return request({
    url: `/orders/${orderId}`,
    method: 'get'
  });
};

// 更新订单乘客信息
export const updateOrderPassengers = (orderId, passengerData) => {
  return request({
    url: `/orders/${orderId}/passengers`,
    method: 'post',
    data: passengerData
  });
};

// 完成订单支付
export const completePayment = (orderId, paymentMethod, paymentId, details) => {
  return request({
    url: `/orders/${orderId}/payment/complete`,
    method: 'post',
    data: {
      paymentMethod,
      paymentId,
      details
    }
  });
};

// 支付回调
export const paymentCallback = (bookingId) => {
  return request({
    url: "/booking/payment/callback",
    method: "post",
    params: { bookingId },
  });
};




// 废弃

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
      url: `/orders/${bookingId}`,
      method: "get"
    });
  }
  if (email) {
    return request({
      url: "/orders",
      method: "get",
      params: {
        email
      }
    });
  }
  return null;
};
