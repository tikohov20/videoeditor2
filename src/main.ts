import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import env from "./environment";

const pinia = createPinia();

import state from "../test/states/state-3.json";

pinia.state.value = state;
pinia.use((context) => {
    context.options.actions.$_hydrate && context.options.actions.$_hydrate()
});

const app = createApp(App)

app.use(pinia).mount('#app');

app.config.errorHandler = (err) => {
    throw err;
}
app.config.globalProperties.$env = env;
