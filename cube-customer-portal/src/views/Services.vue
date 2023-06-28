<template>
  <div className="services">
    <h3>Services, no way</h3>
    <br>
    <h3><b><u>Token in LocalStorage:</u> </b> {{ tok }}</h3>
    <h3> <b><u> Active Relation in LocalStorage:</u> </b> {{ ar }}</h3>
    <h3><b> <u> Relations in LocalStorage:</u></b> {{ newrel }}</h3>
    <br>
    <div>
      <h2>Active Relation: {{ selectedRelation.name }}</h2>
      <br>
      <!--      <h2>tok : {{tok}}</h2>-->

      <br>
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
import {useActiveRelationStore} from "@/stores/activeRelationStore";
import {computed, ref} from "vue";

export default {
  setup() {

    const activeRelationStore = useActiveRelationStore();
    const userStore = useUserStore();


    const activeRelationStoreRef = ref(activeRelationStore);
    const userStoreRef = ref(userStore);


    const selectedRelation = computed(() => activeRelationStoreRef.value.getActiveRelation);
    const token = computed(() => userStoreRef.value.getToken)


    let tok = localStorage.getItem("token")
    let ar = localStorage.getItem("activeRelation")

    let newrel = localStorage.getItem("userRelations")

    return {
      selectedRelation,
      token,
      tok,
      ar,
      newrel
    }

  }
}
</script>
