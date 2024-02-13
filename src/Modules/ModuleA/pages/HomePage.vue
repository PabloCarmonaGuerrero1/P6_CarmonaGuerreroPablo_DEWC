<template>
    <div class="Comentarios">
    <article class="Mensaje">
        <div class="image-container">
            <img src="@/assets/icons/perfil.png" alt="User icon" class="user-icon">
        </div>
        <div class="content-container">
            <header class="post-header">
                <p class="username">Jun</p>
                <p class="date">12/11/2023</p>
            </header>
            <p class="post-content">Wow! The last episode was amazing, nice <span>#NewEpisode</span>.</p>
        </div>
    </article>
    <article class="Mensaje">
        <div class="image-container">
            <img src="@/assets/icons/perfil.png" alt="User icon" class="user-icon">
        </div>
        <div class="content-container">
            <header class="post-header">
                <p class="username">Jun</p>
                <p class="date">12/11/2023</p>
            </header>
            <p class="post-content">Wow! The last episode was amazing, nice <span>#NewEpisode</span>.</p>
        </div>
    </article>
    <article class="Mensaje">
        <div class="image-container">
            <img src="@/assets/icons/perfil.png" alt="User icon" class="user-icon">
        </div>
        <div class="content-container">
            <header class="post-header">
                <p class="username">Jun</p>
                <p class="date">12/11/2023</p>
            </header>
            <p class="post-content">Wow! The last episode was amazing, nice <span>#NewEpisode</span>.</p>
        </div>
    </article>
</div>
</template>

<style>
.Comentarios{
    min-height: 48.5rem;
    margin-left: 9.4375rem;
    margin-top: 3rem;
}
.Mensaje{
    width: 60rem;
    margin-bottom: 3rem;
    padding: 1rem;
    border-radius: 1.875rem;
    display: flex;
    background-color: #2E3244;
    color: white;
    font-family: 'Mogra', sans-serif;
    font-size: 1rem;
}
.image-container {
    display: flex;
    align-items: center;
    justify-content: center;
}
.user-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
}
.content-container {
    flex-grow: 1;
}
.post-header {
    margin: 0;
    display: flex;
    align-items: center;
}
.username {
    margin-top: 0rem;
    margin-bottom: 0rem;
    margin-left: 6rem;
    font-size: 1.25rem;
}
.date{
    margin-top: 0rem;
    margin-bottom: 0rem;
    margin-left: 3rem;
    font-size: 1.25rem;
}
.post-content span {
    color: #0BFF00;
}
.post-content{
    margin-left: 1rem;
    margin-top: 0;
}
</style>
