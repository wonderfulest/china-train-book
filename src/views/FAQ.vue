<template>
  <div class="faq-container">
    <h1 class="faq-title">Frequently Asked Questions</h1>
    
    <!-- Booking Process -->
    <div class="faq-section">
      <h2>Ticket Booking</h2>
      <el-collapse>
        <el-collapse-item title="How to book train tickets?" name="1">
          <p>The booking process is simple:</p>
          <ol>
            <li>Enter departure city, destination, and date on the homepage</li>
            <li>Select your preferred train and seat type</li>
            <li>Fill in passenger information (name, ID type, ID number, etc.)</li>
            <li>Confirm order details</li>
            <li>Choose payment method and complete payment</li>
            <li>View order details and download e-ticket after payment</li>
          </ol>
        </el-collapse-item>

        <el-collapse-item title="How far in advance can I book tickets?" name="2">
          <p>You can book tickets up to 30 days before the departure date. We recommend booking early to ensure better seat availability.</p>
        </el-collapse-item>

        <el-collapse-item title="What payment methods are accepted?" name="3">
          <p>We currently support the following payment methods:</p>
          <ul>
            <li>PayPal</li>
            <li>Credit Cards</li>
            <li>Debit Cards</li>
          </ul>
        </el-collapse-item>

        <el-collapse-item title="How can I get my tickets after payment?" name="4">
          <p>After successful payment, your e-ticket will be generated immediately. You can:</p>
          <ul>
            <li>Use the e-ticket directly (show order details and valid ID)</li>
            <li>Print physical tickets at station self-service machines</li>
            <li>Print physical tickets at station ticket counters</li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- Refund Policy -->
    <div class="faq-section">
      <h2>Ticket Refunds</h2>
      <el-collapse>
        <el-collapse-item title="How to request a refund?" name="5">
          <p>Refund steps:</p>
          <ol>
            <li>Log in and go to "My Orders"</li>
            <li>Find the order and click "Request Refund"</li>
            <li>Confirm refund details</li>
            <li>Wait for refund processing (usually 1-7 business days)</li>
          </ol>
        </el-collapse-item>

        <el-collapse-item title="What are the refund fees?" name="6">
          <p>Refund fees depend on how early you cancel:</p>
          <ul>
            <li>15+ days before departure: Full refund</li>
            <li>48 hours to 15 days: 5% fee</li>
            <li>24-48 hours: 10% fee</li>
            <li>Less than 24 hours: 20% fee</li>
          </ul>
        </el-collapse-item>

        <el-collapse-item title="How long does it take to receive a refund?" name="7">
          <p>Refund processing time varies by payment method:</p>
          <ul>
            <li>PayPal: 1-3 business days</li>
            <li>Credit Cards: 3-7 business days</li>
            <li>Debit Cards: 3-5 business days</li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- Ticket Changes -->
    <div class="faq-section">
      <h2>Ticket Changes</h2>
      <el-collapse>
        <el-collapse-item title="How to change my ticket?" name="8">
          <p>Steps to change your ticket:</p>
          <ol>
            <li>Log in and go to "My Orders"</li>
            <li>Find the order and click "Change Ticket"</li>
            <li>Select new train and seat</li>
            <li>Pay any price difference (if applicable)</li>
            <li>Complete the change</li>
          </ol>
        </el-collapse-item>

        <el-collapse-item title="What are the restrictions for ticket changes?" name="9">
          <p>Please note the following restrictions:</p>
          <ul>
            <li>Changes only allowed for same origin and destination</li>
            <li>Additional payment required if new ticket price is higher</li>
            <li>Difference refunded if new ticket price is lower</li>
            <li>Only one change allowed per ticket</li>
            <li>Online changes not available within 2 hours of departure</li>
          </ul>
        </el-collapse-item>

        <el-collapse-item title="What are the change fees?" name="10">
          <p>Change fees are as follows:</p>
          <ul>
            <li>More than 48 hours before departure: No fee</li>
            <li>24-48 hours before departure: $10 per ticket</li>
            <li>Less than 24 hours before departure: $20 per ticket</li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- Other Questions -->
    <div class="faq-section">
      <h2>Other Questions</h2>
      <el-collapse>
        <el-collapse-item title="How to check order status?" name="11">
          <p>To check your order status:</p>
          <ol>
            <li>Log in and click "My Orders"</li>
            <li>View all orders with statuses: Unpaid, Paid, Completed, Refunded, etc.</li>
            <li>Click on specific orders for detailed information</li>
          </ol>
        </el-collapse-item>

        <el-collapse-item title="What if I forget to collect my tickets?" name="12">
          <p>If you forget to collect your tickets, you can:</p>
          <ul>
            <li>Use the e-ticket directly (show order details and valid ID)</li>
            <li>Print tickets at station self-service machines</li>
            <li>Get assistance at station ticket counters</li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
</script>

<style scoped>
.faq-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.faq-title {
  text-align: center;
  color: #333;
  margin-bottom: 40px;
  font-size: 32px;
}

.faq-section {
  margin-bottom: 40px;
}

.faq-section h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  border-bottom: 2px solid var(--button-color, #f39c12);
  padding-bottom: 10px;
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  font-size: 18px;
  color: #666;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 2px;
}

:deep(.el-collapse-item__content) {
  padding: 20px;
  color: #666;
  line-height: 1.6;
}

:deep(.el-collapse-item__wrap) {
  border: none;
}

ul, ol {
  padding-left: 20px;
  margin: 10px 0;
}

li {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .faq-container {
    padding: 10px;
  }

  .faq-title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .faq-section h2 {
    font-size: 20px;
  }

  :deep(.el-collapse-item__header) {
    font-size: 16px;
    padding: 15px;
  }

  :deep(.el-collapse-item__content) {
    padding: 15px;
  }
}
</style> 