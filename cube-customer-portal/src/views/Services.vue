<template>
    <div class="services">
        <h3>{{$t('services_no_way')}}</h3>
        <h3>{{$t('token')}}: {{token}}</h3>
        <br>
        <div>
            <h2>{{$t('active_relation')}}: {{selectedRelation.name }}</h2>
            <h3>{{$t('permissions')}}:</h3>
            <ul>
                <li v-for="(permission, index) in selectedRelation.permissions" :key="index">
                    {{$t(permission)}}
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
