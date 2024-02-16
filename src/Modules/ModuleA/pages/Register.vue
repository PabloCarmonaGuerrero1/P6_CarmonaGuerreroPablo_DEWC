<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: "",
      password: "",
      repeat: "",
      errors: {
        username: "",
        password: "",
        repeat: "",
        usernameTaken: "", 
      },
      submitDisabled: false,
    };
  },
  methods: {
    async validateUsernameAvailability() {
      try {
        const apiUrl = `http://localhost:80/api/v1/auth/users/${this.username}/availability`;
        const response = await axios.get(apiUrl);
        this.errors.usernameTaken = '';
      } catch (error) {
  if (error.response && error.response.status === 404) {
    this.errors.usernameTaken = 'Username is already taken';
  } else {
    this.errors.usernameTaken = '';
  }
  console.error('Error checking username availability:', error);
}

    },
    validateName() {
      const namelength = this.username.replace(/\s/g, '').length;
      if (namelength < 4) {
        this.errors.username = 'Username must be at least 4 characters long';
        this.errors.usernameTaken = ''; 
      } else {
        this.errors.username = '';

        

      }
      this.updateSubmitDisabled();
    },
    validatePassword() {
      const passwordLength = this.password.length;
      if (passwordLength < 8 || this.password.includes(" ")) {
        this.errors.password = "Password must be at least 8 characters long and cannot contain spaces";
      } else {
        this.errors.password = "";
      }
      this.updateSubmitDisabled();
    },
    validateRepeat() {
      if (this.password !== this.repeat) {
        this.errors.repeat = "Passwords do not match";
      } else {
        this.errors.repeat = "";
      }
      this.updateSubmitDisabled();
    },
    updateSubmitDisabled() {
      this.submitDisabled = Object.values(this.errors).some(error => error !== '');
    },
    async registerUser() {
      try {
        const apiUrl = 'http://localhost:80/api/v1/auth/users';
        const userData = {
          username: this.username,
          password: this.password,
          idicon: 0,
          num_coments: 1,
          comments: "Hey"
        };

        const response = await axios.post(apiUrl, userData);
        console.log('Respuesta del servidor:', response.data);

        this.$router.push("/login");
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
  watch: {
    username: "validateName",
    password: "validatePassword",
    repeat: "validateRepeat",
  },
};
</script>

<template>
  <form class="Register">
    <label>
      <p>Username</p>
      <input type="text" v-model="username">
      <div class="error" v-if="errors.username">{{ errors.username }}</div>
      <div class="error" v-if="errors.usernameTaken">{{ errors.usernameTaken }}</div>
    </label>
    <label>
      <p>Password</p>
      <input type="password" v-model="password">
      <div class="error" v-if="errors.password">{{ errors.password }}</div>
    </label>
    <label>
      <p>Repeat Password</p>
      <input type="password" v-model="repeat">
      <div class="error" v-if="errors.repeat">{{ errors.repeat }}</div>
    </label>
    <button @click.prevent="validateAndSubmit" :disabled="submitDisabled">Register</button>
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
</style>
