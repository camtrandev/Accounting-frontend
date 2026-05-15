

import { createApp } from 'vue'
import App from './App.vue'

import Toast from "vue-toastification";
import router from './router'
import { createPinia } from 'pinia'
import "vue-toastification/dist/index.css";

const app = createApp(App)

const toastOptions = {
    transition: "Vue-Toastification__bounce",
    maxToasts: 5,
    newestOnTop: true
};

app.use(createPinia())
app.use(router)

app.use(Toast, toastOptions);
app.mount('#app')
