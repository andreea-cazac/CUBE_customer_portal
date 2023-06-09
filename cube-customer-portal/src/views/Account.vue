<template>
  <Navigation/>
  <div class="account ma-5">
    <router-view></router-view>

  </div>
</template>

<script>

import {computed, ref, watch} from 'vue';
import Navigation from '../components/Navigation.vue';
import {useActiveRelationStore} from "@/stores/activeRelation";

export default {
  components: {Navigation}
}
</script>

<style>

</style>
