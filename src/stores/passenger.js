import { defineStore } from 'pinia'

export const usePassengerStore = defineStore('passenger', {
  state: () => ({
    passengers: [],
    historicalPassengers: []
  }),

  actions: {
    addPassenger(passenger) {
      // 检查是否已存在于乘客列表中
      const exists = this.passengers.some(p => p.passportNumber === passenger.passportNumber)
      if (exists) {
        // 如果已存在，不添加, 更新
        console.log("Passenger already exists, updating...")
        this.updatePassenger(this.passengers.findIndex(p => p.passportNumber === passenger.passportNumber), passenger)
        return
      }
      
      this.passengers.push({
        id: this.passengers.length + 1,
        ...passenger
      })
      this.historicalPassengers.push({
        id: this.historicalPassengers.length + 1,
        ...passenger
      })
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
