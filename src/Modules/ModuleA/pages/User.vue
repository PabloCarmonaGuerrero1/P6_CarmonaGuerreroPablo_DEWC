<script>
import axios from 'axios';

export default {
  data() {
    return {
      // Información del usuario
      userInfo: {},
      // Lista de amigos del usuario
      userFriends: [],
      // Información de los comentarios del usuario
      commentInfo: [],
      // Página actual de los comentarios
      currentPage: 1,
      // Número de comentarios por página
      commentsPerPage: 3,
      // Número total de comentarios
      num_comments : 0,
      // Estado del modal
      isModalOpen:false,
      // Personajes de Rick and Morty
      rickAndMortyCharacters: [],
      // Página actual de personajes
      page:1,
      // Número total de páginas de personajes
      totalPagesImage:0,
    };
  },
  // Método ejecutado cuando el componente ha sido montado
  mounted() {
    // Obtiene la información del usuario
    this.getUserInfo();
    // Obtiene la lista de amigos del usuario
    this.getUserFriends();
    // Obtiene los comentarios del usuario
    this.getComments();
    // Obtiene los personajes de Rick and Morty
    this.getRickAndMortyCharacters();
  },
  computed: {
    // Calcula el número total de páginas de comentarios
    totalPages() {
      return Math.ceil(this.commentInfo.length / this.commentsPerPage);
    },
    // Obtiene los comentarios paginados
    paginatedComments() {
      const startIndex = (this.currentPage - 1) * this.commentsPerPage;
      const endIndex = startIndex + this.commentsPerPage;
      return this.commentInfo.slice(startIndex, endIndex);
    }
  },
  methods: {
    // Obtiene la información del usuario
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
    // Obtiene la lista de amigos del usuario
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
    // Cierra la sesión del usuario
    logout() {
      localStorage.removeItem('username');
      this.$router.push('/login');
    },
    // Guarda el amigo seleccionado y navega a su perfil
    saveFriendAndNavigate(usernameFriend) {
      localStorage.setItem('selectedFriend', usernameFriend);
      this.$router.push('/other-user');
    },
    // Obtiene los comentarios del usuario
    async getComments() {
      try {
        const storedUsername = localStorage.getItem('username');
        const apiUrl = `http://localhost/api/v1/comments/${storedUsername}`;
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
    // Formatea la fecha de los comentarios
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    },
    // Muestra u oculta el modal
    toggleModal(){
      this.isModalOpen=!this.isModalOpen;
    },
    // Obtiene los personajes de Rick and Morty
    async getRickAndMortyCharacters() {
      try {
        const apiUrl = `https://rickandmortyapi.com/api/character?page=${this.page}`;
        const response = await axios.get(apiUrl);
        this.rickAndMortyCharacters = response.data.results;
        this.totalPagesImage = response.data.info.pages;
      } catch (error) {
        console.error('Error fetching Rick and Morty characters:', error);
      }
    },
    // Selecciona un personaje de Rick and Morty
    selectCharacter(character) {
      this.submit(character.image);
    },
    // Actualiza el ícono del usuario con el personaje seleccionado
    async submit(selectedCharacter) {
      try {
        const storedUsername = localStorage.getItem('username');
        const apiUrl = `http://localhost/api/v1/users/${storedUsername}`; 
        const response = await axios.put(apiUrl, { idicon: selectedCharacter });
        this.getUserInfo();
      } catch (error) {
        console.error('Error submitting selected character:', error);
      }
    },
    // Pasa a la siguiente página de personajes
    nextPageImage() {
      if (this.page < this.totalPagesImage) {
        this.page++;
        this.getRickAndMortyCharacters();
      }
    },
    // Pasa a la página anterior de personajes
    previousPageImage() {
      if (this.page > 1) {
        this.page--;
        this.getRickAndMortyCharacters();
      }
    },
    // Página siguiente
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    // Página anterior
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    // Formatea los comentarios
    formatComment(comment) {
      const words = comment.split(' ');
      const formattedWords = words.map(word => {
        if (word.startsWith('#')) {
          return `<span class="hashtag">${word}</span>`;
        } else {
          return word;
        }
      });
      return formattedWords.join(' ');
    },
  },
};
</script>

<template>
  <div class="user-profile">
    <!-- Sección de información del usuario -->
    <div class="profile-box">
      <!-- Avatar del usuario -->
      <img :src="userInfo.idicon" alt="User Avatar" @click="toggleModal">
      <!-- Información del usuario -->
      <div class="user-info">
        <p class="username_user">{{ userInfo.username }}</p>
        <p class="comments_user">Comments</p>
        <!-- Número de comentarios del usuario -->
        <p class="comments_user">{{ this.num_comments }}</p>
      </div>
        <!-- Botón de cierre de sesión -->
        <button @click="logout">Logout</button>
      <!-- Modal para seleccionar el avatar -->
      <Teleport to="body">
        <div class="modalImage" v-if="isModalOpen">
          <!-- Lista de imágenes de personajes de Rick and Morty -->
          <div class="character-images">
            <img v-for="character in rickAndMortyCharacters" :src="character.image" :alt="character.name" @click="selectCharacter(character)" class="character-image" :key="character.id">
          </div>
          <!-- Botones de paginación de imágenes -->
          <div class="buttons">
            <button @click="previousPageImage" :disabled="page === 1">Previous</button>
            <span>{{ page }}</span>
            <button @click="nextPageImage" :disabled="page === totalPagesImage">Next</button>
            <button @click="toggleModal">Close</button>
          </div>
        </div>
      </Teleport>
    </div>
    <!-- Sección de comentarios del usuario -->
    <div class="user-comments">
      <!-- Lista de comentarios del usuario -->
      <article v-for="comment in paginatedComments" :key="comment.id" class="comment-user">
        <!-- Avatar del usuario -->
        <div class="image-container">
          <img :src="userInfo.idicon" alt="User icon" class="user-icon">
        </div>
        <!-- Contenido del comentario -->
        <div class="content-container">
          <header class="post-header">
            <!-- Nombre de usuario que hizo el comentario -->
            <p class="username">{{ comment.username }}</p>
            <!-- Fecha del comentario -->
            <p class="date">{{ formatDate(comment.created_at) }}</p>
          </header>
          <!-- Contenido del comentario -->
          <p class="post-content" v-html="formatComment(comment.texto)"></p>
        </div>
      </article>
      <!-- Botones de paginación de comentarios -->
      <div class="button-container">
        <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
    <!-- Sección de lista de amigos del usuario -->
    <div class="user-friends">
      <div class="friends-box">
        <!-- Título de la lista de amigos -->
        <p class="friend-title">Friends</p>
        <!-- Lista de amigos -->
        <div class="friend-list">
          <ul>
            <li v-for="friend in userFriends" :key="friend">
              <!-- Enlace a la página del perfil del amigo -->
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
.modalImage{
  position: fixed;
  top: 0;
  left: 0;
  background-color: #666565;
  width: 50%;
  height: 50%;
  transform: translate(50%, 50%);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5rem;
  flex-direction: column;
}
.modalImage img{
  height: 6rem;
  width: 6rem;
  border-radius: 50%;
}
.modmodalImageal .buttons {
  display: flex;
  align-items: center; 
  margin-top: 1rem;

}
.modalImage .buttons button,span {
  margin-left: 1rem;

}
.modalImage .character-images{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}
.profile-box button {
  height: 2rem;
  width: 5rem;
  margin-top: 1rem;
  border-radius: 2.8125rem;
  background-color: #2CD824;
  color: black;
  font-family: 'Nanum Brush Script', cursive;
  font-size: 1.5rem;
}
.user-comments .button-container{
  display: flex;
  justify-content: center;
}
.user-comments button {
  height: 2rem;
  width: 5rem;
  margin-top: 1rem;
  border-radius: 2.8125rem;
  background-color: #2CD824;
  color: black;
  font-family: 'Nanum Brush Script', cursive;
  font-size: 1.5rem;
  margin: auto;
  display: block;
}
.modalImage button{
  height: 2rem;
  width: 5rem;
  margin-top: 1rem;
  border-radius: 2.8125rem;
  background-color: #2CD824;
  color: black;
  font-family: 'Nanum Brush Script', cursive;
  font-size: 1.5rem;
}
  @media only screen and (max-width: 600px) {
    .user-profile {
    display: flex;
    flex-direction: column;
    height: 56rem;
  }
  .profile-box {
    height: auto;
    width: 100%;
    padding: 1rem;
    padding-right: 0;
    padding-left: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }  
  .user-comments{
    width: 100%;
    font-size: 0.75rem;
  }
  .user-friends{
    width: 100%;
  }
  .user-friends .friends-box{
    height: auto;
    width: 100%;
    padding: 1rem;
    padding-right: 0;
    padding-left: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .user-friends .friend-title{
    font-size: 1.25rem;
    margin-bottom: 0rem;
  }
  .user-friends .friend-list{
    font-size: 1rem;
    margin-top: 0;
    margin-right: 8rem;
  }
  .profile-box img {
    width: 5rem;
    height: auto;
    border-radius: 50%;
    align-items: center;
    display: flex;
  }
  .user-info {
    font-size: 1rem;
  }

  .user-info .username_user {
    font-size: 1.5rem;
    margin-top: 0;

  }
  .user-info .comments_user {
    font-size: 1rem;
  }
  .user-comments .username {
  font-size: 1.25rem;
  margin-left: 1rem;
}
.user-comments .date{
  margin-left: 2rem;
  font-size: 1.25rem;
  }
.user-comments .post-content{
  margin-top: 0.3rem;
  font-size: 1.25rem;
}
.modalImage{
  width: 100%;
  height: 70%;
  transform: none;
  margin-top: 4rem;
}
.modalImage img{
  width: 5rem;
  height: 5rem;
}
.modalImage button{
  height: 3rem;
  width: 5rem;
  font-size: 1.6rem;
}
.modalImage span{
  font-size: 1.6rem;
}
.profile-box button{
  width: 6rem;
  height: 3rem;
  font-size: 1.75rem;
}
.user-comments button{
  width: 6rem;
  height: 3rem;
  font-size: 1.75rem;
  margin-top: -1rem;
}
}

</style>
