<template>
  <div class="my-bookings">
    <div class="search-section">
      <h1>My Bookings</h1>
      <div class="booking-search">
        <div class="search-form">
          <el-form :model="searchForm" @submit.prevent="searchBooking">
            <el-form-item label="Booking ID:">
              <el-input v-model="searchForm.bookingId" placeholder="Enter your booking ID" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchBooking" :loading="loading">
                <el-icon><Search /></el-icon> Search
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <div v-if="bookingData" class="booking-details">
      <div class="payment-card">
        <div class="header">
          <div class="order-info">
            <div class="order-id">Booking ID: <span>{{ bookingData.bookingId }}</span></div>
            <div class="order-status">Status: <el-tag>{{ bookingData.status }}</el-tag></div>
          </div>
        </div>

        <div class="train-orders">
          <div v-for="(order, index) in bookingData.orders" :key="index" class="train-order">
            <div class="train-header">
              <div class="train-tag">Train {{ order.trainNo }}</div>
              <div class="train-date">{{ formatDate(order.departTime) }}</div>
            </div>

            <div class="train-route">
              <div class="station">
                <div class="name">{{ order.from }}</div>
                <div class="time">{{ formatTime(order.departTime) }}</div>
              </div>
              <div class="route-info">
                <div class="standing">{{ order.seatType }}</div>
                <div class="duration">{{ calculateDuration(order.departTime, order.arriveTime) }}</div>
              </div>
              <div class="station">
                <div class="name">{{ order.to }}</div>
                <div class="time">{{ formatTime(order.arriveTime) }}</div>
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
                    <td>{{ passenger.surname }} {{ passenger.givenName }}</td>
                    <td>{{ passenger.passportNumber }}</td>
                    <td>{{ passenger.country }}</td>
                    <td class="text-right">{{ formatPrice(getPassengerPrice(order, passenger)) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="contact-info" v-if="bookingData.contactForm">
          <h3>Contact Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Name:</label>
              <span>{{ bookingData.contactForm.title }} {{ bookingData.contactForm.name }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ bookingData.contactForm.email }}</span>
            </div>
            <div class="info-item">
              <label>Tel:</label>
              <span>{{ bookingData.contactForm.phone }}</span>
            </div>
          </div>
        </div>

        <div class="price-summary" v-if="bookingData.orders && bookingData.orders[0]">
          <div class="price-item">
            <span>Ticket Price:</span>
            <span>{{ formatPrice(getTicketPrice(bookingData.orders[0])) }}</span>
          </div>
          <div class="price-item">
            <span>Service Fee:</span>
            <span>{{ formatPrice(getServiceFee(bookingData.orders[0])) }}</span>
          </div>
          <div class="price-item total">
            <span>Total Amount:</span>
            <span>{{ formatPrice(bookingData.orders[0].priceAmount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="searched" class="no-results">
      <el-empty description="No booking found with the provided ID" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getBooking } from '@/api/modules/orders'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const searchForm = ref({
  bookingId: ''
})

const loading = ref(false)
const searched = ref(false)
const bookingData = ref(null)

// 在组件挂载时检查 URL 参数
onMounted(() => {
  // 从 URL 参数中获取 bookingId
  const urlBookingId = route.query.bookingId
  
  if (urlBookingId) {
    // 如果 URL 中有 bookingId 参数，设置到表单并自动搜索
    searchForm.value.bookingId = urlBookingId
    searchBooking()
  }
})

const searchBooking = async () => {
  if (!searchForm.value.bookingId) {
    ElMessage.warning('Please enter a booking ID')
    return
  }

  loading.value = true
  searched.value = false
  bookingData.value = null

  try {
    console.log('Fetching booking data for ID:', searchForm.value.bookingId)
    const response = await getBooking(searchForm.value.bookingId)
    console.log('API Response:', response)

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch booking')
    }

    if (!response.data) {
      throw new Error('No booking found')
    }

    bookingData.value = response.data
    searched.value = true
    ElMessage.success('Booking found')
    console.log('Booking data set:', bookingData.value)
  } catch (error) {
    console.error('Error fetching booking:', error)
    ElMessage.error(error.message || 'Failed to fetch booking details')
    bookingData.value = null
    searched.value = true
  } finally {
    loading.value = false
    console.log('Search completed. Loading:', loading.value, 'Searched:', searched.value, 'Has data:', !!bookingData.value)
  }
}

const formatDate = (datetime) => {
  if (!datetime) return ''
  const date = new Date(datetime)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const formatTime = (datetime) => {
  if (!datetime) return ''
  const date = new Date(datetime)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

const calculateDuration = (departTime, arriveTime) => {
  if (!departTime || !arriveTime) return ''
  const start = new Date(departTime)
  const end = new Date(arriveTime)
  const diff = end - start
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

const formatPrice = (price) => {
  if (price === undefined || price === null) return '$0.00'
  return `$${Number(price).toFixed(2)}`
}

const getPassengerPrice = (order, passenger) => {
  try {
    const priceDetail = JSON.parse(order.priceDetail)
    if (passenger.type.toLowerCase() === 'adult') {
      return priceDetail.adult.price
    } else if (passenger.type.toLowerCase() === 'child') {
      return priceDetail.child.price
    }
    return 0
  } catch (e) {
    return 0
  }
}

const getTicketPrice = (order) => {
  try {
    const priceDetail = JSON.parse(order.priceDetail)
    return priceDetail.adult.total + priceDetail.child.total
  } catch (e) {
    return 0
  }
}

const getServiceFee = (order) => {
  try {
    const priceDetail = JSON.parse(order.priceDetail)
    return priceDetail.service.total
  } catch (e) {
    return 0
  }
}
</script>

<style scoped>
.my-bookings {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.search-section {
  max-width: 1000px;
  margin: 0 auto 24px;
}

.booking-search {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.search-form {
  max-width: 500px;
  margin: 0 auto;
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
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
  font-weight: 500;
  color: #303133;
}

.no-results {
  margin-top: 24px;
  text-align: center;
}
</style>
