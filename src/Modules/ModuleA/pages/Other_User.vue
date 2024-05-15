<script>
import axios from 'axios';

export default {
  data() {
    return {
      otherUserInfo: {},
      isFriend: false,
      commentInfo: [],
      currentPage: 1,
      commentsPerPage: 4,
      num_comments: 0,
    };
  },
  mounted() {
    this.loadUserData();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.commentInfo.length / this.commentsPerPage);
    },
    paginatedComments() {
      const startIndex = (this.currentPage - 1) * this.commentsPerPage;
      const endIndex = startIndex + this.commentsPerPage;
      return this.commentInfo.slice(startIndex, endIndex);
    }
  },
  methods: {
    async loadUserData() {
  const username = localStorage.getItem('username');
  const selectedFriend = localStorage.getItem('selectedFriend');

  try {
    console.log('Loading user data...');
    const isFriendFromAPI = await this.checkFriendshipStatus(username, selectedFriend);
    console.log('isFriendFromAPI:', isFriendFromAPI);
    await this.getUserInfo(selectedFriend);
    await this.getComments(selectedFriend);
    console.log('Updating isFriend...');
    this.isFriend = isFriendFromAPI;
  } catch (error) {
    console.error('Error loading user data:', error);
  }
},

    async toggleFriendship() {
      const selectedFriend = localStorage.getItem('selectedFriend');
      const username = localStorage.getItem('username');

      try {
        if (this.isFriend) {
          await axios.delete(`http://localhost/api/v1/friendships/${username}/${selectedFriend}`);
          console.log('Amistad eliminada exitosamente');
        } else {
          const friendshipData = {
            username: username,
            username_friend: selectedFriend,
          };
          await axios.post('http://localhost/api/v1/friendships', friendshipData);
          console.log('Amistad creada exitosamente');
        }
        this.isFriend = !this.isFriend;
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
    async getComments(selectedFriend) {
      try {
        const apiUrl = `http://localhost/api/v1/comments/${selectedFriend}`;
        const response = await axios.get(apiUrl);
        this.commentInfo = response.data;
        this.num_comments = this.commentInfo.length;
        this.commentInfo.sort((a, b) => {
          if (a.created_at > b.created_at) return -1;
          if (a.created_at < b.created_at) return 1;
          return a.id - b.id;
        });
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    },
    async checkFriendshipStatus(username, selectedFriend) {
  try {
    console.log('Checking friendship status...');
    const response = await axios.get(`http://localhost/api/v1/friendships/${username}/${selectedFriend}`);
    console.log('Friendship status response:', response.data);
    return true;
  } catch (error) {
    console.error('Error checking friendship status:', error);
    return false;
  }
},
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
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
        <p class="comments">Comments: {{ num_comments }}</p>
        <button @click="toggleFriendship">
          {{ isFriend ? 'Dejar de ser Amigo' : 'Añadir Amistad' }}
        </button>
      </div>
    </div>
    <div class="other-comments">
      <article v-for="comment in paginatedComments" :key="comment.id" class="Mensaje">
        <div class="image-container">
          <img src="@/assets/icons/perfil.png" alt="User icon" class="user-icon">
        </div>
        <div class="content-container">
          <header class="post-header">
            <p class="username">{{ comment.username }}</p>
            <p class="date">{{ formatDate(comment.created_at) }}</p>
          </header>
          <p class="post-content">{{ comment.texto }}</p>
        </div>
      </article>
      <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
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