<template>
  <div class="terms-conditions">
    <div class="page-header">
      <h1>Terms & Conditions</h1>
      <p class="subtitle">Learn about our terms and conditions before booking</p>
    </div>

    <div class="content-container">
      <div class="highlights">
        <div class="highlight-card" v-for="(card, index) in highlightCards" :key="index">
          <img :src="card.image" :alt="card.title">
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
          <router-link :to="card.link" class="read-more">Read More</router-link>
        </div>
      </div>

      <div class="terms-sections">
        <div v-for="(section, index) in sections" :key="index" class="terms-section">
          <div class="section-icon">
            <img :src="section.icon" :alt="section.title">
          </div>
          <div class="section-content">
            <h2>{{ section.title }}</h2>
            <div class="section-text" v-html="section.content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TermsConditions',
  data() {
    return {
      highlightCards: [
        {
          title: 'Train Schedule',
          description: 'Check the latest train schedules',
          image: '/images/train-schedule.jpg',
          link: '/trains'
        },
        {
          title: 'Fare Rules',
          description: 'Learn about ticket pricing and rules',
          image: '/images/fare-rules.jpg',
          link: '/guide/fare-rules'
        },
        {
          title: 'Booking Guide',
          description: 'How to book your train tickets',
          image: '/images/booking-guide.jpg',
          link: '/guide/booking'
        }
      ],
      sections: [
        {
          title: 'Booking and Payment',
          icon: '/icons/payment.svg',
          content: `
            <p>By making a booking through our platform, you agree to provide accurate and complete information. All payments must be made in full at the time of booking.</p>
            <ul>
              <li>We accept various payment methods including credit cards, PayPal, and UnionPay</li>
              <li>All prices are displayed in your selected currency</li>
              <li>Additional bank charges may apply for international transactions</li>
            </ul>
          `
        },
        {
          title: 'Cancellation Policy',
          icon: '/icons/cancellation.svg',
          content: `
            <p>Our cancellation policy varies depending on the ticket type and timing:</p>
            <ul>
              <li>Full refund available if cancelled 48 hours before departure</li>
              <li>50% refund if cancelled between 48-24 hours before departure</li>
              <li>No refund for cancellations within 24 hours of departure</li>
              <li>Special conditions may apply during peak seasons</li>
            </ul>
          `
        },
        {
          title: 'Service Fees',
          icon: '/icons/fees.svg',
          content: `
            <p>Our service fees are transparent and clearly displayed during the booking process:</p>
            <ul>
              <li>Booking fee: 20 CNY per ticket</li>
              <li>Modification fee: 10 CNY per change</li>
              <li>Cancellation processing fee: 15 CNY per ticket</li>
            </ul>
          `
        },
        {
          title: 'Customer Support',
          icon: '/icons/support.svg',
          content: `
            <p>Our customer support team is available to assist you:</p>
            <ul>
              <li>24/7 email support</li>
              <li>Phone support during business hours</li>
              <li>Live chat available on website</li>
              <li>Emergency contact number provided with booking</li>
            </ul>
          `
        },
        {
          title: 'Privacy Policy',
          icon: '/icons/privacy.svg',
          content: `
            <p>We take your privacy seriously and protect your personal information:</p>
            <ul>
              <li>Data encryption for all transactions</li>
              <li>No sharing of personal information with third parties</li>
              <li>Compliance with international data protection regulations</li>
            </ul>
          `
        },
        {
          title: 'Ticket Delivery',
          icon: '/icons/delivery.svg',
          content: `
            <p>After successful booking, you will receive:</p>
            <ul>
              <li>Instant email confirmation</li>
              <li>E-ticket within 24 hours</li>
              <li>Pickup instructions for physical tickets</li>
              <li>SMS notifications for important updates</li>
            </ul>
          `
        }
      ]
    }
  }
}
</script>

<style scoped>
.terms-conditions {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 18px;
}

.highlights {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 60px;
}

.highlight-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 20px;
}

.highlight-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 15px;
}

.highlight-card h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.highlight-card p {
  color: #666;
  margin-bottom: 15px;
}

.read-more {
  color: #ff3366;
  text-decoration: none;
  font-weight: 500;
}

.terms-sections {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.terms-section {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 20px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-icon {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.section-icon img {
  width: 40px;
  height: 40px;
}

.section-content h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
}

.section-text {
  color: #666;
  line-height: 1.6;
}

.section-text ul {
  padding-left: 20px;
  margin-top: 10px;
}

.section-text li {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .highlights {
    grid-template-columns: 1fr;
  }

  .terms-section {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .section-icon {
    margin-bottom: 15px;
  }

  .page-header h1 {
    font-size: 28px;
  }
}
</style>
