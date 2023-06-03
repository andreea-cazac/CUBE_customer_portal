<template>
  <div class="services">
    <h3>Services, no way</h3>
    <h3>TOKEN: {{token}}</h3>
    <br>
    <div>
      <h2>Active Relation: {{selectedRelation.name }}</h2>
      <h3>Permissions:</h3>
      <ul>
        <li v-for="(permission, index) in selectedRelation.permissions" :key="index">
          {{ permission }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {useUserStore} from "@/stores/userStore";
import {useActiveRelationStore} from "@/stores/activeRelation";
import {computed, ref} from "vue";

export default{
  setup(){

    const activeRelationStore = useActiveRelationStore();
    const userStore = useUserStore();


    const activeRelationStoreRef = ref(activeRelationStore);
    const userStoreRef = ref(userStore);

    const selectedRelation = computed(() => activeRelationStoreRef.value.getActiveRelation);
    const token = computed(() => userStoreRef.value.getToken)

    return {
      selectedRelation,
      token
    }

  }
}
</script>
