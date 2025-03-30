import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import TimeTable from '../views/orders/TimeTable.vue'
import OrderList from '../views/orders/OrderList.vue'
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
import NotFound from '../views/NotFound.vue'

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
    path: '/trains/order/:orderId/timetable',
    name: 'OrderTimeTable',
    component: TimeTable,
    meta: {
      title: '列车时刻表',
      step: 1 // 对应四步导航系统中的第二步
    }
  },
  {
    path: '/trains/order/:orderId/passengers',
    name: 'OrderPassengerInfo',
    component: () => import('../views/orders/PassengerInfo.vue'),
    meta: {
      title: '乘客信息',
      step: 2 // 对应四步导航系统中的第三步
    }
  },
  {
    path: '/trains/order/:orderId/pay',
    name: 'OrderPayment',
    component: () => import('@/views/orders/OrderPayment.vue'),
    meta: {
      title: 'Order Payment',
      step: 3 // 对应四步导航系统中的第四步
    }
  },
  {
    path: '/trains/order/:orderId/success',
    name: 'OrderPaymentSuccess',
    component: () => import('@/views/orders/OrderPaymentSuccess.vue'),
    meta: {
      title: 'Payment Success'
    }
  },
  {
    path: '/orders',
    name: 'OrderList',
    component: OrderList
  },
  {
    path: '/contact-us',
    name: 'ContactUs',
    component: ContactUs
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('@/views/FAQ.vue')
  },
  // {
  //   path: '/category/travel-guide',
  //   name: 'TravelGuide',
  //   component: TravelGuide
  // },
  // {
  //   path: '/terms-conditions',
  //   name: 'TermsConditions',
  //   component: TermsConditions
  // },
  // {
  //   path: '/trains',
  //   name: 'ChinaMainlandTrains',
  //   component: ChinaMainlandTrains
  // },
  // {
  //   path: '/hongkongtrains',
  //   name: 'HongKongTrains',
  //   component: HongKongTrains
  // },
  // {
  //   path: '/internationaltrains',
  //   name: 'InternationalTrains',
  //   component: InternationalTrains
  // },
  // {
  //   path: '/flights',
  //   name: 'Flights',
  //   component: Flights
  // },
  // {
  //   path: '/category/china_train_guide',
  //   name: 'ChinaTrainGuide',
  //   component: ChinaTrainGuide
  // },
  // {
  //   path: '/category/booking-guide',
  //   name: 'BookingGuide',
  //   component: BookingGuide
  // },
 
  // 404 catch-all route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
