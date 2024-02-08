import { createApp } from 'vue'
import App from './App.vue'
import router from './Modules/ModuleA/route/Router'
import "@/assets/css/main.css"

createApp(App).use(router).mount('#app')
