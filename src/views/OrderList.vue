<template>
  <div class="order-list">
    <div class="header">
      <h2>My Orders</h2>
    </div>

    <div v-if="orders.length === 0" class="empty-state">
      <el-empty description="No orders found" />
    </div>

    <div v-else class="orders">
      <div
        v-for="order in orders"
        :key="order.id"
        class="order-card"
      >
        <div class="train-header">
          <div class="train-number">Train {{ order.trainNo }}</div>
          <div class="train-date">{{ order.date }}</div>
          <div class="remove-link">
            <el-button type="danger" link @click="removeOrder(order.id)">Remove</el-button>
          </div>
        </div>

        <div class="train-route">
          <div class="station-info">
            <div class="station">
              <div class="name">{{ order.from }}</div>
              <div class="time">{{ order.departTime }}</div>
            </div>
            <div class="duration">
              <div class="seat-type">{{ order.seatType }}</div>
              <div class="time">{{ calculateDuration(order.departTime, order.arriveTime) }}</div>
            </div>
            <div class="station">
              <div class="name">{{ order.to }}</div>
              <div class="time">{{ order.arriveTime }}</div>
            </div>
          </div>
        </div>

        <div class="passenger-list">
          <div v-for="passenger in order.passengers" :key="passenger.passportNumber" class="passenger-item">
            <div class="passenger-type">{{ passenger.type }}</div>
            <div class="passenger-name">{{ passenger.surname }}, {{ passenger.givenName }}</div>
            <div class="passenger-passport">{{ passenger.passportNumber }}</div>
            <div class="passenger-country">{{ passenger.country }}</div>
            <div class="passenger-price">USD{{ calculatePassengerTotal(passenger) }}</div>
          </div>
        </div>

        <div class="order-summary">
          <div class="subtotal">
            Subtotal: USD{{ calculateOrderTotal(order) }}
          </div>
        </div>
      </div>
    </div>

    <div class="order-actions">
      <div class="action-buttons">
        <el-button type="primary" @click="addAnotherTrain">
          <el-icon><Plus /></el-icon>
          Add another train
        </el-button>
        <template v-if="!isAllTrainsAdded">
          <el-button type="success" @click="markAllTrainsAdded">
            All Trains are Added
          </el-button>
        </template>
      </div>
      <div class="booking-form" v-if="isAllTrainsAdded">
        <div class="form-grid">
          <div class="form-column">
            <div class="form-section">
              <h3>In case the selected tickets are not available, I would like to</h3>
              <el-radio-group v-model="unavailableOption">
                <div class="radio-item">
                  <el-radio value="upgrade">upgrade to higher class</el-radio>
                </div>
                <div class="radio-item">
                  <el-radio value="downgrade">downgrade to lower class</el-radio>
                </div>
                <div class="radio-item">
                  <el-radio value="switch">switch to an alternative train operating on a similar timetable within 1 hour</el-radio>
                </div>
                <div class="radio-item">
                  <el-radio value="cancel">cancel and refund</el-radio>
                </div>
              </el-radio-group>
            </div>

            <div class="form-section">
              <h3>Upgrade to refundable booking (recommended)</h3>
              <p class="upgrade-info">
                Upgrade your booking for USD9.26 and receive a FULL refund (USD97.50) if you cannot attend and can evidence one of the many reasons in our 
                <el-link type="primary" href="#" @click.prevent>Terms and Conditions</el-link>, 
                which you accept when you select a Refundable Booking. 
                <el-link type="primary" href="#" @click.prevent>See more</el-link>.
              </p>
              <el-radio-group v-model="refundableOption">
                <div class="radio-item">
                  <el-radio value="yes">
                    Yes, Upgrade my booking. (+USD9.26)
                    <el-tag size="small" type="danger" effect="light">recommended</el-tag>
                  </el-radio>
                </div>
                <div class="radio-item">
                  <el-radio value="no">No, keep my book non-refundable.</el-radio>
                </div>
              </el-radio-group>
            </div>
          </div>

          <div class="form-column">
            <div class="form-section">
              <h3>How to receive tickets?</h3>
              <el-radio-group v-model="receiveOption">
                <div class="radio-item">
                  <el-radio value="email">Receive e-ticket by email</el-radio>
                </div>
              </el-radio-group>
            </div>

            <div class="form-section contact-info">
              <h3>Contact Information</h3>
              <el-form :model="contactForm" label-position="top" :class="{ 'el-form--compact': true }">
                <el-form-item label="Name:" class="form-item-full">
                  <div class="name-input-group">
                    <el-select v-model="contactForm.title" class="title-select">
                      <el-option label="Mr" value="Mr" />
                      <el-option label="Ms" value="Ms" />
                      <el-option label="Mrs" value="Mrs" />
                    </el-select>
                    <el-input v-model="contactForm.name" placeholder="Enter your name" />
                  </div>
                </el-form-item>
                <el-form-item label="Email:" class="form-item-full">
                  <el-input v-model="contactForm.email" />
                </el-form-item>
                <el-form-item label="Confirm email:" class="form-item-full">
                  <el-input v-model="contactForm.confirmEmail" />
                </el-form-item>
                <el-form-item label="Tel / Mobile:" class="form-item-full">
                  <el-input v-model="contactForm.phone" />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>

        <div class="form-section terms">
          <el-checkbox v-model="agreeToTerms">
            I have read and agree to the 
            <el-link type="primary" href="#" @click.prevent>Terms and Conditions</el-link>
          </el-checkbox>
        </div>

        <div class="form-actions">
          <el-button type="primary" :disabled="!agreeToTerms" @click="bookNow">
            Book Now
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { submitBooking } from '@/api/modules/orders'

const router = useRouter()
const orderStore = useOrderStore()
const isAllTrainsAdded = ref(false)
const highlightedOrderId = ref(null)

// 获取所有订单
const orders = computed(() => orderStore.orders)

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

// 计算乘客总价（票价+服务费）
const calculatePassengerTotal = (passenger) => {
  const ticketPrice = passenger.price || 0
  const servicePrice = passenger.servicePrice || 0
  return (ticketPrice + servicePrice).toFixed(2)
}

// 计算订单总价
const calculateOrderTotal = (order) => {
  return order.passengers.reduce((total, passenger) => {
    return total + (passenger.price || 0) + (passenger.servicePrice || 0)
  }, 0).toFixed(2)
}

// 添加新车次
const addAnotherTrain = () => {
  router.push('/')
}

// 标记所有车次已添加
const markAllTrainsAdded = () => {
  isAllTrainsAdded.value = true
}

// 移除订单
const removeOrder = (orderId) => {
  orderStore.removeOrder(orderId)
  ElMessage.success('Order removed successfully')
  
  // 如果删除了所有订单，重置状态
  if (orders.value.length === 0) {
    isAllTrainsAdded.value = false
  }
}

const unavailableOption = ref('upgrade')
const refundableOption = ref('yes')
const receiveOption = ref('email')
const agreeToTerms = ref(false)
const contactForm = ref({
  title: 'Mr',
  name: '',
  email: '',
  confirmEmail: '',
  phone: ''
})

// 格式化时间为 yyyy-MM-dd HH:mm:ss
const formatDateTime = (date, time) => {
  try {
    if (!date || !time) return null

    // 验证日期格式
    if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(date)) {
      console.error('Invalid date format:', date)
      return null
    }

    // 验证时间格式
    if (!/^\d{1,2}:\d{1,2}$/.test(time)) {
      console.error('Invalid time format:', time)
      return null
    }

    const [year, month, day] = date.split('-').map(Number)
    const [hour, minute] = time.split(':').map(Number)

    // 验证数值范围
    if (month < 1 || month > 12 || day < 1 || day > 31 ||
        hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      console.error('Invalid date/time values:', { date, time })
      return null
    }

    // 格式化为指定格式
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`
  } catch (error) {
    console.error('Error formatting date/time:', error)
    return null
  }
}

// 提交订单
const bookNow = async () => {
  if (!agreeToTerms.value) {
    ElMessage.warning('Please agree to the Terms and Conditions')
    return
  }

  // 处理订单数据，转换时间格式
  const processedOrders = orders.value.map(order => {
    const departTime = formatDateTime(order.date, order.departTime)
    const arriveTime = formatDateTime(order.date, order.arriveTime)

    if (!departTime || !arriveTime) {
      throw new Error(`Invalid date/time format for order ${order.id}`)
    }

    // 为每个乘客添加价格信息
    const passengers = order.passengers.map(passenger => {
      const basePrice = passenger.type === 'Adult' ? 
        order.adultPrice : 
        order.childPrice

      return {
        ...passenger,
        price: basePrice,
        servicePrice: order.servicePrice
      }
    })

    return {
      trainNo: order.trainNo,
      from: order.from,
      to: order.to,
      departTime,
      arriveTime,
      passengers
    }
  })

  const bookForm = {
    orders: processedOrders,
    unavailableOption: unavailableOption.value,
    refundableOption: refundableOption.value,
    receiveOption: receiveOption.value,
    contact: {
      ...contactForm.value
    }
  }

  try {
    console.log('Submitting booking form:', JSON.stringify(bookForm))
    const response = await submitBooking(bookForm)
    
    console.log('Booking response:', response) // 添加日志
    const { success, message, data } = response
    
    if (success) {
      ElMessage.success('Booking submitted successfully')
      
      // 跳转到订单成功页面
      router.push({
        path: '/trains/pay/',
        query: {
          bookingId: data.bookingId // 使用 data 中的 bookingId
        }
      })

    } else {
      ElMessage.error(message || 'Failed to submit booking')
    }
  } catch (error) {
    console.error('Booking error:', error)
    ElMessage.error(error.message || 'Failed to submit booking. Please try again later.')
  }
}
</script>

<style scoped>
.order-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.order-card {
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
}

.train-header {
  padding: 12px 20px;
  background: #fff;
  position: relative;
}

.train-number {
  display: inline-block;
  background: #ff9f00;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 10px;
}

.train-date {
  font-size: 16px;
  font-weight: 500;
}

.train-route {
  padding: 20px;
  background: #fff;
}

.station-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  font-size: 14px;
  color: #606266;
}

.duration {
  text-align: center;
  padding: 0 40px;
}

.duration .seat-type {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.duration .time {
  font-size: 14px;
  color: #909399;
}

.passenger-list {
  padding: 20px;
}

.passenger-item {
  display: grid;
  grid-template-columns: 100px 1fr 1fr 1fr 120px;
  gap: 20px;
  margin-bottom: 10px;
  color: #606266;
}

.remove-link {
  position: absolute;
  top: 12px;
  right: 20px;
}

.order-summary {
  padding: 20px;
  text-align: right;
  border-top: 1px solid #ebeef5;
}

.subtotal {
  font-size: 16px;
  font-weight: 500;
}

.order-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  width: 100%;
  padding: 16px 0;
  border-bottom: 1px solid #ebeef5;
}

.booking-form {
  max-width: 1000px;
  margin: 40px auto;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.form-section {
  margin-bottom: 24px;
}

.form-section h3 {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 12px;
}

.radio-item {
  margin-bottom: 8px;
}

.upgrade-info {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.name-input-group {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
}

.title-select {
  width: 100px;
  flex-shrink: 0;
}

:deep(.el-input) {
  width: 100%;
}

.form-item-full {
  width: 100%;
}

.form-item-full :deep(.el-form-item__content) {
  width: 100%;
}

:deep(.el-form--compact) {
  width: 100%;
  
  .el-form-item {
    margin-bottom: 16px;
    width: 100%;
  }

  .el-form-item__content {
    display: flex;
  }

  .el-form-item__label {
    padding-bottom: 4px;
    font-weight: normal;
    color: #606266;
  }
}

.terms {
  margin: 20px 0;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.form-actions {
  text-align: center;
  margin-top: 24px;
}

:deep(.el-radio__label) {
  color: #606266;
}

:deep(.el-tag) {
  margin-left: 8px;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .booking-form {
    padding: 16px;
  }
}
</style>
