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
      isLightMode: localStorage.getItem('light-mode') === 'true'
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
    <div class="profile-box" :class="{ 'light-mode-profile': isLightMode }">
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
        <div class="modalImage" v-if="isModalOpen" :class="{ 'light-mode-moddalimg': isLightMode }">
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
      <article v-for="comment in paginatedComments" :key="comment.id" class="comment-user" :class="{ 'light-mode-comuser': isLightMode }">
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
      <div class="button-container" :class="{ 'light-mode-buttonuser': isLightMode }">
        <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
    <!-- Sección de lista de amigos del usuario -->
    <div class="user-friends">
      <div class="friends-box" :class="{ 'light-mode-profile': isLightMode }">
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
 /* Estilos para el contenedor principal del perfil de usuario */
.user-profile {
  display: flex; /* Utiliza el modelo de caja flexible */
  justify-content: space-around; /* Distribuye el espacio alrededor de los elementos */
  align-items: center; /* Centra verticalmente los elementos */
  height: 77.4vh; /* Altura del perfil de usuario */
  margin-top: 2rem; /* Margen superior de 2 rem */
  margin-bottom: 2rem; /* Margen inferior de 2 rem */
}

/* Estilos para el cuadro de perfil */
.profile-box {
  width: 20.625rem; /* Ancho del cuadro de perfil */
  height: 34rem; /* Altura del cuadro de perfil */
  text-align: center; /* Alineación del texto al centro */
  padding: 2rem; /* Relleno de 2 rem */
  border-radius: 1.875rem; /* Radio del borde */
  background-color: #2E3244; /* Color de fondo */
  color: white; /* Color del texto en blanco */
  font-family: 'Mogra', sans-serif; /* Fuente del texto */
}

/* Estilos para la imagen de perfil en el cuadro de perfil */
.profile-box img {
  width: 10rem; /* Ancho de la imagen de perfil */
  height: auto; /* Altura automática */
  border-radius: 50%; /* Radio del borde */
}

/* Estilos para la información del usuario */
.user-info {
  margin-top: 1rem; /* Margen superior de 1 rem */
  text-align: center; /* Alineación del texto al centro */
}

/* Estilos para el nombre de usuario en la información del usuario */
.user-info .username_user {
  font-size: 1.5rem; /* Tamaño de fuente de 1.5 rem */
}

/* Estilos para los comentarios del usuario en la información del usuario */
.user-info .comments_user {
  font-size: 1rem; /* Tamaño de fuente de 1 rem */
}

/* Estilos para los comentarios del usuario */
.user-comments .comment-user {
  max-width: 100%; /* Ancho máximo del comentario del usuario */
  margin-bottom: 3rem; /* Margen inferior de 3 rem */
  padding: 1rem; /* Relleno de 1 rem */
  border-radius: 1.875rem; /* Radio del borde */
  display: flex; /* Utiliza el modelo de caja flexible */
  background-color: #2E3244; /* Color de fondo */
  color: white; /* Color del texto en blanco */
  font-family: 'Mogra', sans-serif; /* Fuente del texto */
  font-size: 1rem; /* Tamaño de fuente de 1 rem */
}

/* Estilos para el contenedor de la imagen en los comentarios del usuario */
.user-comments .image-container {
  display: flex; /* Utiliza el modelo de caja flexible */
  align-items: center; /* Centra verticalmente los elementos */
  justify-content: center; /* Centra horizontalmente los elementos */
}

/* Estilos para el icono de usuario en los comentarios del usuario */
.user-comments .user-icon {
  width: 4rem; /* Ancho del icono de usuario */
  height: 4rem; /* Altura del icono de usuario */
  border-radius: 50%; /* Radio del borde */
}

/* Estilos para el contenedor de contenido en los comentarios del usuario */
.user-comments .content-container {
  flex-grow: 1; /* Hace que el contenedor de contenido crezca */
}

/* Estilos para la cabecera del comentario en los comentarios del usuario */
.user-comments .post-header {
  margin: 0; /* Sin margen */
  display: flex; /* Utiliza el modelo de caja flexible */
  align-items: center; /* Centra verticalmente los elementos */
}

/* Estilos para el nombre de usuario en los comentarios del usuario */
.user-comments .username {
  margin-top: 0rem; /* Margen superior de 0 rem */
  margin-bottom: 0rem; /* Margen inferior de 0 rem */
  margin-left: 6rem; /* Margen izquierdo de 6 rem */
  font-size: 1.25rem; /* Tamaño de fuente de 1.25 rem */
}

/* Estilos para la fecha en los comentarios del usuario */
.user-comments .date {
  margin-top: 0rem; /* Margen superior de 0 rem */
  margin-bottom: 0rem; /* Margen inferior de 0 rem */
  margin-left: 3rem; /* Margen izquierdo de 3 rem */
  font-size: 1.25rem; /* Tamaño de fuente de 1.25 rem */
}

/* Estilos para el contenido del comentario en los comentarios del usuario */
.user-comments .post-content span {
  color: #0BFF00; /* Color del texto en verde */
}

/* Estilos para el contenido del comentario en los comentarios del usuario */
.user-comments .post-content {
  margin-left: 1rem; /* Margen izquierdo de 1 rem */
  margin-top: 0; /* Margen superior de 0 */
}

/* Estilos para el contenedor de amigos */
.user-friends {
  max-height: 38.6875rem; /* Altura máxima del contenedor de amigos */
}

/* Estilos para el cuadro de amigos */
.friends-box {
  width: 20.625rem; /* Ancho del cuadro de amigos */
  height: 34rem; /* Altura del cuadro de amigos */
  padding: 2rem; /* Relleno de 2 rem */
  border-radius: 1.875rem; /* Radio del borde */
  background-color: #2E3244; /* Color de fondo */
  color: white; /* Color del texto en blanco */
  font-family: 'Mogra', sans-serif; /* Fuente del texto */
}

/* Estilos para el título de amigos en el cuadro de amigos */
.friends-box .friend-title {
  text-align: center; /* Alineación del texto al centro */
  font-size: 1.5rem; /* Tamaño de fuente de 1.5 rem */
  text-decoration: underline; /* Subrayado */
}

/* Estilos para la lista de amigos en el cuadro de amigos */
.friends-box .friend-list {
  margin-left: 1rem; /* Margen izquierdo de 1 rem */
  font-size: 1.25rem; /* Tamaño de fuente de 1.25 rem */
}

/* Estilos para los enlaces de la lista de amigos */
.friend-list a {
  text-decoration: none; /* Sin decoración de enlace */
  color: inherit; /* Color del texto heredado */
}

/* Estilos para el modal de imagen */
.modalImage {
  position: fixed; /* Posición fija */
  top: 0; /* Desde la parte superior */
  left: 0; /* Desde la parte izquierda */
  background-color: #666565; /* Color de fondo */
  width: 50%; /* Ancho del modal */
  height: 50%; /* Altura del modal */
  transform: translate(50%, 50%); /* Transformación para centrar */
  display: flex; /* Utiliza el modelo de caja flexible */
  justify-content: center; /* Centra horizontalmente los elementos */
  align-items: center; /* Centra verticalmente los elementos */
  border-radius: 5rem; /* Radio del borde */
  flex-direction: column; /* Dirección de la columna */
}

/* Estilos para la imagen dentro del modal */
.modalImage img {
  height: 6rem; /* Altura de la imagen */
  width: 6rem; /* Ancho de la imagen */
  border-radius: 50%; /* Radio del borde */
}

/* Estilos para los botones y el texto dentro del modal */
.modalImage .buttons {
  display: flex; /* Utiliza el modelo de caja flexible */
  align-items: center; /* Centra verticalmente los elementos */
  margin-top: 1rem; /* Margen superior de 1 rem */
}

/* Estilos para los botones dentro del modal */
.modalImage .buttons button,
.modalImage span {
  margin-left: 1rem; /* Margen izquierdo de 1 rem */
}

/* Estilos para el contenedor de imágenes del personaje */
.modalImage .character-images {
  display: flex; /* Utiliza el modelo de caja flexible */
  flex-wrap: wrap; /* Envuelve los elementos en la siguiente línea */
  justify-content: space-around; /* Distribuye uniformemente los elementos */
  align-items: center; /* Centra verticalmente los elementos */
}

/* Estilos para los botones dentro del cuadro de perfil */
.profile-box button {
  height: 2rem; /* Altura del botón */
  width: 5rem; /* Ancho del botón */
  margin-top: 1rem; /* Margen superior de 1 rem */
  border-radius: 2.8125rem; /* Radio del borde */
  background-color: #2CD824; /* Color de fondo */
  color: black; /* Color del texto en negro */
  font-family: 'Nanum Brush Script', cursive; /* Fuente del texto */
  font-size: 1.5rem; /* Tamaño de fuente de 1.5 rem */
}

/* Estilos para el contenedor de botones en los comentarios del usuario */
.user-comments .button-container {
  display: flex; /* Utiliza el modelo de caja flexible */
  justify-content: center; /* Centra horizontalmente los elementos */
}

/* Estilos para los botones dentro de los comentarios del usuario */
.user-comments button {
  height: 2rem; /* Altura del botón */
  width: 5rem; /* Ancho del botón */
  margin-top: 1rem; /* Margen superior de 1 rem */
  border-radius: 2.8125rem; /* Radio del borde */
  background-color: #2CD824; /* Color de fondo */
  color: black; /* Color del texto en negro */
  font-family: 'Nanum Brush Script', cursive; /* Fuente del texto */
  font-size: 1.5rem; /* Tamaño de fuente de 1.5 rem */
  margin: auto; /* Margen automático */
  display: block; /* Muestra en bloque */
}

/* Estilos para el modo claro del perfil */
.light-mode-profile {
  background-color: white; /* Color de fondo blanco */
  color: black; /* Color del texto en negro */
  border: 2px solid black; /* Borde sólido de 2 px negro */
}

/* Estilos para los botones en el modo claro del perfil */
.light-mode-profile button {
  background-color: #0BFF00; /* Color de fondo verde */
}

/* Estilos para la sección de comentarios en el modo claro del usuario */
.user-comments .light-mode-comuser {
  background-color: white; /* Color de fondo blanco */
  color: black; /* Color del texto en negro */
  border: 2px solid black; /* Borde sólido de 2 px negro */
}

/* Estilos para el texto en el modo claro de la sección de comentarios del usuario */
.user-comments .light-mode-comuser span {
  -webkit-text-stroke: 1px black; /* Agrega un trazo de 1 px negro al texto */
}

/* Estilos para los botones en el modo claro de los comentarios del usuario */
.light-mode-buttonuser button {
  background-color: #0BFF00; /* Color de fondo verde */
}

/* Estilos para el modal de imagen en el modo claro */
.light-mode-moddalimg {
  background-color: white; /* Color de fondo blanco */
  border: 2px solid black; /* Borde sólido de 2 px negro */
}

/* Estilos para los botones en el modo claro del modal de imagen */
.light-mode-moddalimg button {
  background-color: #0BFF00; /* Color de fondo verde */
}

/* Estilos de medios para pantallas pequeñas */
@media only screen and (max-width: 600px) {
  .user-profile {
    display: flex; /* Utiliza el modelo de caja flexible */
    flex-direction: column; /* Dirección de la columna */
    height: 56rem; /* Altura del perfil de usuario */
  }
  
  /* Estilos para el cuadro de perfil en pantallas pequeñas */
  .profile-box {
    height: auto; /* Altura automática */
    width: 100%; /* Ancho del 100% */
    padding: 1rem; /* Relleno de 1 rem */
    padding-right: 0; /* Relleno derecho de 0 */
    padding-left: 0; /* Relleno izquierdo de 0 */
    display: flex; /* Utiliza el modelo de caja flexible */
    justify-content: space-around; /* Centra horizontalmente los elementos */
    align-items: center; /* Centra verticalmente los elementos */
  }
  
  /* Estilos para la sección de comentarios en pantallas pequeñas */
  .user-comments {
    width: 100%; /* Ancho del 100% */
    font-size: 0.75rem; /* Tamaño de fuente de 0.75 rem */
  }
  
  /* Estilos para la sección de amigos en pantallas pequeñas */
  .user-friends {
    width: 100%; /* Ancho del 100% */
  }
  
  /* Estilos para el cuadro de amigos en pantallas pequeñas */
  .user-friends .friends-box {
    height: auto; /* Altura automática */
    width: 100%; /* Ancho del 100% */
    padding: 1rem; /* Relleno de 1 rem */
    padding-right: 0; /* Relleno derecho de 0 */
    padding-left: 0; /* Relleno izquierdo de 0 */
    display: flex; /* Utiliza el modelo de caja flexible */
    align-items: center; /* Centra verticalmente los elementos */
    flex-direction: column; /* Dirección de la columna */
  }
  
  /* Estilos para el título de amigos en pantallas pequeñas */
  .user-friends .friend-title {
    font-size: 1.25rem; /* Tamaño de fuente de 1.25 rem */
    margin-bottom: 0rem; /* Margen inferior de 0 rem */
  }
  
  /* Estilos para la lista de amigos en pantallas pequeñas */
  .user-friends .friend-list {
    font-size: 1rem; /* Tamaño de fuente de 1 rem */
    margin-top: 0; /* Margen superior de 0 */
    margin-right: 8rem; /* Margen derecho de 8 rem */
  }
  
  /* Estilos para la imagen de perfil en pantallas pequeñas */
  .profile-box img {
    width: 5rem; /* Ancho de la imagen de perfil */
    height: auto; /* Altura automática */
    border-radius: 50%; /* Radio del borde */
    align-items: center; /* Centra verticalmente los elementos */
    display: flex; /* Utiliza el modelo de caja flexible */
  }
  
  /* Estilos para la información del usuario en pantallas pequeñas */
  .user-info {
    font-size: 1rem; /* Tamaño de fuente de 1 rem */
  }
  
  /* Estilos para el nombre de usuario en la información del usuario en pantallas pequeñas */
  .user-info .username_user {
    font-size: 1.4rem; /* Tamaño de fuente de 1.4 rem */
    margin-top: 0; /* Margen superior de 0 */
  }
  
  /* Estilos para los comentarios del usuario en pantallas pequeñas */
  .user-comments .username {
    font-size: 1.2rem; /* Tamaño de fuente de 1.2 rem */
    margin-left: 1rem; /* Margen izquierdo de 1 rem */
  }
  
  /* Estilos para la fecha en los comentarios del usuario en pantallas pequeñas */
  .user-comments .date {
    margin-left: 2rem; /* Margen izquierdo de 2 rem */
    font-size: 1.2rem; /* Tamaño de fuente de 1.2 rem */
  }
  
  /* Estilos para el contenido del comentario en los comentarios del usuario en pantallas pequeñas */
  .user-comments .post-content {
    margin-top: 0.3rem; /* Margen superior de 0.3 rem */
    font-size: 1.2rem; /* Tamaño de fuente de 1.2 rem */
  }
  
  /* Estilos para el modal de imagen en pantallas pequeñas */
  .modalImage {
    width: 100%; /* Ancho del 100% */
    height: 70%; /* Altura del 70% */
    transform: none; /* Sin transformación */
    margin-top: 4rem; /* Margen superior de 4 rem */
  }
  
  /* Estilos para la imagen dentro del modal de imagen en pantallas pequeñas */
  .modalImage img {
    width: 5rem; /* Ancho de la imagen de 5 rem */
    height: 5rem; /* Altura de la imagen de 5 rem */
  }
  
  /* Estilos para los botones dentro del modal de imagen en pantallas pequeñas */
  .modalImage button {
    height: 3rem; /* Altura del botón de 3 rem */
    width: 5rem; /* Ancho del botón de 5 rem */
    font-size: 1.6rem; /* Tamaño de fuente de 1.6 rem */
  }
  
  /* Estilos para el texto dentro del modal de imagen en pantallas pequeñas */
  .modalImage span {
    font-size: 1.6rem; /* Tamaño de fuente de 1.6 rem */
  }
  
  /* Estilos para los botones dentro del cuadro de perfil en pantallas pequeñas */
  .profile-box button {
    width: 6rem; /* Ancho del botón de 6 rem */
    height: 3rem; /* Altura del botón de 3 rem */
    font-size: 1.75rem; /* Tamaño de fuente de 1.75 rem */
  }
  
  /* Estilos para los botones dentro de los comentarios del usuario en pantallas pequeñas */
  .user-comments button {
    width: 6rem; /* Ancho del botón de 6 rem */
    height: 3rem; /* Altura del botón de 3 rem */
    font-size: 1.75rem; /* Tamaño de fuente de 1.75 rem */
    margin-top: -1rem; /* Margen superior de -1 rem */
  }
}
</style>
