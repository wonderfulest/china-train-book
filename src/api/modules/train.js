import request from '../request'

// 获取所有车站信息
export const getAllCity = () => {
  return request({
    url: '/train/getAllCity',
    method: 'post',
    data: {}
  })
}

// 获取热门城市
export const getHotCity = () => {
  return request({
    url: '/train/getHotCity',
    method: 'post',
    data: {}
  })
}

// 获取车票列表
export const getTicketList = (params) => {
  return request({
    url: '/train/getTicketList',
    method: 'post',
    data: {
      FromStationCode: params.fromStationCode,
      ToStationCode: params.toStationCode,
      FromDate: params.fromDate,
      IsStudent: params.isStudent ?? false
    }
  })
}
