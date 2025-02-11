<template>
  <div class="china-esim">
    <div class="hero-section">
      <div class="hero-content">
        <h1>Greater China eSIM</h1>
        <p>Stay connected in China with our easy-to-use eSIM service</p>
      </div>
    </div>

    <div class="content-container">
      <div class="package-selection">
        <h2>Choose a package</h2>
        <div class="packages">
          <div v-for="pkg in packages" :key="pkg.id" class="package-card" :class="{ 'selected': selectedPackage === pkg.id }" @click="selectPackage(pkg.id)">
            <h3>{{ pkg.name }}</h3>
            <div class="package-details">
              <p class="data">{{ pkg.data }}</p>
              <p class="validity">{{ pkg.validity }}</p>
              <p class="speed">{{ pkg.speed }}</p>
            </div>
            <div class="price">{{ pkg.price }}</div>
          </div>
        </div>
      </div>

      <div class="order-form">
        <el-form :model="form" label-width="120px">
          <el-form-item label="Contact Email">
            <el-input v-model="form.email" placeholder="Enter your email address" />
          </el-form-item>
          <el-form-item label="Contact Name">
            <el-input v-model="form.name" placeholder="Your name" />
          </el-form-item>
          <el-button type="primary" @click="submitOrder">Buy Now</el-button>
        </el-form>
      </div>

      <div class="advantages">
        <h2>Advantages of using Greater China eSIM</h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="icon">
              <i class="el-icon-check"></i>
            </div>
            <h3>Very easy to use</h3>
            <p>Simply scan the QR code to install the eSIM profile and activate when needed</p>
          </div>
          <div class="advantage-card">
            <div class="icon">
              <i class="el-icon-data-line"></i>
            </div>
            <h3>Unlimited data plans</h3>
            <p>Choose from various data packages to suit your needs</p>
          </div>
          <div class="advantage-card">
            <div class="icon">
              <i class="el-icon-mobile"></i>
            </div>
            <h3>Access social media apps</h3>
            <p>Stay connected with Facebook, WhatsApp, Instagram and more</p>
          </div>
          <div class="advantage-card">
            <div class="icon">
              <i class="el-icon-timer"></i>
            </div>
            <h3>Instant delivery</h3>
            <p>Receive your eSIM immediately after purchase</p>
          </div>
          <div class="advantage-card">
            <div class="icon">
              <i class="el-icon-document"></i>
            </div>
            <h3>Keep your original SIM</h3>
            <p>Use both your regular SIM and eSIM simultaneously</p>
          </div>
          <div class="advantage-card">
            <div class="icon">
              <i class="el-icon-user"></i>
            </div>
            <h3>No Identity Verification</h3>
            <p>No need to provide passport or other documents</p>
          </div>
        </div>
      </div>

      <div class="how-it-works">
        <h2>How does the Greater China eSIM work?</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Scan your phone to install the eSIM</h3>
            <p>We'll send you a QR code to install the eSIM profile</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Buy your prepaid data card</h3>
            <p>Choose and purchase your preferred data package</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Scan the QR code to install the eSIM</h3>
            <p>Follow the instructions to activate your service</p>
          </div>
        </div>
      </div>

      <div class="important-notes">
        <h2>What you should know about eSIMs?</h2>
        <div class="notes-grid">
          <div class="note-card">
            <div class="icon">
              <i class="el-icon-warning"></i>
            </div>
            <h3>No local phone number</h3>
            <p>This eSIM provides data-only service without a local phone number</p>
          </div>
          <div class="note-card">
            <div class="icon">
              <i class="el-icon-mobile"></i>
            </div>
            <h3>Check phone compatibility</h3>
            <p>Make sure your device supports eSIM technology</p>
          </div>
          <div class="note-card">
            <div class="icon">
              <i class="el-icon-time"></i>
            </div>
            <h3>No data sharing</h3>
            <p>The data package cannot be shared with other devices</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChinaEsim',
  data() {
    return {
      selectedPackage: null,
      packages: [
        {
          id: 1,
          name: '8 Days',
          data: '3GB High-speed data',
          validity: '8 days validity',
          speed: 'Up to 100 Mbps',
          price: 'USD22.00'
        },
        {
          id: 2,
          name: '15 Days',
          data: '6GB High-speed data',
          validity: '15 days validity',
          speed: 'Up to 100 Mbps',
          price: 'USD28.00'
        },
        {
          id: 3,
          name: '30 Days',
          data: '9GB High-speed data',
          validity: '30 days validity',
          speed: 'Up to 100 Mbps',
          price: 'USD35.00'
        }
      ],
      form: {
        email: '',
        name: ''
      }
    }
  },
  methods: {
    selectPackage(id) {
      this.selectedPackage = id
    },
    submitOrder() {
      if (!this.selectedPackage) {
        this.$message.error('Please select a package first')
        return
      }
      if (!this.form.email || !this.form.name) {
        this.$message.error('Please fill in all required fields')
        return
      }
      // TODO: Implement order submission
      this.$message.success('Order submitted successfully! Check your email for the eSIM details.')
    }
  }
}
</script>

<style scoped>
.china-esim {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('../assets/images/west-kowloon-station.jpg') no-repeat center center;
  background-size: cover;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.package-selection {
  margin-bottom: 60px;
}

.packages {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.package-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.package-card:hover {
  transform: translateY(-5px);
}

.package-card.selected {
  border: 2px solid #ff3366;
}

.package-card h3 {
  color: #333;
  margin-bottom: 20px;
}

.package-details {
  color: #666;
  margin-bottom: 20px;
}

.price {
  font-size: 24px;
  color: #ff3366;
  font-weight: bold;
}

.order-form {
  max-width: 600px;
  margin: 0 auto 60px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.advantages {
  margin-bottom: 60px;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.advantage-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.advantage-card .icon {
  font-size: 40px;
  color: #ff3366;
  margin-bottom: 20px;
}

.how-it-works {
  margin-bottom: 60px;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.step {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #ff3366;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 20px;
  font-weight: bold;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.note-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.note-card .icon {
  font-size: 40px;
  color: #ff3366;
  margin-bottom: 20px;
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

h3 {
  color: #333;
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .hero-section {
    height: 300px;
  }

  .hero-content h1 {
    font-size: 32px;
  }

  .packages {
    grid-template-columns: 1fr;
  }

  .advantages-grid,
  .steps,
  .notes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
