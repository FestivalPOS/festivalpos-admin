<template>
  <div class="container" v-if="isAuthenticated">
    <nav class="navbar navbar-expand-lg">
      <a class="navbar-brand" href="#">FestivalPOS</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="/">Vending Points</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/products">Products</a>
          </li>
        </ul>
      </div>

      <div class="d-flex">
        <button class="btn btn-outline-warning" type="button" @click="logout">Logout</button>
      </div>
    </nav>
  </div>
  <RouterView />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterView, useRouter } from 'vue-router'

document.documentElement.setAttribute('data-bs-theme', 'dark')

const isAuthenticated = ref(false)
const router = useRouter()

onMounted(() => {
  isAuthenticated.value = !!localStorage.getItem('token')
})

// Listen to route changes to update authentication status
const route = useRoute()
watch(
  () => route.path,
  () => {
    isAuthenticated.value = !!localStorage.getItem('token')
  }
)

function logout() {
  // Clear the token from local storage
  localStorage.removeItem('token')

  // Redirect to login page
  router.push('/login')
}
</script>
