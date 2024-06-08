<script>
// Importa la librería Axios para hacer solicitudes HTTP
import axios from 'axios';

// Exporta el objeto Vue con sus propiedades y métodos
export default {
  // Datos del componente
  data() {
    return {
      // Nombre de usuario
      username: "",
      // Información del otro usuario
      otherUserInfo: {},
      // Estado de amistad
      isFriend: false,
      // Información de comentarios
      commentInfo: [],
      // Página actual
      currentPage: 1,
      // Comentarios por página
      commentsPerPage: 3,
      // Número total de comentarios
      num_comments: 0,
    };
  },
  // Método que se ejecuta cuando el componente se monta
  mounted() {
    // Obtiene el nombre de usuario almacenado localmente
    this.username = localStorage.getItem('username');
    // Carga la información del usuario
    this.loadUserData();
  },
  // Propiedades computadas
  computed: {
    totalPages() {
      return Math.ceil(this.commentInfo.length / this.commentsPerPage); // Total de páginas
    },
    paginatedComments() {
      // Comentarios paginados
      const startIndex = (this.currentPage - 1) * this.commentsPerPage;
      const endIndex = startIndex + this.commentsPerPage;
      return this.commentInfo.slice(startIndex, endIndex);
    }
  },
  // Métodos del componente
  methods: {
    // Carga la información del usuario
    async loadUserData() {
      // Obtiene los nombres de usuario almacenados localmente
      const username = localStorage.getItem('username');
      const selectedFriend = localStorage.getItem('selectedFriend');

      try {
        console.log('Loading user data...');
        // Comprueba el estado de amistad
        const isFriendFromAPI = await this.checkFriendshipStatus(username, selectedFriend);
        console.log('isFriendFromAPI:', isFriendFromAPI);
        // Obtiene la información del otro usuario
        await this.getUserInfo(selectedFriend);
        // Obtiene los comentarios del otro usuario
        await this.getComments(selectedFriend);
        console.log('Updating isFriend...');
        // Actualiza el estado de amistad
        this.isFriend = isFriendFromAPI;
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    },
    // Alterna el estado de amistad
    async toggleFriendship() {
      // Obtiene los nombres de usuario almacenados localmente
      const selectedFriend = localStorage.getItem('selectedFriend');
      const username = localStorage.getItem('username');

      try {
        if (this.isFriend) {
          // Elimina la amistad si ya son amigos
          await axios.delete(`http://localhost/api/v1/friendships/${username}/${selectedFriend}`);
          await axios.delete(`http://localhost/api/v1/friendships/${selectedFriend}/${username}`);
          console.log('Amistad eliminada exitosamente');
        } else {
          // Crea una nueva amistad si no son amigos
          const friendshipData = {
            username: username,
            username_friend: selectedFriend,
          };
          await axios.post('http://localhost/api/v1/friendships', friendshipData);
          const friendshipData2 = {
            username: selectedFriend,
            username_friend: username,
          };
          await axios.post('http://localhost/api/v1/friendships', friendshipData2);
          console.log('Amistad creada exitosamente');
        }
        // Actualiza el estado de amistad
        this.isFriend = !this.isFriend;
      } catch (error) {
        console.error('Error al manejar la amistad:', error.response.data);
      }
    },
    // Obtiene la información del otro usuario
    async getUserInfo(username) {
      try {
        const apiUrl = `http://localhost/api/v1/users/${username}`;
        const response = await axios.get(apiUrl);
        this.otherUserInfo = response.data;
      } catch (error) {
        console.error('Error fetching other user information:', error);
      }
    },
    // Obtiene los comentarios del otro usuario
    async getComments(selectedFriend) {
      try {
        const apiUrl = `http://localhost/api/v1/comments/${selectedFriend}`;
        const response = await axios.get(apiUrl);
        this.commentInfo = response.data;
        this.num_comments = this.commentInfo.length;
        // Ordena los comentarios por fecha
        this.commentInfo.sort((a, b) => {
          if (a.created_at > b.created_at) return -1;
          if (a.created_at < b.created_at) return 1;
          return a.id - b.id;
        });
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    // Formatea la fecha del comentario
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    },
    // Comprueba el estado de amistad
    async checkFriendshipStatus(username, selectedFriend) {
      try {
        console.log('Checking friendship status...');
        // Realiza una solicitud para comprobar el estado de amistad
        const response = await axios.get(`http://localhost/api/v1/friendships/${username}/${selectedFriend}`);
        console.log('Friendship status response:', response.data);
        return true; // Retorna verdadero si son amigos
      } catch (error) {
        console.error('Error checking friendship status:', error);
        return false; // Retorna falso si no son amigos
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
    // Formatea el comentario
    formatComment(comment) {
      const words = comment.split(' ');
      const formattedWords = words.map(word => {
        if (word.startsWith('#')) {
          return `<span class="hashtag">${word}</span>`; // Formatea los hashtags
        } else {
          return word;
        }
      });
      return formattedWords.join(' '); // Retorna el comentario formateado
    },
  },
};
</script>



<template>
  <!-- Contenedor del perfil del otro usuario -->
  <div class="other-user-profile">
    <!-- Caja de perfil del otro usuario -->
    <div class="other-profile-box">
      <!-- Avatar del otro usuario -->
      <img :src="otherUserInfo.idicon" alt="User Avatar">
      <!-- Información del otro usuario -->
      <div class="other-info">
        <!-- Nombre de usuario del otro usuario -->
        <p class="username-other">{{ otherUserInfo.username }}</p>
        <!-- Número de comentarios del otro usuario -->
        <p class="comments-other">Comments: {{ num_comments }}</p>
        <!-- Botón para agregar o eliminar amigo -->
      </div>
      <button v-if="otherUserInfo.username !== username && username" @click="toggleFriendship">
          {{ isFriend ? "Stop being friends" : "Add friend" }}
      </button>
    </div>
    <!-- Contenedor de los comentarios del otro usuario -->
    <div class="other-comments">
      <!-- Itera sobre los comentarios paginados del otro usuario -->
      <article v-for="comment in paginatedComments" :key="comment.id" class="Mensaje">
        <!-- Contenedor de la imagen del usuario -->
        <div class="image-container">
          <!-- Avatar del otro usuario -->
          <img :src="otherUserInfo.idicon" alt="User icon" class="user-icon">
        </div>
        <!-- Contenedor del contenido del comentario -->
        <div class="content-container">
          <!-- Encabezado del comentario -->
          <header class="post-header">
            <!-- Nombre de usuario del comentario -->
            <p class="username">{{ comment.username }}</p>
            <!-- Fecha del comentario -->
            <p class="date">{{ formatDate(comment.created_at) }}</p>
          </header>
          <!-- Contenido del comentario -->
          <p class="post-content" v-html="formatComment(comment.texto)"></p>
        </div>
      </article>
      <!-- Contenedor de botones de paginación -->
      <div class="button-container">
        <!-- Botón para la página anterior -->
        <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
        <!-- Botón para la página siguiente -->
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
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
.other-user-profile img{
  width: 10rem; 
  height: auto; 
  border-radius: 50%;
}
.other-comments .Mensaje{
  width: 50rem;
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
.other-profile-box button {
  height: 4rem;
  width: 8rem;
  margin-top: 1rem;
  border-radius: 2.8125rem;
  background-color: #2CD824;
  color: black;
  font-family: 'Nanum Brush Script', cursive;
  font-size: 1.5rem;
}
.other-comments .button-container{
  display: flex;
  justify-content: center;
}
.other-comments button {
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
@media (max-width: 768px) {
.other-user-profile{
  flex-direction: column;
  margin: 0;
  height: 41rem;
}
.other-user-profile .other-profile-box{
 height: auto;
 width: 100%;
 margin-top: 0rem;
 padding: 1rem;
 padding-right: 0;
 padding-left: 0;
 display: flex;
 justify-content: space-around;
}
.other-user-profile img{
 width: 5rem;
 height: auto;
 border-radius: 50%;
 align-self: flex-start;
 display: flex;
}
.other-user-profile .other-info{
 font-size: 1rem;
}
.other-user-profile button{
 font-size: 1.25rem;
 width: 6rem;
 height: 3rem;
}
.other-comments .Mensaje{
  width: 100%;
  font-size: 0.75rem;
}
.other-comments .username {
  font-size: 1rem;
}
.other-comments button {
  font-size: 1.5rem;
}
.other-comments .date{
  margin-left: 2rem;
  font-size: 1rem;
}
}

</style>