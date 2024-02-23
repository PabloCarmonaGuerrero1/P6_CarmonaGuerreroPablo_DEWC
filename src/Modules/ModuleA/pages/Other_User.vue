<script>
import axios from 'axios';

export default {
  methods: {
    addFriendship() {

      const friendshipData = {
        username: 'Orejas', 
        username_friend: 'nadie', 
      };

      axios.post('http://localhost/api/v1/friendships', friendshipData)
        .then(response => {
          console.log('Amistad creada exitosamente:', response.data);
        })
        .catch(error => {
          console.error('Error al crear la amistad:', error.response.data);
        });
    },
  },
};
</script>
<template>
    <div class="other-user-profile">
        <div class="other-profile-box">
            <img src="@/assets/icons/perfil.png" alt="User Avatar">
            <div class="other-info">
                <p class="username">x</p>
                <p class="comments">Comments </p>
                <button @click="addFriendship">Añadir Amistad</button>
            </div>
        </div>
        <div class="other-comments">
            <article class="Mensaje">
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
        <article class="Mensaje">
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
        <article class="Mensaje">
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
    </div>
</template>

<style>
.other-user-profile{
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 77.4vh;
    margin-top: 2rem;
    margin-bottom: 2rem;
}
.other-user-profile .other-profile-box{
    min-width: 20.625rem;
    height: 34rem; 
    text-align: center;
    padding: 2rem;
    border-radius: 1.875rem;
    background-color: #2E3244;
    color: white;
    font-family: 'Mogra', sans-serif;
}
.other-comments .Mensaje{
    width: 60rem;
    margin-bottom: 3rem;
    padding: 1rem;
    border-radius: 1.875rem;
    display: flex;
    background-color: #2E3244;
    color: white;
    font-family: 'Mogra', sans-serif;
    font-size: 1rem;
}
.other-comments .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
}
.other-comments .user-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
}
.other-comments .content-container {
    flex-grow: 1;
}
.other-comments .post-header {
    margin: 0;
    display: flex;
    align-items: center;
}
.other-comments .username {
    margin-top: 0rem;
    margin-bottom: 0rem;
    margin-left: 6rem;
    font-size: 1.25rem;
}
.other-comments .date{
    margin-top: 0rem;
    margin-bottom: 0rem;
    margin-left: 3rem;
    font-size: 1.25rem;
}
.post-content span {
    color: #0BFF00;
}
.other-comments .post-content{
    margin-left: 1rem;
    margin-top: 0;
}
</style>
