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
  <form class="Login" @submit.prevent="loginUser">
    <!-- Campo de entrada para el nombre de usuario -->
    <label>
      <p class="titleform">Username</p>
      <input v-model="username" type="text" />
      <!-- Muestra el mensaje de error si hay un error relacionado con el nombre de usuario -->
      <div class="error" v-if="errors.username">{{ errors.username }}</div>
    </label>
    <!-- Campo de entrada para la contraseña -->
    <label>
      <p class="titleform">Password</p>
      <input v-model="password" type="password" />
      <!-- Muestra el mensaje de error si hay un error relacionado con la contraseña -->
      <div class="error" v-if="errors.password">{{ errors.password }}</div>
    </label>
    <!-- Botón para enviar el formulario -->
    <button type="submit">Login</button>
    <!-- Enlace para dirigirse a la página de registro -->
    <router-link to="/Register"><p class="goregister">Press here to register!</p></router-link>
  </form>
</template>

<style>
.Login .error {
  margin-top: 1rem;
  color: red;
  font-size: 12px;
}

.Login {
  margin-top: 0rem;
  margin-bottom: 5rem;
  min-height: 42rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.Login label {
  display: block;
  text-align: center;
}

.Login input {
  height: 4rem;
  width: 20rem;
  margin-top: 0;
  border-radius: 2.8125rem;
  text-align: center;
  font-family: 'Mogra', sans-serif;
  font-size: 1.5rem;
}

.Login .goregister {
  color: white;
  font-family: 'Nanum Brush Script', cursive;
  font-size: 2rem;
}

.Login a {
  text-decoration: none;
}

.Login .titleform {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  color: #0BFF00;
  font-family: 'Nanum Brush Script', cursive;
  font-size: 4rem;
}

.Login button {
  height: 3.5rem;
  width: 12rem;
  margin-top: 2rem;
  border-radius: 2.8125rem;
  background-color: #2CD824;
  color: black;
  font-family: 'Nanum Brush Script', cursive;
  font-size: 3rem;
}

@media screen and (max-width: 768px) {

  .Login input {
    width: 15rem;
    font-size: 1rem;
  }

  .Login button {
    width: 6rem;
    font-size: 2rem;
  }
  .Login .titleform{
    font-size: 3rem;
  }
}
</style>
