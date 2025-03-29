<template>
  <div class="order-payment-page">
    <div class="payment-container">
      <div class="payment-header">
        <div class="order-info">
          <div class="order-id">Order ID: <span>{{ orderId }}</span></div>
          <div class="order-status">
            Order Status: <el-tag type="warning" v-if="orderData?.paymentStatus == '0'">Pending Payment</el-tag>
            <el-tag type="success" v-else-if="orderData?.paymentStatus == '1'">Paid</el-tag>
            <el-tag type="danger" v-else>Failed</el-tag>
          </div>
        </div>
      </div>

      <!-- 订单信息部分 -->
      <div class="order-details" v-if="orderData">
        <div class="train-info">
          <div class="train-header">
            <div class="train-tag">Train {{ orderData.trainNo }}</div>
            <div class="train-date">{{ formatDisplayDate(orderData.fromDate) }}</div>
          </div>

          <div class="train-route">
            <div class="station">
              <div class="name">{{ formatStation(orderData.fromStation, allCities) }}</div>
              <div class="time">{{ orderData.fromTime }}</div>
            </div>
            <div class="route-info">
              <div class="seat-type">{{ orderData.seatType }}</div>
              <div class="duration" v-if="orderData.fromTime && orderData.toTime">
                {{ formatDuration(orderData.runTime) }}
              </div>
            </div>
            <div class="station">
              <div class="name">{{ formatStation(orderData.toStation, allCities) }}</div>
              <div class="time">{{ orderData.toTime }}</div>
            </div>
          </div>
        </div>

        <!-- 乘客信息 -->
        <div class="passengers-section">
          <h3>Passenger Information</h3>
          <div class="passengers">
            <table class="passenger-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Passport Number</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="passenger in orderData.passengers" :key="passenger.passportNumber">
                  <td>{{ passenger.passengerType === 1 ? 'Adult' : 'Child' }}</td>
                  <td>{{ passenger.passportName }}</td>
                  <td>{{ passenger.passportNumber }}</td>
                  <td>{{ passenger.country }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 联系人信息 -->
        <div class="contact-info" v-if="orderData.contact">
          <h3>Contact Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Name:</label>
              <span>{{ orderData.contact.title }} {{ orderData.contact.name }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ orderData.contact.email }}</span>
            </div>
            <div class="info-item">
              <label>Tel:</label>
              <span>{{ orderData.contact.phone }}</span>
            </div>
          </div>
        </div>

        <!-- 价格汇总 -->
        <div class="price-summary">
          <h3>Price Summary</h3>
          
          <!-- 票价明细 -->
          <div class="price-details">
            <div v-for="(group, index) in passengerGroups" :key="index" class="price-detail-item">
              <div class="detail-label">
                {{ group.type === 1 ? 'Adult' : 'Child' }} x {{ group.count }}
              </div>
              <div class="detail-value">{{ currencyStore.currencySymbol }} {{ currencyStore.convertPrice(group.passengerPrice) }}</div>
            </div>

            <!-- 手续费明细 -->
            <div class="price-detail-item refundable-fee">
              <div class="detail-label">Service Fee x {{ orderData.passengers.length }}</div>
              <div class="detail-value">{{ currencyStore.currencySymbol }} {{ currencyStore.convertPrice(orderData.seatFee) * orderData.passengers.length }}</div>
            </div>
            
            <!-- 可退款选项费用 -->
            <div v-if="orderData.contact.refundableOption === 'yes'" class="price-detail-item refundable-fee">
              <div class="detail-label">Refundable booking</div>
              <div class="detail-value">{{ currencyStore.currencySymbol }} {{ currencyStore.convertPrice(9.26) }}</div>
            </div>
            
            <!-- 总金额 -->
            <div class="price-detail-item total">
              <div class="detail-label">Total Price:</div>
              <div class="detail-value total-value">{{ currencyStore.currencySymbol }} {{ totalAmount }}</div>
            </div>
          </div>
        </div>

        <!-- 支付方式选择 -->
        <div class="payment-methods">
          <h3>Payment Methods</h3>
          <div class="payment-options">
            <!-- PayPal 支付选项 -->
            <div 
              class="payment-option" 
              :class="{ selected: selectedPaymentMethod === 'paypal' }"
            >
            <!-- @click="selectPaymentMethod('paypal')" -->
              <div class="option-logo">
                <img src="@/assets/payments/paypal.png" alt="PayPal" />
              </div>
              <div class="option-details">
                <div class="option-name">PayPal</div>
                <div class="option-description">Pay securely with PayPal</div>
              </div>
              <div class="option-check" v-if="selectedPaymentMethod === 'paypal'">
                <el-icon><Check /></el-icon>
              </div>
            </div>
         
          </div> 

          <!-- 支付按钮区域 -->
          <div class="payment-actions">
            <!-- PayPal 支付按钮 -->
            <div v-if="selectedPaymentMethod === 'paypal'">
              <div class="payment-amount-display">
                <p>Total amount: {{ currencyStore.currencySymbol }} {{ totalAmount }}</p>
                <p class="payment-note">Payment will be processed in USD</p>
              </div>
              <div id="paypal-button-container" class="paypal-container"></div>
            </div>
            
            <!-- 安全支付提示 -->
            <div class="secure-payment-note">
              <el-icon><Lock /></el-icon> Secure payment processed by PayPal
            </div>
          </div>
        </div>
      </div>

      <!-- 加载中状态 -->
      <div v-else class="loading-state">
        <el-skeleton :rows="10" animated />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { Check, Lock } from '@element-plus/icons-vue'
import { getOrderById, paymentCallback } from '@/api/modules/orders'
import { useBookingStore } from '@/stores/bookingProcess'
import { useCurrencyStore } from '@/stores/currencyStore'
import { formatDuration, formatStation } from "@/utils/formatters";
import { useCityStore } from "@/stores/city";

const cityStore = useCityStore();
const { allCities } = storeToRefs(cityStore);
const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()
const currencyStore = useCurrencyStore()

const totalAmount = computed(() => {
  const seatFee = currencyStore.convertPrice(orderData.value.seatFee) * orderData.value.passengers.length
  let seatPrice = 0;
  orderData.value.passengers.forEach(passenger => {
    if (passenger.passengerType === 1) {
      seatPrice += currencyStore.convertPrice(passenger.passengerPrice)
    } else {
      seatPrice += currencyStore.convertPrice(passenger.passengerPrice * 0.6)
    }
  })
  let refundableFee = 0;
  if (orderData.value.contact.refundableOption === 'yes') {
    refundableFee = Math.ceil(seatPrice * 0.1)
  }
  return seatFee + seatPrice + refundableFee
})

// 订单ID
const orderId = ref(route.params.orderId)

// 订单数据
const orderData = ref(null)

// 汇率数据
const exchangeRates = ref(null)

// 当前选择的支付方式 - 固定为PayPal
const selectedPaymentMethod = ref('paypal')

// 获取汇率数据
const fetchExchangeRates = async () => {
  try {
    // 模拟API调用，实际项目中应该从真实API获取汇率
    exchangeRates.value = {
      CNY: 1, // 人民币
      USD: 0.14, // 美元
      EUR: 0.13, // 欧元
      SGD: 0.19, // 新加坡元
      JPY: 20.85, // 日元
    };
  } catch (error) {
    console.error("获取汇率失败:", error);
    // 设置默认汇率，以防API调用失败
    exchangeRates.value = {
      CNY: 1,
      USD: 0.14,
      EUR: 0.13,
      SGD: 0.19,
      JPY: 20.85,
    };
  }
};

// 计算乘客分组
const passengerGroups = computed(() => {
  if (!orderData.value || !orderData.value.passengers) return [];
  
  // 初始化计数器
  const groups = {};
  
  // 对乘客进行分组
  orderData.value.passengers.forEach(passenger => {
    const type = passenger.passengerType;
    if (!groups[type]) {
      groups[type] = {
        type,
        count: 0,
        passengerPrice:type === 1 ? orderData.value.seatPrice : orderData.value.seatPrice * 0.6,
        passengerFee: orderData.value.seatFee,
      };
    }
    
    groups[type].count += 1;
  });
  
  console.log('groups', groups)
  return Object.values(groups);
});

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

// 获取订单数据
async function fetchOrderData() {
  if (!orderId.value) {
    ElMessage.error('无效的订单ID');
    router.push('/');
    return;
  }
  
  const loading = ElLoading.service({
    lock: true,
    text: '加载订单数据...',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  
  try {
    const response = await getOrderById(orderId.value);
    orderData.value = response.data;
    
    // 检查订单支付状态
    if (orderData.value?.payment?.paymentStatus === 1) {
      // 如果订单已支付，直接跳转到支付成功页面
      router.push(`/trains/order/${orderId.value}/success`);
      return;
    }
    
    // 如果没有获取到有效数据
    if (!orderData.value) {
      ElMessage.error('加载订单数据失败');
      router.push('/');
    }
  } catch (error) {
    console.error('获取订单数据失败:', error);
    ElMessage.error('加载订单数据失败');
    router.push('/');
  } finally {
    loading.close();
  }
}

// 初始化PayPal按钮
function initPayPalButton() {
  console.log('Initializing PayPal button');
  if (!window.paypal || !orderData.value) return;
  
  // 清空容器
  const container = document.getElementById('paypal-button-container');
  if (container) {
    container.innerHTML = '';
  }
  
  window.paypal.Buttons({
    createOrder: (data, actions) => {
      // 将价格转换为美元
      const usdPrice = totalAmount.value
      console.log('Creating PayPal order', orderData.value, 'USD price:', usdPrice);
      
      return actions.order.create({
        purchase_units: [{
          amount: {
            // 固定使用USD货币
            currency_code: 'USD',
            value: Math.round(usdPrice)
          },
          description: `Train Ticket Order ${orderId.value}`
        }]
      });
    },
    onApprove: async (data, actions) => {
      try {
        console.log('Payment approved, capturing order...');
        const details = await actions.order.capture();
        ElMessage.success(`Payment successful! Thank you ${details.payer.name.given_name}!`);
        console.log('Payment successful!', details);
        
        // 调用后端支付完成API
        try {
          await paymentCallback(orderId.value, 'paypal', details.id, details);
          console.log('Payment completion API call successful');
          
          // 导航到成功页面
          router.push(`/trains/order/${orderId.value}/success`);
        } catch (callbackErr) {
          console.error('Payment completion API error:', callbackErr);
          ElMessage.warning('Payment successful but order status update failed. Please contact support.');
        }
      } catch (err) {
        console.error('Payment capture error:', err);
        ElMessage.error(`Payment failed: ${err.message || 'Please try again.'}`);
      }
    },
    onError: (err) => {
      console.error('PayPal error:', err);
      ElMessage.error(`PayPal error: ${err.message || 'Payment failed. Please try again.'}`);
    }
  }).render('#paypal-button-container');
}

// 等待PayPal SDK加载完成
const checkPayPalSDK = () => {
  if (window.paypal) {
    console.log('PayPal SDK found, initializing button');
    initPayPalButton();
  } else {
    console.log('Waiting for PayPal SDK to load...');
    setTimeout(checkPayPalSDK, 500);
  }
};
// 组件挂载时执行
onMounted(async () => {
  // 获取汇率数据
  await fetchExchangeRates();
  
  // 获取订单数据
  await fetchOrderData();
  
  // 更新导航步骤
  bookingStore.setActiveStep(3); // 设置为支付步骤（第4步）
  
  // 开始检查PayPal SDK是否加载
  checkPayPalSDK();
});
</script>

<style scoped>
.order-payment-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

.payment-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  padding: 30px;
  border: 1px solid #e4e7ed;
  border-bottom: 3px solid #e4e7ed;
}

.payment-header {
  margin-bottom: 30px;
  border-bottom: 1px solid #dcdfe6;
  padding-bottom: 15px;
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-id {
  font-size: 18px;
  color: #303133;
}

.order-id span {
  font-weight: 600;
  color: #303133;
}

.train-info {
  margin-bottom: 30px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
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

.passengers-section, .contact-info, .price-summary, .payment-methods {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background-color: #f5f5f5;
}

h3 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #303133;
  font-weight: 600;
}

.passenger-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
}

.passenger-table th, .passenger-table td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #dcdfe6;
  font-size: 15px;
}

.passenger-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #303133;
}

.passenger-table .text-right {
  text-align: right;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #606266;
  font-size: 15px;
}

.price-details {
  background-color: white;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #dcdfe6;
}

.price-detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
  color: #606266;
}

.price-detail-item.total {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #dcdfe6;
  font-weight: 600;
  color: #303133;
  font-size: 18px;
}

.total-value {
  font-size: 20px;
  color: #303133;
  font-weight: 600;
}

.refundable-fee {
  color: #409eff;
}

.payment-options {
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-option:hover {
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.payment-option.selected {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.option-logo {
  width: 60px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-logo img {
  width: 100%;
  max-height: 40px;
  object-fit: contain;
}

.option-details {
  flex: 1;
}

.option-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.option-description {
  font-size: 14px;
  color: #606266;
}

.option-check {
  color: #409eff;
}

.payment-actions {
  margin-top: 30px;
}

.paypal-container {
  max-width: 400px;
  margin: 0 auto;
}

.payment-amount-display {
  text-align: center;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.payment-note {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.payment-amount-display {
  text-align: center;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.payment-note {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.secure-payment-note {
  text-align: center;
  margin-top: 15px;
  color: #909399;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.secure-payment-note .el-icon {
  margin-right: 5px;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .order-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .order-id {
    margin-bottom: 10px;
  }
  
  .train-route {
    flex-direction: column;
  }
  
  .station, .route-info {
    margin-bottom: 15px;
    text-align: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
