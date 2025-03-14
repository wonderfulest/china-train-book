import { defineStore } from 'pinia'

export const usePassengerStore = defineStore('passenger', {
  state: () => ({
    passengers: [],
    historicalPassengers: []
  }),

  actions: {
    addPassenger(passenger) {
      this.passengers.push({
        id: this.passengers.length + 1,
        ...passenger
      })
      // 检查是否已存在于历史记录中
      const exists = this.historicalPassengers.some(
        p => p.passportNumber === passenger.passportNumber
      )
      if (!exists) {
        this.historicalPassengers.push({
          id: this.historicalPassengers.length + 1,
          ...passenger
        })
      }
    },

    updatePassenger(index, passenger) {
      this.passengers[index] = { 
        ...this.passengers[index],
        ...passenger 
      }
      // 更新历史记录中的乘客信息
      const historicalIndex = this.historicalPassengers.findIndex(
        p => p.passportNumber === passenger.passportNumber
      )
      if (historicalIndex !== -1) {
        this.historicalPassengers[historicalIndex] = {
          ...this.historicalPassengers[historicalIndex],
          ...passenger
        }
      }
    },

    removePassenger(index) {
      if (index >= 0 && index < this.passengers.length) {
        this.passengers.splice(index, 1)
        return true
      }
      return false
    },

    removeHistoricalPassenger(id) {
      const index = this.historicalPassengers.findIndex(p => p.id === id)
      if (index !== -1) {
        this.historicalPassengers.splice(index, 1)
        return true
      }
      return false
    },

    clearPassengers() {
      this.passengers = []
    }
  },

  persist: {
    key: 'train-booking-passengers',
    storage: localStorage,
    paths: ['historicalPassengers'] // 只持久化历史乘客数据
  }
})
