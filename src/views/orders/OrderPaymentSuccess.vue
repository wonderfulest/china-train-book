<template>
  <div class="payment-success">
    <div class="success-card">
      <div class="success-header">
        <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
        <h1>Payment Successful!</h1>
        <p class="subtitle">Your payment has been processed successfully</p>
        <div class="order-id">
          Order ID: <span>{{ orderId }}</span>
          <p class="save-reminder">Please save this order ID for future reference</p>
        </div>
      </div>
      
      <!-- 订单详情 -->
      <div v-if="orderData" class="order-details">
        <h2>Order Details</h2>
        
        <div class="train-info">
          <div class="train-header">
            <div class="train-tag">Train {{ orderData.trainNo || 'N/A' }}</div>
            <div class="train-date">{{ formatDisplayDate(new Date()) }}</div>
          </div>
          
          <div class="train-route">
            <div class="station departure">
              <div class="name">{{ getStationName(orderData.from) }}</div>
              <div class="time">{{ orderData.departTime || 'N/A' }}</div>
            </div>
            
            <div class="route-info">
              <div class="seat-type">{{ orderData.seatType || 'Standard Seat' }}</div>
              <div class="duration">{{ calculateDuration(orderData.departTime, orderData.arriveTime) }}</div>
            </div>
            
            <div class="station arrival">
              <div class="name">{{ getStationName(orderData.to) }}</div>
              <div class="time">{{ orderData.arriveTime || 'N/A' }}</div>
            </div>
          </div>
        </div>
        
        <!-- 乘客信息 -->
        <div class="passengers-info" v-if="orderData.passengers && orderData.passengers.length > 0">
          <h3>Passenger Information</h3>
          <el-table :data="orderData.passengers" stripe style="width: 100%">
            <el-table-column prop="passportName" label="Name" />
            <el-table-column label="Type">
              <template #default="{row}">
                {{ getPassengerType(row.passengerType) }}
              </template>
            </el-table-column>
            <el-table-column prop="passportNumber" label="Passport" />
            <el-table-column label="Price">
              <template #default="{row}">
                {{ formatUSDPrice(row.priceTotal) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <div class="payment-info">
          <h3>Payment Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Payment Method</label>
              <div>{{ orderData.payment ? capitalizeFirstLetter(orderData.payment.paymentMethod) : 'PayPal' }}</div>
            </div>
            <div class="info-item">
              <label>Payment Date</label>
              <div>{{ orderData.payment ? formatDate(new Date(orderData.payment.updatedAt)) : formatDate(new Date()) }}</div>
            </div>
            <div class="info-item">
              <label>Amount Paid</label>
              <div>{{ formatUSDPrice(orderData.priceAmount) }}</div>
            </div>
            <div class="info-item">
              <label>Payment Status</label>
              <div class="status success">{{ getPaymentStatus(orderData.payment ? orderData.payment.paymentStatus : 1) }}</div>
            </div>
            <div class="info-item" v-if="orderData.payment && orderData.payment.paymentId">
              <label>Transaction ID</label>
              <div class="transaction-id">{{ orderData.payment.paymentId }}</div>
            </div>
          </div>
        </div>
        
        <!-- 联系人信息 -->
        <div class="contact-info" v-if="orderData.contact">
          <h3>Contact Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Name</label>
              <div>{{ orderData.contact.title }} {{ orderData.contact.name }}</div>
            </div>
            <div class="info-item">
              <label>Email</label>
              <div>{{ orderData.contact.email }}</div>
            </div>
            <div class="info-item">
              <label>Phone</label>
              <div>{{ orderData.contact.phone }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 加载中状态 -->
      <div v-else class="loading-state">
        <el-skeleton :rows="5" animated />
      </div>

      <div class="info-section">
        <h2>What's Next?</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Check Your Email</h3>
              <p>We've sent your e-tickets and payment confirmation to your email address. Please check your inbox (and spam folder).</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Save Your Tickets</h3>
              <p>Download and save your e-tickets. You'll need to show them during your journey.</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Before Your Journey</h3>
              <p>Make sure to arrive at the station at least 30 minutes before departure. Don't forget to bring valid ID for all passengers.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <el-button type="primary" @click="downloadOrderDetails">
          <el-icon><Download /></el-icon>Download Order Details
        </el-button>
        <el-button @click="viewBookings">View Orders</el-button>
        <el-button @click="backToHome">Back to Home</el-button>
      </div>

      <div class="contact-support">
        <p>Need help? <el-link type="primary" href="#" @click.prevent="contactSupport">Contact our support team</el-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CircleCheckFilled, Download } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { ElMessage, ElLoading, ElTable, ElTableColumn } from 'element-plus'
import { getOrderById } from '@/api/modules/orders'
import { useCurrencyStore } from '@/stores/currencyStore'

const router = useRouter()
const route = useRoute()
const orderId = ref(route.params.orderId)
const orderData = ref(null)
const currencyStore = useCurrencyStore()

// 获取订单数据
async function fetchOrderData() {
  if (!orderId.value) {
    ElMessage.error('Invalid order ID');
    router.push('/');
    return;
  }
  
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading order data...',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  
  try {
    const response = await getOrderById(orderId.value);
    orderData.value = response.data;
    console.log('订单数据:', orderData.value);
    
    // 如果没有获取到有效数据
    if (!orderData.value) {
      ElMessage.error('Failed to load order data');
      // router.push('/');
    }
  } catch (error) {
    console.error('Error fetching order data:', error);
    ElMessage.error('Failed to load order data');
    // router.push('/');
  } finally {
    loading.close();
  }
}

// 获取车站名称
function getStationName(code) {
  if (!code) return 'N/A';
  
  const stationMap = {
    'BJP': 'Beijing',
    'TJP': 'Tianjin',
    'SHH': 'Shanghai',
    'GZQ': 'Guangzhou',
    'SZQ': 'Shenzhen',
    'CDW': 'Chengdu',
    'CQW': 'Chongqing',
    'HZH': 'Hangzhou',
    'NJH': 'Nanjing',
    'XAY': 'Xi\'an'
  };
  
  return stationMap[code] || code;
}

// 获取乘客类型
function getPassengerType(type) {
  const typeMap = {
    1: 'Adult',
    2: 'Child',
    3: 'Student',
    4: 'Senior'
  };
  
  return typeMap[type] || 'Adult';
}

// 获取支付状态
function getPaymentStatus(status) {
  const statusMap = {
    0: 'Pending',
    1: 'Completed',
    2: 'Failed',
    3: 'Refunded'
  };
  
  return statusMap[status] || 'Unknown';
}

// 首字母大写
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// 格式化显示日期
function formatDisplayDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    weekday: 'short'
  };
  
  return date.toLocaleDateString('en-US', options);
}

// 计算行程时长
function calculateDuration(departTime, arriveTime) {
  if (!departTime || !arriveTime) return '';
  
  let [departHours, departMinutes] = departTime.split(':').map(Number);
  let [arriveHours, arriveMinutes] = arriveTime.split(':').map(Number);
  
  // 处理跨天的情况
  if ((arriveHours < departHours) || (arriveHours === departHours && arriveMinutes < departMinutes)) {
    arriveHours += 24;
  }
  
  const totalMinutes = (arriveHours - departHours) * 60 + (arriveMinutes - departMinutes);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours}h ${minutes}m`;
}

// 格式化美元价格
function formatUSDPrice(cnyPrice) {
  if (!cnyPrice) return '$0.00';
  const usdPrice = parseFloat(cnyPrice) * 0.14; // 使用固定汇率进行简单转换
  return `${currencyStore.currencySymbol} ${Math.round(usdPrice)}`;
}

// 格式化日期
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const backToHome = () => {
  router.push('/')
}

const viewBookings = () => {
  router.push('/orders')
}

const contactSupport = () => {
  // 实现联系支持的逻辑
  window.open('mailto:support@chinatrainstickets.com')
}

const downloadOrderDetails = () => {
  if (!orderData.value) {
    ElMessage.warning('Order data is still loading. Please try again.');
    return;
  }
  
  const now = new Date().toLocaleString();
  let passengersInfo = '';
  
  if (orderData.value.passengers && orderData.value.passengers.length > 0) {
    passengersInfo = '\nPassengers:\n';
    orderData.value.passengers.forEach((passenger, index) => {
      passengersInfo += `${index + 1}. ${passenger.passportName} (${getPassengerType(passenger.passengerType)}) - Passport: ${passenger.passportNumber}\n`;
    });
  }
  
  const content = `China Train Tickets - Order Details

Order ID: ${orderId.value}
Date: ${now}
Train: ${orderData.value.trainNo || 'N/A'}
From: ${getStationName(orderData.value.from)}
To: ${getStationName(orderData.value.to)}
Departure: ${orderData.value.departTime || 'N/A'}
Arrival: ${orderData.value.arriveTime || 'N/A'}
Seat Type: ${orderData.value.seatType || 'Standard Seat'}
Amount Paid: ${formatUSDPrice(orderData.value.priceAmount)}
${passengersInfo}
Payment Method: ${orderData.value.payment ? capitalizeFirstLetter(orderData.value.payment.paymentMethod) : 'PayPal'}
Payment ID: ${orderData.value.payment ? orderData.value.payment.paymentId : 'N/A'}
Payment Status: ${getPaymentStatus(orderData.value.payment ? orderData.value.payment.paymentStatus : 1)}

Please keep this information safe for future reference.
For any assistance, contact support@chinatrainstickets.com
`

  const blob = new Blob([content], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `order-${orderId.value}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
  
  ElMessage.success('Order details downloaded successfully')
}

// 组件挂载时获取订单数据
onMounted(() => {
  fetchOrderData()
})
</script>

<style scoped>
.payment-success {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: #f5f5f5;
}

.success-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  padding: 40px;
  max-width: 900px;
  width: 100%;
  border: 1px solid #e4e7ed;
  border-bottom: 3px solid #e4e7ed;
}

.success-header {
  text-align: center;
  margin-bottom: 40px;
  border-bottom: 1px solid #dcdfe6;
  padding-bottom: 20px;

  .order-id {
    margin-top: 1.2rem;
    font-size: 1.2rem;
    color: #303133;

    .save-reminder {
      margin-top: 0.6rem;
      font-size: 1rem;
      color: #f56c6c;
      font-weight: 500;
    }
  }

  .order-id span {
    font-weight: 600;
    color: #303133;
  }
}

.success-icon {
  font-size: 70px;
  color: #67c23a;
  margin-bottom: 24px;
}

h1 {
  color: #303133;
  font-size: 30px;
  margin: 0 0 10px;
  font-weight: 600;
}

.subtitle {
  color: #606266;
  font-size: 18px;
  margin: 0;
}

.info-section {
  margin: 40px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
}

h2 {
  color: #303133;
  font-size: 22px;
  margin: 0 0 24px;
  font-weight: 600;
}

h3 {
  color: #303133;
  font-size: 20px;
  margin: 0 0 18px;
  font-weight: 600;
}

.order-details {
  margin-bottom: 30px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 24px;
  background-color: #f5f5f5;
}

.train-info {
  margin-bottom: 24px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
}

.train-header {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: #f5f5f5;
  border-bottom: 2px solid #dcdfe6;
}

.train-tag {
  font-weight: 600;
  color: #303133;
  font-size: 16px;
}

.train-date {
  color: #606266;
  font-size: 15px;
}

.train-route {
  display: flex;
  padding: 24px;
}

.station {
  flex: 1;
}

.route-info {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.name {
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 6px;
  color: #303133;
}

.time {
  color: #606266;
  font-size: 16px;
}

.seat-type {
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
  font-size: 16px;
}

.duration {
  color: #606266;
  font-size: 15px;
}

.payment-info {
  background-color: white;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 16px;
}

.transaction-id {
  font-family: monospace;
  font-size: 1rem;
  color: #303133;
  word-break: break-all;
  font-weight: 500;
}

.passengers-info,
.contact-info {
  margin-top: 24px;
  background-color: white;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-size: 15px;
  color: #606266;
  margin-bottom: 6px;
  font-weight: 500;
}

.info-item div {
  font-size: 16px;
  color: #303133;
}

.status {
  font-weight: 600;
}

.status.success {
  color: #67c23a;
  font-size: 16px;
}

.loading-state {
  padding: 24px;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
}

.step-number {
  background: #303133;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
  font-size: 16px;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  color: #303133;
  font-size: 18px;
  margin: 0 0 10px;
  font-weight: 600;
}

.step-content p {
  color: #606266;
  margin: 0;
  line-height: 1.6;
  font-size: 15px;
}

.actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;
}

.contact-support {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #dcdfe6;
}

.contact-support p {
  color: #606266;
  margin: 0;
  font-size: 15px;
}

@media (max-width: 768px) {
  .success-card {
    padding: 24px;
  }

  .actions {
    flex-direction: column;
  }

  .actions .el-button {
    width: 100%;
  }
}
</style>
