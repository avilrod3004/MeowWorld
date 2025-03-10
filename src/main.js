import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import router from './router/router'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

const pinia = createPinia()
pinia.use(piniaPersist)

createApp(App).use(router).use(pinia).mount('#app')
