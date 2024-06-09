<script>
// Importar la librería Axios para hacer solicitudes HTTP
import axios from 'axios';

export default {
  data() {
    // Estado de los datos del formulario y mensajes de error
    return {
      selected: 'review',
      review: '',
      advice: '',
      email: '',
      rating: '',
      date: '',
      useradvice: '',
      errors: {
        review: '',
        rating: '',
        email: '',
        advice: '',
        date: '',
        useradvice: '',
      },
      // Indicador de inhabilitar el botón de envío
      isSubmitDisabled: true,
      isLightMode: localStorage.getItem('light-mode') === 'true' 
    };
  },
  methods: {
    // Manejador para el cambio en el selector de revisión/consejo
    handleSelectChange() {
      // Limpiar campos y mensajes de error al cambiar la selección
      this.review = '';
      this.advice = '';
      this.email = '';
      this.rating = '';
      this.date = '';
      this.useradvice = '';
      this.errors = {
        review: '',
        rating: '',
        email: '',
        advice: '',
        date: '',
        useradvice: '',
      };
      // Actualizar estado del botón de envío
      this.updateSubmitDisabled();
    },
    // Validación de la longitud de la revisión
    validateReview() {
      const reviewLength = this.review.replace(/\s/g, '').length;

      if (reviewLength < 10) {
        this.errors.review = 'Review must be at least 10 characters long';
      } else {
        this.errors.review = '';
      }
      // Actualizar estado del botón de envío
      this.updateSubmitDisabled();
    },
    // Validación del formato del correo electrónico
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(this.email)) {
        this.errors.email = 'Invalid email address';
      } else {
        this.errors.email = '';
      }
      // Actualizar estado del botón de envío
      this.updateSubmitDisabled();
    },
    // Validación del rango de la calificación
    validateRating() {
      const ratingValue = parseFloat(this.rating);

      if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 10) {
        this.errors.rating = 'Rating must be a number between 1 and 10';
      } else {
        this.errors.rating = '';
      }
      // Actualizar estado del botón de envío
      this.updateSubmitDisabled();
    },
    // Validación del usuario reportado
    async validateUser(){
      try {
        const user = this.useradvice
        const apiUrl = `http://localhost/api/v1/users/${user}`; 
        const response = await axios.get(apiUrl);
        const userInfo = response.data;
        if(userInfo){
          this.errors.useradvice = '';
        }
        // Actualizar estado del botón de envío
        this.updateSubmitDisabled();
      } catch (error) {
        this.errors.useradvice = 'This user is not registered ';
      }
    },
    // Validación de la longitud del consejo
    validateAdvice() {
      const adviceLength = this.advice.replace(/\s/g, '').length;

      if (adviceLength < 10) {
        this.errors.advice = 'Advice must be at least 10 characters long';
      } else {
        this.errors.advice = '';
      }
      // Actualizar estado del botón de envío
      this.updateSubmitDisabled();
    },
    // Validación de la presencia de la fecha
    validateDate() {
      if (!this.date) {
        this.errors.date = 'Date cannot be empty';
      } else {
        this.errors.date = '';
      }
      // Actualizar estado del botón de envío
      this.updateSubmitDisabled();
    },
    // Validación final y envío del formulario
    validateAndSubmit() {
      if (this.selected === 'review') {
        // Validar campos específicos de revisión
        this.validateReview();
        this.validateEmail();
        this.validateRating();

        // Comprobar si no hay errores antes de enviar
        if (
          this.errors.review === '' &&
          this.errors.email === '' &&
          this.errors.rating === ''
        ) {
          this.review = '';
          this.email = '';
          this.rating = '';
        } else {
          console.log('Form is invalid. Please fix errors.');
        }
      } else {
        // Validar campos específicos de consejo
        this.validateUser();
        this.validateAdvice();
        this.validateDate(); 

        // Comprobar si no hay errores antes de enviar
        if (this.errors.advice === '' && this.errors.date === '' && this.errors.useradvice === '') {
          this.advice = '';
          this.date = '';
          this.useradvice = '';
        } else {
          console.log('Form is invalid. Please fix errors.');
        }
      }
      
    },
    // Actualizar el estado del botón de envío
    updateSubmitDisabled() {
      this.isSubmitDisabled =
        this.errors.email !== '' ||
        this.errors.rating !== '' ||
        this.errors.review !== '';
    },
  },
};
</script>

<template>
  <!-- Formulario con opciones para revisión o consejo -->
  <form class="Contact" :class="{ 'light-mode-contact': isLightMode }">
    <!-- Selector para elegir entre revisión y consejo -->
    <label>
      <select v-model="selected" @change="handleSelectChange">
        <!-- Opción para revisión -->
        <option value="review" classname="option">Review</option>
        <!-- Opción para consejo -->
        <option value="advice" classname="option">Advice</option>
      </select>
    </label>

    <!-- Sección específica para revisión -->
    <div v-if="selected === 'review'">
      <!-- Campo para ingresar el correo electrónico -->
      <label>
        <p>Email</p>
        <input type="text" v-model="email" @input="validateEmail">
        <!-- Mensaje de error para el correo electrónico -->
        <div class="error" v-if="errors.email">{{ errors.email }}</div>
      </label>
      <!-- Campo para ingresar la calificación numérica -->
      <label>
        <p>Rating</p>
        <input type="number" v-model="rating" min="1" max="10" @input="validateRating">
        <!-- Mensaje de error para la calificación -->
        <div class="error" v-if="errors.rating">{{ errors.rating }}</div>
      </label>
      <!-- Campo para ingresar la revisión en formato de texto largo -->
      <label>
        <p>Review</p>
        <textarea v-model="review" @input="validateReview"></textarea>
        <!-- Mensaje de error para la revisión -->
        <div class="error" v-if="errors.review">{{ errors.review }}</div>
      </label>
    </div>

    <!-- Sección específica para consejo -->
    <div v-if="selected === 'advice'">
      <!-- Campo para ingresar el usuario del consejo -->
      <label>
        <p>User Advice</p>
        <input type="text" v-model="useradvice" @input="validateUser">
        <!-- Mensaje de error para el usuario del consejo -->
        <div class="error" v-if="errors.useradvice">{{ errors.useradvice }}</div>
      </label>
      <!-- Campo para ingresar la fecha del consejo -->
      <label>
        <p>Date</p>
        <input type="date" v-model="date" @input="validateDate">
        <!-- Mensaje de error para la fecha -->
        <div class="error" v-if="errors.date">{{ errors.date }}</div>
      </label>
      <!-- Campo para ingresar el consejo en formato de texto largo -->
      <label>
        <p>Advice</p>
        <textarea v-model="advice" @input="validateAdvice"></textarea>
        <!-- Mensaje de error para el consejo -->
        <div class="error" v-if="errors.advice">{{ errors.advice }}</div>
      </label>
    </div>

    <!-- Botón de envío del formulario -->
    <button @click.prevent="validateAndSubmit" :disabled="isSubmitDisabled">Send</button>
  </form>
</template>

<style>
/* Estilos para mensajes de error dentro de la clase Contact */
.Contact .error {
  margin-top: 1rem; /* Margen superior de 1 rem */
  color: red; /* Color del texto en rojo */
  font-size: 1rem; /* Tamaño de fuente de 1 rem */
}

/* Estilos para el contenedor de contacto */
.Contact {
  margin-top: 5rem; /* Margen superior de 5 rem */
  margin-bottom: 5rem; /* Margen inferior de 5 rem */
  display: flex; /* Utiliza el modelo de caja flexible */
  flex-direction: column; /* Los elementos dentro del contenedor se colocan en columna */
  align-items: center; /* Centra los elementos horizontalmente */
  justify-content: center; /* Centra los elementos verticalmente */
}

/* Estilos para las etiquetas de texto dentro del formulario de contacto */
.Contact label {
  display: block; /* Muestra las etiquetas como bloques */
  text-align: center; /* Alinea el texto al centro */
}

/* Estilos para los campos de entrada de texto dentro del formulario de contacto */
.Contact input {
  height: 4rem; /* Altura del campo de entrada de texto de 4 rem */
  width: 20rem; /* Ancho del campo de entrada de texto de 20 rem */
  margin-top: 0; /* Margen superior de 0 */
  border-radius: 2.8125rem; /* Radio del borde del campo de entrada */
  text-align: center; /* Alinea el texto al centro */
  font-family: 'Mogra', sans-serif; /* Fuente del texto */
  font-size: 1.5rem; /* Tamaño de fuente de 1.5 rem */
}

/* Estilos para el área de texto dentro del formulario de contacto */
.Contact textarea {
  height: 4rem; /* Altura del área de texto de 4 rem */
  width: 20rem; /* Ancho del área de texto de 20 rem */
  margin-top: 0; /* Margen superior de 0 */
  padding: 1rem; /* Relleno de 1 rem */
  border-radius: 2.8125rem; /* Radio del borde del área de texto */
  font-family: 'Mogra', sans-serif; /* Fuente del texto */
  font-size: 1.5rem; /* Tamaño de fuente de 1.5 rem */
}

/* Estilos para los párrafos dentro del formulario de contacto */
.Contact p {
  margin-top: 0.5rem; /* Margen superior de 0.5 rem */
  margin-bottom: 0.5rem; /* Margen inferior de 0.5 rem */
  color: #0BFF00; /* Color del texto en verde */
  font-family: 'Nanum Brush Script', cursive; /* Fuente del texto */
  font-size: 4rem; /* Tamaño de fuente de 4 rem */
}

/* Estilos para los selectores dentro del formulario de contacto */
.Contact select {
  height: 4rem; /* Altura del selector de 4 rem */
  width: 20rem; /* Ancho del selector de 20 rem */
  border-radius: 2.8125rem; /* Radio del borde del selector */
  text-align: center; /* Alinea el texto al centro */
  color: black; /* Color del texto en negro */
  font-family: 'Nanum Brush Script', cursive; /* Fuente del texto */
  font-size: 3rem; /* Tamaño de fuente de 3 rem */
}

/* Estilos para el botón de enviar dentro del formulario de contacto */
.Contact button {
  height: 3.5rem; /* Altura del botón de enviar de 3.5 rem */
  width: 12rem; /* Ancho del botón de enviar de 12 rem */
  margin-top: 2rem; /* Margen superior de 2 rem */
  border-radius: 2.8125rem; /* Radio del borde del botón */
  background-color: #2CD824; /* Color de fondo del botón */
  color: black; /* Color del texto en negro */
  font-family: 'Nanum Brush Script', cursive; /* Fuente del texto */
  font-size: 3rem; /* Tamaño de fuente de 3 rem */
}

/* Estilos específicos para el modo de luz en el formulario de contacto */
.light-mode-contact input {
  border: 2px solid black; /* Borde del campo de entrada de texto de 2 píxeles sólido negro */
}

.light-mode-contact textarea {
  border: 2px solid black; /* Borde del área de texto de 2 píxeles sólido negro */
}

.light-mode-contact p {
  -webkit-text-stroke: 1px black; /* Añade un contorno de 1 píxel de grosor en negro al texto */
}

.light-mode-contact button {
  background-color: #0BFF00; /* Color de fondo del botón en verde */
  border: 2px solid black; /* Borde del botón de enviar de 2 píxeles sólido negro */
}

/* Estilos específicos para pantallas con un ancho máximo de 768px */
@media (max-width:768px) {
  .Contact {
    min-height: 40rem; /* Altura mínima del contenedor de contacto de 40 rem */
  }

  .Contact input {
    width: 15rem; /* Ancho del campo de entrada de texto de 15 rem */
    border-radius: 2.8125rem; /* Radio del borde del campo de entrada */
    font-size: 1rem; /* Tamaño de fuente de 1 rem */
  }

  .Contact textarea {
    width: 15rem; /* Ancho del área de texto de 15 rem */
    height: 3rem; /* Altura del área de texto de 3 rem */
    font-size: 1rem; /* Tamaño de fuente de 1 rem */
  }

  .Contact select {
    width: 18rem; /* Ancho del selector de 18 rem */
    height: 3rem; /* Altura del selector de 3 rem */
    font-size: 2rem; /* Tamaño de fuente de 2 rem */
  }

  .Contact p {
    font-size: 3rem; /* Tamaño de fuente de 3 rem */
  }
  .Contact button {
    width: 6rem; /* Ancho del botón de enviar de 6 rem */
    font-size: 2rem; /* Tamaño de fuente de 2 rem */
  }
}
</style> 