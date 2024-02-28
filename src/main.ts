import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

const piana = createPinia();

createApp(App).use(piana).mount('#app')
