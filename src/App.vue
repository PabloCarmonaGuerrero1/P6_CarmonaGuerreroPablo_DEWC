<script >
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    Navbar: defineAsyncComponent(() => import('./Modules/ModuleA/shared/NavBar.vue')),
  },
}
</script>

<template>
  <Navbar/>
  <router-view/>
</template>

<style>

</style>
