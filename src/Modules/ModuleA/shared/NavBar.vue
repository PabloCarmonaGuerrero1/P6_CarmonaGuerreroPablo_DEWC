
<template>
  <div class="NavBar" :class="{ 'light-mode-navbar': isLightMode }">
    <div class="left">
      <router-link v-if="!this.isLightMode" to="/Contact"><img src="@/assets/icons/charlando.png" alt="contact-page"></router-link>
      <router-link v-if="this.isLightMode" to="/Contact"><img src="@/assets/icons/Charlando.png" alt="contact-page-light"></router-link>
      <button @click="toggleLightMode" v-if="!this.isLightMode"><img src="@/assets/icons/soleado 1.png" alt="lightmode"></button>
      <button @click="toggleLightMode" v-if="this.isLightMode"><img src="@/assets/icons/luna 6.png" alt="normal-mode"></button> 
    </div>
    <router-link to="/"><h1>Rick & Morty</h1></router-link>
    <router-link v-if="!username" to="/Login"><img src="@/assets/icons/perfil.png" alt="login-user" ></router-link>
    <router-link v-else to="/user"><img :src="userAvatar" alt="user-profile" class="loged"></router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userAvatar: null ,
      username : localStorage.getItem('username'),
      isLightMode: JSON.parse(localStorage.getItem('light-mode'))
    };
  },
  mounted() {
    this.getUserAvatar()
  },
  methods: {
    async getUserAvatar() {
      try {
        const storedUsername = localStorage.getItem('username');
        const apiUrl = `http://localhost/api/v1/users/${storedUsername}`; 
        const response = await axios.get(apiUrl);
        this.userAvatar = response.data.idicon;
      } catch (error) {
        console.error('Error fetching user avatar:', error);
      }
    },
    toggleLightMode() {
      this.isLightMode = !this.isLightMode;
      localStorage.setItem("light-mode", this.isLightMode);
      window.location.reload();
    }
  }
};
</script>

<style>
.NavBar {
    height: 5rem; /* Altura de la barra de navegación */
    padding: 0 1rem; /* Relleno en los lados de la barra de navegación */
    display: flex; /* Utiliza el modelo de caja flexible */
    justify-content: space-between; /* Distribuye los elementos a lo largo del eje principal (horizontal) */
    align-items: center; /* Centra verticalmente los elementos */
    background-color: #2CD824; /* Color de fondo de la barra de navegación */
}

.NavBar img {
    max-width: 3rem; /* Ancho máximo de la imagen dentro de la barra de navegación */
    max-height: 3rem; /* Altura máxima de la imagen dentro de la barra de navegación */
}

.NavBar h1 {
    color: black; /* Color del texto del encabezado */
    font-family: 'Monofett', sans-serif; /* Familia de fuentes del encabezado */
    font-size: 3rem; /* Tamaño del texto del encabezado */
}

.NavBar a {
    text-decoration: none; /* Quita la decoración de texto de los enlaces */
}

.loged {
  border-radius: 50%; /* Agrega bordes redondeados a la clase "loged" */
}

.left button {
  margin-left: 2rem; /* Margen izquierdo para los botones dentro de la clase "left" */
  color: transparent; /* Hace que el color del texto sea transparente */
  background-color: transparent; /* Hace que el fondo del botón sea transparente */
  border: none; /* Quita los bordes del botón */
}

.light-mode-navbar {
  background-color: #0BFF00; /* Color de fondo de la barra de navegación en modo claro */
}

.light-mode-navbar h1 {
  color: white; /* Color del texto del encabezado en modo claro */
  -webkit-text-stroke: 1px black; /* Agrega un contorno al texto del encabezado */
}

@font-face {
    font-family: "Monofett"; /* Define una nueva fuente llamada "Monofett" */
    src: url("@/Modules/ModuleA/fonts/Monofett/Monofett-Regular.ttf") format("truetype"); /* Ubicación de la fuente */
}

@font-face {
    font-family: 'Nanum Brush Script'; /* Define una nueva fuente llamada 'Nanum Brush Script' */
    src: url("@/Modules/ModuleA/fonts/LR/NanumBrushScript-Regular.ttf") format('truetype'); /* Ubicación de la fuente */
}

@font-face {
    font-family: 'Mogra'; /* Define una nueva fuente llamada 'Mogra' */
    src: url("@/Modules/ModuleA/fonts/Mogra/Mogra-Regular.ttf") format('truetype'); /* Ubicación de la fuente */
}

@media screen and (max-width: 768px) {
    .NavBar {
        text-align: center; /* Alinea el texto al centro en pantallas más pequeñas */
    }

    .NavBar h1 {
        font-size: 2rem; /* Tamaño del texto del encabezado en pantallas más pequeñas */
        margin-top: 1rem; /* Margen superior del texto del encabezado en pantallas más pequeñas */
    }
    
    .NavBar img {
        max-width: 2rem; /* Ancho máximo de la imagen dentro de la barra de navegación en pantallas más pequeñas */
        max-height: 2rem; /* Altura máxima de la imagen dentro de la barra de navegación en pantallas más pequeñas */
    }
    
    .left {
        display: flex; /* Utiliza el modelo de caja flexible */
        justify-content: center; /* Centra horizontalmente los elementos */
    }
    
    .left button {
        margin-left: 0.2rem; /* Margen izquierdo reducido para los botones dentro de la clase "left" */
    }
}

</style>