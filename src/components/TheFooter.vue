<template>
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
            <li><router-link to="/terms-conditions">Terms & Conditions</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Contact Info</h3>
          <ul class="contact-info">
            <li>
              <el-icon><Location /></el-icon>
              <span>Harju maakond, Tallinn, Kesklinna linnaosa, Ahtri tn 12, 15551, Estonia</span>
            </li>
            <li>
              <el-icon><Message /></el-icon>
              <span>service@chinatrainbook.com</span>
            </li>
            <!-- <li>
              <el-icon><Phone /></el-icon>
              <span>（+86）18801464879</span>
            </li> -->
          </ul>
        </div>
        <div class="footer-section">
          <h3>Follow Us</h3>
          <div class="social-links">
            <a v-for="(social, key) in SOCIAL_MEDIA" 
               :key="key"
               :href="social.url" 
               target="_blank" 
               class="social-link">
              <Icon :icon="social.icon" width="24" height="24" style="color: #ffffff" />
            </a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="payment-methods">
          <h4>Secure Payment Methods</h4>
          <div class="payment-icons">
            <img src="../assets/payments/visa.png" alt="Visa" class="payment-icon">
            <img src="../assets/payments/mastercard.png" alt="Mastercard" class="payment-icon">
            <img src="../assets/payments/paypal-mark-color.svg" alt="PayPal" class="payment-icon">
            <img src="../assets/payments/jcb.png" alt="JCB" class="payment-icon">
          </div>
        </div>
        <div class="copyright">
          <p>&copy; {{ new Date().getFullYear() }} WuKong OÜ. All rights reserved.</p>
        </div>
      </div>
    </div>
  </el-footer>
</template>

<script setup>
import { Location, Message, Phone, Share, Connection, ChatDotRound } from '@element-plus/icons-vue'
import { APP_CONFIG, SOCIAL_MEDIA } from '@/config/appConfig'
import { Icon } from '@iconify/vue'
</script>

<style scoped>
.footer {
  background-color: #1a1a1a;
  color: #fff;
  padding: 40px 0 20px;
  margin-top: auto;
  height: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.footer-section h3 {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
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
  margin-bottom: 8px;
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
  .footer {
    padding: 30px 0 20px;
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
