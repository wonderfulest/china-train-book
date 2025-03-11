import { defineStore } from 'pinia'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    steps: [
      { name: 'Search', path: '/trains/timetable' },
      { name: 'Timetable', path: '/booking/timetable' },
      { name: 'Passengers', path: '/booking/passengers' },
      { name: 'Payment', path: '/orders/pay' }
    ],
    activeStep: 0,
    searchParams: null
  }),
  actions: {
    setActiveStep(index) {
      this.activeStep = Math.max(0, Math.min(index, this.steps.length - 1))
    },
    setSearchParams(params) {
      this.searchParams = params
    }
  }
})
