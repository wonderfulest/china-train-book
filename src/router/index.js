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

const routes = [
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
