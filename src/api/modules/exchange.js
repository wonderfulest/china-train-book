import request from '../request'

export function getExchangeRate(fromCurrency, toCurrency) {
  return request({
    url: '/exchange-rate',
    method: 'get',
    params: {
      fromCurrency,
      toCurrency
    }
  })
}
