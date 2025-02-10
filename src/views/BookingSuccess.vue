<template>
  <div class="booking-success">
    <div class="success-card">
      <div class="success-header">
        <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
        <h1>Booking Successful!</h1>
        <p class="subtitle">Your train tickets have been booked successfully</p>
        <div class="booking-id">
          Booking ID: <span>{{ bookingId }}</span>
          <p class="save-reminder">Please save this booking ID for future reference</p>
        </div>
      </div>

      <div class="info-section">
        <h2>What's Next?</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Check Your Email</h3>
              <p>We've sent your e-tickets and booking confirmation to your email address. Please check your inbox (and spam folder).</p>
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
        <el-button @click="viewBookings">View My Bookings</el-button>
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
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const bookingId = ref(route.params.bookingId)

const backToHome = () => {
  router.push('/')
}

const viewBookings = () => {
  router.push('/my-bookings')
}

const contactSupport = () => {
  // 实现联系支持的逻辑
  window.open('mailto:support@chinatrainstickets.com')
}

const downloadOrderDetails = () => {
  const now = new Date().toLocaleString()
  const content = `China Train Tickets - Order Details

Booking ID: ${bookingId.value}
Date: ${now}

Please keep this information safe for future reference.
For any assistance, contact support@chinatrainstickets.com
`

  const blob = new Blob([content], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `order-${bookingId.value}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
  
  ElMessage.success('Order details downloaded successfully')
}
</script>

<style scoped>
.booking-success {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f5f7fa;
}

.success-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 800px;
  width: 100%;
}

.success-header {
  text-align: center;
  margin-bottom: 40px;

  .booking-id {
    margin-top: 1rem;
    font-size: 1.1rem;
    color: #606266;

    .save-reminder {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #f56c6c;
    }
  }

  .booking-id span {
    font-weight: 600;
    color: #409EFF;
  }
}

.success-icon {
  font-size: 64px;
  color: #67c23a;
  margin-bottom: 20px;
}

h1 {
  color: #303133;
  font-size: 28px;
  margin: 0 0 8px;
}

.subtitle {
  color: #606266;
  font-size: 16px;
  margin: 0;
}

.info-section {
  margin: 40px 0;
}

h2 {
  color: #303133;
  font-size: 20px;
  margin: 0 0 24px;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.step-number {
  background: #409eff;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  color: #303133;
  font-size: 16px;
  margin: 0 0 8px;
}

.step-content p {
  color: #606266;
  margin: 0;
  line-height: 1.5;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 40px;
}

.contact-support {
  text-align: center;
  margin-top: 24px;
}

.contact-support p {
  color: #606266;
  margin: 0;
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
