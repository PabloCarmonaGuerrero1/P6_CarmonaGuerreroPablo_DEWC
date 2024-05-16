<script>
import axios from 'axios';

export default {
  data() {
    return {
      commentInfo: [],
      currentPage: 1,
      commentsPerPage: 5,
      isModalOpen: false,
      comment:"",
      userInfo : [],
      filters:[],
      x:"#prueba",
    };
  },
  mounted() {
    this.getComments();
    this.getUserInfo();
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
    async getComments() {
  try {
    const apiUrl = `http://localhost/api/v1/comments`;
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
},
  formatDate(dateString) {
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
  toggleModal(){
    this.isModalOpen=!this.isModalOpen
  },
  async submit(){
    try {
      const apiUrl = 'http://localhost:80/api/v1/comments';
      const userData = {
        username: this.userInfo.username,
        texto: this.comment,
      };
      const response = await axios.post(apiUrl, userData);
      console.log('Respuesta del servidor:', response.data);
        this.getComments()
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
  formatComment(comment) {
    const words = comment.split(' ');
    const formattedWords = words.map(word => {
    if (word.startsWith('#')) {
      if (!this.filters.includes(word)) {
        this.filters.push(word);
      }
      return `<span class="hashtag">${word}</span>`;
    } else {
        return word;
    }
  });
  return formattedWords.join(' ');
},
saveFriendAndNavigate(usernameFriend) {
      localStorage.setItem('selectedFriend', usernameFriend);
      this.$router.push('/other-user');
    },
    sortByWord(word) {
      this.commentInfo.sort((a, b) => {
        if (a.texto.includes(word) && !b.texto.includes(word)) return -1;
        if (!a.texto.includes(word) && b.texto.includes(word)) return 1;
        return 0;
      });
    },
  }
}
</script>

<template>
  <div class="Comentarios">
    <article v-for="comment in paginatedComments" :key="comment.id" class="Mensaje">
      <div class="image-container">
        <img src="@/assets/icons/perfil.png" alt="User icon" class="user-icon">
      </div>
      <div class="content-container">
        <header class="post-header">
          <router-link @click="saveFriendAndNavigate(comment.username)" to="/other-user" class="username">{{ comment.username }}</router-link>
          <p class="date">{{ formatDate(comment.created_at) }}</p>
        </header>
        <p class="post-content" v-html="formatComment(comment.texto)"></p>
      </div>
    </article>
    <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
    <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    <button @click="toggleModal"><img src="@/assets/icons/pluma.png" alt=""></button>
    <Teleport to="body">
      <div class="modal" v-if="isModalOpen">
        <form>
          <label>
            <textarea v-model="comment" placeholder="Use me to comment!"></textarea>
          </label>
        </form>
        <button @click.prevent="submit">Send</button>
        <button @click="toggleModal">Close</button>
    </div>
    </Teleport>
    <div>
      <button @click="sortByWord(this.x)">X</button>
    </div>
  </div>
</template>

<style>
.Comentarios {
  min-height: 50rem;
  margin-left: 9.4375rem;
  margin-top: 3rem;
}

.Mensaje {
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

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
}

.content-container {
  flex-grow: 1;
}

.post-header {
  margin: 0;
  display: flex;
  align-items: center;
}

.username {
  margin-top: 0rem;
  margin-bottom: 0rem;
  margin-left: 6rem;
  font-size: 1.25rem;
}

.date {
  margin-top: 0rem;
  margin-bottom: 0rem;
  margin-left: 3rem;
  font-size: 1.25rem;
}

.post-content span {
  color: #0BFF00;
}

.post-content {
  margin-left: 1rem;
  margin-top: 0;
}
.modal{
  position: fixed;
  top: 0;
  left: 0;
  background-color: #2E3244;
  width: 50%;
  height: 50%;
  transform: translate(50%, 50%);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5rem;
}
.modal>div{
  background-color: aliceblue;
  padding: 50px;
}
.hashtag {
  color: #00ff00; 
}

@media (max-width: 768px) {
  .Comentarios {
    margin-left: 2rem;
  }

  .Mensaje {
    max-width: 19rem;
    margin-left: 0;
  }
  .user-icon{
    max-width: 3rem;
    max-height: 3rem;
}
  .username {
    margin-left: 2rem;
    font-size: 1rem;
  }

  .date {
    margin-left: 2rem;
    font-size: 1rem;
  }
  .post-content{
    font-size: 1rem;
  }
}
</style>