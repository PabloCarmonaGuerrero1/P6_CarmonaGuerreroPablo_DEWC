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
      isLightMode: localStorage.getItem('light-mode') === 'true'
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
    <div class="other-profile-box" :class="{ 'light-mode-otherprofile': isLightMode }">
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
      <article v-for="comment in paginatedComments" :key="comment.id" class="Mensaje" :class="{ 'light-mode-othercomments': isLightMode }">
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
      <div class="button-container" :class="{ 'light-mode-buttonsother': isLightMode }">
        <!-- Botón para la página anterior -->
        <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
        <!-- Botón para la página siguiente -->
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </div>
</template>

<style>
/* Estilos para el perfil de otro usuario */
.other-user-profile {
  display: flex; /* Utiliza el modelo de caja flexible */
  justify-content: space-around; /* Distribuye el espacio alrededor de los elementos */
  align-items: center; /* Centra verticalmente los elementos */
  height: 77.4vh; /* Altura del perfil de otro usuario */
  margin-top: 2rem; /* Margen superior de 2 rem */
  margin-bottom: 2rem; /* Margen inferior de 2 rem */
}

/* Estilos para el contenedor del perfil de otro usuario */
.other-user-profile .other-profile-box {
  min-width: 20.625rem; /* Ancho mínimo de la caja del perfil de otro usuario */
  height: 34rem; /* Altura de la caja del perfil de otro usuario */
  text-align: center; /* Alineación del texto al centro */
  padding: 2rem; /* Relleno de 2 rem */
  border-radius: 1.875rem; /* Radio del borde */
  background-color: #2E3244; /* Color de fondo */
  color: white; /* Color del texto en blanco */
  font-family: 'Mogra', sans-serif; /* Fuente del texto */
}

/* Estilos para el nombre de usuario en el perfil de otro usuario */
.other-user-profile .other-profile-box .username-other {
  font-size: 1.5rem; /* Tamaño de fuente de 1.5 rem */
}

/* Estilos para los comentarios en el perfil de otro usuario */
.other-user-profile .other-profile-box .comments-other {
  font-size: 1rem; /* Tamaño de fuente de 1 rem */
}

/* Estilos para la imagen de perfil en el perfil de otro usuario */
.other-user-profile img {
  width: 10rem; /* Ancho de la imagen de perfil de 10 rem */
  height: auto; /* Altura automática de la imagen de perfil */
  border-radius: 50%; /* Radio del borde */
}

/* Estilos para los mensajes en el perfil de otro usuario */
.other-comments .Mensaje {
  width: 50rem; /* Ancho del mensaje en el perfil de otro usuario */
  margin-bottom: 3rem; /* Margen inferior de 3 rem */
  padding: 1rem; /* Relleno de 1 rem */
  border-radius: 1.875rem; /* Radio del borde */
  display: flex; /* Utiliza el modelo de caja flexible */
  background-color: #2E3244; /* Color de fondo */
  color: white; /* Color del texto en blanco */
  font-family: 'Mogra', sans-serif; /* Fuente del texto */
  font-size: 1.2rem; /* Tamaño de fuente de 1.2 rem */
}

/* Estilos para el contenedor de imagen en los comentarios */
.other-comments .image-container {
  display: flex; /* Utiliza el modelo de caja flexible */
  align-items: center; /* Centra verticalmente los elementos */
  justify-content: center; /* Centra horizontalmente los elementos */
}

/* Estilos para el icono de usuario en los comentarios */
.other-comments .user-icon {
  width: 4rem; /* Ancho del icono de usuario de 4 rem */
  height: 4rem; /* Altura del icono de usuario de 4 rem */
  border-radius: 50%; /* Radio del borde */
}

/* Estilos para el contenedor de contenido en los comentarios */
.other-comments .content-container {
  flex-grow: 1; /* El contenedor de contenido crece para ocupar el espacio disponible */
}

/* Estilos para el encabezado del mensaje en los comentarios */
.other-comments .post-header {
  margin: 0; /* Margen de 0 */
  display: flex; /* Utiliza el modelo de caja flexible */
  align-items: center; /* Centra verticalmente los elementos */
}

/* Estilos para el nombre de usuario en los comentarios */
.other-comments .username {
  margin-top: 0rem; /* Margen superior de 0 */
  margin-bottom: 0rem; /* Margen inferior de 0 */
  margin-left: 6rem; /* Margen izquierdo de 6 rem */
  font-size: 1.3rem; /* Tamaño de fuente de 1.3 rem */
}

/* Estilos para la fecha en los comentarios */
.other-comments .date {
  margin-top: 0rem; /* Margen superior de 0 */
  margin-bottom: 0rem; /* Margen inferior de 0 */
  margin-left: 3rem; /* Margen izquierdo de 3 rem */
  font-size: 1.3rem; /* Tamaño de fuente de 1.3 rem */
}

/* Estilos específicos para el botón en la caja del perfil de otro usuario */
.other-profile-box button {
  height: 4rem; /* Altura del botón de 4 rem */
  width: 8rem; /* Ancho del botón de 8 rem */
  margin-top: 1rem; /* Margen superior de 1 rem */
  border-radius: 2.8125rem; /* Radio del borde */
  background-color: #2CD824; /* Color de fondo */
  color: black; /* Color del texto en negro */
  font-family: 'Nanum Brush Script', cursive; /* Fuente del texto */
  font-size: 1.5rem; /* Tamaño de fuente de 1.5 rem */
}

/* Estilos para el contenedor de botones en los comentarios */
.other-comments .button-container {
  display: flex; /* Utiliza el modelo de caja flexible */
  justify-content: center; /* Centra horizontalmente los elementos */
}

/* Estilos para los botones en los comentarios */
.other-comments button {
  height: 2rem; /* Altura del botón de 2 rem */
  width: 5rem; /* Ancho del botón de 5 rem */
  margin-top: 1rem; /* Margen superior de 1 rem */
  border-radius: 2.8125rem; /* Radio del borde */
  background-color: #2CD824; /* Color de fondo */
  color: black; /* Color del texto en negro */
  font-family: 'Nanum Brush Script', cursive; /* Fuente del texto */
  font-size: 1.5rem; /* Tamaño de fuente de 1.5 rem */
  margin: auto; /* Margen automático */
  display: block; /* Muestra como bloque */
}

/* Estilos específicos para el modo claro en el perfil de otro usuario */
.other-user-profile .light-mode-otherprofile {
  background-color: white; /* Color de fondo blanco */
  color: black; /* Color del texto en negro */
  border: 2px solid black; /* Borde de 2 píxeles sólido negro */
}

/* Estilos específicos para el modo claro en la imagen de perfil del perfil de otro usuario */
.other-user-profile .light-mode-otherprofile img {
  border: 2px solid black; /* Borde de 2 píxeles sólido negro */
}

/* Estilos específicos para el modo claro en el botón del perfil de otro usuario */
.other-user-profile .light-mode-otherprofile button {
  background-color: #0BFF00; /* Color de fondo en verde */
}

/* Estilos específicos para el modo claro en los comentarios del perfil de otro usuario */
.other-user-profile .light-mode-othercomments {
  background-color: white; /* Color de fondo blanco */
  color: black; /* Color del texto en negro */
  border: 2px solid black; /* Borde de 2 píxeles sólido negro */
}

/* Estilos específicos para el modo claro en el contenido del comentario del perfil de otro usuario */
.other-user-profile .light-mode-othercomments span {
  -webkit-text-stroke: 1px black; /* Contorno de texto de 1 píxel */
}

/* Estilos específicos para el modo claro en los botones en los comentarios del perfil de otro usuario */
.light-mode-buttonsother button {
  background-color: #0BFF00; /* Color de fondo en verde */
}

/* Media query para dispositivos con un ancho máximo de 768px */
@media (max-width: 768px) {
  .other-user-profile {
    flex-direction: column; /* Los elementos se colocan en columna */
    margin: 0; /* Sin margen */
    height: 41rem; /* Altura del perfil de otro usuario */
  }
  .other-user-profile .other-profile-box {
    height: auto; /* Altura automática */
    width: 100%; /* Ancho al 100% */
    margin-top: 0rem; /* Margen superior de 0 rem */
    padding: 1rem; /* Relleno de 1 rem */
    padding-right: 0; /* Relleno derecho de 0 */
    padding-left: 0; /* Relleno izquierdo de 0 */
    display: flex; /* Utiliza el modelo de caja flexible */
    justify-content: space-around; /* Distribuye el espacio alrededor de los elementos */
  }
  .other-user-profile img {
    width: 5rem; /* Ancho de la imagen de perfil de 5 rem */
    height: auto; /* Altura automática de la imagen de perfil */
    border-radius: 50%; /* Radio del borde */
    align-self: flex-start; /* Alineación propia al inicio */
    display: flex; /* Utiliza el modelo de caja flexible */
  }
  .other-user-profile .other-info {
    font-size: 1rem; /* Tamaño de fuente de 1 rem */
  }
  .other-user-profile button {
    font-size: 1.25rem; /* Tamaño de fuente de 1.25 rem */
    width: 6rem; /* Ancho del botón de 6 rem */
    height: 3rem; /* Altura del botón de 3 rem */
  }
  .other-comments .Mensaje {
    width: 100%; /* Ancho del mensaje al 100% */
    font-size: 0.75rem; /* Tamaño de fuente de 0.75 rem */
  }
  .other-comments .username {
    font-size: 1rem; /* Tamaño de fuente de 1 rem */
  }
  .other-comments button {
    font-size: 1.5rem; /* Tamaño de fuente de 1.5 rem */
  }
  .other-comments .date {
    margin-left: 2rem; /* Margen izquierdo de 2 rem */
    font-size: 1rem; /* Tamaño de fuente de 1 rem */
  }
}
</style>