<script>
  //En futuras entregas habrá una validación para asegurar que el usuario de User Advice este registrado en la base de datos.
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
      errors: {
        review: '',
        rating: '',
        email: '',
        advice: '',
        date: '',
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
      this.errors = {
        review: '',
        rating: '',
        email: '',
        advice: '',
        date: '',
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
          console.log('Form is valid. Submitting...');
        } else {
          console.log('Form is invalid. Please fix errors.');
        }
      } else {
        // Validar campos específicos de consejo
        this.validateAdvice();
        this.validateDate(); 

        // Comprobar si no hay errores antes de enviar
        if (this.errors.advice === '' && this.errors.date === '') {
          console.log('Form is valid. Submitting...');
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
  <!-- Encabezado de la página de contacto -->
  <h1>Contact</h1>
  <!-- Formulario con opciones para revisión o consejo -->
  <form>
    <!-- Selector para elegir entre revisión y consejo -->
    <label>
      <select v-model="selected" @change="handleSelectChange">
        <option value="review">Review</option>
        <option value="advice">Advice</option>
      </select>
    </label>
    <!-- Sección específica para revisión -->
    <div v-if="selected === 'review'">
      <!-- Campo para ingresar el correo electrónico -->
      <label>
        <p>Email</p>
        <input type="text" v-model="email" @input="validateEmail">
        <div class="error" v-if="errors.email">{{ errors.email }}</div>
      </label>
      <!-- Campo para ingresar la calificación numérica -->
      <label>
        <p>Rating</p>
        <input type="number" v-model="rating" min="1" max="10" @input="validateRating">
        <div class="error" v-if="errors.rating">{{ errors.rating }}</div>
      </label>
      <!-- Campo para ingresar la revisión en formato de texto largo -->
      <label>
        <p>Review</p>
        <textarea v-model="review" @input="validateReview"></textarea>
        <div class="error" v-if="errors.review">{{ errors.review }}</div>
      </label>
    </div>
    <!-- Sección específica para consejo -->
    <div v-if="selected === 'advice'">
      <!-- Campo para ingresar el consejo en formato de texto largo -->
      <label>
        <p>Advice</p>
        <textarea v-model="advice" @input="validateAdvice"></textarea>
        <div class="error" v-if="errors.advice">{{ errors.advice }}</div>
      </label>
      <!-- Campo para ingresar el consejo del usuario en formato de texto corto -->
      <label>
        <p>User Advice</p>
        <input type="text">
      </label>
      <!-- Campo para ingresar la fecha del consejo -->
      <label>
        <p>Date</p>
        <input type="date" v-model="date" @input="validateDate">
        <div class="error" v-if="errors.date">{{ errors.date }}</div>
      </label>
    </div>
    <!-- Botón de envío del formulario -->
    <button @click.prevent="validateAndSubmit" :disabled="isSubmitDisabled">Submit</button>
  </form>
</template>
<style>
/* Estilo para los mensajes de error en color rojo y tamaño de fuente pequeño */
.error {
  color: red;
  font-size: 12px;
}
</style>