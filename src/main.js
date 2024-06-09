import { createApp } from 'vue'
import App from './App.vue'
import router from './Modules/ModuleA/route/Router'
import "@/assets/css/main.css"

const isLightMode = JSON.parse(localStorage.getItem('light-mode'));
if (isLightMode) {
    document.body.style.backgroundImage = 'url("/src/assets/icons/fondo-light.jpg")'; 
} else {
    document.body.style.backgroundImage = 'url("/src/assets/icons/fondo.jpg")'; 
}
createApp(App).use(router).mount('#app')
