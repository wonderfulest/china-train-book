import Mock from 'mockjs'

Mock.setup({
  timeout: '100-600'  // 模拟网络延迟
})

Mock.mock('/api/exchange-rate', 'get', (options) => {
  const url = new URL('http://example.com' + options.url)
  const fromCurrency = url.searchParams.get('fromCurrency')
  const toCurrency = url.searchParams.get('toCurrency')

  if (fromCurrency === 'CNY' && toCurrency === 'USD') {
    return {
      code: '0',
      message: null,
      data: {
        exchangeRate: {
          fromCurrencyCode: 'CNY',
          fromCurrencyName: 'Chinese Yuan',
          toCurrencyCode: 'USD',
          toCurrencyName: 'United States Dollar',
          exchangeRate: '0.13810000',
          lastRefreshed: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
          timeZone: 'UTC',
          bidPrice: '0.13809000',
          askPrice: '0.13810000'
        }
      }
    }
  }
  
  return {
    code: '1',
    message: 'Unsupported currency pair',
    data: null
  }
})
