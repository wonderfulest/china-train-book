import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: []
  }),

  actions: {
    createOrder(orderData) {
      const order = {
        id: Date.now(),
        status: 'Pending', // Pending, Confirmed, Cancelled
        createdAt: new Date().toISOString(),
        ...orderData
      }
      this.orders.unshift(order) // 新订单添加到列表开头
      return order
    },

    updateOrderStatus(orderId, status) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = status
      }
    },

    removeOrder(orderId) {
      const index = this.orders.findIndex(o => o.id === orderId)
      if (index !== -1) {
        this.orders.splice(index, 1)
      }
    },

    getOrderById(orderId) {
      return this.orders.find(o => o.id === orderId)
    }
  },

  persist: {
    key: 'train-booking-orders',
    storage: localStorage
  }
})
