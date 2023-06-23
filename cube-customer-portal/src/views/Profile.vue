<template>
  <v-container fluid>
    <!-- header -->
    <v-row class="mb-5 pa-5" :style="{ color: primary_color }">
      <v-col>
        <h1>{{$t('profile')}}</h1>
      </v-col>
      <v-col>
        <h5 class="float-right">{{$t('my_tenant')}} / {{$t('profile')}}</h5>
      </v-col>
    </v-row>

    <v-row>
      <!-- contact info -->
      <v-col cols="12" sm="6">
        <v-card class="pa-2">
          <v-card-item>
            <v-card-title :style="{ color: primary_color }" class="mb-5">{{$t('organization_information')}}</v-card-title>
            <v-card-text v-for="detail in profile.contact_details" :key="detail.id">
              <strong :style="{ color: primary_color }">{{$t(detail.label)}}</strong>
              <br>
              <a v-if="detail.type === 'website'" :href="`https://${detail.value}`">{{ detail.value }}</a>
              <span v-else>{{ detail.value }}</span>
            </v-card-text>
          </v-card-item>
        </v-card>
      </v-col>


      <!-- google maps -->
      <v-col cols="12" sm="6">
        <v-row>
          <v-card class="mb-5 w-100" v-for="address in profile.addresses" :key="address.id">
            <v-card-title>
              {{ address.street }} {{ address.number }}
              <br>
              {{ address.zipcode }}, {{ address.city }}, {{ $t(address.country.name) }}
            </v-card-title>
            <iframe v-if="address.geoLocation" :src="`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${address.geoLocation.lat},${address.geoLocation.lng}`" width="100%" height="500" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import axios from 'axios';
import {useTenantStore} from "@/stores/tenant";


import {useUserStore} from "@/stores/userStore";
import {useActiveRelationStore} from "@/stores/activeRelation";
import {computed, ref, onMounted} from "vue";

export default {
  setup() {
    const activeRelationStore = useActiveRelationStore();
    const activeRelationStoreRef = ref(activeRelationStore);

    const activeRelation = computed(() => activeRelationStoreRef.value.getActiveRelation);
    const relationId = computed(() => activeRelation.value.id);
    const profile = ref({});
    const apiKey = 'AIzaSyCb-VXv9duPI7zRwSm_nu-_KUbHUrnV23A';

    const tenantStore = useTenantStore();

    const accent_color = tenantStore.tenant.settings.accent_color;
    const primary_color = tenantStore.tenant.settings.primary_color;


    onMounted(async () => {
      try {
        const responseRelations = await axios.get(`https://cube-testing.solidpartners.nl/cp/relations/${relationId.value}`, {
          headers: {
            'Authorization': 'Bearer ' + useUserStore().token,
            'Access-Control-Allow-Origin':  'http://localhost:5173'
          }
        });
        profile.value = responseRelations.data;
        console.log(responseRelations);
        for (const address of profile.value.addresses) {
          const formattedAddress = `${address.street} ${address.number}, ${address.city}, ${address.country.name}`;
          const location = await getGeoInfo(formattedAddress);
          if (location) {
            // Here we add the geolocation information to the address object
            address.geoLocation = location;
          }
        }
      } catch (error) {
        console.error('Error occurred: ', error);
      }
    });

    const getGeoInfo = async (address) => {
      try {
        const responseGoogleApi = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
        );
        if (responseGoogleApi.data.results[0]) {
          const location = responseGoogleApi.data.results[0].geometry.location;
          return location;
        } else {
          console.log('No results for this address: ', address);
        }
      } catch (error) {
        console.error('Error occurred getting geolocation for the address: ', address, error);
      }
      // We add a delay to avoid the OVER_QUERY_LIMIT error
      await new Promise(resolve => setTimeout(resolve, 50));
    };
    return {
      relationId,
      profile,
      getGeoInfo,
      apiKey,
      accent_color,
      primary_color
    }
  },
};

</script>

  <style>

    .text-color{
        color: #0061ba;
    }

  </style>

