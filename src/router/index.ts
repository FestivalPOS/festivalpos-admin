import { createRouter, createWebHistory } from 'vue-router'
import VendingPoints from '../components/VendingPoints.vue'
import ProductsOverview from '../components/ProductsOverview.vue'
import VendingPointOverview from '../components/VendingPointOverview.vue'
import Login from '../components/UserLogin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'vendingpoints',
      component: VendingPoints,
      meta: { requiresAuth: true }
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsOverview,
      meta: { requiresAuth: true }
    },
    {
      path: '/vendor-point/:id',
      name: 'VendingPointOverview',
      component: VendingPointOverview,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
