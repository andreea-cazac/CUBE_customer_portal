<template>
  <Navigation/>
  <div class="account ma-5">
    <router-view></router-view>

  </div>
</template>

<script>
import Navigation from '/src/components/Navigation.vue'

import {useRelationsStore} from '../stores/relations.js';
import {computed, ref, watch} from 'vue';
import Navigation from '../components/Navigation.vue';
import {useActiveRelationStore} from "@/stores/activeRelation";
export default {
  components: {Navigation},
  setup(){
        const relationsStore = useRelationsStore();
        const activeRelationStore = useActiveRelationStore();

        const activeRelationStoreRef = ref(activeRelationStore);
        const relations = relationsStore.getRelations;
        const selectedRelation = computed(() => activeRelationStoreRef.value.getActiveRelation);


        watch(relations, (newRelations) => {

          // check if newRelations array is not empty before assigning
            if (newRelations && newRelations.length > 0) {
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
