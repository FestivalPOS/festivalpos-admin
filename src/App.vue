<template>
  <div class="container" v-if="isAuthenticated">
    <nav class="navbar navbar-expand-lg border-bottom">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img
            src="/src/assets/app_icon.png"
            alt="Logo"
            width="30"
            class="d-inline-block align-text-top"
          />
          FestivalPOS
        </a>
        <div class="d-flex h5 mb-0" v-if="festivalStore.state.festival">
          {{ festivalStore.state.festival }}
        </div>
        <div class="d-flex">
          <router-link class="nav-link" to="/" v-if="festivalStore.state.festival">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="bi d-block mx-auto mb-1"
              viewBox="0 0 512 512"
              width="24"
            >
              <path
                d="M352 200v240a40.12 40.12 0 01-40 40H136a40.12 40.12 0 01-40-40V224"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
              />
              <path
                d="M352 224h40a56.16 56.16 0 0156 56v80a56.16 56.16 0 01-56 56h-40"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-miterlimit="10"
                stroke-width="32"
              />
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
                d="M224 256v160M288 256v160M160 256v160M320 112a48 48 0 010 96c-13.25 0-29.31-7.31-38-16H160c-8 22-27 32-48 32a48 48 0 010-96 47.91 47.91 0 0126 9"
              />
              <path
                d="M91.86 132.43a40 40 0 1160.46-52S160 91 160 96M145.83 64.71C163.22 44.89 187.57 32 216 32c52.38 0 94 42.84 94 95.21a95 95 0 01-1.67 17.79"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-miterlimit="10"
                stroke-width="32"
              />
            </svg>
            Festivals
          </router-link>
          <router-link to="/" class="nav-link ms-4" @click="logout">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="bi d-block mx-auto mb-1"
              viewBox="0 0 512 512"
              width="24"
            >
              <path
                d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40M368 336l80-80-80-80M176 256h256"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
              />
            </svg>
            Logout
          </router-link>
        </div>
      </div>
    </nav>
    <nav class="navbar navbar-expand-lg border-bottom" v-if="festivalStore.state.festival_id">
      <div class="" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/pos">Vending Points</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/products">Products</router-link>
          </li>
          <!-- <li class="nav-item">
            <router-link class="nav-link" to="/sales">Sales</router-link>
          </li> -->
        </ul>
      </div>
    </nav>
  </div>
  <RouterView />
</template>

<style scoped></style>

<script setup>
import { ref, onMounted, watch, inject } from 'vue'
import { useRoute, RouterView, useRouter } from 'vue-router'

document.documentElement.setAttribute('data-bs-theme', 'dark')

const isAuthenticated = ref(false)
const router = useRouter()
const festivalStore = inject('festivalStore')

onMounted(() => {
  isAuthenticated.value = !!localStorage.getItem('token')

  if (!festivalStore.state.festival_id) {
    router.push('/')
  }
})

// Listen to route changes to update authentication status
const route = useRoute()
watch(
  () => route.path,
  () => {
    isAuthenticated.value = !!localStorage.getItem('token')

    if (!festivalStore.state.festival_id) {
      router.push('/')
    }
  }
)

function logout() {
  // Clear the token from local storage
  localStorage.removeItem('token')
  festivalStore.unsetFestival()

  // Redirect to login page
  router.push('/login')
}
</script>
