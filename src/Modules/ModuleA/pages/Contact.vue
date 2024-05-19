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
  <form class="Contact">
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
.Contact .error {
  margin-top: 1rem;
  color: red;
  font-size: 1rem;
}
.Contact {
  margin-top: 5rem;
  margin-bottom: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}
.Contact label{
  display: block;
  text-align: center;
}
.Contact input{
  height: 4rem;
  width: 20rem;
  margin-top: 0;
  border-radius: 2.8125rem;
  text-align: center;
  font-family: 'Mogra', sans-serif;
  font-size: 1.5rem;
}
.Contact textarea{
  height: 4rem;
  width: 20rem;
  margin-top: 0;
  padding: 1rem;
  border-radius: 2.8125rem;
  font-family: 'Mogra', sans-serif;
  font-size: 1.5rem;
  
}
.Contact p{
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  color: #0BFF00;
  font-family: 'Nanum Brush Script', cursive;
  font-size: 4rem; 
}
.Contact select{
  height: 4rem;
  width: 20rem;
  border-radius: 2.8125rem;
  text-align: center;
  color: black;
  font-family: 'Nanum Brush Script', cursive;
  font-size: 3rem;
}
.Contact  button{
  height: 3.5rem;
  width: 12rem;
  margin-top: 2rem;
  border-radius: 2.8125rem;
  background-color: #2CD824;
  color: black;
  font-family: 'Nanum Brush Script', cursive;
  font-size: 3rem;
}
@media (max-width:768px){
  .Contact{
    min-height: 40rem;
  }
  .Contact input{
  width: 15rem;
  border-radius: 2.8125rem;
  font-size: 1rem;
}
.Contact textarea{
  width: 15rem;
  height: 3rem;
  font-size: 1rem;
}
.Contact select{
  width: 18rem;
  height: 3rem;
  font-size: 2rem;
}
.Contact p{
  font-size: 3rem;
}
}
.Contact button{
  width: 6rem;
  font-size: 2rem;
}
</style>