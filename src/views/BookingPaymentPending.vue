<template>
  <div class="booking-payment">
    <div class="payment-card">
      <div class="header">
        <div class="order-info">
          <div class="order-id">Order ID: <span>{{ orderId }}</span></div>
          <div class="order-status">Order Status: <el-tag>{{ orderStatus }}</el-tag></div>
        </div>
      </div>

      <div class="train-orders">
        <div v-for="(order, index) in orders" :key="index" class="train-order">
          <div class="train-header">
            <div class="train-tag">Train {{ order.trainNo }}</div>
            <div class="train-date">{{ order.date }}</div>
          </div>

          <div class="train-route">
            <div class="station">
              <div class="name">{{ order.from }}</div>
              <div class="time">{{ order.departTime }}</div>
            </div>
            <div class="route-info">
              <div class="standing">Standing {{ order.standing }}</div>
              <div class="duration">{{ calculateDuration(order.departTime, order.arriveTime) }}</div>
            </div>
            <div class="station">
              <div class="name">{{ order.to }}</div>
              <div class="time">{{ order.arriveTime }}</div>
            </div>
          </div>

          <div class="passengers">
            <table class="passenger-table">
              <thead>
                <tr>
                  <th>A/C</th>
                  <th>Name</th>
                  <th>Passport Number</th>
                  <th>Country</th>
                  <th class="text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="passenger in order.passengers" :key="passenger.passportNumber">
                  <td>{{ passenger.type }}</td>
                  <td>{{ passenger.name }}</td>
                  <td>{{ passenger.passportNumber }}</td>
                  <td>{{ passenger.country }}</td>
                  <td class="text-right">{{ formatPrice(passenger.price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="preferences">
        <div class="preference-item">
          <div class="label">In case the selected tickets are not available, I would like to</div>
          <div class="value">{{ preferences.unavailable }}</div>
        </div>
        <div class="preference-item">
          <div class="label">Receive e-ticket by</div>
          <div class="value">{{ preferences.receiveMethod }}</div>
        </div>
      </div>

      <div class="contact-info">
        <h3>Contact Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>Name:</label>
            <span>{{ contact.title }} {{ contact.name }}</span>
          </div>
          <div class="info-item">
            <label>Email:</label>
            <span>{{ contact.email }}</span>
          </div>
          <div class="info-item">
            <label>Tel:</label>
            <span>{{ contact.phone }}</span>
          </div>
        </div>
      </div>

      <div class="price-summary">
        <div class="price-item">
          <span>Delivery fee:</span>
          <span>{{ formatPrice(prices.deliveryFee) }}</span>
        </div>
        <div class="price-item">
          <span>Refund Protect:</span>
          <span>{{ formatPrice(prices.refundProtect) }}</span>
        </div>
        <div class="price-item">
          <span>Transaction fee:</span>
          <span>{{ formatPrice(prices.transactionFee) }}</span>
        </div>
        <div class="price-item total">
          <span>Total Price:</span>
          <span>{{ formatPrice(prices.total) }}</span>
        </div>
      </div>

      <div class="actions">
        <el-button type="primary" size="large" @click="handlePayment">
          Pay {{ formatPrice(prices.total) }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 从路由参数获取订单ID
const orderId = ref('')

onMounted(() => {
  console.log('Route query:', route.query) // 添加调试日志
  const bookingId = route.query.bookingId
  if (!bookingId) {
    ElMessage.error('Invalid booking ID')
    router.push('/') // 如果没有订单ID，重定向到首页
    return
  }
  orderId.value = bookingId
})

const orderStatus = ref('Pending')

const orders = ref([
  {
    trainNo: 'K7731',
    date: 'Jan 29, 2025',
    from: 'Beijing Fengtai',
    to: 'Tianjin',
    departTime: '00:22',
    arriveTime: '02:05',
    standing: '1:43',
    passengers: [
      {
        type: 'Adult',
        name: '12, 222',
        passportNumber: '2222',
        country: 'AL',
        price: 10.50
      },
      {
        type: 'Adult',
        name: '111, 111',
        passportNumber: '111',
        country: 'AL',
        price: 10.50
      }
    ]
  },
  {
    trainNo: 'Z140',
    date: 'Jan 31, 2025',
    from: 'Tianjin west',
    to: 'Beijing',
    departTime: '03:18',
    arriveTime: '04:52',
    standing: '1:34',
    passengers: [
      {
        type: 'Adult',
        name: '12, 222',
        passportNumber: '2222',
        country: 'AF',
        price: 11.50
      },
      {
        type: 'Adult',
        name: '111, 111',
        passportNumber: '111',
        country: 'AL',
        price: 11.50
      }
    ]
  }
])

const preferences = ref({
  unavailable: 'upgrade to higher class',
  receiveMethod: 'email'
})

const contact = ref({
  title: 'Mr',
  name: '11',
  email: '11@qq.com',
  phone: '111'
})

const prices = ref({
  deliveryFee: 0.00,
  refundProtect: 24.18,
  transactionFee: 1.69,
  total: 49.87
})

// 计算行程时长
const calculateDuration = (departTime, arriveTime) => {
  const [departHour, departMinute] = departTime.split(':').map(Number)
  const [arriveHour, arriveMinute] = arriveTime.split(':').map(Number)
  
  let hours = arriveHour - departHour
  let minutes = arriveMinute - departMinute
  
  if (minutes < 0) {
    hours -= 1
    minutes += 60
  }
  
  return `${hours}:${minutes.toString().padStart(2, '0')}`
}

// 格式化价格
const formatPrice = (price) => {
  return `USD${price.toFixed(2)}`
}

// 处理支付
const handlePayment = () => {
  // TODO: 实现支付逻辑
  router.push('/payment')
}
</script>

<style scoped>
.booking-payment {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.payment-card {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.header {
  margin-bottom: 24px;
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

.order-id span {
  font-weight: 500;
  margin-left: 4px;
}

.train-orders {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.train-order {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.train-header {
  background: #f5f7fa;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.train-tag {
  background: #ff9f00;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.train-route {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
}

.station {
  flex: 1;
}

.station .name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.station .time {
  color: #606266;
}

.route-info {
  text-align: center;
  padding: 0 40px;
}

.standing {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.passengers {
  padding: 0 20px 20px;
}

.passenger-table {
  width: 100%;
  border-collapse: collapse;
}

.passenger-table th,
.passenger-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}

.text-right {
  text-align: right !important;
}

.preferences {
  margin: 24px 0;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.preference-item {
  margin-bottom: 12px;
}

.preference-item:last-child {
  margin-bottom: 0;
}

.preference-item .label {
  color: #606266;
  margin-bottom: 4px;
}

.preference-item .value {
  font-weight: 500;
}

.contact-info {
  margin: 24px 0;
}

.contact-info h3 {
  font-size: 16px;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item label {
  color: #606266;
  margin-right: 8px;
}

.price-summary {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #606266;
}

.price-item.total {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.actions {
  margin-top: 24px;
  text-align: center;
}

@media (max-width: 768px) {
  .payment-card {
    padding: 16px;
  }

  .train-route {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .route-info {
    padding: 16px 0;
  }

  .passenger-table {
    display: block;
    overflow-x: auto;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
