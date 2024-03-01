<script>
import axios from 'axios';

export default {
  data() {
    return {
      otherUserInfo: {},
      isFriend: false,
    };
  },
  async mounted() {
  const username = localStorage.getItem('username');
  if (username) {
    await this.loadUserData();
    console.log(this.isFriend);
  }
},
  methods: {
    async loadUserData() {
      const username = localStorage.getItem('username')
      const selectedFriend = localStorage.getItem('selectedFriend');
      console.log(username);
      console.log(this.isFriend)
      try {
        await this.checkFriendshipStatus(username, selectedFriend);
        await this.getUserInfo(selectedFriend);
        console.log(this.isFriend)
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    },

    async toggleFriendship() {
      const selectedFriend = localStorage.getItem('selectedFriend');
      const username = localStorage.getItem('username');
      console.log(username);

      try {
        if (this.isFriend) {
          await axios.delete(`http://localhost/api/v1/friendships/${username}/${selectedFriend}`);
          console.log('Amistad eliminada exitosamente');
          this.isFriend=false
        } else {
          const friendshipData = {
            username: username,
            username_friend: selectedFriend,
          };

          await axios.post('http://localhost/api/v1/friendships', friendshipData);
          console.log('Amistad creada exitosamente');
          this.isFriend=true
        }
      } catch (error) {
        console.error('Error al manejar la amistad:', error.response.data);
      }
    },

    async getUserInfo(username) {
      try {
        const apiUrl = `http://localhost/api/v1/users/${username}`;
        const response = await axios.get(apiUrl);
        this.otherUserInfo = response.data;
      } catch (error) {
        console.error('Error fetching other user information:', error);
      }
    },

    async checkFriendshipStatus(username, selectedFriend) {
      try {
        const response = await axios.get(`http://localhost/api/v1/friendships/${username}/${selectedFriend}`);
        this.isFriend = response.data.length > 0;
      }catch (error) {
        console.error('Error checking friendship status:', error);
        this.isFriend = false;
      }
    },
  },
};
</script>


<template>
  <div class="other-user-profile">
    <div class="other-profile-box">
      <img src="@/assets/icons/perfil.png" alt="User Avatar">
      <div class="other-info">
        <p class="username">{{ otherUserInfo.username }}</p>
        <p class="comments">Comments: {{ otherUserInfo.num_comments }}</p>
        <button @click="toggleFriendship">
          {{ isFriend ? 'Dejar de ser Amigo' : 'Añadir Amistad' }}
        </button>
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
