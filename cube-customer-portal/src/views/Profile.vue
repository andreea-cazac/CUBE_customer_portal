<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="6">
          <v-card class="pa-2">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="headline">{{ profile.organization }}</v-list-item-title>
                <v-list-item-subtitle>{{ profile.phoneNumber }}</v-list-item-subtitle>
                <v-list-item-subtitle>
                  <a :href="'http://' + profile.website">{{ profile.website }}</a>
                </v-list-item-subtitle>
                <v-list-item-subtitle>{{ profile.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card height="100%">
            <!-- google maps plugin -->
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        profile: {}
      };
    },
    components: {
        // google maps plugin 
    },
    created() {
      axios.get('https://api.example.com/profile')
        .then(response => {
          this.profile = response.data;
        });
    }
  };
  </script>
  
  <style scoped>
  .v-list-item-title,
  .v-list-item-subtitle {
    font-family: Arial, sans-serif;
    color: #000061;
  }
  </style>
  