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
      isLightMode: localStorage.getItem('light-mode') === 'true'
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
      <article v-for="comment in paginatedComments" :key="comment.id" class="Mensaje" :class="{ 'light-mode-comment': isLightMode }">
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
       <div class="buttons" :class="{ 'light-mode-buttons': isLightMode }">
        <button @click="previousPage" :disabled="currentPage === 1" class="pagination">Previous</button>
        <button v-if="username" @click="toggleModal" class="write"><img src="@/assets/icons/pluma.png" alt="pluma"></button>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination">Next</button>
       </div>

      
      <!-- Modal para escribir un nuevo comentario -->
      <Teleport to="body">
        <div class="modal" v-if="isModalOpen" :class="{ 'light-mode-modal': isLightMode }">
          <form>
            <label>
              <textarea v-model="comment" placeholder="Use me to comment!"></textarea>
            </label>
          </form>
          <div class="buttons-modal">
            <!-- Botón para enviar el comentario -->
            <button @click.prevent="submit">Send</button>
            <!-- Botón para cerrar el modal -->
            <button @click="toggleModal">Close</button>
          </div>
        </div>
      </Teleport>
    </div>
    <!-- Panel lateral derecho -->
    <div class="right-side" >
      <!-- Filtros de comentarios -->
      <div class="comments-filter" :class="{ 'light-mode-rightside': isLightMode }">
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

    </div>
  </div>
</template>

<style>
/* Estilos para el contenedor principal de la página de inicio */
.homepage{
  display: flex; /* Utiliza el modelo de caja flexible */
  justify-content: space-between; /* Distribuye el espacio entre los elementos */
}

/* Estilos para el contenedor de comentarios */
.Comentarios {
  min-height: 50rem; /* Altura mínima del contenedor de comentarios de 50 rem */
  margin-left: 7rem; /* Margen izquierdo de 7 rem */
  margin-top: 3rem; /* Margen superior de 3 rem */
}

/* Estilos para cada mensaje dentro del contenedor de comentarios */
.Mensaje {
  max-width: 60rem; /* Ancho máximo del mensaje de 60 rem */
  min-width: 60rem; /* Ancho mínimo del mensaje de 60 rem */
  margin-bottom: 3rem; /* Margen inferior de 3 rem */
  padding: 1rem; /* Relleno de 1 rem */
  border-radius: 1.875rem; /* Radio del borde del mensaje */
  display: flex; /* Utiliza el modelo de caja flexible */
  background-color: #2E3244; /* Color de fondo del mensaje */
  color: white; /* Color del texto en blanco */
  font-family: 'Mogra', sans-serif; /* Fuente del texto */
  font-size: 1.2rem; /* Tamaño de fuente de 1.2 rem */
}

/* Estilos para el contenedor de imagen dentro del mensaje */
.image-container {
  display: flex; /* Utiliza el modelo de caja flexible */
  align-items: center; /* Centra verticalmente los elementos */
  justify-content: center; /* Centra horizontalmente los elementos */
}

/* Estilos para el icono de usuario dentro del mensaje */
.user-icon {
  width: 4rem; /* Ancho del icono de usuario de 4 rem */
  height: 4rem; /* Altura del icono de usuario de 4 rem */
  border-radius: 50%; /* Radio del borde del icono de usuario */
}

/* Estilos para el contenedor de contenido dentro del mensaje */
.content-container {
  flex-grow: 1; /* Permite que el contenedor ocupe todo el espacio disponible */
}

/* Estilos para el encabezado del mensaje */
.post-header {
  margin: 0; /* Elimina el margen */
  display: flex; /* Utiliza el modelo de caja flexible */
  align-items: center; /* Centra verticalmente los elementos */
}

/* Estilos para el nombre de usuario en el mensaje */
.username {
  margin-top: 0rem; /* Margen superior de 0 rem */
  margin-bottom: 0rem; /* Margen inferior de 0 rem */
  margin-left: 6rem; /* Margen izquierdo de 6 rem */
  font-size: 1.3rem; /* Tamaño de fuente de 1.3 rem */
  text-decoration: none; /* Elimina la decoración de texto */
  color: inherit; /* Utiliza el color de texto heredado */
}

/* Estilos para la fecha en el mensaje */
.date {
  margin-top: 0rem; /* Margen superior de 0 rem */
  margin-bottom: 0rem; /* Margen inferior de 0 rem */
  margin-left: 3rem; /* Margen izquierdo de 3 rem */
  font-size: 1.3rem; /* Tamaño de fuente de 1.3 rem */
}

/* Estilos para el contenido del mensaje */
.post-content span {
  color: #0BFF00; /* Color del texto en verde */
}

/* Estilos para el contenido del mensaje */
.post-content {
  margin-left: 1rem; /* Margen izquierdo de 1 rem */
  margin-top: 0.3rem; /* Margen superior de 0.3 rem */
}

/* Estilos para el modal */
.modal{
  position: fixed; /* Posición fija */
  top: 0; /* Desde la parte superior de la ventana gráfica */
  left: 0; /* Desde la parte izquierda de la ventana gráfica */
  background-color: #666565; /* Color de fondo */
  width: 50%; /* Ancho del modal */
  height: 50%; /* Altura del modal */
  transform: translate(50%, 50%); /* Centra el modal */
  display: flex; /* Utiliza el modelo de caja flexible */
  justify-content: center; /* Centra horizontalmente los elementos */
  align-items: center; /* Centra verticalmente los elementos */
  border-radius: 5rem; /* Radio del borde */
  flex-direction: column; /* Los elementos dentro del modal se colocan en columna */
}

/* Estilos para los elementos dentro del modal */
.modal>div{
  background-color: aliceblue; /* Color de fondo del div */
  padding: 50px; /* Relleno de 50 píxeles */
}

/* Estilos para el lado derecho de la página */
.right-side {
  width: 25%; /* Ancho del lado derecho de la página */
  display: flex; /* Utiliza el modelo de caja flexible */
  align-items: center; /* Centra verticalmente los elementos */
  justify-content: center; /* Centra horizontalmente los elementos */
  flex-direction: column; /* Los elementos dentro del lado derecho se colocan en columna */
  margin-left: 1rem; /* Margen izquierdo de 1 rem */
}

/* Estilos para el filtro de comentarios */
.right-side .comments-filter{
  display: flex; /* Utiliza el modelo de caja flexible */
  align-items: center; /* Centra verticalmente los elementos */
  width: 14rem; /* Ancho del filtro de comentarios */
  margin-bottom: 3rem; /* Margen inferior de 3 rem */
  margin-left: 0; /* Margen izquierdo de 0 */
  padding: 0rem; /* Relleno de 0 */
  border-radius: 1.875rem; /* Radio del borde */
  background-color: #2E3244; /* Color de fondo */
  color: #00ff00; /* Color del texto en verde */
  font-family: 'Mogra', sans-serif; /* Fuente del texto */
  font-size: 1.2rem; /* Tamaño de fuente de 1.2 rem */
  flex-direction: column; /* Los elementos dentro del filtro se colocan en columna */
}

/* Estilos para la paginación dentro de los comentarios */
.Comentarios .pagination {
  height: 4rem; /* Altura de la paginación de 4 rem */
  width: 6rem; /* Ancho de la paginación de 6 rem */
  margin-top: 1rem; /* Margen superior de 1 rem */
  border-radius: 2.8125rem; /* Radio del borde */
  background-color: #2CD824; /* Color de fondo */
  color: black; /* Color del texto en negro */
  font-family: 'Nanum Brush Script', cursive; /* Fuente del texto */
  font-size: 2rem; /* Tamaño de fuente de 2 rem */
}

/* Estilos para los elementos de la lista dentro del filtro de comentarios */
.comments-filter li{
  margin-left: -5rem; /* Margen izquierdo negativo de 5 rem */
}

/* Estilos para el botón de escribir */
.write{
  height: 4rem; /* Altura del botón de escribir de 4 rem */
  width: 4rem; /* Ancho del botón de escribir de 4 rem */
  display: flex; /* Utiliza el modelo de caja flexible */
  justify-content: center; /* Centra horizontalmente los elementos */
  align-items: center; /* Centra verticalmente los elementos */
  border-radius: 50%; /* Radio del borde */
  background-color: #2CD824; /* Color de fondo */
}

/* Estilos para el título del filtro */
.filter-title{
  width: 10rem; /* Ancho del título del filtro de 10 rem */
  height: 3rem; /* Altura del título del filtro de 3 rem */
  margin-top: 1rem; /* Margen superior de 1 rem */
  border-radius: 2.8125rem; /* Radio del borde */
  background-color: #2CD824; /* Color de fondo */
  color: black; /* Color del texto en negro */
  font-family: 'Nanum Brush Script', cursive; /* Fuente del texto */
  font-size: 2rem; /* Tamaño de fuente de 2 rem */
}

/* Estilos para los botones */
.buttons{
  display: flex; /* Utiliza el modelo de caja flexible */
  align-items: center; /* Centra verticalmente los elementos */
  justify-content: space-around; /* Distribuye el espacio entre los elementos */
  padding: 1rem; /* Relleno de 1 rem */
}

/* Estilos para los botones dentro del modal */
.modal button{
  height: 4rem; /* Altura del botón de 4 rem */
  width: 8rem; /* Ancho del botón de 8 rem */
  margin-top: 1rem; /* Margen superior de 1 rem */
  border-radius: 2.8125rem; /* Radio del borde */
  background-color: #2CD824; /* Color de fondo */
  color: black; /* Color del texto en negro */
  font-family: 'Nanum Brush Script', cursive; /* Fuente del texto */
  font-size: 2.5rem; /* Tamaño de fuente de 2.5 rem */
}

/* Estilos para los botones dentro del modal */
.buttons-modal{
  display: flex; /* Utiliza el modelo de caja flexible */
  justify-content: center; /* Centra horizontalmente los elementos */
}

/* Estilos para los elementos dentro del modal */
.modal>div{
  background-color: transparent; /* Color de fondo transparente */
}

/* Estilos para el área de texto dentro del modal */
.modal textarea{
  height: 8rem; /* Altura del área de texto de 8 rem */
  width: 20rem; /* Ancho del área de texto de 20 rem */
  margin-top: 0; /* Margen superior de 0 */
  padding: 1rem; /* Relleno de 1 rem */
  border-radius: 2.8125rem; /* Radio del borde */
  font-family: 'Mogra', sans-serif; /* Fuente del texto */
  font-size: 1.5rem; /* Tamaño de fuente de 1.5 rem */
}

/* Estilos específicos para el modo claro en los comentarios */
.light-mode-comment{
  background-color: white; /* Color de fondo blanco */
  color: black; /* Color del texto en negro */
  border: 2px solid black; /* Borde de 2 píxeles sólido negro */
}

/* Estilos específicos para el modo claro en los comentarios */
.light-mode-comment span{
  -webkit-text-stroke: 1px black; /* Contorno de texto de 1 píxel */
}

/* Estilos específicos para el modo claro en el lado derecho */
.right-side .light-mode-rightside{
  background-color: white; /* Color de fondo blanco */
  -webkit-text-stroke: 1px black; /* Contorno de texto de 1 píxel */
  border: 2px solid black; /* Borde de 2 píxeles sólido negro */
}

/* Estilos específicos para el modo claro en el lado derecho */
.right-side .light-mode-rightside button{
  -webkit-text-stroke: 0px black; /* Sin contorno de texto */
  background-color: #00ff00; /* Color de fondo en verde */
}

/* Estilos específicos para el modo claro en los botones de los comentarios */
.Comentarios .light-mode-buttons button{
  background-color: #00ff00; /* Color de fondo en verde */
}

/* Estilos específicos para el modo claro en el modal */
.light-mode-modal{
  background-color: white; /* Color de fondo blanco */
  border: 2px solid black; /* Borde de 2 píxeles sólido negro */
}

/* Estilos específicos para el modo claro en el área de texto del modal */
.light-mode-modal textarea{
  border: 2px solid black; /* Borde de 2 píxeles sólido negro */
}

/* Estilos específicos para el modo claro en los botones del modal */
.light-mode-modal button{
  background-color: #00ff00; /* Color de fondo en verde */
}

/* Media query para dispositivos con un ancho máximo de 768px */
@media (max-width: 768px) {
  .homepage{
    display: flex; /* Utiliza el modelo de caja flexible */
    flex-direction: column; /* Los elementos se colocan en columna */
    height: 78rem; /* Altura de la página de inicio de 78 rem */
  }
  .Comentarios {
    margin-left: 0rem; /* Margen izquierdo de 0 rem */
  }

  .Mensaje {
    width: 100%; /* Ancho del mensaje al 100% */
    margin-left: 0; /* Margen izquierdo de 0 */
    padding: 1rem; /* Relleno de 1 rem */
    padding-right: 0; /* Relleno derecho de 0 */
    padding-left: 0; /* Relleno izquierdo de 0 */
  }
  .user-icon{
    max-width: 3rem; /* Ancho máximo del icono de usuario de 3 rem */
    max-height: 3rem; /* Altura máxima del icono de usuario de 3 rem */
}
  .username {
    margin-left: 2rem; /* Margen izquierdo de 2 rem */
    font-size: 1rem; /* Tamaño de fuente de 1 rem */
  }

  .date {
    margin-left: 2rem; /* Margen izquierdo de 2 rem */
    font-size: 1rem; /* Tamaño de fuente de 1 rem */
  }
  .post-content{
    font-size: 1rem; /* Tamaño de fuente de 1 rem */
  }
  .right-side{
    height: auto; /* Altura automática */
    width: 100%; /* Ancho al 100% */
    padding: 0; /* Sin relleno */
    padding-right: 0; /* Sin relleno derecho */
    padding-left: 0; /* Sin relleno izquierdo */
    margin: 0; /* Sin margen */
  }
  .modal{
    width: 100%; /* Ancho del modal al 100% */
    height: 60%; /* Altura del modal al 60% */
    transform: none; /* Sin transformaciones */
    margin-top: 5rem; /* Margen superior de 5 rem */
  }
  .modal textarea{
    height: 5rem; /* Altura del área de texto del modal de 5 rem */
    width: 16rem; /* Ancho del área de texto del modal de 16 rem */
    margin-top: 0; /* Margen superior de 0 */
    padding: 1rem; /* Relleno de 1 rem */
    border-radius: 2.8125rem; /* Radio del borde */
    font-family: 'Mogra', sans-serif; /* Fuente del texto */
    font-size: 1.5rem; /* Tamaño de fuente de 1.5 rem */
  }
  .modal button{
    height: 5rem; /* Altura del botón de 5 rem */
    width: 8rem; /* Ancho del botón de 8 rem */
    font-size: 3rem; /* Tamaño de fuente de 3 rem */
  }
}
</style>