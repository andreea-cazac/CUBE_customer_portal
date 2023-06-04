<template>
  <v-container fluid>
    <!-- header -->
    <v-row class="mb-5 pa-5 text-color">
      <v-col>
        <h1>Profile</h1>
      </v-col>
      <v-col>
        <h5 class="float-right">Mijn Tenant / Profile</h5>
      </v-col>
    </v-row>

    <v-row>
      <!-- contact info -->
      <v-col cols="12" sm="6">
        <v-card class="pa-2">
          <v-card-item>
            <v-card-title class="text-color mb-5">Organization Information</v-card-title>
            <v-card-text v-for="detail in profile.contact_details" :key="detail.id">
              <strong class="text-color">{{ detail.label }}</strong>
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
              {{ address.zipcode }}, {{ address.city }}, {{ address.country.name }}
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



export default {
  data() {
    return {
      profile: {},
      apiKey: '',
    };
  },
  async created() {
    try {
      const response = await axios.get('https://apim-solidpartners-p.azure-api.net/cp-cube-mock/cp/relations/1');
      this.profile = response.data;
      for (const address of this.profile.addresses) {
        const formattedAddress = `${address.street} ${address.number}, ${address.city}, ${address.country.name}`;
        const location = await this.getGeoInfo(formattedAddress);
        if (location) {
          // Here we add the geolocation information to the address object
          address.geoLocation = location;
        }
      }
    } catch (error) {
      console.error('Error occurred: ', error);
    }
  },
  methods: {
    async getGeoInfo(address) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${this.apiKey}`
        );
        if (response.data.results[0]) {
          const location = response.data.results[0].geometry.location;
          return location;
        } else {
          console.log('No results for this address');
        }
      } catch (error) {
        console.error('Error occurred: ', error);
      }
    },
  },
};
</script>
  
  <style>

    .text-color{
        color: #0061ba;
    }

  </style>
  