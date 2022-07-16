import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/coin/:id',
      name: "coinSingle",
      props: true,
      component: () => import('../views/CoinView.vue')
    }
  ]
})

export default router
