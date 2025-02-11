import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SearchResults from '../views/SearchResults.vue'
import MyBookings from '../views/MyBookings.vue'
import ContactUs from '../views/ContactUs.vue'
import TravelGuide from '../views/TravelGuide.vue'
import TermsConditions from '../views/TermsConditions.vue'
import Trains from '../views/Trains.vue'
import ChinaMainlandTrains from '../views/ChinaMainlandTrains.vue'
import HongKongTrains from '../views/HongKongTrains.vue'
import InternationalTrains from '../views/InternationalTrains.vue'
import Flights from '../views/Flights.vue'
import ChinaTrainGuide from '../views/ChinaTrainGuide.vue'
import BookingGuide from '../views/BookingGuide.vue'
import ChinaEsim from '../views/ChinaEsim.vue'
import OrderCreate from '../views/OrderCreate.vue'
import BookingCreate from '../views/BookingCreate.vue'
import NotFound from '../views/NotFound.vue'
import BookingSuccess from '../views/BookingSuccess.vue'
import BookingPaymentPending from '../views/BookingPaymentPending.vue'

const routes = [
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    children: [
      {
        path: 'cookie12306',
        name: 'Cookie12306',
        component: () => import('../views/admin/Cookie12306.vue'),
        meta: {
          title: '12306 Cookie Management'
        }
      }
    ]
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults
  },
  {
    path: '/my-bookings',
    name: 'MyBookings',
    component: MyBookings
  },
  {
    path: '/contact-us',
    name: 'ContactUs',
    component: ContactUs
  },
  {
    path: '/category/travel-guide',
    name: 'TravelGuide',
    component: TravelGuide
  },
  {
    path: '/terms-conditions',
    name: 'TermsConditions',
    component: TermsConditions
  },
  {
    path: '/trains',
    name: 'ChinaMainlandTrains',
    component: ChinaMainlandTrains
  },
  {
    path: '/hongkongtrains',
    name: 'HongKongTrains',
    component: HongKongTrains
  },
  {
    path: '/internationaltrains',
    name: 'InternationalTrains',
    component: InternationalTrains
  },
  {
    path: '/flights',
    name: 'Flights',
    component: Flights
  },
  {
    path: '/category/china_train_guide',
    name: 'ChinaTrainGuide',
    component: ChinaTrainGuide
  },
  {
    path: '/category/booking-guide',
    name: 'BookingGuide',
    component: BookingGuide
  },
  {
    path: '/china-esim',
    name: 'ChinaEsim',
    component: ChinaEsim
  },
  {
    path: '/create-order',
    name: 'OrderCreate',
    component: OrderCreate
  },
  {
    path: '/trains/order',
    name: 'order',
    component: () => import('../views/OrderCreate.vue')
  },
  {
    path: '/booking/create',
    name: 'BookingCreate',
    component: () => import('../views/BookingCreate.vue')
  },
  {
    path: '/trains/pay/',
    name: 'BookingPaymentPending',
    component: () => import('@/views/BookingPaymentPending.vue'),
    meta: {
      title: 'Payment Confirmation'
    }
  },
  {
    path: '/booking-success/:bookingId',
    name: 'BookingSuccess',
    component: () => import('@/views/BookingSuccess.vue'),
    meta: {
      title: 'Booking Success'
    }
  },
  // 404 catch-all route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
