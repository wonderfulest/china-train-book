import { defineStore } from 'pinia'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    steps: [
      { name: 'Search', path: '/' },
      { name: 'Timetable', path: '/trains/order/:orderId/timetable' },
      { name: 'Passengers', path: '/trains/order/:orderId/passengers' },
      { name: 'Payment', path: '/trains/order/:orderId/payment' },
    ],
    activeStep: 0,
    searchParams: null,
    orderId: null,
  }),
  actions: {
    setActiveStep(index) {
      console.log('Setting active step to:', index)
      this.activeStep = Math.max(0, Math.min(index, this.steps.length - 1))
    },
    setSearchParams(params) {
      this.searchParams = params
    },
    setOrderId(id) {
      this.orderId = id
    },
  }
})
