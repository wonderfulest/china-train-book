import { defineStore } from 'pinia'
import { onMounted } from 'vue'
import {getExchangeRate} from '@/api/modules/exchange'
// 定义所有支持的货币及其符号
const CURRENCY_SYMBOLS = {
  USD: '$',
  // CNY: '¥',
  // EUR: '€',
  // SGD: 'S$',
  // JPY: '¥'
}

// 汇率数据
const exchangeRates = {
  CNY: 1,
  USD: 0.14,
  // EUR: 0.13,
  // SGD: 0.19,
  // JPY: 20.85,
};

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currency: 'USD',
  }),
  
  getters: {
    currencySymbol: (state) => CURRENCY_SYMBOLS[state.currency] || '',
    
    // 支持的货币列表
    supportedCurrencies: () => {
      return Object.keys(CURRENCY_SYMBOLS).map(code => ({
        code,
        symbol: CURRENCY_SYMBOLS[code],
        label: `${code} (${CURRENCY_SYMBOLS[code]})`
      }))
    },
  },
  
  actions: {
    setCurrency(newCurrency) {
      if (CURRENCY_SYMBOLS[newCurrency]) {
        this.currency = newCurrency
        // 保存到本地存储，以便页面刷新后保持选择
        localStorage.setItem('selected-currency', newCurrency)
      }
    },
    
    convertPrice(cnyPrice) {
      if (!exchangeRates || !cnyPrice) return 0;
      const targetCurrency = this.currency;
      const rate = exchangeRates[targetCurrency];
      if (!rate) return 0;
      const convertedPrice = parseFloat(cnyPrice) * rate;
      return Math.ceil(convertedPrice); // 向上取整到整数
    },
    async fetchExchangeRates() {
      if (this.currency === 'CNY') return 1;
      const response = await getExchangeRate('CNY', this.currency)
      exchangeRates[this.currency] = +response.data.exchangeRate.exchangeRate
    },
    async initialize() {
      const savedCurrency = localStorage.getItem('selected-currency')
      if (savedCurrency && CURRENCY_SYMBOLS[savedCurrency]) {
        this.currency = savedCurrency
      }
      await this.fetchExchangeRates()
    }
  }
})

// ** 挂载时自动初始化 **
onMounted(async () => {
  const store = useCurrencyStore();
  await store.initialize();
});