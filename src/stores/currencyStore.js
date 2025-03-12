import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 定义所有支持的货币及其符号
const CURRENCY_SYMBOLS = {
  USD: '$',
  CNY: '¥',
  EUR: '€',
  SGD: 'S$',
  JPY: '¥'
}

export const useCurrencyStore = defineStore('currency', () => {
  // 默认货币为美元
  const currency = ref('USD')
  
  // 获取当前货币符号
  const currencySymbol = computed(() => CURRENCY_SYMBOLS[currency.value] || '')
  
  // 获取所有支持的货币与符号
  const supportedCurrencies = computed(() => {
    return Object.keys(CURRENCY_SYMBOLS).map(code => ({
      code,
      symbol: CURRENCY_SYMBOLS[code],
      label: `${code} (${CURRENCY_SYMBOLS[code]})`
    }))
  })
  
  // 设置货币方法
  function setCurrency(newCurrency) {
    if (CURRENCY_SYMBOLS[newCurrency]) {
      currency.value = newCurrency
      // 保存到本地存储，以便页面刷新后保持选择
      localStorage.setItem('selected-currency', newCurrency)
    }
  }
  
  // 初始化：从本地存储加载先前选择的货币（如果有）
  function initialize() {
    const savedCurrency = localStorage.getItem('selected-currency')
    if (savedCurrency && CURRENCY_SYMBOLS[savedCurrency]) {
      currency.value = savedCurrency
    }
  }
  
  // 在创建store时初始化
  initialize()
  
  return {
    currency,
    currencySymbol,
    supportedCurrencies,
    setCurrency
  }
})
