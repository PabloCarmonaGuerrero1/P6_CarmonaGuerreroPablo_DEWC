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
        <img :src="userAvatar" alt="User Avatar">
        <div class="user-info">
          <p><strong>Username:</strong> {{ userInfo.username }}</p>
          <p><strong>Number of Comments:</strong> {{ userInfo.num_comments }}</p>
        </div>
      </div>
    </div>
  </template>

<style>

</style>
