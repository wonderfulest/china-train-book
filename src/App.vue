<template>
  <el-container class="layout-container">
    <el-header class="header">
      <div class="header-content">
        <div class="logo">
          <router-link to="/">
            <img src="../src/assets/crh-logo-16-9.png" alt="China Railway" class="header-logo">
          </router-link>
        </div>
        <nav class="main-nav">
          <el-menu mode="horizontal" router class="nav-menu">
            <el-menu-item index="/">Home</el-menu-item>
            <el-menu-item index="/trains">Train Schedule</el-menu-item>
            <el-menu-item index="/guide">Travel Guide</el-menu-item>
            <el-menu-item index="/about">About China</el-menu-item>
          </el-menu>
          <div class="user-actions">
            <el-select v-model="language" class="language-select">
              <el-option label="English" value="en" />
              <el-option label="简体中文" value="zh" />
            </el-select>
            <el-button type="text">Sign In</el-button>
            <el-button type="primary">Register</el-button>
          </div>
        </nav>
      </div>
    </el-header>

    <el-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>

    <el-footer class="footer">
      <div class="footer-content">
        <div class="footer-sections">
          <div class="footer-section">
            <h3>About Us</h3>
            <p>China Train Book is your trusted partner for booking train tickets in China. We provide reliable and convenient booking services for international travelers.</p>
          </div>
          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><router-link to="/about">About</router-link></li>
              <li><router-link to="/contact">Contact</router-link></li>
              <li><router-link to="/faq">FAQ</router-link></li>
              <li><router-link to="/terms">Terms & Conditions</router-link></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Contact Info</h3>
            <ul class="contact-info">
              <li>
                <el-icon><Location /></el-icon>
                <span>123 Railway Street, Beijing, China</span>
              </li>
              <li>
                <el-icon><Message /></el-icon>
                <span>support@chinatrainbook.com</span>
              </li>
              <li>
                <el-icon><Phone /></el-icon>
                <span>+86 10 1234 5678</span>
              </li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Follow Us</h3>
            <div class="social-links">
              <a href="#" class="social-link"><el-icon><Share /></el-icon></a>
              <a href="#" class="social-link"><el-icon><Connection /></el-icon></a>
              <a href="#" class="social-link"><el-icon><ChatDotRound /></el-icon></a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="payment-methods">
            <h4>Secure Payment Methods</h4>
            <div class="payment-icons">
              <img src="../src/assets/payments/visa.png" alt="Visa" class="payment-icon">
              <img src="../src/assets/payments/mastercard.png" alt="Mastercard" class="payment-icon">
              <img src="https://www.paypalobjects.com/marketing/web/logos/paypal-mark-color.svg" alt="PayPal" class="payment-icon">
              <img src="../src/assets/payments/jcb.png" alt="JCB" class="payment-icon">
            </div>
          </div>
          <div class="copyright">
            <p>&copy; {{ new Date().getFullYear() }} China Train Book. All rights reserved.</p>
          </div>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { Location, Message, Phone, Share, Connection, ChatDotRound } from '@element-plus/icons-vue'

const language = ref('en')
</script>

<style scoped>
#app {
  width: 100%;
  min-width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.layout-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

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
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.logo {
  display: flex;
  align-items: center;
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
  border: none;
  background: transparent;
}

.nav-menu :deep(.el-menu-item) {
  font-size: 16px;
  padding: 0 20px;
}

.nav-menu :deep(.el-menu-item.is-active) {
  color: #ff385c;
  border-bottom-color: #ff385c;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.language-select {
  width: 120px;
}

.el-main {
  margin-top: 64px;
  flex: 1;
  padding: 0;
  background-color: #f5f5f5;
}

.footer {
  background-color: #1a1a1a;
  color: #fff;
  padding: 80px 0 40px;
  margin-top: auto;
  height: 100%;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
}

.footer-section h3 {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  position: relative;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 2px;
  background: #ff385c;
}

.footer-section p {
  color: #999;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 12px;
}

.footer-section ul li a {
  color: #999;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: #ff385c;
}

.contact-info li {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #999;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #ff385c;
  transform: translateY(-2px);
}

.footer-bottom {
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.payment-methods {
  margin-bottom: 32px;
  text-align: center;
}

.payment-methods h4 {
  color: #fff;
  font-size: 16px;
  margin-bottom: 16px;
}

.payment-icons {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.payment-icon {
  height: 48px;
  width: 48px;
  object-fit: contain;
  background: rgba(255, 255, 255, 1);
  border-radius: 50%;
  transition: all 0.3s ease;
  padding: 6px;
  filter: contrast(1.1) brightness(1.2);
}

.payment-icon:hover {
  opacity: 1;
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  filter: contrast(1.2) brightness(1.4);
}

.copyright {
  text-align: center;
  color: #666;
  font-size: 14px;
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
  
  .footer {
    padding: 60px 0 32px;
  }
  
  .footer-sections {
    gap: 32px;
  }
  
  .footer-section {
    text-align: center;
  }
  
  .footer-section h3::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .contact-info li {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>
