import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { createFestivalStore } from './helpers/festival.store'

const app = createApp(App)

const globalState = reactive({
  isAuthenticated: false
})
const festivalStore = createFestivalStore()

app.provide('isAuthenticated', globalState.isAuthenticated)
app.provide('festivalStore', festivalStore)
app.use(router)

app.mount('#app')

// Function to set authorization token
function setAuthToken(token: string) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

// Set the token at startup
const token = localStorage.getItem('token')
if (token) {
  setAuthToken(token)
}
