<template>
    <div class="NotFound">
        <h2>404</h2>
        <h3>Oops Something Wrong Happens</h3>
        <router-link to="/HomePage">
            <img src="@/assets/icons/giphy.gif" alt="Portal Image">
        </router-link>
    </div>

</template>
<style>
.NotFound{
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 75vh;
    color: #0BFF00;
    font-family: 'Nanum Brush Script', cursive;
}
.NotFound img{
    max-width: 30rem; 
    max-height: auto;
}
.NotFound h2{
    font-size: 5rem;
    margin: 0;

}
.NotFound h3{
    font-size: 2rem;

}
</style>