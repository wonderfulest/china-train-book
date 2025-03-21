<template>
  <div class="passenger-info-page">
    <div class="passenger-info-container">
      <!-- Left column: journey info, passenger details, contact info -->
      <div class="left-column">
        <!-- Journey Information Section -->
        <div class="journey-info-section">
          <div class="section-header" @click="toggleSection('journey')">
            <h2>Ticket Summary</h2>
            <i :class="[sections.journey ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
          </div>
          <div class="journey-card" v-if="sections.journey">
            <div class="date-section">
              <div class="date">{{ formatDate(orderInfo.date) }}</div>
              <div class="day">{{ formatDay(orderInfo.date) }}, {{ orderInfo.departTime }}</div>
            </div>
            <div class="journey-details">
              <div class="station-info">
                <div class="station-name">{{ formatStation(orderInfo.from, allCities) }} - {{ orderInfo.departTime }}</div>
              </div>
              <div class="train-info">
                <div class="train-number">Train #{{ orderInfo.trainNo }} - {{ getTrainType(orderInfo.trainNo) }} / Travel time {{ orderInfo.duration }}</div>
              </div>
              <div class="station-info">
                <div class="station-name">{{ formatStation(orderInfo.to, allCities) }} - {{ orderInfo.arriveTime }}</div>
              </div>
              <div class="seat-preferences">
                {{ orderInfo }} 
                <span>{{ orderInfo.seatType }}</span>
                <span class="price-tag">{{ formatPrice(orderInfo.seatPriceTotal) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Passenger Information Section -->
        <div class="passenger-details-section">
          <div class="section-header" @click="toggleSection('passengers')">
            <h2>Passenger Information</h2>
            <div class="section-actions">
              <Icon icon="icon-park-solid:add-one" width="28" height="28" style="color: var(--el-button-primary-background)" @click.stop="addPassenger"/>
            </div>
          </div>
          <div v-if="sections.passengers">
            <div v-for="(passenger, index) in passengersList" :key="index" class="passenger-card">
              <div class="passenger-header" @click="togglePassengerForm(index)">
                <div class="warning-icon">
                  <i class="el-icon-warning"></i>
                </div>
                <div class="passenger-title">乘客 {{ index + 1 }}</div>
                <div class="passenger-actions">
                
                  <Icon icon="material-symbols:delete-outline" width="24" height="24"  style="color: var(--el-button-primary-background)"  @click.stop="removePassenger(index)"  />
                </div>
              </div>

              <div v-if="passenger.isExpanded">
                <div class="quick-fill-section" v-if="historicalPassengers.length > 0">
                  <h3>Quick Fill</h3>
                  <div class="quick-fill-radio-group">
                    <el-radio-group v-model="passenger.selectedHistoricalId" @change="(id) => selectHistoricalPassenger(id, index)">
                      <div class="quick-fill-radio-row" v-for="histPassenger in historicalPassengers" :key="histPassenger.id">
                        <el-radio :label="histPassenger.id">{{ histPassenger.passportName }}</el-radio>
                        <Icon icon="ant-design:user-delete-outlined" width="24" height="24"  style="color: var(--el-button-primary-background)" @click.stop="deleteHistoricalPassenger(histPassenger.id)" />
                      </div>
                    </el-radio-group>
                  </div>
                </div>

                <div class="passenger-form-container">
                  <el-form :model="passenger.info" label-position="top">
                    <div class="form-row">
                      <el-form-item label="Passenger Type" class="form-item-type">
                        <el-radio-group v-model="passenger.info.passengerType">
                          <el-radio :value="1">Adult</el-radio>
                          <el-radio :value="2">Child <span class="type-hint">(under 14 years old)</span></el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </div>

                    <div class="form-row">
                      <el-form-item label="Passport Name" class="form-item-full">
                        <el-input v-model="passenger.info.passportName" placeholder="Full name as shown on passport" />
                      </el-form-item>
                    </div>

                    <div class="form-row">
                      <el-form-item label="Gender" class="form-item-third">
                        <el-select v-model="passenger.info.gender" placeholder="Select">
                          <el-option label="Male" :value="1" />
                          <el-option label="Female" :value="2" />
                          <el-option label="--" :value="0" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="Birthday" class="form-item-third">
                        <el-date-picker v-model="passenger.info.birthday" type="date" placeholder="Select date" style="width: 100%" />
                      </el-form-item>
                      <el-form-item label="Country of Passport" class="form-item-third">
                        <el-select v-model="passenger.info.country" placeholder="Select country" filterable>
                          <el-option v-for="country in countries" :key="country.code" :label="country.name" :value="country.code" />
                        </el-select>
                      </el-form-item>
                    </div>

                    <div class="form-row">
                      <el-form-item label="Passport Number" class="form-item-half">
                        <el-input v-model="passenger.info.passportNumber" placeholder="Enter passport number" />
                      </el-form-item>
                      <el-form-item label="Passport Expiry Date" class="form-item-half">
                        <el-date-picker v-model="passenger.info.passportExpiry" type="date" placeholder="Select date" style="width: 100%" />
                      </el-form-item>
                    </div>
                  </el-form>
                </div>

                <div class="encryption-notice">
                  <i class="el-icon-lock"></i>
                  Your personal information is encrypted
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information and Additional Options Section -->
        <div class="contact-additional-section">
          <div class="contact-options-section">
            <div class="section-header" @click="toggleSection('contact')">
              <h2>Contact & Additional Information</h2>
              <i :class="[sections.contact ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
            </div>
            <div v-if="sections.contact">
              <div class="email-input-section">
                <p>请您提供一个有效的电子邮件地址，我们会将电子车票发送给您。</p>
                <el-form :model="contactInfo" label-position="top">
                  <div class="form-row">
                    <el-form-item label="电子邮件" class="form-item-full">
                      <el-input v-model="contactInfo.email" placeholder="电子邮件" class="email-input" @blur="showConfirmEmail = true" />
                    </el-form-item>
                  </div>
                  <div class="form-row" v-if="showConfirmEmail && contactInfo.email">
                    <el-form-item label="确认电子邮件" class="form-item-full">
                      <el-input v-model="contactInfo.confirmEmail" placeholder="请再次输入电子邮件以确认" class="email-input" />
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
                    <div class="radio-item-inline">
                      <el-radio :value="'upgrade'">upgrade to higher class</el-radio>
                      <el-radio :value="'downgrade'">downgrade to lower class</el-radio>
                      <el-radio :value="'switch'">alternative train</el-radio>
                      <el-radio :value="'cancel'">cancel and refund</el-radio>
                    </div>
                  </el-radio-group>
                </div>

                <div class="option-section">
                  <h3>Upgrade to refundable booking (recommended)</h3>
                  <p class="upgrade-info">
                    Upgrade your booking for {{ formatPrice(9.26) }} and receive a FULL refund ({{ formatPrice(97.5) }}) if you cannot attend and can evidence one of the many reasons in our
                    <el-link type="primary" href="#" @click.prevent>Terms and Conditions</el-link>, which you accept when you select a Refundable Booking. <el-link type="primary" href="#" @click.prevent>See more</el-link>.
                  </p>
                  <el-radio-group v-model="refundableOption">
                    <div class="radio-item-inline">
                      <el-radio :value="'yes'">
                        Yes, Upgrade my booking. (+{{ formatPrice(9.26) }})
                        <el-tag size="small" type="danger" effect="light">recommended</el-tag>
                      </el-radio>
                      <el-radio :value="'no'">No, keep my book non-refundable.</el-radio>
                    </div>
                  </el-radio-group>
                </div>

                <div class="option-section">
                  <h3>How to receive tickets?</h3>
                  <el-radio-group v-model="receiveOption">
                    <div class="radio-item-inline">
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
      </div>

      <!-- Right column: Order summary and payment info -->
      <div class="right-column">
        <div class="order-summary-card">
          <div class="order-summary-header">
            <h2>Order Summary</h2>
            <i class="el-icon-edit"></i>
          </div>

          <div class="ticket-info">
            <div class="ticket-type">{{ orderInfo.seatType }}</div>
            <div class="ticket-type-label">E-ticket</div>
          </div>

          <div class="ticket-option">
            <div class="option-label">Flexible</div>
            <div class="option-info-icon">i</div>
          </div>

          <div class="price-section">
            <!-- 票价明细 -->
            <div class="price-details">
              <div class="price-detail-header">Price Details</div>

              <!-- 乘客类型分组 -->
              <div v-for="(group, index) in passengerGroups" :key="index" class="price-detail-item">
                <div class="detail-label">{{ group.passengerType == PASSENGER_TYPE_ADULT ? 'Adult' : 'Child' }} x {{ group.count }}</div>
                <div class="detail-value">{{ formatPrice(group.seatPrice) }}</div>
              </div>

              <!-- 服务费 -->
              <div class="price-detail-item service-fee">
                <div class="detail-label">Service fee x {{ passengerGroups.length }}</div>
                <div class="detail-value">{{ formatPrice(orderInfo.seatFee * passengerGroups.length) }}</div>
              </div>

              <!-- 可退款选项费用 -->
              <div v-if="refundableOption === 'yes'" class="price-detail-item refundable-fee">
                <div class="detail-label">Refundable booking  x {{ passengerGroups.length }}</div>
                <div class="detail-value">{{ formatPrice(50 * passengerGroups.length) }}</div>
              </div>
            </div>

            <!-- 总金额 -->
            <div class="total-amount-row">
              <div class="total-amount-label">Total amount</div>
              <div class="total-amount-info-icon">i</div>
              <div class="total-amount">{{ formatPrice(orderSummary.totalAmount) }}</div>
            </div>
            <div class="tax-fees-note">includes all taxes and fees</div>
          </div>

          <el-button type="primary" class="continue-button" icon="el-icon-arrow-right" @click="proceedToPayment">Continue</el-button>

          <div class="details-toggle">See Details <i class="el-icon-arrow-down"></i></div>

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
        <div class="page-actions">
          <el-button type="primary" class="continue-button-mobile" @click="proceedToPayment">Continue</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";
import { usePassengerStore } from "@/stores/passenger";
import { useBookingStore } from "@/stores/bookingProcess";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useCityStore } from "@/stores/city";
import { getOrderById, updateOrderPassengers } from "@/api/modules/orders";
import { formatDuration, formatStation } from "@/utils/formatters";

const route = useRoute();
const router = useRouter();
const passengerStore = usePassengerStore();
const bookingStore = useBookingStore();
const currencyStore = useCurrencyStore();
const cityStore = useCityStore();
const { allCities } = storeToRefs(cityStore);
const { currency, currencySymbol } = storeToRefs(currencyStore);

// order info
const orderInfo = ref({});

// 获取订单ID
const orderId = computed(() => route.params.orderId);

// 各部分的展开/折叠状态
const sections = ref({
  journey: true,
  passengers: true,
  contact: false,
});

onMounted(async () => {
  await Promise.all([currencyStore.initialize(), cityStore.initializeCityData()]);
  // 加载订单乘客信息
  await loadOrderPassengers();

  // 验证是否有必要的数据
  const hasRequiredData = orderInfo.value.trainNo && orderInfo.value.from && orderInfo.value.to && orderInfo.value.date;

  if (!hasRequiredData && !orderId.value) {
    // 如果没有必要的数据且没有订单ID，则重定向到时刻表页面
    ElMessage.warning("缺少列车信息，请先选择一个列车");
    router.push("/trains/timetable");
  }

  // 更新订单流程中的步骤
  bookingStore.setActiveStep(2); // 设置为第2步（基于0的索引）
});

// Helper functions for formatting
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  return `${month} ${day}`;
}

function formatDay(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", { weekday: "short" });
}

function formatPrice(price) {
  // 先转换价格，再添加货币符号
  const convertedPrice = currencyStore.convertPrice(price);
  return `${currencyStore.currencySymbol} ${Math.round(convertedPrice)}`;
}

function getTrainType(trainNo) {
  if (!trainNo) return "Train";
  // Simple logic to determine train type based on train number
  const prefix = trainNo.toString().charAt(0).toUpperCase();
  switch (prefix) {
    case "G":
      return "High-Speed Train";
    case "D":
      return "Electric Multiple Unit";
    case "C":
      return "Intercity Train";
    case "Z":
      return "Direct Express";
    case "T":
      return "Express Train";
    case "K":
      return "Fast Train";
    default:
      return "Regular Train";
  }
}

// 切换各部分的展开/折叠状态
function toggleSection(section) {
  sections.value[section] = !sections.value[section];
}

// 乘客列表
const passengersList = ref([
  {
    selectedHistoricalId: null,
    isExpanded: true, // 默认展开第一个乘客
    info: {
      passengerType: 1,
      passportName: "",
      gender: 0,
      birthday: "",
      passportNumber: "",
      passportExpiry: "",
      country: "",
    },
  },
]);

// 切换乘客表单展开/收起状态
function togglePassengerForm(index) {
  passengersList.value[index].isExpanded = !passengersList.value[index].isExpanded;
}

// 已保存的乘客列表
const historicalPassengers = computed(() => passengerStore.historicalPassengers);

// 添加乘客
function addPassenger() {
  passengersList.value.push({
    selectedHistoricalId: null,
    isExpanded: true, // 默认展开新添加的乘客
    info: {
      passengerType: 1,
      passportName: "",
      gender: 0,
      birthday: "",
      passportNumber: "",
      passportExpiry: "",
      country: "",
    },
  });
  ElMessage.success("已添加新乘客");
}

// 删除乘客
function removePassenger(index) {
  if (passengersList.value.length <= 1) {
    ElMessage.warning("至少需要保留一名乘客");
    return;
  }
  passengersList.value.splice(index, 1);
  ElMessage.success("已删除乘客");
}

// 选择历史乘客的方法
function selectHistoricalPassenger(id, passengerIndex) {
  if (!id) {
    // 如果清除选择，重置表单
    passengersList.value[passengerIndex].info = {
      passengerType: 1,
      passportName: "",
      gender: 0,
      birthday: "",
      passportNumber: "",
      passportExpiry: "",
      country: "",
    };
    passengersList.value[passengerIndex].selectedHistoricalId = null;
    return;
  }

  const passenger = historicalPassengers.value.find((p) => p.id === id);
  if (passenger) {
    // 填充表单
    passengersList.value[passengerIndex].info = {
      passengerType: passenger.passengerType || 1,
      passportName: passenger.passportName || "",
      gender: passenger.gender || 0,
      birthday: passenger.birthday || "",
      passportNumber: passenger.passportNumber || "",
      passportExpiry: passenger.passportExpiry || "",
      country: passenger.country || "",
    };

    // 设置选中的历史乘客ID
    passengersList.value[passengerIndex].selectedHistoricalId = id;

    // 显示成功提示
    ElMessage.success("已自动填充乘客信息");
  }
}

// 删除历史乘客
function deleteHistoricalPassenger(id) {
  if (!id) return;

  // 弹出确认对话框
  ElMessageBox.confirm("确定要删除这个历史乘客记录吗？删除后无法恢复。", "删除确认", {
    confirmButtonText: "确定删除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 调用store中的删除方法
      const success = passengerStore.removeHistoricalPassenger(id);

      if (success) {
        // 重置所有选中了该历史乘客的乘客表单
        passengersList.value.forEach((passenger) => {
          if (passenger.selectedHistoricalId === id) {
            passenger.selectedHistoricalId = null;
          }
        });

        ElMessage.success("已删除历史乘客记录");
      } else {
        ElMessage.error("删除失败，请重试");
      }
    })
    .catch(() => {
      // 取消删除
    });
}

// 获取国家名称
function getCountryName(code) {
  const country = countries.value.find((c) => c.code === code);
  return country ? country.name : code;
}


const passengerTypeOptions = [
  { value: 1, label: "Adult" },
  { value: 2, label: "Child" },
];

const passengerTypeMap = {
  1: "Adult",
  2: "Child",
};

const PASSENGER_TYPE_ADULT = 1;
const PASSENGER_TYPE_CHILD = 2;
// Contact information
const contactInfo = ref({
  title: "Mr",
  name: "",
  email: "",
  confirmEmail: "",
  phone: "",
});

// Additional options
const unavailableOption = ref("upgrade");
const refundableOption = ref("yes");
const receiveOption = ref("email");
const agreeToTerms = ref(false);

// 控制是否显示确认邮箱字段
const showConfirmEmail = ref(false);

// 根据乘客类型进行分组计算
const passengerGroups = computed(() => {
  // 初始化计数器
  const groups = {};

  // 对乘客进行分组
  passengersList.value.forEach((passenger) => {
    const passengerType = passenger.info.passengerType;
    if (!groups[passengerType]) {
      groups[passengerType] = {
        passengerType: passengerType,
        count: 0,
        seatPrice: passengerType === PASSENGER_TYPE_ADULT ? orderInfo.value.seatPrice : orderInfo.value.seatPrice * 0.5, // 成人和儿童的基础票价
        seatFee: orderInfo.value.seatFee, // 每位乘客的服务费
        seatPriceTotal: 0,
      };
    }

    groups[passengerType].count += 1;
    // 单个乘客的总价 = 基础票价 + 服务费
    const personTotal = groups[passengerType].seatPrice + groups[passengerType].seatFee;
    groups[passengerType].seatPriceTotal += personTotal;
  });

  return Object.values(groups);
});

// Order summary calculation
const orderSummary = computed(() => {
  console.log('groups', passengerGroups.value)
  // 所有乘客的票价总和
  const seatPriceSum = passengerGroups.value.reduce((sum, group) => sum + group.seatPrice, 0);

  // 服务费总和（已经包含在每位乘客的价格中）
  const seatFeeSum = passengerGroups.value.reduce((sum, group) => sum + group.seatFee * group.count, 0);

  // 可退款选项费用
  const seatRefundSum = refundableOption.value === "yes" ? 50 * passengerGroups.value.length: 0;

  // 总金额
  const totalAmount = seatPriceSum + seatFeeSum + seatRefundSum;

  return {
    seatPriceSum,
    seatFeeSum,
    seatRefundSum,
    totalAmount,
  };
});

// Countries data for select dropdown
const countries = ref([
  { code: "USA", name: "United States" },
  { code: "GBR", name: "United Kingdom" },
  { code: "CAN", name: "Canada" },
  { code: "AUS", name: "Australia" },
  { code: "CHN", name: "China" },
  { code: "JPN", name: "Japan" },
  { code: "KOR", name: "South Korea" },
  { code: "DEU", name: "Germany" },
  { code: "FRA", name: "France" },
  { code: "ITA", name: "Italy" },
  // Add more countries as needed
]);

// Form validation rules
const rules = {
  passportName: [{ required: true, message: "Please enter full passport name", trigger: "blur" }],
  gender: [{ required: true, message: "Please select gender", trigger: "change" }],
  birthday: [{ required: true, message: "Please select birthday", trigger: "change" }],
  passportNumber: [{ required: true, message: "Please enter passport number", trigger: "blur" }],
  passportExpiry: [{ required: true, message: "Please select passport expiry date", trigger: "change" }],
  country: [{ required: true, message: "Please select country", trigger: "change" }],
};

// Validate form data
function validateForm() {
  // 验证所有乘客信息
  for (let i = 0; i < passengersList.value.length; i++) {
    const passenger = passengersList.value[i].info;

    if (!passenger.passportName) {
      ElMessage.error(`乘客 ${i + 1}: 请输入护照姓名`);
      return false;
    }

    if (!passenger.passportNumber) {
      ElMessage.error(`乘客 ${i + 1}: 请输入护照号码`);
      return false;
    }

    if (!passenger.country) {
      ElMessage.error(`乘客 ${i + 1}: 请选择护照国家`);
      return false;
    }

    if (!passenger.gender) {
      ElMessage.error(`乘客 ${i + 1}: 请选择性别`);
      return false;
    }

    if (!passenger.birthday) {
      ElMessage.error(`乘客 ${i + 1}: 请选择出生日期`);
      return false;
    }

    if (!passenger.passportExpiry) {
      ElMessage.error(`乘客 ${i + 1}: 请选择护照有效期`);
      return false;
    }
  }

  // 验证联系人信息
  if (!contactInfo.value.email) {
    ElMessage.error("请提供电子邮件地址以接收车票");
    return false;
  }

  // 电子邮件格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactInfo.value.email)) {
    ElMessage.error("请提供有效的电子邮件地址");
    return false;
  }

  // 确认电子邮件验证
  if (contactInfo.value.email && contactInfo.value.confirmEmail && contactInfo.value.email !== contactInfo.value.confirmEmail) {
    ElMessage.error("邮箱地址不匹配");
    return false;
  }

  // 电话验证
  if (!contactInfo.value.phone) {
    ElMessage.error("请提供联系电话");
    return false;
  }

  // 条款验证
  if (!agreeToTerms.value) {
    ElMessage.error("请同意条款和条件");
    return false;
  }

  return true;
}

// 保存乘客和订单信息
async function submitOrderPassengers() {
  // 保存所有乘客到store
  passengersList.value.forEach((passenger) => {
    passengerStore.addPassenger({
      ...passenger.info,
    });
  });

  // 计算额外费用
  let additionalCost = 0;
  if (refundableOption.value === "yes") {
    additionalCost += 50; // 可退款预订费
  }

  // 如果有订单ID，则更新订单乘客信息
  if (orderId.value) {
    try {
      // 准备乘客数据
      const passengersData = passengersList.value.map((passenger) => {
        return {
          passengerType: passenger.info.passengerType,
          passportName: passenger.info.passportName,
          gender: passenger.info.gender,
          birthday: passenger.info.birthday,
          passportNumber: passenger.info.passportNumber,
          passportExpiry: passenger.info.passportExpiry,
          country: passenger.info.country,
          seatPrice: orderInfo.value.seatPrice,
          seatFee: orderInfo.value.seatFee,
          seatRefund: orderInfo.value.seatRefund,
          seatPriceTotal: orderInfo.value.seatPrice + orderInfo.value.seatFee + orderInfo.value.seatRefund,
        };
      });

      // 计算总价
      const totalPrice = passengersData.reduce((sum, p) => sum + p.seatPriceTotal, 0) + additionalCost;

      // 准备完整的订单数据
      const orderUpdateData = {
        trainNo: orderInfo.value.trainNo,
        from: orderInfo.value.from,
        to: orderInfo.value.to,
        seatType: orderInfo.value.seatType,
        departTime: orderInfo.value.departTime,
        arriveTime: orderInfo.value.arriveTime,
        passengers: passengersData,
        price_amount: totalPrice,
        contact: {
          title: contactInfo.value.title,
          name: contactInfo.value.name || passengersList.value[0].info.passportName, // 如果没有联系人姓名，使用第一个乘客姓名
          email: contactInfo.value.email,
          phone: contactInfo.value.phone,
          unavailableOption: unavailableOption.value,
          refundableOption: refundableOption.value,
          receiveOption: receiveOption.value,
        },
      };

      console.log("更新订单乘客信息:", orderUpdateData);
      // 调用API更新订单乘客信息
      await updateOrderPassengers(orderId.value, orderUpdateData);
    } catch (error) {
      console.error("更新乘客信息失败:", error);
      ElMessage.error("更新乘客信息失败，请重试");
      return false;
    }
  }

  return true;
}

// 导航函数
async function proceedToPayment() {
  if (!validateForm()) return;

  const loading = ElLoading.service({
    lock: true,
    text: "保存乘客信息...",
    background: "rgba(0, 0, 0, 0.7)",
  });

  try {
    if (await submitOrderPassengers()) {
      // 设置订单流程的下一步
      bookingStore.setActiveStep(3); // 移动到支付步骤（索引3）

      // 导航到支付页面
      if (orderId.value) {
        router.push(`/trains/order/${orderId.value}/pay`);
      } else {
        router.push("/orders/pay");
      }
    }
  } catch (error) {
    console.error("处理支付失败:", error);
    ElMessage.error("处理支付失败，请重试");
  } finally {
    loading.close();
  }
}

// 乘客信息页面初始化

// 加载订单乘客信息
const loadOrderPassengers = async () => {
  if (!orderId.value) return;

  const loading = ElLoading.service({
    lock: true,
    text: "加载乘客信息...",
    background: "rgba(0, 0, 0, 0.7)",
  });

  try {
    // 如果 store 中没有，则从 API 获取
    const response = await getOrderById(orderId.value);
    const orderData = response.data;
    orderInfo.value = {
      trainNo: orderData.trainNo,
      from: orderData.from,
      to: orderData.to,
      date: orderData.date,
      departTime: orderData.departTime,
      arriveTime: orderData.arriveTime,
      duration: orderData.duration,
      seatType: orderData.seatType,
      seatPrice: orderData.seatPrice,
      seatFee: orderData.seatFee,
      seatRefund: orderData.seatRefund || 50,
      seatPriceTotal: orderData.seatPriceTotal,
    };

    // 如果有乘客信息，则填充表单
    if (orderData.passengers && orderData.passengers.length > 0) {
      // 清空默认的乘客列表
      passengersList.value = [];
      // 将所有乘客添加到列表中
      orderData.passengers.forEach((passenger, idx) => {
        passengersList.value.push({
          selectedHistoricalId: null,
          isExpanded: idx === 0, // 只展开第一个乘客
          info: {
            passengerType: passenger.passengerType || 1,
            passportName: passenger.passportName || "",
            gender: passenger.gender || 0,
            birthday: passenger.birthday || "",
            passportNumber: passenger.passportNumber || "",
            passportExpiry: passenger.passportExpiry || "",
            country: passenger.country || "",
          },
        });
      });

      // 如果没有乘客，添加一个默认的空乘客
      if (passengersList.value.length === 0) {
        passengersList.value.push({
          selectedHistoricalId: null,
          isExpanded: true,
          info: {
            passengerType: 1,
            passportName: "",
            gender: 0,
            birthday: "",
            passportNumber: "",
            passportExpiry: "",
            country: "",
          },
        });
      }
    }

    // 如果有联系人信息，则填充表单
    if (orderData.contact) {
      contactInfo.value = {
        title: orderData.contact.title || "Mr",
        name: orderData.contact.name || "",
        email: orderData.contact.email || "",
        confirmEmail: orderData.contact.confirmEmail || "",
        phone: orderData.contact.phone || "",
      };

      // 填充其他选项
      if (orderData.contact.unavailableOption) {
        unavailableOption.value = orderData.contact.unavailableOption;
      }
      if (orderData.contact.refundableOption) {
        refundableOption.value = orderData.contact.refundableOption;
      }
      if (orderData.contact.receiveOption) {
        receiveOption.value = orderData.contact.receiveOption;
      }
    }
  } catch (error) {
    console.error("获取乘客信息失败:", error);
    ElMessage.error("获取乘客信息失败，请重试");
  } finally {
    loading.close();
  }
};
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
  width: 100%;
}

.left-column {
  flex: 2; /* 占据2/3宽度 */
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-column {
  flex: 1; /* 占据1/3宽度 */
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
  margin-bottom: 15px;
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
  cursor: pointer;
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

.price-details {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.price-detail-header {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 16px;
  color: #303133;
}

.price-detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.service-fee {
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px dashed #dcdfe6;
}

.refundable-fee {
  color: #409eff;
  font-weight: 500;
}

.total-amount-row {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #dcdfe6;
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.radio-item-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
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

/* 历史乘客选择部分 */
.quick-fill-section {
  padding: 15px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
}

.quick-fill-section h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 14px;
  color: #606266;
}

.quick-fill-radio-group {
  max-height: 150px;
  overflow-y: auto;
}

.quick-fill-radio-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px dashed #ebeef5;
}

.quick-fill-radio-row:last-child {
  border-bottom: none;
}

.saved-passengers h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}

.saved-passengers-description {
  font-size: 14px;
  color: #606266;
  margin-bottom: 15px;
}

.passenger-option {
  display: flex;
  flex-direction: column;
}

.passenger-option-name {
  font-weight: bold;
  font-size: 14px;
}

.passenger-option-details {
  font-size: 12px;
  color: #909399;
  display: flex;
  flex-direction: column;
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
