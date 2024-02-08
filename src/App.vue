<script >
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    Navbar: defineAsyncComponent(() => import('./Modules/ModuleA/shared/NavBar.vue')),
    Footer: defineAsyncComponent(() => import('./Modules/ModuleA/shared/Footer.vue')),
  },
}
</script>

<template>
  <Navbar/>
  <router-view/>
  <Footer></Footer>
</template>

<style>

</style>
