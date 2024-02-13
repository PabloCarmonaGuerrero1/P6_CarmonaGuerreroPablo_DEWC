// Importar funciones de enrutamiento desde vue-router
import { createRouter, createWebHashHistory } from 'vue-router';

// Definir rutas para el enrutador
const routes = [
  { path: "/", component: () => import("../pages/Inicio.vue") },
  { path: "/login", component: () => import("../pages/Login.vue") },
  { path: "/register", component: () => import("../pages/Register.vue") },
  { path: "/homePage", component: () => import("../pages/HomePage.vue") },
  { path: "/user", component: () => import("../pages/User.vue") },
  { path: "/other_User", component: () => import("../pages/Other_User.vue") },
  { path: "/contact", component: () => import("../pages/Contact.vue") },
  { path: "/:pathMatch(.*)*", component: () => import("../pages/NotFound.vue") },
];

// Crear un enrutador con historial basado en hash
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Exportar el enrutador creado
export default router;
