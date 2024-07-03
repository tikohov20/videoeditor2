import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

const pinia = createPinia();

import state from "../test/states/state-2.json";

pinia.state.value = state;

createApp(App).use(pinia).mount('#app')
