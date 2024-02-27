// Importar funciones de enrutamiento desde vue-router
import { createRouter, createWebHashHistory } from 'vue-router';

// Definir rutas para el enrutador
const routes = [
  {
    path: '/',
    component:()=>import("@/Modules/ModuleA/layouts/LayoutPublic.vue"),
    children:[
      { path: "", component: () => import("../pages/Inicio.vue") },
      { path: "homePage", component: () => import("../pages/HomePage.vue") },
      { path: "other-user", component: () => import("../pages/Other_User.vue") },
      { path: "contact", component: () => import("../pages/Contact.vue") },
    ]
  },
  {path: '/user',
    component:()=>import("@/Modules/ModuleA/layouts/LayoutPrivate.vue"),
    children:[{ path: "", component: () => import("../pages/User.vue") },]
  },
  { path: "/login", component: () => import("../pages/Login.vue") },
  { path: "/register", component: () => import("../pages/Register.vue") },
  { path: "/:pathMatch(.*)*", component: () => import("../pages/NotFound.vue") },
  
];

// Crear un enrutador con historial basado en hash
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
const storedUsername = localStorage.getItem('username');
const isLoggedIn = !!storedUsername;

router.beforeEach((to, from, next) => {
  if (to.path !== '/user' || isLoggedIn) {
    next();
  } else {
    next('/login');
  }
});

// Exportar el enrutador creado
export default router;
