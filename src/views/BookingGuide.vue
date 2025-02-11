<template>
  <div class="booking-guide">
    <div class="page-header">
      <h1>How to Book China Train Tickets</h1>
      <p class="subtitle">A step-by-step guide to booking your train tickets in China</p>
    </div>

    <div class="content-container">
      <div class="guide-content">
        <div class="steps-section">
          <h2>Booking Steps</h2>
          <div class="step-list">
            <div v-for="step in bookingSteps" :key="step.id" class="step-item">
              <div class="step-number">{{ step.id }}</div>
              <div class="step-content">
                <h3>{{ step.title }}</h3>
                <p>{{ step.description }}</p>
                <div v-if="step.tips" class="step-tips">
                  <strong>Tips:</strong>
                  <ul>
                    <li v-for="(tip, index) in step.tips" :key="index">{{ tip }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="faq-section">
          <h2>Frequently Asked Questions</h2>
          <el-collapse v-model="activeFaq">
            <el-collapse-item v-for="faq in faqs" :key="faq.id" :title="faq.question" :name="faq.id">
              <div v-html="faq.answer"></div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div class="payment-section">
          <h2>Payment Methods</h2>
          <div class="payment-methods">
            <div v-for="method in paymentMethods" :key="method.id" class="payment-method">
              <img :src="method.icon" :alt="method.name">
              <h3>{{ method.name }}</h3>
              <p>{{ method.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <aside class="sidebar">
        <div class="important-notes">
          <h3>Important Notes</h3>
          <ul>
            <li v-for="note in importantNotes" :key="note.id">{{ note.text }}</li>
          </ul>
        </div>

        <div class="help-contact">
          <h3>Need Help?</h3>
          <p>Our customer service team is here to assist you with your booking:</p>
          <div class="contact-methods">
            <div class="contact-method">
              <i class="el-icon-message"></i>
              <span>Email: support@chinatrainbooking.com</span>
            </div>
            <div class="contact-method">
              <i class="el-icon-phone"></i>
              <span>Phone: +86 123 456 7890</span>
            </div>
            <div class="contact-method">
              <i class="el-icon-chat-line-round"></i>
              <span>Live Chat: Available 24/7</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingGuide',
  data() {
    return {
      activeFaq: ['1'],
      bookingSteps: [
        {
          id: 1,
          title: 'Search for Your Train',
          description: 'Enter your departure city, destination, and travel date to find available trains.',
          tips: [
            'Book at least 3-7 days in advance for popular routes',
            'Consider flexible travel dates for better availability',
            'Check both high-speed and regular trains for options'
          ]
        },
        {
          id: 2,
          title: 'Select Your Train and Seat',
          description: 'Choose from available trains and select your preferred seat class.',
          tips: [
            'Second class is the most economical option',
            'First class offers more comfort for longer journeys',
            'Business class is available on some high-speed trains'
          ]
        },
        {
          id: 3,
          title: 'Enter Passenger Information',
          description: 'Provide passenger details exactly as they appear on their ID/passport.',
          tips: [
            'Double-check all information before submission',
            'Have your passport number ready',
            'Use pinyin names for foreign passengers'
          ]
        },
        {
          id: 4,
          title: 'Make Payment',
          description: 'Complete your booking by paying with your preferred payment method.',
          tips: [
            'Multiple payment options available',
            'Secure transaction processing',
            'Keep your booking reference number'
          ]
        }
      ],
      faqs: [
        {
          id: 1,
          question: 'How far in advance can I book train tickets?',
          answer: 'Domestic train tickets can be booked up to 30 days in advance. For peak seasons (Chinese New Year, National Day, etc.), booking early is strongly recommended.'
        },
        {
          id: 2,
          question: 'What documents do I need for booking?',
          answer: 'For booking, you\'ll need:<ul><li>Valid passport for foreign travelers</li><li>Chinese ID card for Chinese citizens</li><li>Credit card for payment</li></ul>'
        },
        {
          id: 3,
          question: 'Can I cancel or modify my booking?',
          answer: 'Yes, tickets can be cancelled or modified up to 30 minutes before departure. Refund policies vary based on timing and ticket type.'
        }
      ],
      paymentMethods: [
        {
          id: 1,
          name: 'Credit Card',
          icon: '../assets/images/credit-card.png',
          description: 'Secure payment with all major credit cards accepted'
        },
        {
          id: 2,
          name: 'WeChat Pay',
          icon: '../assets/images/wechat-pay.png',
          description: 'Quick and convenient payment through WeChat'
        },
        {
          id: 3,
          name: 'Alipay',
          icon: '../assets/images/alipay.png',
          description: 'Easy payment with Alipay account'
        }
      ],
      importantNotes: [
        {
          id: 1,
          text: 'Tickets cannot be booked more than 30 days in advance'
        },
        {
          id: 2,
          text: 'Name changes are not permitted after booking'
        },
        {
          id: 3,
          text: 'Arrive at least 30 minutes before departure'
        },
        {
          id: 4,
          text: 'Keep your booking reference number safe'
        }
      ]
    }
  }
}
</script>

<style scoped>
.booking-guide {
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('../assets/images/west-kowloon-station.jpg') no-repeat center center;
  background-size: cover;
  color: white;
  text-align: center;
  padding: 60px 20px;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 40px;
}

.guide-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.step-item {
  display: flex;
  gap: 20px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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
  font-size: 20px;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content {
  flex-grow: 1;
}

.step-content h3 {
  color: #333;
  margin-bottom: 12px;
}

.step-tips {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
}

.step-tips ul {
  margin-top: 8px;
  padding-left: 20px;
}

.step-tips li {
  margin-bottom: 4px;
  color: #666;
}

.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.payment-method {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.payment-method img {
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.sidebar > div {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.important-notes ul {
  list-style: none;
  padding: 0;
}

.important-notes li {
  margin-bottom: 12px;
  padding-left: 24px;
  position: relative;
  color: #666;
}

.important-notes li::before {
  content: '!';
  position: absolute;
  left: 0;
  color: #ff3366;
  font-weight: bold;
}

.contact-methods {
  margin-top: 16px;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  color: #666;
}

h2 {
  color: #333;
  margin-bottom: 24px;
  font-size: 24px;
}

h3 {
  color: #333;
  margin-bottom: 16px;
  font-size: 20px;
}

@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 20px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .step-item {
    flex-direction: column;
  }

  .payment-methods {
    grid-template-columns: 1fr;
  }
}
</style>
