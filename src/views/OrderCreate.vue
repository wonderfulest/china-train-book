<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getExchangeRate } from '@/api/modules/exchange'
import { Delete } from '@element-plus/icons-vue'
import { usePassengerStore } from '@/stores/passenger'
import { useOrderStore } from '@/stores/order'

const route = useRoute()
const router = useRouter()
const passengerStore = usePassengerStore()
const orderStore = useOrderStore()
const passengerForm = ref(null)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editIndex = ref(-1)
const selectedHistoricalPassenger = ref(null)

const currentPassenger = ref({
  type: 'Adult',
  surname: '',
  givenName: '',
  gender: '',
  birthday: '',
  passportNumber: '',
  passportExpiry: '',
  country: ''
})

const rules = {
  surname: [{ required: true, message: 'Please enter surname', trigger: 'blur' }],
  givenName: [{ required: true, message: 'Please enter given name', trigger: 'blur' }],
  gender: [{ required: true, message: 'Please select gender', trigger: 'change' }],
  birthday: [{ required: true, message: 'Please select birthday', trigger: 'change' }],
  passportNumber: [
    { required: true, message: 'Please enter passport number', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (!value) {
          callback();
          return;
        }
        
        // Remove any spaces
        const cleanValue = value.trim();
        
        // Most passport numbers are 6-15 characters
        if (cleanValue.length < 6 || cleanValue.length > 15) {
          callback(new Error('Passport number should be 6-15 characters'));
          return;
        }
        
        // Most passport numbers contain only letters and numbers
        // Some may contain < as a filler character
        const validFormat = /^[A-Z0-9<]+$/i.test(cleanValue);
        if (!validFormat) {
          callback(new Error('Passport number should contain only letters, numbers, or < symbol'));
          return;
        }
        
        callback();
      },
      trigger: 'blur'
    }
  ],
  passportExpiry: [{ required: true, message: 'Please select passport expiry date', trigger: 'change' }],
  country: [
    { required: true, message: 'Please select country', trigger: 'change' },
    { 
      validator: (rule, value, callback) => {
        const isValidCountry = countries.value.some(country => country.code === value);
        if (!isValidCountry) {
          callback(new Error('Please select a valid country from the list'));
        } else {
          callback();
        }
      }, 
      trigger: 'change' 
    }
  ]
}

// 使用 computed 获取乘客列表
const passengers = computed(() => passengerStore.passengers)

// 使用 computed 获取历史乘客列表
const historicalPassengers = computed(() => passengerStore.historicalPassengers)

const exchangeRate = ref(null)
const countries = ref([
  { code: 'AFG', name: 'Afghanistan' },
  { code: 'ALB', name: 'Albania' },
  { code: 'DZA', name: 'Algeria' },
  { code: 'AND', name: 'Andorra' },
  { code: 'AGO', name: 'Angola' },
  { code: 'ATG', name: 'Antigua and Barbuda' },
  { code: 'ARG', name: 'Argentina' },
  { code: 'ARM', name: 'Armenia' },
  { code: 'AUS', name: 'Australia' },
  { code: 'AUT', name: 'Austria' },
  { code: 'AZE', name: 'Azerbaijan' },
  { code: 'BHS', name: 'Bahamas' },
  { code: 'BHR', name: 'Bahrain' },
  { code: 'BGD', name: 'Bangladesh' },
  { code: 'BRB', name: 'Barbados' },
  { code: 'BLR', name: 'Belarus' },
  { code: 'BEL', name: 'Belgium' },
  { code: 'BLZ', name: 'Belize' },
  { code: 'BEN', name: 'Benin' },
  { code: 'BTN', name: 'Bhutan' },
  { code: 'BOL', name: 'Bolivia' },
  { code: 'BIH', name: 'Bosnia and Herzegovina' },
  { code: 'BWA', name: 'Botswana' },
  { code: 'BRA', name: 'Brazil' },
  { code: 'BRN', name: 'Brunei' },
  { code: 'BGR', name: 'Bulgaria' },
  { code: 'BFA', name: 'Burkina Faso' },
  { code: 'BDI', name: 'Burundi' },
  { code: 'CPV', name: 'Cabo Verde' },
  { code: 'KHM', name: 'Cambodia' },
  { code: 'CMR', name: 'Cameroon' },
  { code: 'CAN', name: 'Canada' },
  { code: 'CAF', name: 'Central African Republic' },
  { code: 'TCD', name: 'Chad' },
  { code: 'CHL', name: 'Chile' },
  { code: 'CHN', name: 'China' },
  { code: 'COL', name: 'Colombia' },
  { code: 'COM', name: 'Comoros' },
  { code: 'COG', name: 'Congo' },
  { code: 'CRI', name: 'Costa Rica' },
  { code: 'CIV', name: 'Côte d\'Ivoire' },
  { code: 'HRV', name: 'Croatia' },
  { code: 'CUB', name: 'Cuba' },
  { code: 'CYP', name: 'Cyprus' },
  { code: 'CZE', name: 'Czech Republic' },
  { code: 'PRK', name: 'North Korea' },
  { code: 'COD', name: 'Democratic Republic of the Congo' },
  { code: 'DNK', name: 'Denmark' },
  { code: 'DJI', name: 'Djibouti' },
  { code: 'DMA', name: 'Dominica' },
  { code: 'DOM', name: 'Dominican Republic' },
  { code: 'ECU', name: 'Ecuador' },
  { code: 'EGY', name: 'Egypt' },
  { code: 'SLV', name: 'El Salvador' },
  { code: 'GNQ', name: 'Equatorial Guinea' },
  { code: 'ERI', name: 'Eritrea' },
  { code: 'EST', name: 'Estonia' },
  { code: 'SWZ', name: 'Eswatini' },
  { code: 'ETH', name: 'Ethiopia' },
  { code: 'FJI', name: 'Fiji' },
  { code: 'FIN', name: 'Finland' },
  { code: 'FRA', name: 'France' },
  { code: 'GAB', name: 'Gabon' },
  { code: 'GMB', name: 'Gambia' },
  { code: 'GEO', name: 'Georgia' },
  { code: 'DEU', name: 'Germany' },
  { code: 'GHA', name: 'Ghana' },
  { code: 'GRC', name: 'Greece' },
  { code: 'GRD', name: 'Grenada' },
  { code: 'GTM', name: 'Guatemala' },
  { code: 'GIN', name: 'Guinea' },
  { code: 'GNB', name: 'Guinea-Bissau' },
  { code: 'GUY', name: 'Guyana' },
  { code: 'HTI', name: 'Haiti' },
  { code: 'HND', name: 'Honduras' },
  { code: 'HUN', name: 'Hungary' },
  { code: 'ISL', name: 'Iceland' },
  { code: 'IND', name: 'India' },
  { code: 'IDN', name: 'Indonesia' },
  { code: 'IRN', name: 'Iran' },
  { code: 'IRQ', name: 'Iraq' },
  { code: 'IRL', name: 'Ireland' },
  { code: 'ISR', name: 'Israel' },
  { code: 'ITA', name: 'Italy' },
  { code: 'JAM', name: 'Jamaica' },
  { code: 'JPN', name: 'Japan' },
  { code: 'JOR', name: 'Jordan' },
  { code: 'KAZ', name: 'Kazakhstan' },
  { code: 'KEN', name: 'Kenya' },
  { code: 'KIR', name: 'Kiribati' },
  { code: 'KWT', name: 'Kuwait' },
  { code: 'KGZ', name: 'Kyrgyzstan' },
  { code: 'LAO', name: 'Laos' },
  { code: 'LVA', name: 'Latvia' },
  { code: 'LBN', name: 'Lebanon' },
  { code: 'LSO', name: 'Lesotho' },
  { code: 'LBR', name: 'Liberia' },
  { code: 'LBY', name: 'Libya' },
  { code: 'LIE', name: 'Liechtenstein' },
  { code: 'LTU', name: 'Lithuania' },
  { code: 'LUX', name: 'Luxembourg' },
  { code: 'MDG', name: 'Madagascar' },
  { code: 'MWI', name: 'Malawi' },
  { code: 'MYS', name: 'Malaysia' },
  { code: 'MDV', name: 'Maldives' },
  { code: 'MLI', name: 'Mali' },
  { code: 'MLT', name: 'Malta' },
  { code: 'MHL', name: 'Marshall Islands' },
  { code: 'MRT', name: 'Mauritania' },
  { code: 'MUS', name: 'Mauritius' },
  { code: 'MEX', name: 'Mexico' },
  { code: 'FSM', name: 'Micronesia' },
  { code: 'MDA', name: 'Moldova' },
  { code: 'MCO', name: 'Monaco' },
  { code: 'MNG', name: 'Mongolia' },
  { code: 'MNE', name: 'Montenegro' },
  { code: 'MAR', name: 'Morocco' },
  { code: 'MOZ', name: 'Mozambique' },
  { code: 'MMR', name: 'Myanmar' },
  { code: 'NAM', name: 'Namibia' },
  { code: 'NRU', name: 'Nauru' },
  { code: 'NPL', name: 'Nepal' },
  { code: 'NLD', name: 'Netherlands' },
  { code: 'NZL', name: 'New Zealand' },
  { code: 'NIC', name: 'Nicaragua' },
  { code: 'NER', name: 'Niger' },
  { code: 'NGA', name: 'Nigeria' },
  { code: 'MKD', name: 'North Macedonia' },
  { code: 'NOR', name: 'Norway' },
  { code: 'OMN', name: 'Oman' },
  { code: 'PAK', name: 'Pakistan' },
  { code: 'PLW', name: 'Palau' },
  { code: 'PAN', name: 'Panama' },
  { code: 'PNG', name: 'Papua New Guinea' },
  { code: 'PRY', name: 'Paraguay' },
  { code: 'PER', name: 'Peru' },
  { code: 'PHL', name: 'Philippines' },
  { code: 'POL', name: 'Poland' },
  { code: 'PRT', name: 'Portugal' },
  { code: 'QAT', name: 'Qatar' },
  { code: 'KOR', name: 'South Korea' },
  { code: 'ROU', name: 'Romania' },
  { code: 'RUS', name: 'Russia' },
  { code: 'RWA', name: 'Rwanda' },
  { code: 'KNA', name: 'Saint Kitts and Nevis' },
  { code: 'LCA', name: 'Saint Lucia' },
  { code: 'VCT', name: 'Saint Vincent and the Grenadines' },
  { code: 'WSM', name: 'Samoa' },
  { code: 'SMR', name: 'San Marino' },
  { code: 'STP', name: 'Sao Tome and Principe' },
  { code: 'SAU', name: 'Saudi Arabia' },
  { code: 'SEN', name: 'Senegal' },
  { code: 'SRB', name: 'Serbia' },
  { code: 'SYC', name: 'Seychelles' },
  { code: 'SLE', name: 'Sierra Leone' },
  { code: 'SGP', name: 'Singapore' },
  { code: 'SVK', name: 'Slovakia' },
  { code: 'SVN', name: 'Slovenia' },
  { code: 'SLB', name: 'Solomon Islands' },
  { code: 'SOM', name: 'Somalia' },
  { code: 'ZAF', name: 'South Africa' },
  { code: 'SSD', name: 'South Sudan' },
  { code: 'ESP', name: 'Spain' },
  { code: 'LKA', name: 'Sri Lanka' },
  { code: 'SDN', name: 'Sudan' },
  { code: 'SUR', name: 'Suriname' },
  { code: 'SWE', name: 'Sweden' },
  { code: 'CHE', name: 'Switzerland' },
  { code: 'SYR', name: 'Syria' },
  { code: 'TJK', name: 'Tajikistan' },
  { code: 'TZA', name: 'Tanzania' },
  { code: 'THA', name: 'Thailand' },
  { code: 'TLS', name: 'Timor-Leste' },
  { code: 'TGO', name: 'Togo' },
  { code: 'TON', name: 'Tonga' },
  { code: 'TTO', name: 'Trinidad and Tobago' },
  { code: 'TUN', name: 'Tunisia' },
  { code: 'TUR', name: 'Turkey' },
  { code: 'TKM', name: 'Turkmenistan' },
  { code: 'TUV', name: 'Tuvalu' },
  { code: 'UGA', name: 'Uganda' },
  { code: 'UKR', name: 'Ukraine' },
  { code: 'ARE', name: 'United Arab Emirates' },
  { code: 'GBR', name: 'United Kingdom' },
  { code: 'USA', name: 'United States' },
  { code: 'URY', name: 'Uruguay' },
  { code: 'UZB', name: 'Uzbekistan' },
  { code: 'VUT', name: 'Vanuatu' },
  { code: 'VAT', name: 'Vatican City' },
  { code: 'VEN', name: 'Venezuela' },
  { code: 'VNM', name: 'Vietnam' },
  { code: 'YEM', name: 'Yemen' },
  { code: 'ZMB', name: 'Zambia' },
  { code: 'ZWE', name: 'Zimbabwe' }
])

// 获取汇率
const fetchExchangeRate = async () => {
  try {
    const response = {
      code: '0',
      message: null,
      data: {
        exchangeRate: {
          fromCurrencyCode: 'CNY',
          fromCurrencyName: 'Chinese Yuan',
          toCurrencyCode: 'USD',
          toCurrencyName: 'United States Dollar',
          exchangeRate: '0.13810000',
          lastRefreshed: '',
          timeZone: 'UTC',
          bidPrice: '0.13809000',
          askPrice: '0.13810000'
        }
      }
    }
    if (response.code === '0' && response.data?.exchangeRate) {
      const rate = parseFloat(response.data.exchangeRate.exchangeRate)
      exchangeRate.value = rate * (1 - 0.005)
    }
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error)
    ElMessage.error('Failed to load exchange rate data')
  }
}

// 转换价格从人民币到美元
const convertToUSD = (cnyPrice) => {
  if (!exchangeRate.value || !cnyPrice) return 0
  const usdPrice = parseFloat(cnyPrice) * exchangeRate.value
  return Math.ceil(usdPrice) // 向上取整
}

// 从路由参数获取车票信息
const ticketInfo = computed(() => ({
  trainNo: route.query.trainNo,
  from: route.query.from,
  to: route.query.to,
  date: route.query.date,
  departTime: route.query.departTime,
  arriveTime: route.query.arriveTime,
  duration: route.query.duration,
  seatType: route.query.seatType,
  price: route.query.price
}))

// 计算总价
const total = computed(() => {
  const adultCount = passengers.value.filter(p => p.type === 'Adult').length || 0
  const childCount = passengers.value.filter(p => p.type === 'Child').length || 0
  const adultPrice = convertToUSD(ticketInfo.value.price)
  const childPrice = Math.ceil(adultPrice * 0.65) // 儿童票价为成人票65%，向上取整
  const servicePrice = 15 // 服务费(USD)
  
  return {
    adult: {
      count: adultCount,
      price: adultPrice,
      total: adultPrice * adultCount
    },
    child: {
      count: childCount,
      price: childPrice,
      total: childPrice * childCount
    },
    service: {
      count: adultCount + childCount,
      price: servicePrice,
      total: servicePrice * (adultCount + childCount)
    },
    totalAmount: (adultPrice * adultCount) + (childPrice * childCount) + (servicePrice * (adultCount + childCount))
  }
})

// 显示添加对话框
const showAddDialog = () => {
  isEdit.value = false
  currentPassenger.value = {
    type: 'Adult',
    surname: '',
    givenName: '',
    gender: '',
    birthday: '',
    passportNumber: '',
    passportExpiry: '',
    country: ''
  }
  dialogVisible.value = true
}

// 编辑乘客
const editPassenger = (row, index) => {
  isEdit.value = true
  editIndex.value = index
  currentPassenger.value = { ...row }
  dialogVisible.value = true
}

// 选择历史乘客
const selectHistoricalPassenger = (passenger) => {
  // 检查该乘客是否已在当前列表中
  const isDuplicate = passengers.value.some(p => 
    p.passportNumber === passenger.passportNumber
  )

  if (isDuplicate) {
    ElMessage.warning('This passenger has already been added')
    return
  }

  selectedHistoricalPassenger.value = passenger.passportNumber
  currentPassenger.value = { ...passenger }
}

// 关闭对话框时重置选中状态
const closeDialog = () => {
  dialogVisible.value = false
  selectedHistoricalPassenger.value = null
}

// 保存乘客信息
const savePassenger = () => {
  passengerForm.value.validate((valid) => {
    if (valid) {
      // 检查护照号是否已存在
      const isDuplicate = passengers.value.some((p, idx) => {
        // 编辑时跳过当前编辑的乘客
        if (isEdit.value && idx === editIndex.value) {
          return false
        }
        return p.passportNumber === currentPassenger.value.passportNumber
      })

      if (isDuplicate) {
        ElMessage.error('This passenger has already been added')
        return
      }

      if (isEdit.value) {
        // 更新现有乘客
        passengerStore.updatePassenger(editIndex.value, currentPassenger.value)
      } else {
        // 添加新乘客
        passengerStore.addPassenger(currentPassenger.value)
      }
      dialogVisible.value = false
      ElMessage.success(`Successfully ${isEdit.value ? 'updated' : 'added'} passenger`)
    }
  })
}

// 删除乘客
const removePassenger = (index) => {
  if (passengerStore.removePassenger(index)) {
    ElMessage.success('Successfully removed passenger')
  }
}

// 验证乘客信息
const validatePassengers = () => {
  if (passengers.value.length === 0) {
    ElMessage.error('Please add at least one passenger')
    return false
  }

  for (const passenger of passengers.value) {
    if (!passenger.surname || !passenger.givenName) {
      ElMessage.error('Please enter passenger name')
      return false
    }
    if (!passenger.gender) {
      ElMessage.error('Please select passenger gender')
      return false
    }
    if (!passenger.birthday) {
      ElMessage.error('Please enter passenger birthday')
      return false
    }
    if (!passenger.passportNumber) {
      ElMessage.error('Please enter passport number')
      return false
    }
    
    // Validate passport number format
    const cleanPassportNumber = passenger.passportNumber.trim();
    if (cleanPassportNumber.length < 6 || cleanPassportNumber.length > 15) {
      ElMessage.error('Passport number should be 6-15 characters')
      return false
    }
    
    const validPassportFormat = /^[A-Z0-9<]+$/i.test(cleanPassportNumber);
    if (!validPassportFormat) {
      ElMessage.error('Passport number should contain only letters, numbers, or < symbol')
      return false
    }
    if (!passenger.passportExpiry) {
      ElMessage.error('Please enter passport expiry date')
      return false
    }
    if (!passenger.country) {
      ElMessage.error('Please select country of passport')
      return false
    }
    
    // Validate that country is a valid code from the list
    const isValidCountry = countries.value.some(country => country.code === passenger.country);
    if (!isValidCountry) {
      ElMessage.error(`Invalid country code "${passenger.country}". Please select a valid country from the list.`);
      return false;
    }

    // 验证护照有效期
    const expiryDate = new Date(passenger.passportExpiry)
    if (expiryDate <= new Date()) {
      ElMessage.error('Passport has expired')
      return false
    }

    // 验证儿童年龄
    if (passenger.type === 'Child') {
      const birthDate = new Date(passenger.birthday)
      const age = Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000))
      if (age >= 14) {
        ElMessage.error('Child passenger must be under 14 years old')
        return false
      }
      if (age < 6) {
        ElMessage.warning('Children under 6 do not need a ticket to sit on lap')
      }
    }
  }

  return true
}

// 验证价格信息
const validatePrices = () => {
  if (!exchangeRate.value) {
    ElMessage.error('Failed to get exchange rate')
    return false
  }

  const totalPrice = total.value
  if (!totalPrice || 
      isNaN(totalPrice.adult.total) || 
      isNaN(totalPrice.child.total) || 
      isNaN(totalPrice.service.total) ||
      isNaN(totalPrice.totalAmount)) {
    ElMessage.error('Invalid price calculation')
    return false
  }

  return true
}

// 提交订单
const submitOrder = () => {
  if (!validatePassengers()) {
    return
  }

  if (!validatePrices()) {
    return
  }

  // 准备订单数据
  const orderData = {
    trainNo: ticketInfo.value.trainNo,
    date: ticketInfo.value.date,
    from: ticketInfo.value.from,
    to: ticketInfo.value.to,
    departTime: ticketInfo.value.departTime,
    arriveTime: ticketInfo.value.arriveTime,
    seatType: ticketInfo.value.seatType,
    passengers: passengers.value,
    price: total.value
  }

  // 创建订单
  const order = orderStore.createOrder(orderData)
  
  // 清空乘客信息
  passengerStore.clearPassengers()
  
  // 跳转到创建订单页
  router.push({
    path: '/booking/create',
    query: { orderId: order.id }
  })
  
  ElMessage.success('Order created successfully')
}

// 初始化
onMounted(() => {
  fetchExchangeRate()
  // 清空之前的乘客信息
  passengerStore.clearPassengers()
})
</script>

<template>
  <div class="create-order">
    <!-- 车票信息 -->
    <div class="ticket-info">
      <div class="train-header">
        <div class="train-number">Train {{ ticketInfo.trainNo }}</div>
        <div class="train-date">{{ ticketInfo.date }}</div>
      </div>
      <div class="train-route">
        <div class="station departure">
          <div class="name">{{ ticketInfo.from }}</div>
          <div class="time">{{ ticketInfo.departTime }}</div>
        </div>
        <div class="duration">
          <div class="line"></div>
          <div class="time">{{ ticketInfo.duration }}</div>
        </div>
        <div class="station arrival">
          <div class="name">{{ ticketInfo.to }}</div>
          <div class="time">{{ ticketInfo.arriveTime }}</div>
        </div>
      </div>
      <div class="seat-info">
        <div class="type">{{ ticketInfo.seatType }}</div>
      </div>
    </div>

    <!-- 乘客信息 -->
    <div class="passenger-info">
      <div class="header">
        <h3>Passenger Information</h3>
        <el-button type="primary" @click="showAddDialog">+ Add Passenger</el-button>
      </div>
      <el-table :data="passengers" style="width: 100%">
        <el-table-column prop="type" label="A/C" width="150" />
        <el-table-column prop="surname" label="Surname" />
        <el-table-column prop="givenName" label="Given Name" />
        <el-table-column prop="passportNumber" label="Passport Number" />
        <el-table-column prop="country" label="Country Of Passport" />
        <el-table-column label="Operations" width="150" align="center">
          <template #default="{ row, $index }">
            <el-button
              type="primary"
              link
              size="small"
              @click="editPassenger(row, $index)"
            >
              Edit
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="removePassenger($index)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 乘客信息弹框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? 'Edit Passenger' : 'Add Passenger'"
      width="500px"
      @close="closeDialog"
    >
      <!-- 历史乘客选择 -->
      <div v-if="!isEdit && historicalPassengers.length > 0" class="historical-passengers">
        <div class="section-title">Select from existing passengers:</div>
        <div class="passenger-list">
          <div
            v-for="passenger in historicalPassengers"
            :key="passenger.id"
            class="passenger-item"
            :class="{ 'is-selected': selectedHistoricalPassenger === passenger.passportNumber }"
            @click="selectHistoricalPassenger(passenger)"
          >
            <div class="passenger-info">
              <div class="name">{{ passenger.surname }}, {{ passenger.givenName }}</div>
              <div class="passport">{{ passenger.passportNumber }}</div>
            </div>
            <div class="passenger-type-tag" :class="passenger.type.toLowerCase()">
              {{ passenger.type }}
            </div>
          </div>
        </div>
        <el-divider>Or fill in manually</el-divider>
      </div>

      <el-form
        ref="passengerForm"
        :model="currentPassenger"
        :rules="rules"
        label-position="top"
      >
        <div class="passenger-type">
          <el-radio-group v-model="currentPassenger.type">
            <el-radio label="Adult">
              Adult
            </el-radio>
            <el-radio label="Child">
              <span>Child</span>
              <span class="type-hint">under 14 years old;</span>
            </el-radio>
          </el-radio-group>
          <div class="type-note" v-if="currentPassenger.type === 'Child'">
            infants under 6 do not need a ticket to sit on lap
          </div>
        </div>

        <el-form-item label="Surname" prop="surname">
          <el-input v-model="currentPassenger.surname" placeholder="Enter surname" />
        </el-form-item>

        <el-form-item label="Given Name" prop="givenName">
          <el-input v-model="currentPassenger.givenName" placeholder="Enter given name" />
        </el-form-item>

        <el-form-item label="Gender" prop="gender">
          <el-select v-model="currentPassenger.gender" placeholder="Select gender" style="width: 100%">
            <el-option label="Female" value="Female" />
            <el-option label="Male" value="Male" />
          </el-select>
        </el-form-item>

        <el-form-item label="Birthday" prop="birthday">
          <el-date-picker
            v-model="currentPassenger.birthday"
            type="date"
            placeholder="Select birthday"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Passport Number" prop="passportNumber">
          <el-input v-model="currentPassenger.passportNumber" placeholder="Enter passport number" />
        </el-form-item>

        <el-form-item label="Passport Expiry" prop="passportExpiry">
          <el-date-picker
            v-model="currentPassenger.passportExpiry"
            type="date"
            placeholder="Select passport expiry date"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Country Of Passport" prop="country">
          <el-select 
            v-model="currentPassenger.country" 
            filterable 
            placeholder="Select country"
            style="width: 100%"
          >
            <el-option
              v-for="country in countries"
              :key="country.code"
              :label="country.name"
              :value="country.code"
            />
          </el-select>
        </el-form-item>

        <div class="form-note">
          The passenger's name and passport number should exactly match Machine Readable Zone of your passport's identity page. Only 26 English letters A-Z allowed. Abbreviation or missing of name are not allowed. According to real-name policy, a ticket with incorrect passport info cannot be collected at station.
          <el-button type="warning" link>Sample</el-button>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="savePassenger">
            {{ isEdit ? 'Update' : 'Add' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 价格明细 -->
    <div class="price-details">
      <div class="price-row">
        <div class="price-label">Adult × {{ total.adult.count }}</div>
        <div class="price-value">
          <span class="currency">USD</span>
          <span class="amount">{{ total.adult.price }}</span>
          <span class="unit">/person</span>
        </div>
        <div class="price-total">
          <span class="currency">USD</span>
          <span class="amount">{{ total.adult.total }}</span>
        </div>
      </div>
      <div class="price-row">
        <div class="price-label">Child × {{ total.child.count }}</div>
        <div class="price-value">
          <span class="currency">USD</span>
          <span class="amount">{{ total.child.price }}</span>
          <span class="unit">/person</span>
        </div>
        <div class="price-total">
          <span class="currency">USD</span>
          <span class="amount">{{ total.child.total }}</span>
        </div>
      </div>
      <div class="price-row">
        <div class="price-label">Service fee × {{ total.service.count }}</div>
        <div class="price-value">
          <span class="currency">USD</span>
          <span class="amount">{{ total.service.price }}</span>
          <span class="unit">/person</span>
        </div>
        <div class="price-total">
          <span class="currency">USD</span>
          <span class="amount">{{ total.service.total }}</span>
        </div>
      </div>
      <div class="price-row total">
        <div class="price-label">Total</div>
        <div class="price-value"></div>
        <div class="price-total">
          <span class="currency">USD</span>
          <span class="amount">{{ total.totalAmount }}</span>
        </div>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="submit-section">
      <el-button type="primary" @click="submitOrder">Continue</el-button>
    </div>
  </div>
</template>

<style scoped>
.create-order {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}

.ticket-info {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.train-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.train-route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.duration {
  flex: 1;
  text-align: center;
  position: relative;
  padding: 0 20px;
}

.duration .line {
  height: 2px;
  background: #dcdfe6;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
}

.station {
  text-align: center;
}

.station .name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.station .time {
  color: #606266;
}

.passenger-info {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.passenger-info .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

:deep(.el-table .cell) {
  padding: 8px;
}

/* 表格中的输入框样式 */
.el-table :deep(.el-input__wrapper) {
  box-shadow: none !important;
  background-color: transparent;
}

.el-table :deep(.el-select .el-input__wrapper) {
  box-shadow: none !important;
  background-color: transparent;
}

/* 弹框中的输入框样式 */
.el-dialog :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset !important;
  background-color: #ffffff;
}

.el-dialog :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset !important;
}

.el-dialog :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset !important;
}

/* 弹框中的下拉框样式 */
.el-dialog :deep(.el-select .el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset !important;
  background-color: #ffffff;
}

.el-dialog :deep(.el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset !important;
}

.el-dialog :deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset !important;
}

/* 弹框中的日期选择器样式 */
.el-dialog :deep(.el-date-editor.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset !important;
  background-color: #ffffff;
}

.el-dialog :deep(.el-date-editor.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset !important;
}

.el-dialog :deep(.el-date-editor.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset !important;
}

.price-details {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px 0;
}

.price-label {
  flex: 1;
  color: #606266;
}

.price-value {
  flex: 1;
  text-align: center;
}

.price-total {
  flex: 1;
  text-align: right;
}

.currency {
  color: #909399;
  margin-right: 4px;
  font-size: 14px;
}

.amount {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.unit {
  color: #909399;
  margin-left: 4px;
  font-size: 14px;
}

.price-row.total {
  border-top: 1px solid #ebeef5;
  font-weight: bold;
  margin-top: 20px;
  padding-top: 20px;
}

.price-row.total .amount {
  font-size: 20px;
  color: #f56c6c;
}

.submit-section {
  text-align: center;
  margin-top: 20px;
}

.submit-section .el-button {
  width: 200px;
}

.passenger-type {
  margin-bottom: 20px;
}

.type-hint {
  color: #909399;
  font-size: 12px;
  margin-left: 4px;
}

.type-note {
  color: #909399;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 24px;
}

.form-note {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-top: 20px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

:deep(.el-dialog__body) {
  padding: 20px 24px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.historical-passengers {
  margin-bottom: 16px;
}

.section-title {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.passenger-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
}

.passenger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 0; /* 防止内容溢出 */
}

.passenger-item:hover {
  border-color: #409eff;
  background-color: #f5f7fa;
}

.passenger-item.is-selected {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.passenger-info {
  min-width: 0; /* 防止内容溢出 */
  margin-right: 8px;
}

.passenger-info .name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 0;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.passenger-info .passport {
  font-size: 12px;
  color: #909399;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.passenger-type-tag {
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
  flex-shrink: 0; /* 防止标签被压缩 */
}

.el-divider {
  margin: 16px 0;
}
</style>
