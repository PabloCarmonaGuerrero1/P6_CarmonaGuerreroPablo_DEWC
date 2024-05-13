<script>
import axios from 'axios';

export default {
  data() {
    return {
      userInfo: {},
      userFriends: [],
      userAvatar: '@/assets/icons/perfil.png', // Aquí se verá una imagen de perfil a elección del usuario en futuras entregas
      commentInfo: [],
      currentPage: 1,
      commentsPerPage: 5,
    };
  },
  mounted() {
    this.getUserInfo();
    this.getUserFriends();
    this.getComments();
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
    async getUserInfo() {
      try {
        const storedUsername = localStorage.getItem('username');
        const apiUrl = `http://localhost/api/v1/users/${storedUsername}`; 
        const response = await axios.get(apiUrl);
        this.userInfo = response.data;
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    },
    async getUserFriends() {
      try {
        const storedUsername = localStorage.getItem('username');
        const apiUrl = `http://localhost/api/v1/friendships/${storedUsername}`; 
        const response = await axios.get(apiUrl);
        this.userFriends = response.data.map(friendship => friendship.username_friend);
      } catch (error) {
        console.error('Error fetching user friends:', error);
      }
    },
    logout() {
      localStorage.removeItem('username');
      this.$router.push('/login');
    },
    saveFriendAndNavigate(usernameFriend) {
      localStorage.setItem('selectedFriend', usernameFriend);
      this.$router.push('/other-user');
    },
    async getComments() {
  try {
    const storedUsername = localStorage.getItem('username');
    const apiUrl = `http://localhost/api/v1/comments/${storedUsername}`;
    const response = await axios.get(apiUrl);
    this.commentInfo = response.data;
    this.commentInfo.sort((a, b) => {
      if (a.created_at > b.created_at) return -1;
      if (a.created_at < b.created_at) return 1;

      return a.id - b.id;
    });

    console.log(this.commentInfo);
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
},formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
    <div class="user-profile">
      <div class="profile-box">
        <img src="@/assets/icons/perfil.png" alt="User Avatar">
        <div class="user-info">
          <p class="username_user">{{ userInfo.username }}</p>
          <p class="comments_user">Comments</p>
          <p class="comments_user">{{ userInfo.num_comments }}</p>
          <button @click="logout">Logout</button>
        </div>
      </div>
      <div class="user-comments">
        <article v-for="comment in paginatedComments" :key="comment.id" class="comment-user">
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
    <span>{{ currentPage }}</span>
    <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
      <div class="user-friends">
        <div class="friends-box">
          <p class="friend-title">Friends</p>
          <div class="friend-list">
            <ul>
              <li v-for="friend in userFriends" :key="friend">
            <router-link @click="saveFriendAndNavigate(friend)" to="/other-user">{{ friend }}</router-link>
          </li>
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
    width: 20.625rem;
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

  .user-info .username_user {
    font-size: 1.5rem;

  }

  .user-info .comments_user {
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
  width: 20.625rem;
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
    .user-profile {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 77.4vh;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .profile-box {
    width: 5rem;
    height: 5rem; 
    text-align: center;
    padding: 2rem;
    border-radius: 1.875rem;
  }  
  .profile-box img {
    width: 5rem; 
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
    max-width: 5rem;
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
  width: 10rem;
  height: 10rem;
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
  }
</style>
