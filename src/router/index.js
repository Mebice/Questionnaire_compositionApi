import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView
    },
    {
      path: '/add',
      component: () => import('../views/Add.vue')
    },
    {
      path: '/checkout',
      component: () => import('../views/Checkout.vue')
    },
    {
      path: '/edit',
      component: () => import('../views/Edit.vue')
    },
    {
      path: '/editCheckout',
      component: () => import('../views/EditCheckout.vue')
    },
    {
      path: '/test',
      component: () => import('../views/Test.vue')
    },
  ]
})

export default router
