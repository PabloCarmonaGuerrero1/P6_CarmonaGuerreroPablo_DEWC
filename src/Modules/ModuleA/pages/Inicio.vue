<template>
    <div class="Inicio">
        <h2>Welcome to RickReditt!</h2>
        <h3>Press the portal to start</h3>
        <router-link to="/HomePage">
            <img src="@/assets/icons/giphy.gif" alt="rick-portal">
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
    }

    .Inicio img {
        max-width: 70%;
        height: auto;
    }
}
</style>