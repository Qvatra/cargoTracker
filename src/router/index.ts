import { createRouter, createWebHistory } from 'vue-router'
import ShipmentsView from '../views/ShipmentsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'shipments',
      component: ShipmentsView
    }
  ]
})

export default router
