<template>
    <!-- Componente para la página 404 -->
    <div class="NotFound">
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
.NotFound{
    height: 75vh;
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #0BFF00;
    font-family: 'Nanum Brush Script', cursive;
}
.NotFound img{
    max-width: 30rem; 
    max-height: auto;
}
.NotFound h2{
    margin: 0;
    font-size: 5rem;
}
.NotFound h3{
    font-size: 2rem;
}
</style>