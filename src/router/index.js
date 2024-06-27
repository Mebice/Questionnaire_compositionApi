import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/Home.vue'),
      children:[
        {
          path: '',
          component: () => import('../components/Home/UserHome.vue')
        },
        {
          path: '/managerHome',
          component: () => import('../components/Home/ManagerHome.vue')
        },
      ]
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
      path: '/preview',
      component: () => import('../views/Preview.vue')
    },
    {
      path: '/answer',
      component: () => import('../views/Answer.vue')
    },
    {
      path: '/answerCheckout',
      component: () => import('../views/AnswerCheckout.vue')
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
