<script>
import axios from 'axios';

export default {
  data() {
    return {
      userInfo: {},
      userAvatar: '@/assets/icons/perfil.png', // Aquí se verá una imagen de perfil a elección del usuario en futuras entregas
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      try {
        const apiUrl = 'http://localhost/api/v1/auth/users/juan'; // En futuras entrega se verá el usuario que ha iniciado sesion
        const response = await axios.get(apiUrl);
        this.userInfo = response.data;
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    },
  },
};
</script>

<template>
    <div class="user-profile">
      <div class="profile-box">
        <img src="@/assets/icons/perfil.png" alt="User Avatar">
        <div class="user-info">
          <p class="username">{{ userInfo.username }}</p>
          <p class="comments">Comments {{ userInfo.num_comments }}</p>
        </div>
      </div>
    </div>
  </template>

<style>
  .user-profile {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 77.4vh;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .profile-box {
    min-width: 10rem; 
    text-align: center;
    padding: 2rem;
    border-radius: 1.875rem;
    background-color: #2E3244;
    color: white;
    font-family: 'Mogra', sans-serif;
  }

  .user-info {
    margin-top: 1rem;
    text-align: center;
  }

  .username {
    font-size: 1.5rem;

  }

  .comments {
    font-size: 1rem;
  }

  img {
    max-width: 100%; 
    height: auto; 
    border-radius: 50%;
  }

  @media only screen and (max-width: 600px) {

    .profile-box {
      width: 5rem; 
    }
    .username{
      font-size: 1rem;
    }
    .comments{
      font-size: 0.5rem;
    }
  }
</style>
