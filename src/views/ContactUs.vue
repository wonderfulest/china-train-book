<template>
  <div class="contact-us">
    <div class="page-header">
      <h1>CONTACT US</h1>
      <p class="subtitle">We would love to hear from you... why not get in touch?</p>
    </div>

    <div class="contact-sections">
      <!-- Travel Plan Change Section -->
      <div class="contact-section">
        <h2>Travel Plan Changed?</h2>
        <p>Need to modify your ticket? Have to cancel your order? Follow the instruction below.</p>
        
        <div class="order-lookup-form">
          <div class="form-group">
            <label>Order ID:</label>
            <el-input v-model="orderId" placeholder="Enter your order ID" />
          </div>
          <div class="form-group">
            <label>Contact Email:</label>
            <el-input v-model="email" placeholder="Enter your email address" type="email" />
          </div>
          <el-button type="primary" @click="searchOrder">Submit</el-button>
        </div>

        <div v-if="orderStatus" class="order-status">
          <p>Order Status: <span>{{ orderStatus }}</span></p>
          <div class="action-buttons">
            <el-button type="primary">View Voucher</el-button>
            <el-button type="warning">Request to change</el-button>
          </div>
        </div>
      </div>

      <!-- More Questions Section -->
      <div class="contact-section">
        <h2>More Questions?</h2>
        <p>Send us a message now and we promise to respond within 24 hours</p>

        <form class="contact-form" @submit.prevent="submitContactForm">
          <div class="form-group">
            <label>Your Name:</label>
            <el-input v-model="contactForm.name" required />
          </div>
          <div class="form-group">
            <label>Your Email:</label>
            <el-input v-model="contactForm.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Message:</label>
            <el-input
              v-model="contactForm.message"
              type="textarea"
              :rows="4"
              required
            />
          </div>
          <div class="captcha">
            <el-checkbox v-model="contactForm.privacy">Privacy Policy</el-checkbox>
            <!-- Add reCAPTCHA integration here -->
          </div>
          <el-button type="primary" native-type="submit">Send</el-button>
        </form>
      </div>

      <!-- Call Us Section -->
      <div class="contact-section">
        <h2>CALL US ON</h2>
        <p class="phone-numbers">
          +86 (0) 559 231.9660, (010) 8575 6061
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactUs',
  data() {
    return {
      orderId: '',
      email: '',
      orderStatus: '',
      contactForm: {
        name: '',
        email: '',
        message: '',
        privacy: false
      }
    }
  },
  methods: {
    searchOrder() {
      // TODO: Implement order search functionality
      this.orderStatus = 'Confirmed' // Example status
    },
    submitContactForm() {
      // TODO: Implement form submission
      console.log('Form submitted:', this.contactForm)
    }
  }
}
</script>

<style scoped>
.contact-us {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../assets/images/west-kowloon-station.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 60px 20px;
  border-radius: 8px;
}

.page-header h1 {
  font-size: 36px;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
}

.contact-sections {
  display: grid;
  gap: 40px;
}

.contact-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.contact-section h2 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.order-status {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 4px;
}

.action-buttons {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.contact-form {
  margin-top: 24px;
}

.captcha {
  margin: 20px 0;
}

.phone-numbers {
  font-size: 20px;
  color: #ff3366;
  font-weight: 500;
  text-align: center;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .contact-sections {
    grid-template-columns: 1fr;
  }

  .page-header {
    padding: 40px 20px;
  }

  .page-header h1 {
    font-size: 28px;
  }
}
</style>
