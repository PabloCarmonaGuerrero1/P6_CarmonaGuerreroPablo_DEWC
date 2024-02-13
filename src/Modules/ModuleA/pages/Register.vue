<script >

</script>

<template>
    <form class="Register">
        <label>
            <p>Username</p>
            <input type="text">
        </label>
        <label>
            <p>Password</p>
            <input type="text">
        </label>
        <label>
            <p>Repeat Password</p>
            <input type="text">
        </label>
        <button>Register</button>
    </form>
</template>

<style>
.Register {
    margin-top: 0rem;
    margin-bottom: 5rem;
    min-height: 42rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.Register label{
    display: block;
    text-align: center;
}
.Register input{
    height: 4rem;
    width: 20rem;
    margin-top: 0;
    border-radius: 2.8125rem;
    text-align: center;
    font-family: 'Mogra', sans-serif;
    font-size: 1.5rem;
}
.Register p{
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    color: #0BFF00;
    font-family: 'Nanum Brush Script', cursive;
    font-size: 4rem; 
}
.Register  button{
    height: 3.5rem;
    width: 12rem;
    margin-top: 2rem;
    border-radius: 2.8125rem;
    background-color: #2CD824;
    color: black;
    font-family: 'Nanum Brush Script', cursive;
    font-size: 3rem;
}
</style>
