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
                      <el-radio :value="'Adult'">Adult</el-radio>
                      <el-radio :value="'Child'">Child <span class="type-hint">(under 14 years old)</span></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
                
                <div class="form-row">
                  <el-form-item label="Passport Name" class="form-item-full">
                    <el-input v-model="passengerInfo.passport_name" placeholder="Full name as shown on passport" />
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

            <div class="encryption-notice">
              <i class="el-icon-lock"></i>
              Your personal information is encrypted
            </div>
          </div>
        </div>

    <!-- Contact Information and Additional Options Section -->
    <div class="contact-additional-section">
      <div class="contact-options-section">
        <h2>Contact & Additional Information</h2>
        <div class="email-input-section">
          <p>请您提供一个有效的电子邮件地址，我们会将电子车票发送给您。</p>
          <el-form :model="contactInfo" label-position="top">
            <div class="form-row">
              <el-form-item label="电子邮件" class="form-item-full">
                <el-input 
                  v-model="contactInfo.email" 
                  placeholder="电子邮件" 
                  class="email-input"
                  @blur="showConfirmEmail = true"
                />
              </el-form-item>
            </div>
            <div class="form-row" v-if="showConfirmEmail && contactInfo.email">
              <el-form-item label="确认电子邮件" class="form-item-full">
                <el-input 
                  v-model="contactInfo.confirmEmail" 
                  placeholder="请再次输入电子邮件以确认" 
                  class="email-input"
                />
              </el-form-item>
            </div>
          </el-form>
        </div>

        <div class="contact-form">
          <h2>Additional Options</h2>
          <el-form :model="contactInfo" label-position="top">
            <div class="form-row">
              <el-form-item label="Tel / Mobile (Optional):" class="form-item-full">
                <el-input v-model="contactInfo.phone" placeholder="Phone number" />
              </el-form-item>
            </div>
          </el-form>

          <div class="option-section">
            <h3>In case the selected tickets are not available, I would like to</h3>
            <el-radio-group v-model="unavailableOption">
              <div class="radio-item">
                <el-radio :value="'upgrade'">upgrade to higher class</el-radio>
              </div>
              <div class="radio-item">
                <el-radio :value="'downgrade'">downgrade to lower class</el-radio>
              </div>
              <div class="radio-item">
                <el-radio :value="'switch'">switch to an alternative train operating on a similar timetable within 1 hour</el-radio>
              </div>
              <div class="radio-item">
                <el-radio :value="'cancel'">cancel and refund</el-radio>
              </div>
            </el-radio-group>
          </div>

          <div class="option-section">
            <h3>Upgrade to refundable booking (recommended)</h3>
            <p class="upgrade-info">
              Upgrade your booking for {{ formatPrice(9.26) }} and receive a FULL refund ({{ formatPrice(97.50) }}) if you cannot attend and can evidence one of the many reasons in our 
              <el-link type="primary" href="#" @click.prevent>Terms and Conditions</el-link>, 
              which you accept when you select a Refundable Booking. 
              <el-link type="primary" href="#" @click.prevent>See more</el-link>.
            </p>
            <el-radio-group v-model="refundableOption">
              <div class="radio-item">
                <el-radio :value="'yes'">
                  Yes, Upgrade my booking. (+{{ formatPrice(9.26) }})
                  <el-tag size="small" type="danger" effect="light">recommended</el-tag>
                </el-radio>
              </div>
              <div class="radio-item">
                <el-radio :value="'no'">No, keep my book non-refundable.</el-radio>
              </div>
            </el-radio-group>
          </div>

          <div class="option-section">
            <h3>How to receive tickets?</h3>
            <el-radio-group v-model="receiveOption">
              <div class="radio-item">
                <el-radio :value="'email'">Receive e-ticket by email</el-radio>
              </div>
            </el-radio-group>
          </div>

          <div class="terms-section">
            <el-checkbox v-model="agreeToTerms">
              I have read and agree to the 
              <el-link type="primary" href="#" @click.prevent>Terms and Conditions</el-link>
            </el-checkbox>
          </div>
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
import { ElMessage, ElLoading } from 'element-plus'
import { usePassengerStore } from '@/stores/passenger'
import { useBookingStore } from '@/stores/bookingProcess'
import { useCurrencyStore } from '@/stores/currencyStore'
import { getOrderPassengers, updateOrderPassengers } from '@/api/modules/orders'

const route = useRoute()
const router = useRouter()
const passengerStore = usePassengerStore()
const bookingStore = useBookingStore()
const currencyStore = useCurrencyStore()

// 汇率数据
const exchangeRates = ref(null)

// 获取汇率数据
const fetchExchangeRates = async () => {
  try {
    // 模拟API调用，实际项目中应该从真实API获取汇率
    // 这里使用模拟数据，假设1人民币等于：
    exchangeRates.value = {
      CNY: 1,      // 人民币
      USD: 0.14,   // 美元
      EUR: 0.13,   // 欧元
      SGD: 0.19,   // 新加坡元
      JPY: 20.85   // 日元
    }
  } catch (error) {
    console.error('获取汇率失败:', error)
    // 设置默认汇率，以防API调用失败
    exchangeRates.value = {
      CNY: 1,
      USD: 0.14,
      EUR: 0.13,
      SGD: 0.19,
      JPY: 20.85
    }
  }
}

// 转换价格从人民币到当前选择的货币
const convertPrice = (cnyPrice) => {
  if (!exchangeRates.value || !cnyPrice) return 0
  const targetCurrency = currencyStore.currency
  const rate = exchangeRates.value[targetCurrency]
  if (!rate) return 0
  
  const convertedPrice = parseFloat(cnyPrice) * rate
  return Math.ceil(convertedPrice) // 向上取整到整数
}

// Journey info from store
const ticketInfo = ref({
  trainNo: '',
  from: '',
  to: '',
  departTime: '',
  arriveTime: '',
  duration: '',
  seatType: '',
  price: 0,
  date: ''
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
  // 先转换价格，再添加货币符号
  const convertedPrice = convertPrice(price)
  return `${currencyStore.currencySymbol}${convertedPrice}`
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
  passport_name: '',
  gender: '',
  birthday: '',
  passportNumber: '',
  passportExpiry: '',
  country: ''
})

// Contact information
const contactInfo = ref({
  title: 'Mr',
  name: '',
  email: '',
  confirmEmail: '',
  phone: ''
})

// Additional options
const unavailableOption = ref('upgrade')
const refundableOption = ref('yes')
const receiveOption = ref('email')
const agreeToTerms = ref(false)

// 控制是否显示确认邮箱字段
const showConfirmEmail = ref(false)

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
  passport_name: [{ required: true, message: 'Please enter full passport name', trigger: 'blur' }],
  gender: [{ required: true, message: 'Please select gender', trigger: 'change' }],
  birthday: [{ required: true, message: 'Please select birthday', trigger: 'change' }],
  passportNumber: [{ required: true, message: 'Please enter passport number', trigger: 'blur' }],
  passportExpiry: [{ required: true, message: 'Please select passport expiry date', trigger: 'change' }],
  country: [{ required: true, message: 'Please select country', trigger: 'change' }]
}

// Validate form data
function validateForm() {
  // Validate passenger info
  if (!passengerInfo.value.passport_name) {
    ElMessage.error('Please enter passenger passport name')
    return false
  }
  
  if (!passengerInfo.value.passportNumber || !passengerInfo.value.country) {
    ElMessage.error('Please complete passport information')
    return false
  }
  
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
  
  // Confirm email validation
  if (contactInfo.value.email && contactInfo.value.confirmEmail && contactInfo.value.email !== contactInfo.value.confirmEmail) {
    ElMessage.error('邮箱地址不匹配')
    return false
  }
  
  // Phone validation
  if (!contactInfo.value.phone) {
    ElMessage.error('Please provide a phone number')
    return false
  }
  
  // Terms validation
  if (!agreeToTerms.value) {
    ElMessage.error('Please agree to the Terms and Conditions')
    return false
  }
  
  return true
}

// 保存乘客和订单信息
async function saveOrderData() {
  // 保存乘客到store
  passengerStore.addPassenger({
    ...passengerInfo.value
  })
  
  // 计算额外费用
  let additionalCost = 0
  if (refundableOption.value === 'yes') {
    additionalCost += 9.26 // 可退款预订费
  }
  
  // 如果有订单ID，则更新订单乘客信息
  if (orderId.value) {
    try {
      // 计算价格
      const price = 10 // 基础价格
      const fee = 8 // 服务费
      const price_total = price + fee
      
      // 准备完整的订单数据
      const orderUpdateData = {
        trainNo: ticketInfo.value.trainNo,
        from: ticketInfo.value.from,
        to: ticketInfo.value.to,
        seatType: ticketInfo.value.seatType,
        departTime: ticketInfo.value.departTime,
        arriveTime: ticketInfo.value.arriveTime,
        passengers: [
          {
            type: passengerInfo.value.type,
            passport_name: passengerInfo.value.passport_name,
            gender: passengerInfo.value.gender,
            birthday: passengerInfo.value.birthday,
            passportNumber: passengerInfo.value.passportNumber,
            passportExpiry: passengerInfo.value.passportExpiry,
            country: passengerInfo.value.country,
            price: price,
            fee: fee,
            price_total: price_total
          }
        ],
        price_amount: price_total,
        contact: {
          title: contactInfo.value.title,
          name: contactInfo.value.name || passengerInfo.value.passport_name, // 如果没有联系人姓名，使用乘客姓名
          email: contactInfo.value.email,
          confirmEmail: contactInfo.value.confirmEmail,
          phone: contactInfo.value.phone,
          unavailableOption: unavailableOption.value,
          refundableOption: refundableOption.value,
          receiveOption: receiveOption.value
        }
      }
      
      // 调用API更新订单乘客信息
      await updateOrderPassengers(orderId.value, orderUpdateData)
    } catch (error) {
      console.error('更新乘客信息失败:', error)
      ElMessage.error('更新乘客信息失败，请重试')
      return false
    }
  }
  
  return true
}

// 导航函数
async function proceedToPayment() {
  if (!validateForm()) return
  
  const loading = ElLoading.service({
    lock: true,
    text: '保存乘客信息...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  try {
    if (await saveOrderData()) {
      // 设置订单流程的下一步
      bookingStore.setActiveStep(3) // 移动到支付步骤（索引3）
      
      // 导航到支付页面
      if (orderId.value) {
        router.push(`/trains/order/${orderId.value}/pay`)
      } else {
        router.push('/orders/pay')
      }
    }
  } catch (error) {
    console.error('处理支付失败:', error)
    ElMessage.error('处理支付失败，请重试')
  } finally {
    loading.close()
  }
}

// 获取订单ID
const orderId = computed(() => route.params.orderId)

// 乘客信息页面初始化

// 加载订单乘客信息
const loadOrderPassengers = async () => {
  if (!orderId.value) return
  
  const loading = ElLoading.service({
    lock: true,
    text: '加载乘客信息...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  try {
    // 尝试从 store 中获取车票信息
    const storeTicketInfo = bookingStore.getTicketInfo()
    
    if (storeTicketInfo) {
      // 如果 store 中有车票信息，直接使用
      ticketInfo.value = storeTicketInfo
    } else {
      // 如果 store 中没有，则从 API 获取
      const response = await getOrderPassengers(orderId.value)
      const orderData = response.data
      
      // 更新车票信息
      ticketInfo.value = {
        trainNo: orderData.trainNo || '',
        from: orderData.from || '',
        to: orderData.to || '',
        departTime: orderData.departTime || '',
        arriveTime: orderData.arriveTime || '',
        duration: orderData.duration || '',
        seatType: orderData.seatType || '',
        price: parseFloat(orderData.priceAmount) || 0,
        date: orderData.date || ''
      }
      
      // 将车票信息保存到 store
      bookingStore.setTicketInfo(ticketInfo.value)
      
      // 如果有乘客信息，则填充表单
      if (orderData.passengers && orderData.passengers.length > 0) {
        const passenger = orderData.passengers[0]
        passengerInfo.value = {
          type: passenger.type || 'Adult',
          passport_name: passenger.passport_name || '',
          gender: passenger.gender || '',
          birthday: passenger.birthday || '',
          passportNumber: passenger.passportNumber || '',
          passportExpiry: passenger.passportExpiry || '',
          country: passenger.country || ''
        }
      }
      
      // 如果有联系人信息，则填充表单
      if (orderData.contact) {
        contactInfo.value = {
          title: orderData.contact.title || 'Mr',
          name: orderData.contact.name || '',
          email: orderData.contact.email || '',
          confirmEmail: orderData.contact.confirmEmail || '',
          phone: orderData.contact.phone || ''
        }
        
        // 填充其他选项
        if (orderData.contact.unavailableOption) {
          unavailableOption.value = orderData.contact.unavailableOption
        }
        if (orderData.contact.refundableOption) {
          refundableOption.value = orderData.contact.refundableOption
        }
        if (orderData.contact.receiveOption) {
          receiveOption.value = orderData.contact.receiveOption
        }
      }
    }
  } catch (error) {
    console.error('获取乘客信息失败:', error)
    ElMessage.error('获取乘客信息失败，请重试')
  } finally {
    loading.close()
  }
}

onMounted(() => {
  // 获取汇率数据
  fetchExchangeRates()
  
  // 加载订单乘客信息
  loadOrderPassengers()
  
  // 如果是从路由参数获取的订单信息
  if (route.query && Object.keys(route.query).length > 0) {
    // 从路由参数填充车票信息
    ticketInfo.value = {
      trainNo: route.query.trainNo || '',
      from: route.query.from || '',
      to: route.query.to || '',
      departTime: route.query.departTime || '',
      arriveTime: route.query.arriveTime || '',
      duration: route.query.duration || '',
      seatType: route.query.seatType || '',
      price: parseFloat(route.query.price) || 0,
      date: route.query.date || ''
    }
  }
  
  // 验证是否有必要的数据
  const hasRequiredData = ticketInfo.value.trainNo && 
                          ticketInfo.value.from && 
                          ticketInfo.value.to && 
                          ticketInfo.value.date
  
  if (!hasRequiredData && !orderId.value) {
    // 如果没有必要的数据且没有订单ID，则重定向到时刻表页面
    ElMessage.warning('缺少列车信息，请先选择一个列车')
    router.push('/trains/timetable')
  }
  
  // 更新订单流程中的步骤
  bookingStore.setActiveStep(2) // 设置为第2步（基于0的索引）
})
</script>

<style scoped>
.passenger-info-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.form-item-type,
.form-item-full {
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

/* Contact and Additional Options Sections */
.contact-additional-section {
  margin-top: 20px;
}

.contact-options-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.email-input-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.email-input-section p {
  margin-bottom: 10px;
  font-size: 14px;
  color: #606266;
}

.name-input-group {
  display: flex;
  gap: 10px;
}

.title-select {
  width: 80px;
}

.option-section {
  margin-bottom: 20px;
}

.option-section h3 {
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 600;
}

.radio-item {
  margin-bottom: 8px;
}

.upgrade-info {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
  line-height: 1.4;
}

.terms-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
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
