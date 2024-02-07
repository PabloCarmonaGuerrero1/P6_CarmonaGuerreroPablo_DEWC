import { createRouter,createWebHashHistory} from 'vue-router'

const routes = [
    {path:"/",component:()=>import("../pages/Inicio.vue")},
    {path:"/Login",component:()=>import("../pages/Login.vue")},
    {path:"/Register",component:()=>import("../pages/Register.vue")},
    {path:"/HomePage",component:()=>import("../pages/HomePage.vue")},
    {path:"/User",component:()=>import("../pages/User.vue")},
    {path:"/Other_User",component:()=>import("../pages/Other_User.vue")},
    {path:"/Contact",component:()=>import("../pages/Contact.vue")},
    {path:"/:pathMatch(.*)*",component:()=>import("../pages/NotFound.vue")},
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })
export default router