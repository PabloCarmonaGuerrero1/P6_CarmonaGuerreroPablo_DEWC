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
    <!-- Componente para la página 404 -->
    <div class="NotFound" :class="{ 'light-mode-notfound': isLightMode }">
        <!-- Título 404 -->
        <h2>404</h2>
        <!-- Mensaje de error -->
        <h3>Oops Something Wrong Happens</h3>
        <!-- Enlace para volver a la página de inicio -->
        <router-link to="/HomePage">
            <!-- Imagen animada -->
            <img src="@/assets/icons/giphy.gif" alt="rick-portal">
        </router-link>
    </div>
</template>

<style>
/* Estilos para la página de error 404 */
.NotFound{
    height: 75vh; /* Altura del 75% del tamaño de la ventana gráfica */
    margin-top: 2.5rem; /* Margen superior de 2.5 rem */
    margin-bottom: 2.5rem; /* Margen inferior de 2.5 rem */
    display: flex; /* Utiliza el modelo de caja flexible */
    flex-direction: column; /* Los elementos dentro del contenedor se colocan en columna */
    align-items: center; /* Centra los elementos horizontalmente */
    color: #0BFF00; /* Color del texto en verde */
    font-family: 'Nanum Brush Script', cursive; /* Fuente del texto */
}

/* Estilos para las imágenes dentro de la página de error 404 */
.NotFound img{
    max-width: 30rem; /* Ancho máximo de la imagen de 30 rem */
    height: auto; /* Altura automática para mantener la proporción */
}

/* Estilos para el encabezado h2 dentro de la página de error 404 */
.NotFound h2{
    margin: 0; /* Elimina el margen */
    font-size: 5rem; /* Tamaño de fuente de 5 rem */
}

/* Estilos para el encabezado h3 dentro de la página de error 404 */
.NotFound h3{
    font-size: 2rem; /* Tamaño de fuente de 2 rem */
}

/* Estilos específicos para el modo de luz en la página de error 404 */
.light-mode-notfound{
    -webkit-text-stroke: 1px black; /* Añade un contorno de 1 píxel de grosor en negro al texto */
}

/* Estilos específicos para pantallas con un ancho máximo de 768px */
@media screen and (max-width: 768px) {
    .NotFound {
        height: 29rem; /* Altura reducida para pantallas más pequeñas */
        margin-top: 6rem; /* Margen superior aumentado */
        margin-bottom: 4rem; /* Margen inferior aumentado */
        text-align: center; /* Alinea el texto al centro */
    }

    .NotFound h2 {
        font-size: 2rem; /* Tamaño de fuente del encabezado h2 de 2 rem */
    }

    .NotFound h3 {
        font-size: 1.5rem; /* Tamaño de fuente del encabezado h3 de 1.5 rem */
        max-width: 80%; /* Ancho máximo del texto reducido */
    }

    .NotFound img {
        max-width: 70%; /* Ancho máximo de la imagen de 70% */
        height: auto; /* Altura automática para mantener la proporción */
    }
}
</style>