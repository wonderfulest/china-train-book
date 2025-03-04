<template>
  <div class="booking-payment">
    <div class="payment-card">
      <div class="header">
        <div class="order-info">
          <div class="order-id">Order ID: <span>{{ bookingId }}</span></div>
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

      <div class="preferences" v-if="preferences.unavailable || preferences.receiveMethod">
        <div class="preference-item" v-if="preferences.unavailable">
          <div class="label">In case the selected tickets are not available, I would like to</div>
          <div class="value">{{ preferences.unavailable }}</div>
        </div>
        <div class="preference-item" v-if="preferences.receiveMethod">
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
        <div class="price-item" v-if="prices.deliveryFee > 0">
          <span>Delivery fee:</span>
          <span>{{ formatPrice(prices.deliveryFee) }}</span>
        </div>
        <div class="price-item" v-if="prices.refundProtect > 0">
          <span>Refund Protect:</span>
          <span>{{ formatPrice(prices.refundProtect) }}</span>
        </div>
        <div class="price-item" v-if="prices.transactionFee > 0">
          <span>Transaction fee:</span>
          <span>{{ formatPrice(prices.transactionFee) }}</span>
        </div>
        <div class="price-item total">
          <span>Total Price:</span>
          <span>{{ formatPrice(prices.total) }}</span>
        </div>
      </div>

      <div class="actions">
        <div id="paypal-button-container" class="paypal-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getBooking, paymentCallback } from '@/api/modules/orders'

const route = useRoute()
const router = useRouter()

// 从路由参数获取订单ID
const bookingId = ref('')

onMounted(async() => {
  console.log('Route query:', route.query)
  bookingId.value = route.query.bookingId
  if (!bookingId.value) {
    ElMessage.error('Invalid booking ID')
    router.push('/')
    return
  }

  // 获取预订信息
  await fetchBookingData()

  // Initialize PayPal button when SDK is loaded
  const initPayPalButton = () => {
    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                currency_code: 'USD',
                value: prices.value.total.toString()
              },
              description: `Train Ticket Order ${bookingId.value}`
            }]
          });
        },
        onApprove: async (data, actions) => {
          try {
            const details = await actions.order.capture()
            ElMessage.success(`Payment successful! Thank you ${details.payer.name.given_name}!`)
            console.log('Payment successful!', details)
            
            // Call backend payment callback API
            try {
              await paymentCallback(bookingId.value)
              console.log('Payment callback successful')
            } catch (callbackErr) {
              console.error('Payment callback error:', callbackErr)
              ElMessage.warning('Payment successful but order status update failed. Please contact support.')
            }
            router.push(`/booking-success/${bookingId.value}`)
          } catch (err) {
            console.error('Payment capture error:', err)
            ElMessage.error('Payment failed. Please try again.')
          }
        },
        onError: (err) => {
          console.error('PayPal error:', err)
          ElMessage.error('Payment failed. Please try again.')
        }
      }).render('#paypal-button-container')
    }
  }

  // Check if PayPal SDK is already loaded
  if (window.paypal) {
    initPayPalButton()
  } else {
    // Wait for SDK to load
    window.addEventListener('paypal-sdk-loaded', initPayPalButton)
  }
})

const orderStatus = ref('')
const orders = ref([])
const contact = ref({})
const preferences = ref({
  unavailable: 'upgrade to higher class',
  receiveMethod: 'email'
})
const prices = ref({
  deliveryFee: 0,
  refundProtect: 0,
  transactionFee: 0,
  total: 0
})

// 获取预订信息
const fetchBookingData = async () => {
  try {

    const { code, message, data } = await getBooking(bookingId.value)
    if (code === '0' && data) {
      // 设置订单状态
      orderStatus.value = data.status || 'Unknown'
      
      // 处理订单信息
      orders.value = data.orders.map(order => {
        const priceDetail = JSON.parse(order.priceDetail)
        const [departDate, departTime] = order.departTime.split(' ')
        const [arriveDate, arriveTime] = order.arriveTime.split(' ')
        
        return {
          trainNo: order.trainNo,
          date: departDate,
          from: order.from.split(' - ')[0],
          to: order.to.split(' - ')[0],
          departTime: departTime,
          arriveTime: arriveTime,
          standing: calculateDuration(departTime, arriveTime),
          seatType: order.seatType,
          passengers: order.passengers.map(p => ({
            type: p.type,
            name: `${p.surname}, ${p.givenName}`,
            passportNumber: p.passportNumber,
            country: p.country,
            price: p.type === 'Adult' ? priceDetail.adult.price : priceDetail.child.price
          }))
        }
      })
      
      // 设置联系人信息
      contact.value = data.contactForm
      
      // 设置价格信息
      prices.value = {
        deliveryFee: 0, // 如果API返回这些值，从API中获取
        refundProtect: 0,
        transactionFee: 0,
        total: data.orders.reduce((sum, order) => sum + order.priceAmount, 0)
      }
    } else {
      throw new Error(message || 'Failed to fetch booking data')
    }
  } catch (error) {
    console.error('Error fetching booking data:', error)
    ElMessage.error('Failed to load booking information')
    router.push('/')
  }
}

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


</script>

<style scoped>
.pp-X9FRD4NFB36QQ {
  text-align: center;
  border: none;
  border-radius: 0.25rem;
  min-width: 11.625rem;
  padding: 0 2rem;
  height: 2.625rem;
  font-weight: bold;
  background-color: #FFD140;
  color: #000000;
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 1rem;
  line-height: 1.25rem;
  cursor: pointer;
}

.paypal-form {
  display: inline-grid;
  justify-items: center;
  align-content: start;
  gap: 0.5rem;
}

.paypal-logo {
  height: 0.875rem;
  vertical-align: middle;
}
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
  display: flex;
  justify-content: center;
}

.paypal-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
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
