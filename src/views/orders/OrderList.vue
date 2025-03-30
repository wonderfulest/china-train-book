<template>
  <div class="my-bookings">
    <div class="search-section">
      <h1>Orders</h1>
      <div class="booking-search">
        <div class="search-form">
          <el-form :model="searchForm" @submit.prevent="searchBooking">
            <el-form-item>
              <el-radio-group v-model="searchForm.searchType">
                <el-radio label="bookingId">Order ID</el-radio>
                <el-radio label="email">Contact Email</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="searchForm.searchType === 'bookingId'" label="Order ID:">
              <el-input v-model="searchForm.bookingId" placeholder="Enter your order ID" />
            </el-form-item>
            <el-form-item v-else label="Contact Email:">
              <el-input v-model="searchForm.email" placeholder="Enter your contact email" />
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

    <div v-if="bookingList && bookingList.length > 0" class="booking-details">
      <div v-for="(bookingData, bookingIndex) in bookingList" :key="bookingData.bookingId" class="payment-card">
        <div class="header">
          <div class="order-info">
            <div class="order-id">Order ID: <span>{{ bookingData.orderId }}</span></div>
            <div class="order-status">Status: <el-tag :type="getPaymentStatusType(bookingData.paymentStatus)">{{ getPaymentStatusText(bookingData.paymentStatus) }}</el-tag></div>
          </div>
        </div>

        <div class="train-orders">
          <div class="train-order">
            <div class="train-header">
              <div class="train-tag">Train {{ bookingData.trainNo || 'N/A' }}</div>
              <div class="train-date">{{ formatDisplayDate(bookingData.fromDate) }}</div>
            </div>
            <div class="train-route">
   
              <div class="station">
                <div class="name">{{ formatStation(bookingData.fromStation, allCities) }}</div>
                <div class="time">{{ bookingData.fromTime || 'N/A' }}</div>
              </div>
              <div class="route-info">
                <div class="standing">{{ bookingData.seatType || 'Standard Seat' }}</div>
                <div class="duration">{{ bookingData.runTime }}</div>
              </div>
              <div class="station">
                <div class="name">{{ formatStation(bookingData.toStation, allCities) }}</div>
                <div class="time">{{ bookingData.toTime || 'N/A' }}</div>
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
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="passenger in bookingData.passengers" :key="passenger.passportNumber">
                    <td>{{ getPassengerType(passenger.passengerType) }}</td>
                    <td>{{ passenger.passportName }}</td>
                    <td>{{ passenger.passportNumber }}</td>
                    <td>{{ passenger.country }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="contact-info" v-if="bookingData.contact">
          <h3>Contact Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Name:</label>
              <span>{{ bookingData.contact.title }} {{ bookingData.contact.name }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ bookingData.contact.email }}</span>
            </div>
            <div class="info-item">
              <label>Tel:</label>
              <span>{{ bookingData.contact.phone }}</span>
            </div>
          </div>
        </div>

        <!-- <div class="price-summary">
          <div class="price-item">
            <span>Ticket Price:</span>
            <span>{{ formatPrice(getTotalTicketPrice(bookingData)) }}</span>
          </div>
          <div class="price-item">
            <span>Service Fee:</span>
            <span>{{ formatPrice(getTotalServiceFee(bookingData)) }}</span>
          </div>
          <div class="price-item total">
            <span>Total Amount:</span>
            <span>{{ formatPrice(bookingData.priceAmount) }}</span>
          </div>
          <div class="price-actions">
            <el-button type="primary" @click="downloadOrderDetails(bookingData)">
              <el-icon><Download /></el-icon>Download Order Details
            </el-button>
          </div>
        </div> -->
      </div>
    </div>

    <div v-else-if="searched" class="no-results">
      <el-empty description="No orders found with the provided information" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getOrders } from '@/api/modules/orders'
import { useRoute, useRouter } from 'vue-router'
import { useCurrencyStore } from '@/stores/currencyStore'
import { storeToRefs } from 'pinia'
import { formatDuration, formatStation } from "@/utils/formatters";
import { useCityStore } from "@/stores/city";

const route = useRoute()
const router = useRouter()
const currencyStore = useCurrencyStore()
const { currency, currencySymbol } = storeToRefs(currencyStore)
const cityStore = useCityStore();
const { allCities } = storeToRefs(cityStore);

const searchForm = ref({
  searchType: 'bookingId',
  bookingId: '',
  email: ''
})


// 格式化显示日期
function formatDisplayDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
  };

  return date.toLocaleDateString("en-US", options);
}

const loading = ref(false)
const searched = ref(false)
const bookingList = ref([])

// 在组件挂载时检查 URL 参数
onMounted(async () => {
  // 初始化城市数据
  await cityStore.initializeCityData();
  
  // 从 URL 参数中获取 bookingId 或 email
  const urlBookingId = route.query.bookingId
  const urlEmail = route.query.email
  
  if (urlBookingId) {
    // 如果 URL 中有 bookingId 参数，设置到表单并自动搜索
    searchForm.value.searchType = 'bookingId'
    searchForm.value.bookingId = urlBookingId
    searchBooking()
  } else if (urlEmail) {
    // 如果 URL 中有 email 参数，设置到表单并自动搜索
    searchForm.value.searchType = 'email'
    searchForm.value.email = urlEmail
    searchBooking()
  }
})

const searchBooking = async () => {
  const searchType = searchForm.value.searchType
  const searchValue = searchType === 'bookingId' ? searchForm.value.bookingId : searchForm.value.email
  
  if (!searchValue) {
    ElMessage.warning(`Please enter a ${searchType === 'bookingId' ? 'booking ID' : 'contact email'}`)
    return
  }

  loading.value = true
  searched.value = false
  bookingList.value = []

  try {
    console.log(`Fetching order data for ${searchType}:`, searchValue)
    let response
    
    if (searchType === 'bookingId') {
      response = await getOrders(searchValue)
    } else {
      // Call the API with email parameter
      response = await getOrders('', searchValue)
    }
    
    console.log('API Response:', response)

    if (response.code !== '0') {
      throw new Error(response.message || 'Failed to fetch order')
    }

    if (!response.data || response.data.length === 0) {
      throw new Error('No orders found')
    }

    // Handle both single booking and array of bookings
    if (Array.isArray(response.data)) {
      bookingList.value = response.data
    } else {
      bookingList.value = [response.data]
    }
    
    searched.value = true
    
    if (bookingList.value.length > 0) {
      ElMessage.success(`Found ${bookingList.value.length} order(s)`)
    } else {
      ElMessage.warning('No orders found')
    }
    
    console.log('Order data set:', bookingList.value)
  } catch (error) {
    console.error('Error fetching order:', error)
    ElMessage.error(error.message || 'Failed to fetch order details')
    bookingList.value = []
    searched.value = true
  } finally {
    loading.value = false
    console.log('Search completed. Loading:', loading.value, 'Searched:', searched.value, 'Has data:', bookingList.value.length > 0)
  }
}

const formatDate = (dateString) => {
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

const formatTime = (datetime) => {
  if (!datetime) return ''
  const date = new Date(datetime)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

const calculateDuration = (departTime, arriveTime) => {
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

const formatPrice = (price) => {
  if (price === undefined || price === null) return `${currencyStore.currencySymbol}0.00`
  
  // 假设原始价格是人民币（CNY）
  const originalPrice = Number(price)
  let convertedPrice = originalPrice
  
  // 根据当前选择的货币进行转换
  const targetCurrency = currencyStore.currency
  const exchangeRates = currencyStore.exchangeRates
  
  if (exchangeRates && targetCurrency !== 'CNY') {
    // 将人民币转换为目标货币
    const rate = exchangeRates[targetCurrency]
    if (rate) {
      convertedPrice = (originalPrice / rate).toFixed(2)
    }
  }
  
  return `${currencyStore.currencySymbol} ${convertedPrice}`
}

// 获取乘客类型文本
const getPassengerType = (type) => {
  const types = {
    1: 'Adult',
    2: 'Child',
    3: 'Student',
    4: 'Senior'
  }
  return types[type] || 'Unknown'
}

// 获取支付状态文本
const getPaymentStatusText = (status) => {
  const statusMap = {
    0: 'Unpaid',
    1: 'Paid',
    2: 'Cancelled',
    3: 'Refunding',
    4: 'Refunded'
  }
  return statusMap[status] || 'Unknown'
}

// 获取支付状态标签类型
const getPaymentStatusType = (status) => {
  const typeMap = {
    0: 'warning',
    1: 'success',
    2: 'info',
    3: 'warning',
    4: 'info'
  }
  return typeMap[status] || 'info'
}

// 计算所有乘客的票价总和
const getTotalTicketPrice = (order) => {
  if (!order.passengers || order.passengers.length === 0) return 0
  return order.passengers.reduce((sum, passenger) => sum + passenger.price, 0)
}

// 计算所有乘客的服务费总和
const getTotalServiceFee = (order) => {
  if (!order.passengers || order.passengers.length === 0) return 0
  return order.passengers.reduce((sum, passenger) => sum + passenger.fee, 0)
}

const downloadOrderDetails = (bookingData) => {
  const now = new Date().toLocaleString();
  let passengersInfo = "";

  if (bookingData.passengers && bookingData.passengers.length > 0) {
    passengersInfo = "\nPassengers:\n";
    bookingData.passengers.forEach((passenger, index) => {
      passengersInfo += `${index + 1}. ${passenger.passportName} (${getPassengerType(passenger.passengerType)}) - Passport: ${passenger.passportNumber}\n`;
    });
  }

  const content = `China Train Tickets - Order Details

Order ID: ${bookingData.orderId}
Date: ${now}
Train: ${bookingData.trainNo || "N/A"}
From: ${formatStation(bookingData.from, allCities.value)}
To: ${formatStation(bookingData.to, allCities.value)}
Departure: ${bookingData.departTime || "N/A"}
Arrival: ${bookingData.arriveTime || "N/A"}
Seat Type: ${bookingData.seatType || "Standard Seat"}
Amount Paid: ${formatPrice(bookingData.priceAmount)}
${passengersInfo}
Payment Method: ${bookingData.payment ? capitalizeFirstLetter(bookingData.payment.paymentMethod) : "PayPal"}
Payment ID: ${bookingData.payment ? bookingData.payment.paymentId : "N/A"}
Payment Status: ${getPaymentStatusText(bookingData.paymentStatus)}

Please keep this information safe for future reference.
For any assistance, contact support@chinatrainstickets.com
`;

  const blob = new Blob([content], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `order-${bookingData.orderId}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  ElMessage.success("Order details downloaded successfully");
};

// 首字母大写
const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};
</script>

<style scoped>
.my-bookings {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
  width: 80%;
  margin: 0 auto;
}

.search-section {
  max-width: 1200px;
  margin: 0 auto 24px;
}

.booking-search {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  padding: 30px;
}

.search-form {
  max-width: 600px;
  margin: 0 auto;
}

.payment-card {
  max-width: 1200px;
  margin: 24px auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  padding: 30px;
  border: 1px solid #e4e7ed;
  border-bottom: 3px solid #e4e7ed;
}

.header {
  margin-bottom: 30px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 15px;
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
}

.order-id span {
  font-weight: 600;
  margin-left: 4px;
  color: #303133;
}

.train-orders {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.train-order {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.train-header {
  background: #f5f5f5;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #dcdfe6;
}

.train-tag {
  background: #303133;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 600;
}

.train-route {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
}

.station {
  flex: 1;
}

.station .name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #303133;
}

.station .time {
  color: #606266;
  font-size: 16px;
  font-weight: 500;
}

.route-info {
  text-align: center;
  padding: 0 40px;
}

.standing {
  font-size: 16px;
  color: #303133;
  margin-bottom: 6px;
  font-weight: 500;
}

.passengers {
  padding: 0 24px 24px;
}

.passenger-table {
  width: 100%;
  border-collapse: collapse;
}

.passenger-table th,
.passenger-table td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid #dcdfe6;
  font-size: 15px;
}

.passenger-table th {
  font-weight: 600;
  color: #303133;
  background-color: #f5f5f5;
}

.text-right {
  text-align: right !important;
}

.contact-info {
  margin: 30px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
}

.contact-info h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #303133;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item label {
  color: #606266;
  margin-right: 8px;
  font-weight: 500;
  font-size: 15px;
}

.info-item span {
  font-size: 15px;
  color: #303133;
}

.price-summary {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  color: #606266;
  font-size: 16px;
}

.price-item.total {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #dcdfe6;
  font-weight: 600;
  color: #303133;
  font-size: 18px;
}

.price-actions {
  margin-top: 14px;
  text-align: right;
}

.no-results {
  margin-top: 30px;
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
