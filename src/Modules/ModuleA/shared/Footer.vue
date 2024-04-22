<template>
    <div  class="Footer">
        <img src="@/assets/icons/instagram 1.png" alt="instagram">
        <img src="@/assets/icons/gorjeo 1.png" alt="x">
        <img src="@/assets/icons/facebook 1.png" alt="facebook">
        <img src="@/assets/icons/discordia 1.png" alt="discord">
    </div>

</template>
<style>
.Footer{
    background-color: #8DB986;
    padding: 1rem;
    display: flex;
    align-items: center;

}
.Footer img{
    max-width: 3rem;
    max-height: 3rem;
    margin-right: 1rem; 
}
@media (max-width:768px){
    .Footer{
        padding: 0.5rem;
    }
    .Footer img{
        max-width: 3rem;
        max-height: 3rem;
    }
}
</style>