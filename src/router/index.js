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
      path: '/addCheckout',
      component: () => import('../views/AddCheckout.vue')
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
      path: '/userHome',
      component: () => import('../views/UserHome.vue')
    },
  ],
  // 路由滾動行為訂製
  scrollBehavior(){
    return {
      top:0
    }
  }
})

export default router
