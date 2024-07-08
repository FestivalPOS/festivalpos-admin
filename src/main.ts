import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { createFestivalStore } from './helpers/festival.store'
import { updateAuthToken, getAuthToken } from './tokenHandler'

const app = createApp(App)

const globalState = reactive({
  isAuthenticated: false
})
const festivalStore = createFestivalStore()

app.provide('isAuthenticated', globalState.isAuthenticated)
app.provide('festivalStore', festivalStore)
app.use(router)

app.mount('#app')

// Set the token at startup
let token = getAuthToken();
if (token !== null) {
  updateAuthToken(token)
}
