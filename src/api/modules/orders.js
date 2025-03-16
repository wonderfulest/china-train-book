import request from "../request";

// 获取订单详情
export const getOrderById = (orderId) => {
  return request({
    url: `/orders/${orderId}`,
    method: 'get'
  });
};

// 查询订单
export const getOrders = (bookingId, email) => {
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

// 2.获取订单时刻表
export const getOrderTimetable = (orderId, params) => {
  return request({
    url: `/orders/${orderId}/timetable`,
    method: 'post',
    data: params || {}
  })
}

// 2.更新订单的车次和座位选择
export const updateOrderTrainSeat = (orderId, trainSeatData) => {
  return request({
    url: `/orders/${orderId}/trainSeat`,
    method: 'post',
    data: {
      orderId: orderId,
      step: 2,
      trainNo: trainSeatData.trainNo,
      from: trainSeatData.from,
      to: trainSeatData.to,
      date: trainSeatData.date,
      departTime: trainSeatData.departTime,
      arriveTime: trainSeatData.arriveTime,
      seatType: trainSeatData.seatType,
      seatPriceRaw: trainSeatData.seatPriceRaw,
      seatPrice: trainSeatData.seatPrice,
      seatFee: trainSeatData.seatFee,
      seatPriceTotal: trainSeatData.seatPriceTotal
    }
  });
};

// 3.更新订单乘客信息
export const updateOrderPassengers = (orderId, passengerData) => {
  return request({
    url: `/orders/${orderId}/passengers`,
    method: 'post',
    data: passengerData
  });
};

// 4.完成订单支付
export const paymentCallback = (orderId, paymentMethod, paymentId, details) => {
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

