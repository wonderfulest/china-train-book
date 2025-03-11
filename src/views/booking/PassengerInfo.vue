<template>
  <div class="passenger-info-page">
    <div class="passenger-info-container">
      <!-- Left column: journey info, passenger details, contact info -->
      <div class="left-column">
        <!-- Journey Information Section -->
        <div class="journey-info-section">
          <h2>Order summary</h2>
          <div class="journey-card">
            <div class="date-section">
              <div class="date">{{ formatDate(ticketInfo.date) }}</div>
              <div class="day">{{ formatDay(ticketInfo.date) }}, {{ ticketInfo.departTime }}</div>
            </div>
            <div class="journey-details">
              <div class="station-info">
                <div class="station-name">{{ ticketInfo.from }}</div>
                <div class="station-details" v-if="stationDetails[ticketInfo.from]">{{ stationDetails[ticketInfo.from] }}</div>
              </div>
              <div class="train-info">
                <div class="train-number">Train #{{ ticketInfo.trainNo }} - {{ getTrainType(ticketInfo.trainNo) }} / Travel time {{ ticketInfo.duration }}</div>
              </div>
              <div class="station-info">
                <div class="station-name">{{ ticketInfo.to }}</div>
                <div class="station-details" v-if="stationDetails[ticketInfo.to]">{{ stationDetails[ticketInfo.to] }}</div>
              </div>
              <div class="seat-preferences">
                <span>{{ ticketInfo.seatType }}</span>
                <span class="price-tag">{{ formatPrice(ticketInfo.price) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Passenger Information Section -->
        <div class="passenger-info-section">
          <h2>Email for receiving e-tickets</h2>
          <div class="email-input-section">
            <p>Please provide a valid email address where we will send your electronic tickets.</p>
            <el-input 
              v-model="contactInfo.email" 
              placeholder="Email" 
              class="email-input"
            />
          </div>
        </div>

        <!-- Contact Information Section -->
        <div class="passenger-details-section">
          <h2>Passengers</h2>
          <div class="passenger-card">
            <div class="passenger-header">
              <div class="warning-icon">
                <i class="el-icon-warning"></i>
              </div>
              <div class="passenger-title">Adult passenger 1</div>
              <div class="passenger-actions">
                <i class="el-icon-arrow-down"></i>
              </div>
            </div>
            <div class="passenger-form-container">
              <el-form :model="passengerInfo" label-position="top">
                <div class="form-row">
                  <el-form-item label="Passenger Type" class="form-item-type">
                    <el-radio-group v-model="passengerInfo.type">
                      <el-radio label="Adult">Adult</el-radio>
                      <el-radio label="Child">Child <span class="type-hint">(under 14 years old)</span></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
                
                <div class="form-row">
                  <el-form-item label="Surname" class="form-item-half">
                    <el-input v-model="passengerInfo.surname" placeholder="As shown on passport" />
                  </el-form-item>
                  <el-form-item label="Given Name" class="form-item-half">
                    <el-input v-model="passengerInfo.givenName" placeholder="As shown on passport" />
                  </el-form-item>
                </div>
                
                <div class="form-row">
                  <el-form-item label="Gender" class="form-item-third">
                    <el-select v-model="passengerInfo.gender" placeholder="Select">
                      <el-option label="Male" value="male" />
                      <el-option label="Female" value="female" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="Birthday" class="form-item-third">
                    <el-date-picker v-model="passengerInfo.birthday" type="date" placeholder="Select date" style="width: 100%" />
                  </el-form-item>
                  <el-form-item label="Country of Passport" class="form-item-third">
                    <el-select v-model="passengerInfo.country" placeholder="Select country" filterable>
                      <el-option v-for="country in countries" :key="country.code" :label="country.name" :value="country.code" />
                    </el-select>
                  </el-form-item>
                </div>
                
                <div class="form-row">
                  <el-form-item label="Passport Number" class="form-item-half">
                    <el-input v-model="passengerInfo.passportNumber" placeholder="Enter passport number" />
                  </el-form-item>
                  <el-form-item label="Passport Expiry Date" class="form-item-half">
                    <el-date-picker v-model="passengerInfo.passportExpiry" type="date" placeholder="Select date" style="width: 100%" />
                  </el-form-item>
                </div>
                
                <div class="form-note">
                  The passenger's name and passport number should exactly match Machine Readable Zone of your passport's identity page. Only 26 English letters A-Z allowed. Abbreviation or missing of name are not allowed. According to real-name policy, a ticket with incorrect passport info cannot be collected at station.
                </div>
              </el-form>
            </div>
            <el-button class="add-requests-button" icon="el-icon-plus">Add special requests</el-button>
            <div class="encryption-notice">
              <i class="el-icon-lock"></i>
              Your personal information is encrypted
            </div>
          </div>
        </div>
      </div>

      <!-- Right column: Order summary and payment info -->
      <div class="right-column">
        <div class="order-summary-card">
          <div class="order-summary-header">
            <h2>Order summary</h2>
            <i class="el-icon-edit"></i>
          </div>

          <div class="ticket-info">
            <div class="ticket-type">{{ ticketInfo.seatType }}</div>
            <div class="ticket-type-label">E-ticket</div>
          </div>

          <div class="ticket-option">
            <div class="option-label">Flexible</div>
            <div class="option-info-icon">i</div>
          </div>

          <div class="price-section">
            <div class="total-amount-row">
              <div class="total-amount-label">Total amount</div>
              <div class="total-amount-info-icon">i</div>
              <div class="total-amount">{{ formatPrice(orderSummary.totalAmount) }}</div>
            </div>
            <div class="tax-fees-note">includes all taxes and fees</div>
          </div>

          <el-button type="primary" class="continue-button" @click="proceedToPayment">Continue</el-button>

          <div class="details-toggle">
            See Details <i class="el-icon-arrow-down"></i>
          </div>

          <div class="additional-info">
            <div class="info-item">
              <div class="icon-container">
                <i class="el-icon-train"></i>
              </div>
              <div class="info-content">
                <div class="info-title">Great Choice!</div>
                <div class="info-details">You have selected one of the best trains for this route. Book now!</div>
              </div>
            </div>

            <div class="info-item">
              <div class="icon-container">
                <i class="el-icon-tickets"></i>
              </div>
              <div class="info-content">
                <div class="info-title">Guaranteed Seat Reservation</div>
                <div class="info-details">We will issue e-tickets with guaranteed seat reservation. The best seats possible.</div>
              </div>
            </div>

            <div class="info-item">
              <div class="icon-container">
                <i class="el-icon-service"></i>
              </div>
              <div class="info-content">
                <div class="info-title">Real Customer Service</div>
                <div class="info-details">Need help with your order? Our customer support is always there for you via email or chat.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-actions">
      <el-button type="primary" class="continue-button-mobile" @click="proceedToPayment">Continue</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { usePassengerStore } from '@/stores/passenger'
import { useOrderStore } from '@/stores/order'
import { useBookingStore } from '@/stores/bookingProcess'

const route = useRoute()
const router = useRouter()
const passengerStore = usePassengerStore()
const orderStore = useOrderStore()
const bookingStore = useBookingStore()

// Journey info from route or store
const ticketInfo = ref({
  trainNo: route.query.trainNo || '',
  from: route.query.from || '',
  to: route.query.to || '',
  departTime: route.query.departTime || '',
  arriveTime: route.query.arriveTime || '',
  duration: route.query.duration || '',
  seatType: route.query.seatType || '',
  price: parseFloat(route.query.price) || 0,
  date: route.query.date || ''
})

// Station details for display
const stationDetails = {
  'Beijing, Beijing West Station': 'China, Beijing, Lianhuachi Donglu, Fengtai District',
  'Xian, Xian North station': 'China, Xian, JWGQ+34 Weiyang, Xi\'an, Shaanxi, China',
  // Add more station details as needed
}

// Helper functions for formatting
function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const month = date.toLocaleString('en-US', { month: 'short' })
  const day = date.getDate()
  return `${month} ${day}`
}

function formatDay(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('en-US', { weekday: 'short' })
}

function formatPrice(price) {
  return `$${price}`
}

function getTrainType(trainNo) {
  if (!trainNo) return 'Train'
  // Simple logic to determine train type based on train number
  const prefix = trainNo.toString().charAt(0).toUpperCase()
  switch (prefix) {
    case 'G': return 'High-Speed Train'
    case 'D': return 'Electric Multiple Unit'
    case 'C': return 'Intercity Train'
    case 'Z': return 'Direct Express'
    case 'T': return 'Express Train'
    case 'K': return 'Fast Train'
    default: return 'Regular Train'
  }
}

// Passenger information
const passengerInfo = ref({
  type: 'Adult',
  surname: '',
  givenName: '',
  gender: '',
  birthday: '',
  passportNumber: '',
  passportExpiry: '',
  country: ''
})

// Contact information
const contactInfo = ref({
  email: ''
})

// Order summary calculation
const orderSummary = computed(() => {
  const basePrice = ticketInfo.value.price
  const serviceFee = 10 // Example service fee
  return {
    seatPrice: basePrice,
    serviceFee: serviceFee,
    totalAmount: basePrice + serviceFee
  }
})

// Countries data for select dropdown
const countries = ref([
  { code: 'USA', name: 'United States' },
  { code: 'GBR', name: 'United Kingdom' },
  { code: 'CAN', name: 'Canada' },
  { code: 'AUS', name: 'Australia' },
  { code: 'CHN', name: 'China' },
  { code: 'JPN', name: 'Japan' },
  { code: 'KOR', name: 'South Korea' },
  { code: 'DEU', name: 'Germany' },
  { code: 'FRA', name: 'France' },
  { code: 'ITA', name: 'Italy' },
  // Add more countries as needed
])

// Form validation rules
const rules = {
  surname: [{ required: true, message: 'Please enter surname', trigger: 'blur' }],
  givenName: [{ required: true, message: 'Please enter given name', trigger: 'blur' }],
  gender: [{ required: true, message: 'Please select gender', trigger: 'change' }],
  birthday: [{ required: true, message: 'Please select birthday', trigger: 'change' }],
  passportNumber: [{ required: true, message: 'Please enter passport number', trigger: 'blur' }],
  passportExpiry: [{ required: true, message: 'Please select passport expiry date', trigger: 'change' }],
  country: [{ required: true, message: 'Please select country', trigger: 'change' }]
}

// Validate form data
function validateForm() {
  // Validate passenger info
  if (!passengerInfo.value.surname || !passengerInfo.value.givenName) {
    ElMessage.error('Please complete passenger name information')
    return false
  }
  
  if (!passengerInfo.value.passportNumber || !passengerInfo.value.country) {
    ElMessage.error('Please complete passport information')
    return false
  }
  
  // Validate contact info
  if (!contactInfo.value.email) {
    ElMessage.error('Please provide an email address for receiving tickets')
    return false
  }
  
  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(contactInfo.value.email)) {
    ElMessage.error('Please provide a valid email address')
    return false
  }
  
  return true
}

// Save passenger and order information to stores
function saveOrderData() {
  // Save passenger to store
  passengerStore.addPassenger({
    ...passengerInfo.value,
    id: Date.now().toString() // Generate a unique ID
  })
  
  // Create order data
  const orderData = {
    id: Date.now().toString(),
    trainNo: ticketInfo.value.trainNo,
    from: ticketInfo.value.from,
    to: ticketInfo.value.to,
    departTime: ticketInfo.value.departTime,
    arriveTime: ticketInfo.value.arriveTime,
    date: ticketInfo.value.date,
    seatType: ticketInfo.value.seatType,
    price: ticketInfo.value.price,
    passengerIds: [passengerStore.passengers[passengerStore.passengers.length - 1].id],
    contactEmail: contactInfo.value.email,
    status: 'pending'
  }
  
  // Save order to store
  orderStore.setCurrentOrder(orderData)
  
  return true
}

// Navigation functions
function proceedToPayment() {
  if (!validateForm()) return
  
  if (saveOrderData()) {
    // Set the next step in the booking process
    bookingStore.setActiveStep(2) // Move to payment step (index 2)
    
    // Navigate to payment page
    router.push('/orders/pay')
  }
}

onMounted(() => {
  // Initialize data if coming from previous step
  // Verify we have the required booking data
  const hasRequiredData = ticketInfo.value.trainNo && 
                          ticketInfo.value.from && 
                          ticketInfo.value.to && 
                          ticketInfo.value.date
  
  if (!hasRequiredData) {
    // Redirect to timetable if missing required data
    ElMessage.warning('Missing train information. Please select a train first.')
    router.push('/trains/timetable')
  }
  
  // Update the step in the booking process store
  bookingStore.setActiveStep(1) // Set to step 1 (0-based index) in the 4-step process
})
</script>

<style scoped>
.passenger-info-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.passenger-info-container {
  display: flex;
  gap: 20px;
}

.left-column {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-column {
  flex: 1;
}

.journey-info-section,
.passenger-info-section,
.passenger-details-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.journey-card {
  display: flex;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  overflow: hidden;
}

.date-section {
  background-color: #f5f7fa;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
}

.date {
  font-size: 18px;
  font-weight: bold;
}

.day {
  font-size: 14px;
  color: #606266;
}

.journey-details {
  flex: 1;
  padding: 15px;
}

.station-info {
  margin-bottom: 15px;
}

.station-name {
  font-weight: bold;
  font-size: 16px;
}

.station-details {
  font-size: 12px;
  color: #909399;
}

.train-info {
  padding: 10px 0;
  margin: 10px 0;
  border-top: 1px dashed #e4e7ed;
  border-bottom: 1px dashed #e4e7ed;
  font-size: 14px;
  color: #606266;
}

.seat-preferences {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
}

.price-tag {
  background-color: #f0f9eb;
  color: #67c23a;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.email-input-section p {
  margin-bottom: 10px;
  font-size: 14px;
  color: #606266;
}

.email-input {
  width: 100%;
}

.passenger-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.passenger-form-container {
  padding: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-item-half {
  flex: 1;
}

.form-item-third {
  flex: 1;
}

.form-item-type {
  width: 100%;
}

.type-hint {
  font-size: 12px;
  color: #909399;
}

.form-note {
  background-color: #f0f9eb;
  border-radius: 4px;
  padding: 10px;
  font-size: 12px;
  color: #67c23a;
  margin-top: 15px;
  line-height: 1.4;
}

.passenger-header {
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 8px 8px 0 0;
}

.warning-icon {
  color: #e6a23c;
  margin-right: 10px;
}

.passenger-title {
  flex: 1;
  font-weight: bold;
}

.passenger-actions {
  cursor: pointer;
}

.add-requests-button {
  margin: 15px;
  display: flex;
  align-items: center;
}

.encryption-notice {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f5f7fa;
  color: #606266;
  font-size: 14px;
  border-radius: 0 0 8px 8px;
}

.encryption-notice i {
  margin-right: 10px;
  color: #67c23a;
}

.order-summary-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.order-summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-summary-header i {
  color: #409eff;
  cursor: pointer;
}

.ticket-info {
  margin: 20px 0;
}

.ticket-type {
  font-weight: bold;
}

.ticket-type-label {
  font-size: 14px;
  color: #606266;
  margin-top: 5px;
}

.ticket-option {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e4e7ed;
}

.option-info-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #909399;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
}

.price-section {
  margin: 20px 0;
}

.total-amount-row {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.total-amount-label {
  font-weight: bold;
  flex: 1;
}

.total-amount-info-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #909399;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 10px;
  cursor: pointer;
}

.total-amount {
  font-size: 24px;
  font-weight: bold;
}

.tax-fees-note {
  font-size: 12px;
  color: #909399;
}

.continue-button {
  width: 100%;
  margin: 20px 0;
}

.details-toggle {
  text-align: center;
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 20px;
}

.additional-info {
  margin-top: 20px;
}

.info-item {
  display: flex;
  margin-bottom: 15px;
}

.icon-container {
  width: 40px;
  height: 40px;
  background-color: #f5f7fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.info-content {
  flex: 1;
}

.info-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.info-details {
  font-size: 14px;
  color: #606266;
}

.page-actions {
  display: none;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .passenger-info-container {
    flex-direction: column;
  }
  
  .page-actions {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 15px;
    background-color: #fff;
    box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .continue-button-mobile {
    width: 100%;
  }
  
  .continue-button {
    display: none;
  }
}
</style>
