<template>
    <div class="Inicio">
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
.Inicio {
    height: 75vh;
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #0BFF00;
    font-family: 'Nanum Brush Script', cursive;
    font-size: 1.5rem;
}

.Inicio h3 {
    word-wrap: break-word;  
    max-width: 50rem;
}

.Inicio img {
    max-width: 30rem;
    max-height: auto;
}

@media screen and (max-width: 768px) {
    .Inicio {
        height: 40rem;  
        margin-top: 6rem;
        margin-bottom: 4rem;
        text-align: center;
    }

    .Inicio h2 {
        font-size: 2rem;
    }

    .Inicio h3 {
        font-size: 1.5rem;
        max-width: 80%;  
    }

    .Inicio img {
        max-width: 70%;
        height: auto;
    }
}
</style>
