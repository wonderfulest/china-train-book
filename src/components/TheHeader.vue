<template>
  <el-header class="header">
    <div class="header-content">
      <div class="logo">
        <router-link to="/">
          <img src="../assets/crh-logo-16-9.png" alt="China Railway" class="header-logo">
        </router-link>
      </div>
      <nav class="main-nav">
        <el-menu mode="horizontal" router class="nav-menu" :default-active="$route.path">
          <!-- 订单流程步骤导航 -->
          <template v-if="isBookingFlow">
            <el-menu-item 
              v-for="(step, index) in bookingSteps" 
              :key="step.path"
              :index="step.path"
              :class="{
                'process-active': index === activeStep,
                'process-completed': index < activeStep,
                'process-disabled': index > activeStep
              }"
              :disabled="index > activeStep"
              @click="navigateWithQuery(step.path)"
            >
              <span class="step-number">{{ index + 1 }}</span>
              {{ step.name }}
            </el-menu-item>
          </template>
          
          <!-- 标准导航菜单 -->
          <template v-else>
            <el-menu-item index="/">HOME</el-menu-item>
            
            <!-- <el-sub-menu index="/trains">
              <template #title>TRAINS</template>
              <el-menu-item index="/trains">China Mainland Trains</el-menu-item>
              <el-menu-item index="/hongkongtrains">Hong Kong Trains</el-menu-item>
              <el-menu-item index="/internationaltrains">International Trains</el-menu-item>
              <el-menu-item index="/terms-conditions">Terms and Conditions</el-menu-item>
            </el-sub-menu> -->

            <!-- <el-menu-item index="/flights">FLIGHTS</el-menu-item> -->
            <!-- <el-menu-item index="/china-esim">CHINA ESIM</el-menu-item> -->

            <!-- <el-sub-menu index="/guide">
              <template #title>GUIDE</template>
              <el-menu-item index="/category/travel-guide">Travel Guide</el-menu-item>
              <el-menu-item index="/category/china_train_guide">China train guide</el-menu-item>
              <el-menu-item index="/category/booking-guide">Booking guide</el-menu-item>
            </el-sub-menu> -->

            <el-menu-item index="/contact-us">CONTACT US</el-menu-item>
            <el-menu-item index="/orders" class="my-orders">ORDERS</el-menu-item>
            <el-menu-item index="/faq">FAQ</el-menu-item>
          </template>
        </el-menu>
        <div class="user-actions">
          <el-select v-model="language" class="language-select">
            <el-option label="English" value="en" />
            <!-- <el-option label="简体中文" value="zh" /> -->
          </el-select>
          <el-select v-model="currency" class="currency-select">
            <el-option 
              v-for="curr in currencyStore.supportedCurrencies" 
              :key="curr.code" 
              :label="curr.label" 
              :value="curr.code" 
            />
          </el-select>
        </div>
      </nav>
    </div>
  </el-header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '../stores/bookingProcess'
import { useCurrencyStore } from '../stores/currencyStore'

const language = ref('en')
const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()
const currencyStore = useCurrencyStore()

// 导航函数，使用orderId替换路径中的占位符
const navigateWithQuery = (path) => {
  // 如果路径中包含orderId占位符，则替换为实际的orderId
  if (path.includes(':orderId')) {
    // 确保有orderId，如果没有则使用路由参数中的orderId
    const orderId = bookingStore.orderId || route.params.orderId
    
    if (orderId) {
      const actualPath = path.replace(':orderId', orderId)
      router.push(actualPath)
      return
    }
  }
  
  // 如果没有orderId或路径中不包含orderId，直接跳转
  router.push(path)
}

// 是否显示订单流程导航
const isBookingFlow = computed(() => {
  return route.path === '/trains/timetable' || 
         route.path.startsWith('/booking/') || 
         route.path.startsWith('/orders/') || 
         route.path.startsWith('/trains/order')
})

// 订单流程步骤
const bookingSteps = computed(() => bookingStore.steps)

// 当前激活步骤
const activeStep = computed(() => bookingStore.activeStep)

// 货币选择
const currency = computed({
  get: () => currencyStore.currency,
  set: (value) => currencyStore.setCurrency(value)
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--bg-color-dark);
  height: 64px;
  box-shadow: var(--shadow-header);
}

.header-content {
  max-width: 1400px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  min-width: 120px;
}

.header-logo {
  height: 30px;
  width: auto;
}

.main-nav {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 40px;
}

.nav-menu {
  border: none !important;
  background: transparent;
  white-space: nowrap;
  flex: 1;
}

:deep(.el-menu--horizontal) {
  background-color: var(--bg-color-dark);
}

.nav-menu:not(.el-menu--collapse) {
  border: none !important;
}

.nav-menu :deep(.el-menu--horizontal) {
  border: none !important;
  border-bottom: none !important;
  display: flex;
  justify-content: flex-start;
  height: 60px;
}

:deep(.el-menu) {
  border: none !important;
  border-bottom: none !important;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  border-bottom: none !important;
}

.nav-menu :deep(.el-menu-item),
.nav-menu :deep(.el-sub-menu__title) {
  font-size: 14px;
  color: var(--text-color-light);
  height: 60px;
  line-height: 60px;
  text-transform: uppercase;
  padding: 0 24px 0 16px !important;
  white-space: nowrap;
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 700;
}

.nav-menu :deep(.el-sub-menu) {
  height: 60px;
  line-height: 60px;
}

.nav-menu :deep(.el-sub-menu__title) {
  padding-right: 36px !important;
  height: 100%;
  display: inline-flex;
  align-items: center;
  position: relative;
}

.nav-menu :deep(.el-sub-menu__icon-arrow) {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%) !important;
  margin: 0;
  font-size: 12px;
  transition: transform .3s;
}

.nav-menu :deep(.el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow) {
  transform: translateY(-50%) rotate(180deg) !important;
}

.nav-menu :deep(.el-menu-item.is-active) {
  color: var(--button-color);
  font-weight: 700;
}

.nav-menu :deep(.el-menu-item)::after,
.nav-menu :deep(.el-sub-menu__title)::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: transparent;
  transition: all 0.3s ease;
  transform: scaleX(0);
}

.nav-menu :deep(.el-menu-item.is-active)::after {
  background-color: var(--button-color);
  transform: scaleX(1);
}

/* 订单流程步骤样式 */
.process-active {
  color: var(--button-color) !important;
  font-weight: bold !important;
}

.process-completed {
  color: var(--text-color-light) !important;
  font-weight: 700 !important;
}

.process-disabled {
  /* color: var(--disabled-color) !important; */
  /* font-weight: 400 !important; */

  /* cursor: not-allowed !important; */
  opacity: 1;
}

.step-number {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  background-color: var(--button-color);
  color: var(--text-color-light);
  margin-right: 8px;
  font-size: 14px;
  font-weight: bold;
}

.process-completed .step-number {
  background-color: var(--completed-color);
}

.process-disabled .step-number {
  background-color: var(--disabled-bg-color);
}

.nav-menu :deep(.el-menu-item:hover),
.nav-menu :deep(.el-sub-menu:hover .el-sub-menu__title) {
  color: var(--button-color);
  background-color: var(--bg-color-hover);
}

:deep(.el-menu--popup) {
  min-width: 200px;
  padding: 4px 0;
  background-color: var(--bg-color-dark) !important;
  border: 1px solid var(--bg-color-hover);
}

:deep(.el-menu--popup .el-menu-item) {
  height: 40px !important;
  line-height: 40px !important;
  padding: 0 20px !important;
  font-size: 14px;
  justify-content: flex-start;
  font-weight: 700;
  color: var(--text-color-light) !important;
}

:deep(.el-menu--popup .el-menu-item:hover) {
  background-color: var(--bg-color-hover) !important;
  color: var(--button-color) !important;
}

:deep(.el-menu--popup .el-menu-item.is-active) {
  color: var(--button-color) !important;
}

@media (max-width: 1200px) {
  .nav-menu :deep(.el-menu-item) {
    padding: 0 12px !important;
    font-size: 13px;
  }
  
  .nav-menu :deep(.el-sub-menu__title) {
    padding: 0 28px 0 12px !important;
    font-size: 13px;
  }
}

@media (max-width: 992px) {
  .header-content {
    padding: 0 16px;
  }
  
  .main-nav {
    margin-left: 20px;
  }
}

@media (max-width: 768px) {
  .header-content {
    height: 60px;
  }
  
  .header-logo {
    height: 30px;
  }
  
  .nav-menu {
    display: none;
  }
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 24px;
  white-space: nowrap;
}

.language-select,
.currency-select {
  width: 120px;
}

.my-bookings {
  color: var(--button-color) !important;
}
</style>
