<template>
  <div class="account ma-5">
    <h1>Dashboard. Welcome.</h1>

    <ul>
      <router-link style="text-decoration: none" :to="{name: 'tickets'}"><v-btn class="ma-3">Tickets</v-btn></router-link>
      <router-link style="text-decoration: none" :to="{name: 'invoices'}"><v-btn>Invoices</v-btn></router-link>
      <router-link style="text-decoration: none" :to="{name: 'services'}"><v-btn class="ma-3">Services</v-btn></router-link>
      <router-link style="text-decoration: none" :to="{name: 'teams'}"><v-btn>Teams</v-btn></router-link>
    </ul>

    <router-view></router-view>
  </div>
</template>

<script>
export default{
}
</script>

<style>

</style>