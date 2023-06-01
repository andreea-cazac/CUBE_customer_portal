<template>
  <Navigation/>
  <div class="account ma-5">
    <router-view></router-view>
  </div>
</template>

<script>
import Navigation from '/components/Navigation.vue'

export default{
  name: 'App',
  components: {
    Navigation
  }
}
</script>

<style>

</style>
