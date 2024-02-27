<script>
import axios from 'axios';

export default {
  data() {
    return {
      userInfo: {},
      userFriends: [],
      userAvatar: '@/assets/icons/perfil.png', // Aquí se verá una imagen de perfil a elección del usuario en futuras entregas
    };
  },
  mounted() {
    this.getUserInfo();
    this.getUserFriends();
  },
  methods: {
    async getUserInfo() {
      try {
        const storedUsername = localStorage.getItem('username');
        const apiUrl = `http://localhost/api/v1/users/${storedUsername}`; // En futuras entrega se verá el usuario que ha iniciado sesion
        const response = await axios.get(apiUrl);
        this.userInfo = response.data;
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    },
    async getUserFriends() {
      try {
        const apiUrl = `http://localhost/api/v1/friendships/${storedUsername}` // Ajusta la URL con el nombre de usuario
        const response = await axios.get(apiUrl);
        this.userFriends = response.data;
      } catch (error) {
        console.error('Error fetching user friends:', error);
      }
    },
    logout() {
      localStorage.removeItem('username');
      this.$router.push('/login');
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
          <button @click="logout">Logout</button> 
        </div>
      </div>
      <div class="user-comments">
        <article class="comment-user">
          <div class="image-container">
            <img src="@/assets/icons/perfil.png" alt="User icon" class="user-icon">
          </div>
          <div class="content-container">
            <header class="post-header">
              <p class="username">Jun</p>
              <p class="date">12/11/2023</p>
            </header>
            <p class="post-content">Wow! The last episode was amazing, nice <span>#NewEpisode</span>.</p>
          </div>
        </article>
        <article class="comment-user">
          <div class="image-container">
            <img src="@/assets/icons/perfil.png" alt="User icon" class="user-icon">
          </div>
          <div class="content-container">
            <header class="post-header">
              <p class="username">Jun</p>
              <p class="date">12/11/2023</p>
            </header>
            <p class="post-content">Wow! The last episode was amazing, nice <span>#NewEpisode</span>.</p>
          </div>
        </article>
        <article class="comment-user">
          <div class="image-container">
            <img src="@/assets/icons/perfil.png" alt="User icon" class="user-icon">
          </div>
          <div class="content-container">
            <header class="post-header">
              <p class="username">Jun</p>
              <p class="date">12/11/2023</p>
            </header>
            <p class="post-content">Wow! The last episode was amazing, nice <span>#NewEpisode</span>.</p>
          </div>
        </article>
      </div>
      <div class="user-friends">
        <div class="friends-box">
          <p class="friend-title">Friends</p>
          <div class="friend-list">
            <ul>
            <li v-for="friend in userFriends" :key="friend">{{ friend }}</li>
          </ul>
          </div>
        </div>
      </div>
    </div>
  </template>

<style>
  .user-profile {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 77.4vh;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .profile-box {
    min-width: 20.625rem;
    height: 34rem; 
    text-align: center;
    padding: 2rem;
    border-radius: 1.875rem;
    background-color: #2E3244;
    color: white;
    font-family: 'Mogra', sans-serif;
  }  
  .profile-box img {
    width: 10rem; 
    height: auto; 
    border-radius: 50%;
  }
  .user-info {
    margin-top: 1rem;
    text-align: center;
  }

  .user-info .username {
    font-size: 1.5rem;

  }

  .user-info .comments {
    font-size: 1rem;
  }

  .user-comments .comment-user{
    max-width: 100%;
    margin-bottom: 3rem;
    padding: 1rem;
    border-radius: 1.875rem;
    display: flex;
    background-color: #2E3244;
    color: white;
    font-family: 'Mogra', sans-serif;
    font-size: 1rem;
}
.user-comments .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
}
.user-comments .user-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
}
.user-comments .content-container {
    flex-grow: 1;
}
.user-comments .post-header {
    margin: 0;
    display: flex;
    align-items: center;
}
.user-comments .username {
    margin-top: 0rem;
    margin-bottom: 0rem;
    margin-left: 6rem;
    font-size: 1.25rem;
}
.user-comments .date{
    margin-top: 0rem;
    margin-bottom: 0rem;
    margin-left: 3rem;
    font-size: 1.25rem;
}
.user-comments .post-content span {
    color: #0BFF00;
}
.user-comments .post-content{
    margin-left: 1rem;
    margin-top: 0;
}
.user-friends{
  max-height: 38.6875rem;
}
.friends-box{
  min-width: 20.625rem;
  height: 34rem;
  padding: 2rem;
  border-radius: 1.875rem;
  background-color: #2E3244;
  color: white;
  font-family: 'Mogra', sans-serif;
}
.friends-box .friend-title{
  text-align: center;
  font-size: 1.5rem;
  text-decoration: underline;
}
.friends-box .friend-list{
  margin-left: 1rem;
  font-size: 1.25rem;
}
.friend-list a{
  text-decoration: none;
  color: inherit;
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
