<template>
    <div class="NavBar">
        <router-link to ="/Contact"><img src="@/assets/icons/telefono.png" alt="contact-page"></router-link> 
        <router-link to ="/"><h1>Rick & Morty</h1></router-link>
        <router-link to ="/Login"><img src="@/assets/icons/perfil.png" alt="login-user"> </router-link>
        
    </div>
</template>
<style>
.NavBar {
    height: 5rem;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2CD824;
}

.NavBar img {
    max-width: 3rem;
    max-height: 3rem;
}

.NavBar h1 {
    color: black;
    font-family: 'Monofett', sans-serif;
    font-size: 3rem;
}

.NavBar a {
    text-decoration: none;
}

@font-face {
    font-family: "Monofett";
    src: url("@/Modules/ModuleA/fonts/Monofett/Monofett-Regular.ttf") format("truetype");
}

@font-face {
    font-family: 'Nanum Brush Script';
    src: url("@/Modules/ModuleA/fonts/LR/NanumBrushScript-Regular.ttf") format('truetype');
}

@font-face {
    font-family: 'Mogra';
    src: url("@/Modules/ModuleA/fonts/Mogra/Mogra-Regular.ttf") format('truetype');
}

@media screen and (max-width: 768px) {
    .NavBar {
        text-align: center;
    }

    .NavBar h1 {
        font-size: 2rem;
        margin-top: 1rem;
    }
    .NavBar img {
        max-width: 2rem;
        max-height: 2rem;
    }
}
</style>