<script>
// Importa la librería Axios para hacer solicitudes HTTP
import axios from 'axios';

// Exporta el objeto Vue con sus propiedades y métodos
export default {
  // Datos de la aplicación
  data() {
    return {
      commentInfo: [], // Información de los comentarios
      currentPage: 1, // Página actual
      commentsPerPage: 5, // Comentarios por página
      isModalOpen: false, // Estado del modal
      comment:"", // Comentario
      userInfo : [], // Información del usuario
      filters:[], // Filtros para hashtags
      showTopHashtags: true, // Mostrar los hashtags principales
    };
  },
  // Función que se ejecuta cuando el componente se monta
  mounted() {
    // Obtiene el nombre de usuario almacenado localmente
    this.username = localStorage.getItem('username');
    // Obtiene los comentarios
    this.getComments();
    // Obtiene toda la información del usuario
    this.getAllUserInfo();
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
  // Métodos
  methods: {
    // Obtiene los comentarios
    async getComments() {
      try {
        const apiUrl = `http://localhost/api/v1/comments`;
        const response = await axios.get(apiUrl);
        this.commentInfo = response.data; // Almacena los comentarios
        // Ordena los comentarios por fecha
        this.commentInfo.sort((a, b) => {
          if (a.created_at > b.created_at) return -1;
          if (a.created_at < b.created_at) return 1;
          return a.id - b.id;
        });
        // Formatea los comentarios
        this.commentInfo.forEach(comment => {
          this.formatComment(comment.texto);
        });
        console.log(this.commentInfo); // Muestra los comentarios en la consola
      } catch (error) {
        console.error('Error fetching comments:', error); // Maneja errores
      }
    },
    // Formatea la fecha
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
    // Alternar modal
    toggleModal(){
      this.isModalOpen=!this.isModalOpen;
    },
    // Enviar comentario
    async submit(){
      const storedUsername = localStorage.getItem('username');
      try {
        const apiUrl = 'http://localhost:80/api/v1/comments';
        const userData = {
          username: storedUsername,
          texto: this.comment,
        };
        const response = await axios.post(apiUrl, userData);
        console.log('Respuesta del servidor:', response.data);
        this.getComments(); // Actualiza los comentarios después de enviar
      } catch (error) {
        // Manejo de errores
      }
    },
    // Obtiene toda la información del usuario
    async getAllUserInfo() {
      try {
        const apiUrl = `http://localhost/api/v1/users`;
        const response = await axios.get(apiUrl);
        // Almacena la información del usuario
        response.data.forEach(user => {
          this.userInfo[user.username] = user;
        });
      } catch (error) {
        console.error('Error fetching user information:', error); // Manejo de errores
      }
    },
    // Formatea los comentarios
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
    // Guarda el amigo y navega
    saveFriendAndNavigate(usernameFriend) {
      localStorage.setItem('selectedFriend', usernameFriend);
      this.$router.push('/other-user');
    },
    // Ordena por palabra
    sortByWord(word) {
      this.commentInfo = [...this.commentInfo].sort((a, b) => b.id - a.id);
      this.commentInfo.sort((a, b) => {
        if (a.texto.includes(word) && !b.texto.includes(word)) return -1;
        if (!a.texto.includes(word) && b.texto.includes(word)) return 1;
        return 0;
      });
    },
    // Obtiene la imagen del usuario
    getUserImage(username) {
      if (this.userInfo[username]) {
        return this.userInfo[username].idicon;
      } else {
        return "@/assets/icons/default-user-image.png";
      }
    },
    // Alternar hashtags
    toggleHashtags() {
      if (this.showTopHashtags) {
        this.showRecentHashtags();
      } else {    
        this.showTopUsedHashtags();
      }
      this.showTopHashtags = !this.showTopHashtags;
    },
    // Muestra los hashtags recientes
    async showRecentHashtags() {
      try {
        const apiUrl = `http://localhost/api/v1/comments`;
        const response = await axios.get(apiUrl);
        this.commentInfo = response.data;
        const recentHashtags = [];
        this.commentInfo.slice().reverse().forEach(comment => {
          const words = comment.texto.split(' ');
          words.forEach(word => {
            if (word.startsWith('#') && !recentHashtags.includes(word)) {
              recentHashtags.push(word);
            }
          });
          if (recentHashtags.length === 5) {
            return;
          }
        });
        this.filters = recentHashtags; // Actualiza los filtros
      } catch (error) {
        console.error('Error fetching comments:', error); // Manejo de errores
      }
    },
    // Muestra los hashtags más usados
    async showTopUsedHashtags() {
      try {
        const apiUrl = `http://localhost/api/v1/comments`;
        const response = await axios.get(apiUrl);
        this.commentInfo = response.data;

        const hashtagFrequency = {};
        this.commentInfo.forEach(comment => {
          const words = comment.texto.split(' ');
          words.forEach(word => {
            if (word.startsWith('#')) {
              hashtagFrequency[word] = (hashtagFrequency[word] || 0) + 1;
            }
          });
        });
        // Ordena y filtra los hashtags más usados
        const sortedHashtags = Object.keys(hashtagFrequency).sort((a, b) => hashtagFrequency[b] - hashtagFrequency[a]).slice(0, 5);
        this.filters = sortedHashtags; // Actualiza los filtros
      } catch (error) {
        console.error('Error fetching comments:', error); // Manejo de errores
      }
    },
  }
}
</script>


<template>
  <!-- Contenedor principal de la página principal -->
  <div class="homepage">
    <!-- Contenedor de los comentarios -->
    <div class="Comentarios">
      <!-- Itera sobre los comentarios paginados -->
      <article v-for="comment in paginatedComments" :key="comment.id" class="Mensaje">
        <!-- Contenedor de la imagen del usuario -->
        <div class="image-container">
          <!-- Muestra la imagen del usuario -->
          <img :src="getUserImage(comment.username)" alt="User icon" class="user-icon">
        </div>
        <!-- Contenedor del contenido del comentario -->
        <div class="content-container">
          <!-- Encabezado del comentario -->
          <header class="post-header">
            <!-- Enlace al perfil del usuario -->
            <router-link @click="saveFriendAndNavigate(comment.username)" to="/other-user" class="username">{{ comment.username }}</router-link>
            <!-- Fecha del comentario -->
            <p class="date">{{ formatDate(comment.created_at) }}</p>
          </header>
          <!-- Contenido del comentario -->
          <p class="post-content" v-html="formatComment(comment.texto)"></p>
        </div>
      </article>
      <!-- Botón para escribir un nuevo comentario -->
      <button v-if="username" @click="toggleModal" class="write"><img src="@/assets/icons/pluma.png" alt="pluma"></button>
      <!-- Modal para escribir un nuevo comentario -->
      <Teleport to="body">
        <div class="modal" v-if="isModalOpen">
          <form>
            <label>
              <textarea v-model="comment" placeholder="Use me to comment!"></textarea>
            </label>
          </form>
          <!-- Botón para enviar el comentario -->
          <button @click.prevent="submit">Send</button>
          <!-- Botón para cerrar el modal -->
          <button @click="toggleModal">Close</button>
        </div>
      </Teleport>
    </div>
    <!-- Panel lateral derecho -->
    <div class="right-side">
      <!-- Filtros de comentarios -->
      <div class="comments-filter">
        <!-- Botón para alternar entre los hashtags principales y los hashtags recientes -->
        <button @click="toggleHashtags" class="filter-title">{{ showTopHashtags ? 'Top Hastags' : 'Last Hastags' }}</button>
        <ul>
          <!-- Itera sobre los filtros de hashtags -->
          <li v-for="word in filters" :key="word">
            <!-- Filtra los comentarios por palabra -->
            <p @click="sortByWord(word)" class="filter">{{ word }}</p>
          </li>
        </ul>
      </div>
      <!-- Botones de paginación -->
      <button @click="previousPage" :disabled="currentPage === 1" class="pagination">Previous</button>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination">Next</button>
    </div>
  </div>
</template>

<style>
.homepage{
  display: flex; 
  justify-content: space-between;
}
.Comentarios {
  min-height: 50rem;
  margin-left: 7rem;
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
  text-decoration: none;
  color: inherit;
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
.modal>div{
  background-color: aliceblue;
  padding: 50px;
}
.hashtag {
  color: #00ff00; 
}
.right-side {
  width: 25%; 
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;  
  margin-left: 1rem;
}
.right-side .comments-filter{
  display: flex;
  align-items: center;
  width: 14rem;
  margin-bottom: 3rem;
  margin-left: 0;
  padding: 0rem;
  border-radius: 1.875rem;
  display: flex;
  background-color: #2E3244;
  color: #00ff00;
  font-family: 'Mogra', sans-serif;
  font-size: 1rem;
  flex-direction: column; 
}
.right-side .pagination {
  height: 4rem;
  width: 6rem;
  margin-top: 1rem;
  border-radius: 2.8125rem;
  background-color: #2CD824;
  color: black;
  font-family: 'Nanum Brush Script', cursive;
  font-size: 2rem;
}
.comments-filter li{
  margin-left: -5rem;
}
.write{
  height: 4rem;
  width: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #2CD824;
  margin: 2rem auto;
}
.filter-title{
  width: 10rem;
  height: 3rem;
  margin-top: 1rem;
  border-radius: 2.8125rem;
  background-color: #2CD824;
  color: black;
  font-family: 'Nanum Brush Script', cursive;
  font-size: 2rem;
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