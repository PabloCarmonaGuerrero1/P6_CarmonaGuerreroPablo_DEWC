<script>
// Importa la librería Axios para hacer solicitudes HTTP
import axios from 'axios';

// Exporta el objeto Vue con sus propiedades y métodos
export default {
  // Datos del componente
  data() {
    return {
      // Nombre de usuario
      username: "",
      // Contraseña
      password: "",
      // Repetir contraseña
      repeat: "",
      // Errores de validación
      errors: {
        username: "", // Error del nombre de usuario
        password: "", // Error de la contraseña
        repeat: "",   // Error de la repetición de la contraseña
        usernameTaken: "", // Error si el nombre de usuario está ocupado
      },
      // Indicador de envío deshabilitado
      submitDisabled: false,
    };
  },
  // Métodos del componente
  methods: {
    // Valida la disponibilidad del nombre de usuario
    async validateUsernameAvailability() {
      try {
        const apiUrl = `http://localhost:80/api/auth/users/${this.username}/availability`;
        const response = await axios.get(apiUrl);
        this.errors.usernameTaken = ''; // Reinicia el error si el nombre de usuario está disponible
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errors.usernameTaken = 'Username is already taken'; // Establece el error si el nombre de usuario ya está en uso
        } else {
          this.errors.usernameTaken = '';
        }
        console.error('Error checking username availability:', error);
      }
    },
    // Valida el nombre de usuario
    validateName() {
      const namelength = this.username.replace(/\s/g, '').length;
      if (namelength < 4 || namelength > 12){
        this.errors.username = 'Username must be at least 4 characters long'; // Establece el error si el nombre de usuario no cumple con la longitud requerida
        this.errors.usernameTaken = ''; 
      } else {
        this.errors.username = '';
      }
      this.updateSubmitDisabled();
    },
    // Valida la contraseña
    validatePassword() {
      const passwordLength = this.password.length;
      if (passwordLength < 8 || this.password.includes(" ")) {
        this.errors.password = "Password must be at least 8 characters long and cannot contain spaces"; // Establece el error si la contraseña no cumple con los requisitos
      } else {
        this.errors.password = "";
      }
      this.updateSubmitDisabled();
    },
    // Valida la repetición de la contraseña
    validateRepeat() {
      if (this.password !== this.repeat) {
        this.errors.repeat = "Passwords do not match"; // Establece el error si las contraseñas no coinciden
      } else {
        this.errors.repeat = "";
      }
      this.updateSubmitDisabled();
    },
    // Actualiza el estado de envío deshabilitado
    updateSubmitDisabled() {
      this.submitDisabled = Object.values(this.errors).some(error => error !== ''); // Comprueba si hay algún error de validación
    },
    // Registra al usuario
    async registerUser() {
      try {
        const apiUrl = 'http://localhost:80/api/v1/users';
        const userData = {
          username: this.username,
          password: this.password,
          idicon: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        };

        const response = await axios.post(apiUrl, userData);
        console.log('Respuesta del servidor:', response.data);

        this.$router.push("/login"); // Redirige al usuario a la página de inicio de sesión después del registro
      } catch (error) {
        if (error.response) {
          console.error('Server responded with an error status:', error.response.status);
          console.error('Error data:', error.response.data);
        } else if (error.request) {
          console.error('No response received from the server');
        } else {
          console.error('Error setting up the request:', error.message);
        }
      }
    },
    // Valida y envía el formulario
    validateAndSubmit() {
      this.validateName();
      this.validatePassword();
      this.validateRepeat();
      this.validateUsernameAvailability();
      if (!this.submitDisabled) {
        this.registerUser();
      }
    }
  },
  // Observadores de cambios
  watch: {
    // Observa cambios en el nombre de usuario
    username: "validateName",
    // Observa cambios en la contraseña
    password: "validatePassword",
    // Observa cambios en la repetición de la contraseña
    repeat: "validateRepeat",
  },
};
</script>


<template>
  <!-- Formulario de registro -->
  <form class="Register">
    <!-- Campo de entrada para el nombre de usuario -->
    <label>
      <p>Username</p>
      <input type="text" v-model="username"> <!-- Enlace bidireccional con la variable 'username' -->
      <!-- Mensaje de error para el nombre de usuario -->
      <div class="error" v-if="errors.username">{{ errors.username }}</div>
      <!-- Mensaje de error si el nombre de usuario está ocupado -->
      <div class="error" v-if="errors.usernameTaken">{{ errors.usernameTaken }}</div>
    </label>
    <!-- Campo de entrada para la contraseña -->
    <label>
      <p>Password</p>
      <input type="password" v-model="password"> <!-- Enlace bidireccional con la variable 'password' -->
      <!-- Mensaje de error para la contraseña -->
      <div class="error" v-if="errors.password">{{ errors.password }}</div>
    </label>
    <!-- Campo de entrada para repetir la contraseña -->
    <label>
      <p>Repeat Password</p>
      <input type="password" v-model="repeat"> <!-- Enlace bidireccional con la variable 'repeat' -->
      <!-- Mensaje de error si las contraseñas no coinciden -->
      <div class="error" v-if="errors.repeat">{{ errors.repeat }}</div>
    </label>
    <!-- Botón para enviar el formulario -->
    <button @click.prevent="validateAndSubmit" :disabled="submitDisabled">Register</button> <!-- Llama al método 'validateAndSubmit' al hacer clic -->
  </form>
</template>

<style>
.Register .error {
    margin-top: 1rem;
    color: red;
    font-size: 12px;
}
.Register {
    margin-top: 0rem;
    margin-bottom: 5rem;
    min-height: 42rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.Register label{
    display: block;
    text-align: center;
}
.Register input{
    height: 4rem;
    width: 20rem;
    margin-top: 0;
    border-radius: 2.8125rem;
    text-align: center;
    font-family: 'Mogra', sans-serif;
    font-size: 1.5rem;
}
.Register p{
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    color: #0BFF00;
    font-family: 'Nanum Brush Script', cursive;
    font-size: 4rem; 
}
.Register  button{
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

.Register input {
  width: 15rem;
  font-size: 1rem;
}

.Register button {
  width: 6rem;
  font-size: 1.75rem;
}
.Register p{
  font-size: 3rem;
}
}
</style>
