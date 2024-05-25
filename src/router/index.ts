import { createRouter, createWebHistory } from 'vue-router'
import VendingPoints from '../components/VendingPoints.vue'
import ProductsOverview from '../components/ProductsOverview.vue'
import VendingPointOverview from '../components/VendingPointOverview.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'vendingpoints',
      component: VendingPoints
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsOverview
    },
    { path: '/vendor-point/:id', name: 'VendingPointOverview', component: VendingPointOverview }
  ]
})

export default router
