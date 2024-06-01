<template>
  <div class="container mt-5 login-box">
    <h1>FestivalPOS - Login</h1>
    <form @submit.prevent="login" class="mt-5">
      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="username">Email:</label>
        <input type="text" id="email" v-model="email" class="form-control" required />
      </div>
      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="password">Password:</label>
        <input type="password" id="password" class="form-control" v-model="password" required />
      </div>
      <button
        type="button"
        data-mdb-button-init
        data-mdb-ripple-init
        class="btn btn-primary btn-block"
        @click="login"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

async function login() {
  const credentials = {
    email: email.value,
    password: password.value
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    localStorage.setItem('token', data.token) // Assuming the response contains a token field
    router.push('/')
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(error.message)
      console.log(error.message)
    } else {
      alert('An unknown error occurred')
      console.log('An unknown error occurred')
    }
  }
}
</script>

<style scoped>
.login-box {
  max-width: 450px;
}
</style>
