<template>
    <div class="NavBar">
        <router-link to ="/Contact"><img src="@/assets/icons/telefono.png"></router-link> 
        <router-link to ="/"><h1>Rick & Morty</h1></router-link>
        <router-link to ="/Login"><img src="@/assets/icons/perfil.png"> </router-link>
        
    </div>
</template>
<style>
.NavBar{
    background-color: #2CD824;
    height: 5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
}
.NavBar img{
    max-width: 3rem;
    max-height: 3rem;
}
.NavBar h1{
    font-family: 'Monofett', sans-serif;
    font-size: 3rem; 
    color: black;

}
.NavBar a{
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
</style>