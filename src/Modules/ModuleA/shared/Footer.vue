<script>

export default {
  data() {
    return {
      isLightMode: localStorage.getItem('light-mode') === 'true' 
    };
  },
};
</script>
<template>
    <div  class="Footer" :class="{ 'light-mode-footer': isLightMode }">
        <img v-if="!this.isLightMode" src="@/assets/icons/instagram 1.png" alt="instagram">
        <img v-if="this.isLightMode" src="@/assets/icons/instagram 12.png" alt="instagram-light">
        <img v-if="!this.isLightMode" src="@/assets/icons/gorjeo 1.png" alt="x">
        <img v-if="this.isLightMode" src="@/assets/icons/gorjeo (1) 1.png" alt="x-light">
        <img v-if="!this.isLightMode" src="@/assets/icons/facebook 1.png" alt="facebook">
        <img v-if="this.isLightMode" src="@/assets/icons/facebook 12.png" alt="facebook-light">
        <img v-if="!this.isLightMode" src="@/assets/icons/discordia 1.png" alt="discord">
        <img v-if="this.isLightMode" src="@/assets/icons/discordia 12 (1).png" alt="discord-light">
    </div>

</template>
<style>
.Footer {
    background-color: #8DB986; /* Color de fondo del pie de página */
    padding: 1rem; /* Relleno del pie de página */
    display: flex; /* Utiliza el modelo de caja flexible */
    align-items: center; /* Centra verticalmente los elementos */
}

.Footer img {
    max-width: 3rem; /* Ancho máximo de la imagen */
    max-height: 3rem; /* Altura máxima de la imagen */
    margin-right: 1rem; /* Margen derecho de la imagen */
}

.light-mode-footer {
    background-color: #C1FFB7; /* Color de fondo del pie de página en modo claro */
}

@media (max-width: 768px) {
    .Footer {
        padding: 0.5rem; /* Relleno del pie de página en pantallas pequeñas */
    }

    .Footer img {
        max-width: 3rem; /* Ancho máximo de la imagen en pantallas pequeñas */
        max-height: 3rem; /* Altura máxima de la imagen en pantallas pequeñas */
    }
}

</style>