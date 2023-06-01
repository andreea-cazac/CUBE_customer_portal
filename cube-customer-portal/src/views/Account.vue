<template>
  <Navigation/>
  <div class="account ma-5">

<!--    <ul>-->
<!--      <router-link style="text-decoration: none" :to="{name: 'tickets'}"><v-btn class="ma-3">Tickets</v-btn></router-link>-->
<!--      <router-link style="text-decoration: none" :to="{name: 'invoices'}"><v-btn>Invoices</v-btn></router-link>-->
<!--      <router-link style="text-decoration: none" :to="{name: 'services'}"><v-btn class="ma-3">Services</v-btn></router-link>-->
<!--      <router-link style="text-decoration: none" :to="{name: 'teams'}"><v-btn>Teams</v-btn></router-link>-->
<!--    </ul>-->

      <!-- Displaying relations here -->
      <div>
          <v-btn v-for="(relation, index) in relations" :key="index" @click="selectRelation(relation)">
              {{ relation.name }}
          </v-btn>

<div v-if="selectedRelation">
              <h2>Selected Relation: {{selectedRelation.name }}</h2>
              <h3>Permissions:</h3>
          <ul>
              <li v-for="(permission, index) in selectedRelation.permissions" :key="index">
                  {{ permission }}
              </li>
          </ul>
      </div>
      </div>
  </div>
</template>

<script>
import {useRelationsStore} from '../stores/relations.js';
import {ref, watch} from 'vue';
export default {
    setup(){
        const relationsStore = useRelationsStore();
        const relations = relationsStore.getRelations;
        let selectedRelation = ref(null);

        watch(relations, (newRelations) => {
            // check if newRelations array is not empty before assigning
            if (newRelations.length > 0) {
                selectedRelation.value = newRelations[0];
            }
        }, { immediate: true });  // { immediate: true } ensures the watcher runs immediately after setup

        const selectRelation = (relation) => {
            selectedRelation.value = relation;
        }


        return {
            relations,
            selectedRelation,
            selectRelation
        }
    }
}
</script>

<style>

</style>