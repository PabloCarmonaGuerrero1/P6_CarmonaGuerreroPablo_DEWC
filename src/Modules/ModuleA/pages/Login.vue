<script>
// Importa la librería Axios para hacer solicitudes HTTP
import axios from 'axios';

// Exporta el objeto Vue con sus propiedades y métodos
export default {
  // Datos del componente
  data() {
    return {
      // Variables para el nombre de usuario y contraseña
      username: '',
      password: '',
      // Objeto para almacenar errores
      errors: {
        username: '',
        password: '',
      },
      // Estado del botón de envío
      submitDisabled: false,
      isLightMode: localStorage.getItem('light-mode') === 'true'
    };
  },
  // Métodos del componente
  methods: {
    // Método para iniciar sesión del usuario
    async loginUser() {
      try {
        // URL de la API para obtener información del usuario
        const apiUrl = `http://localhost/api/v1/users/${this.username}`;
        // Realiza una solicitud GET a la API
        const response = await axios.get(apiUrl);

        // Si se recibe una respuesta
        if (response.data) {
          // Obtiene los datos del usuario
          const user = response.data;

          // Verifica si la contraseña es correcta
          if (user.password === this.password) {
            // Almacena el nombre de usuario en el almacenamiento local
            localStorage.setItem("username", this.username);
            // Redirecciona a la página de inicio
            this.$router.push('/homepage');
          } else {
            // Muestra un mensaje de error si la contraseña es incorrecta
            this.errors.password = 'Incorrect password.';
            this.errors.username = ''; 
          }
        }
      } catch (error) {
        // Maneja errores de la solicitud
        if (error.response && error.response.status === 404) {
          // Muestra un mensaje de error si el usuario no se encuentra
          this.errors.username = 'User not found.';
          this.errors.password = ''; 
        } else if (error.response) {
          // Muestra un mensaje de error si la respuesta tiene un estado diferente de 404
          console.error('Server responded with an error status:', error.response.status);
          console.error('Error data:', error.response.data);
        } else if (error.request) {
          // Muestra un mensaje de error si no se recibe respuesta del servidor
          console.error('No response received from the server');
        } else {
          // Muestra un mensaje de error si hay un problema con la solicitud
          console.error('Error setting up the request:', error.message);
        }
      }
    },
  },
};
</script>


<template>
  <!-- Formulario de inicio de sesión -->
  <form class="Login" :class="{ 'light-mode-title': isLightMode }" @submit.prevent="loginUser">
    <!-- Campo de entrada para el nombre de usuario -->
    <label>
      <p class="titleform">Username</p>
      <input v-model="username" type="text"/>
      <!-- Muestra el mensaje de error si hay un error relacionado con el nombre de usuario -->
      <div class="error" v-if="errors.username">{{ errors.username }}</div>
    </label>
    <!-- Campo de entrada para la contraseña -->
    <label>
      <p class="titleform">Password</p>
      <input v-model="password" type="password"/>
      <!-- Muestra el mensaje de error si hay un error relacionado con la contraseña -->
      <div class="error" v-if="errors.password">{{ errors.password }}</div>
    </label>
    <!-- Botón para enviar el formulario -->
    <button type="submit">Login</button>
    <!-- Enlace para dirigirse a la página de registro -->
    <router-link to="/Register"><p class="goregister" :class="{ 'light-mode-register': isLightMode }">Press here to register!</p></router-link>
  </form>
</template>

<style>
/* Estilos para mensajes de error dentro de la clase Login */
.Login .error {
  margin-top: 1rem; /* Margen superior de 1 rem */
  color: red; /* Color del texto en rojo */
  font-size: 12px; /* Tamaño de fuente de 12 píxeles */
}

/* Estilos para el contenedor de inicio de sesión */
.Login {
  margin-top: 0rem; /* Margen superior de 0 rem */
  margin-bottom: 5rem; /* Margen inferior de 5 rem */
  min-height: 42rem; /* Altura mínima de 42 rem */
  display: flex; /* Utiliza el modelo de caja flexible */
  flex-direction: column; /* Los elementos dentro del contenedor se colocan en columna */
  align-items: center; /* Centra los elementos horizontalmente */
  justify-content: center; /* Centra los elementos verticalmente */
}

/* Estilos para las etiquetas de texto dentro del formulario de inicio de sesión */
.Login label {
  display: block; /* Muestra las etiquetas como bloques */
  text-align: center; /* Alinea el texto al centro */
}

/* Estilos para los campos de entrada dentro del formulario de inicio de sesión */
.Login input {
  height: 4rem; /* Altura del campo de entrada de 4 rem */
  width: 20rem; /* Ancho del campo de entrada de 20 rem */
  margin-top: 0; /* Margen superior de 0 */
  border-radius: 2.8125rem; /* Radio del borde del campo de entrada */
  text-align: center; /* Alinea el texto al centro */
  font-family: 'Mogra', sans-serif; /* Fuente del texto */
  font-size: 1.5rem; /* Tamaño de fuente de 1.5 rem */
}

/* Estilos para el enlace de registro dentro del formulario de inicio de sesión */
.Login .goregister {
  color: white; /* Color del texto en blanco */
  font-family: 'Nanum Brush Script', cursive; /* Fuente del texto */
  font-size: 2rem; /* Tamaño de fuente de 2 rem */
}

/* Estilos para los enlaces dentro del formulario de inicio de sesión */
.Login a {
  text-decoration: none; /* Quita la subrayado de los enlaces */
}

/* Estilos para el título del formulario de inicio de sesión */
.Login .titleform {
  margin-top: 0.5rem; /* Margen superior de 0.5 rem */
  margin-bottom: 0.5rem; /* Margen inferior de 0.5 rem */
  color: #0BFF00; /* Color del texto en verde */
  font-family: 'Nanum Brush Script', cursive; /* Fuente del texto */
  font-size: 4rem; /* Tamaño de fuente de 4 rem */
}

/* Estilos para el botón de enviar dentro del formulario de inicio de sesión */
.Login button {
  height: 3.5rem; /* Altura del botón de 3.5 rem */
  width: 12rem; /* Ancho del botón de 12 rem */
  margin-top: 2rem; /* Margen superior de 2 rem */
  border-radius: 2.8125rem; /* Radio del borde del botón */
  background-color: #2CD824; /* Color de fondo del botón */
  color: black; /* Color del texto en negro */
  font-family: 'Nanum Brush Script', cursive; /* Fuente del texto */
  font-size: 3rem; /* Tamaño de fuente de 3 rem */
}

/* Estilos específicos para el modo de luz en el título del formulario */
.light-mode-title input{
  border: 2px solid black; /* Borde del campo de entrada de 2 píxeles sólido negro */
}
.light-mode-title{
  -webkit-text-stroke: 1px black; /* Añade un contorno de 1 píxel de grosor en negro al texto */
}
.Login .light-mode-register{
  color:black; /* Color del texto en negro */
  text-decoration: underline; /* Subrayado del texto */
}
.light-mode-title button{
  background-color:#0BFF00; /* Color de fondo del botón en verde */
  border: 2px solid black; /* Borde del botón de 2 píxeles sólido negro */
  -webkit-text-stroke: 0px black; /* Elimina el contorno del texto */
}

/* Estilos específicos para pantallas con un ancho máximo de 768px */
@media screen and (max-width: 768px) {

  .Login input {
    width: 15rem; /* Ancho del campo de entrada de 15 rem */
    font-size: 1rem; /* Tamaño de fuente de 1 rem */
  }

  .Login button {
    width: 6rem; /* Ancho del botón de 6 rem */
    font-size: 2rem; /* Tamaño de fuente de 2 rem */
  }
  .Login .titleform{
    font-size: 3rem; /* Tamaño de fuente del título de 3 rem */
  }
}
</style>
