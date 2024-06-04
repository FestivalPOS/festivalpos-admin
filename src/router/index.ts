import { createRouter, createWebHistory } from 'vue-router'
import VendingPoints from '../components/VendingPoints.vue'
import ProductsOverview from '../components/ProductsOverview.vue'
import VendingPointOverview from '../components/VendingPointOverview.vue'
import Login from '../components/UserLogin.vue'
import FestivalsOverview from '../components/FestivalsOverview.vue'
import SalesDashbord from '@/components/Sales/SalesDashbord.vue'

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
      name: 'festivals',
      component: FestivalsOverview,
      meta: { requiresAuth: true }
    },
    {
      path: '/pos',
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
    },
    {
      path: '/sales',
      name: 'SalesDashbord',
      component: SalesDashbord,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } else if (token) {
    // Check jwt expired
    const jwtPayload = parseJwt(token)
    if (jwtPayload.exp < Date.now() / 1000) {
      // token expired
      localStorage.removeItem('token') // Remove expired token
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )

    return JSON.parse(jsonPayload)
  } catch (e) {
    console.error('Failed to parse JWT:', e)
    return null
  }
}

export default router
