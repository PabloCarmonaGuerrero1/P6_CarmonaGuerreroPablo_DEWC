<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      errors: {
        username: '',
        password: '',
      },
      submitDisabled: false,
    };
  },
  methods: {
    async loginUser() {
      try {
        const apiUrl = `http://localhost/api/v1/users/${this.username}`;
        const response = await axios.get(apiUrl);

        if (response.data) {
          const user = response.data;

          if (user.password === this.password) {
            this.$router.push('/homepage');
          } else {
            this.errors.password = 'Incorrect password.';
            this.errors.username = ''; 
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errors.username = 'User not found.';
          this.errors.password = ''; 
        } else if (error.response) {
          console.error('Server responded with an error status:', error.response.status);
          console.error('Error data:', error.response.data);
        } else if (error.request) {
          console.error('No response received from the server');
        } else {
          console.error('Error setting up the request:', error.message);
        }
      }
    },
  },
};
</script>

<template>
  <form class="Login" @submit.prevent="loginUser">
    <label>
      <p class="titleform">Username</p>
      <input v-model="username" type="text" />
      <div class="error" v-if="errors.username">{{ errors.username }}</div>
    </label>
    <label>
      <p class="titleform">Password</p>
      <input v-model="password" type="password" />
      <div class="error" v-if="errors.password">{{ errors.password }}</div>
    </label>
    <button type="submit">Login</button>
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
