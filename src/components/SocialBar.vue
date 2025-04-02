<template>
  <div class="social-bar-container">
    <!-- 展开状态的社交媒体栏 -->
    <div class="social-bar" v-show="isExpanded">
      <div class="social-bar-header">
        <h3>Follow Us on Social Media</h3>
        <button class="close-button" @click="toggleExpand">
          <Icon icon="mdi:close" width="20" height="20" />
        </button>
      </div>
      
      <a v-for="(social, key) in SOCIAL_MEDIA" 
         :key="key"
         :href="social.url" 
         target="_blank" 
         :class="['social-icon', key]">
        <Icon :icon="social.icon" width="24" height="24" />
        <span class="tooltip">{{ social.name }}</span>
      </a>
    </div>

    <!-- 收起状态的触发按钮 -->
    <button 
      v-show="!isExpanded" 
      class="contact-trigger"
      @click="toggleExpand"
    >
      <Icon icon="mdi:share-variant" width="24" height="24" />
      <span>Follow Us</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { SOCIAL_MEDIA } from '@/config/appConfig'

const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.social-bar-container {
  position: fixed;
  right: 20px;
  bottom: 120px;
  z-index: 1000;
}

.social-bar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  animation: slideIn 0.3s ease;
  margin-bottom: 30px;
}

.social-bar-header {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.social-bar-header h3 {
  margin: 0;
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.close-button {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #f5f5f5;
  transform: scale(1.1);
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.social-icon:hover {
  transform: translateX(-5px);
}

.whatsapp {
  background-color: #25D366;
}

.instagram {
  background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D);
}

.facebook {
  background-color: #1877F2;
}

.tooltip {
  position: absolute;
  right: 50px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.social-icon:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

.contact-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #1877F2;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.contact-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .social-bar-container {
    right: 10px;
    bottom: 140px;
  }

  .social-icon {
    width: 35px;
    height: 35px;
  }

  .contact-trigger {
    padding: 10px 16px;
    font-size: 13px;
  }
}

/* 添加新的媒体查询，处理较小屏幕的情况 */
@media (max-height: 600px) {
  .social-bar-container {
    bottom: 160px;
  }
}
</style> 