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
              :class="{ 'process-active': index === activeStep }"
            >
              <span class="step-number">{{ index + 1 }}</span>
              {{ step.name }}
            </el-menu-item>
          </template>
          
          <!-- 标准导航菜单 -->
          <template v-else>
            <el-menu-item index="/">HOME</el-menu-item>
            
            <el-sub-menu index="/trains">
              <template #title>TRAINS</template>
              <el-menu-item index="/trains">China Mainland Trains</el-menu-item>
              <el-menu-item index="/hongkongtrains">Hong Kong Trains</el-menu-item>
              <el-menu-item index="/internationaltrains">International Trains</el-menu-item>
              <el-menu-item index="/terms-conditions">Terms and Conditions</el-menu-item>
            </el-sub-menu>

            <!-- <el-menu-item index="/flights">FLIGHTS</el-menu-item> -->
            <!-- <el-menu-item index="/china-esim">CHINA ESIM</el-menu-item> -->

            <!-- <el-sub-menu index="/guide">
              <template #title>GUIDE</template>
              <el-menu-item index="/category/travel-guide">Travel Guide</el-menu-item>
              <el-menu-item index="/category/china_train_guide">China train guide</el-menu-item>
              <el-menu-item index="/category/booking-guide">Booking guide</el-menu-item>
            </el-sub-menu> -->

            <el-menu-item index="/contact-us">CONTACT US</el-menu-item>
            <el-menu-item index="/my-bookings" class="my-bookings">MY BOOKINGS</el-menu-item>
          </template>
        </el-menu>
        <div class="user-actions">
          <el-select v-model="language" class="language-select">
            <el-option label="English" value="en" />
            <!-- <el-option label="简体中文" value="zh" /> -->
          </el-select>
        </div>
      </nav>
    </div>
  </el-header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBookingStore } from '../stores/bookingProcess'

const language = ref('en')
const route = useRoute()
const bookingStore = useBookingStore()

// 是否显示订单流程导航
const isBookingFlow = computed(() => {
  return route.path === '/trains/timetable' || 
         route.path.startsWith('/booking/') || 
         route.path.startsWith('/orders/')
})

// 订单流程步骤
const bookingSteps = computed(() => bookingStore.steps)

// 当前激活步骤
const activeStep = computed(() => bookingStore.activeStep)
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  height: 64px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  min-width: 120px;
}

.header-logo {
  height: 40px;
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

.nav-menu:not(.el-menu--collapse) {
  border: none !important;
}

.nav-menu :deep(.el-menu--horizontal) {
  border: none !important;
  border-bottom: none !important;
  display: flex;
  justify-content: flex-start;
  height: 64px;
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
  color: #333;
  height: 64px;
  line-height: 64px;
  text-transform: uppercase;
  padding: 0 24px 0 16px !important;
  white-space: nowrap;
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 900;
}

.nav-menu :deep(.el-sub-menu) {
  height: 64px;
  line-height: 64px;
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
  color: #ff3366;
  font-weight: 500;
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
  background-color: #ff3366;
  transform: scaleX(1);
}

/* 订单流程步骤样式 */
.process-active {
  color: #ff3366 !important;
  font-weight: bold !important;
}

.step-number {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  background-color: #ff3366;
  color: white;
  margin-right: 8px;
  font-size: 14px;
  font-weight: bold;
}

.nav-menu :deep(.el-menu-item:hover),
.nav-menu :deep(.el-sub-menu:hover .el-sub-menu__title) {
  color: #ff3366;
  background-color: transparent;
}

:deep(.el-menu--popup) {
  min-width: 200px;
  padding: 4px 0;
}

:deep(.el-menu--popup .el-menu-item) {
  height: 40px !important;
  line-height: 40px !important;
  padding: 0 20px !important;
  font-size: 14px;
  justify-content: flex-start;
  font-weight: 900;
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
    height: 32px;
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

.language-select {
  width: 120px;
}

.my-bookings {
  color: #ff3366 !important;
}
</style>
