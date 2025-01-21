<template>
  <div class="my-bookings">
    <h1>My Bookings</h1>
    <div class="booking-search">
      <div class="search-form">
        <div class="form-group">
          <label>Order ID:</label>
          <input type="text" v-model="orderId" placeholder="Enter your order ID" />
        </div>
        <div class="form-group">
          <label>Contact Email:</label>
          <input type="email" v-model="email" placeholder="Enter your email address" />
        </div>
        <button class="submit-btn" @click="searchBooking">Submit</button>
      </div>
    </div>

    <div v-if="bookingDetails" class="booking-details">
      <h2>Booking Details</h2>
      <!-- Add booking details display here -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyBookings',
  data() {
    return {
      orderId: '',
      email: '',
      bookingDetails: null
    }
  },
  methods: {
    searchBooking() {
      // TODO: Implement booking search logic
      console.log('Searching booking with:', { orderId: this.orderId, email: this.email })
    }
  }
}
</script>

<style scoped>
.my-bookings {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.booking-search {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.submit-btn {
  background-color: #ff3366;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #ff1a4d;
}

.booking-details {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
