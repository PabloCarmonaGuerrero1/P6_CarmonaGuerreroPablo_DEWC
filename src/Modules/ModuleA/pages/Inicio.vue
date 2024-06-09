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
    <div class="Inicio" :class="{ 'light-mode-inicio': isLightMode }">
        <!-- Div para la sección de inicio -->
        <h2>Welcome to RickReditt!</h2>
        <!-- Título principal -->
        <h3>A social network where you can freely interact with other users, expressing your comments on any topic, but mainly focused on discussions related to Rick and Morty</h3>
        <!-- Descripción de la red social -->
        <router-link to="/HomePage">
            <!-- Enlace de router para la página de inicio -->
            <img src="@/assets/icons/giphy.gif" alt="rick-portal">
            <!-- Imagen con enlace, representando el portal de Rick -->
        </router-link>
    </div>
</template>

<style>
/* Estilos para la sección de inicio */
.Inicio {
    height: 75vh; /* Altura del 75% del tamaño de la ventana gráfica */
    margin-top: 2.5rem; /* Margen superior de 2.5 rem */
    margin-bottom: 2.5rem; /* Margen inferior de 2.5 rem */
    display: flex; /* Utiliza el modelo de caja flexible */
    flex-direction: column; /* Los elementos dentro del contenedor se colocan en columna */
    align-items: center; /* Centra los elementos horizontalmente */
    color: #0BFF00; /* Color del texto */
    font-family: 'Nanum Brush Script', cursive; /* Fuente del texto */
    font-size: 1.5rem; /* Tamaño del texto */
}

/* Estilos para los encabezados h3 dentro de la sección de inicio */
.Inicio h3 {
    word-wrap: break-word; /* Permite el salto de línea dentro de palabras largas */
    max-width: 50rem; /* Ancho máximo del texto */
}

/* Estilos para las imágenes dentro de la sección de inicio */
.Inicio img {
    max-width: 30rem; /* Ancho máximo de la imagen */
    height: auto; /* Altura automática para mantener la proporción */
}

/* Estilos específicos para pantallas con un ancho máximo de 768px */
@media screen and (max-width: 768px) {
    .Inicio {
        height: 40rem; /* Altura reducida para pantallas más pequeñas */
        margin-top: 6rem; /* Margen superior aumentado */
        margin-bottom: 4rem; /* Margen inferior aumentado */
        text-align: center; /* Alinea el texto al centro */
    }

    /* Estilos para los encabezados h2 dentro de la sección de inicio en pantallas pequeñas */
    .Inicio h2 {
        font-size: 2rem; /* Tamaño del texto aumentado */
    }

    /* Estilos para los encabezados h3 dentro de la sección de inicio en pantallas pequeñas */
    .Inicio h3 {
        font-size: 1.5rem; /* Tamaño del texto aumentado */
        max-width: 80%; /* Ancho máximo del texto aumentado */
    }

    /* Estilos para las imágenes dentro de la sección de inicio en pantallas pequeñas */
    .Inicio img {
        max-width: 70%; /* Ancho máximo de la imagen aumentado */
        height: auto; /* Altura automática para mantener la proporción */
    }
}
</style>
