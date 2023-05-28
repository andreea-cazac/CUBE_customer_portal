<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="6">
          <v-card class="pa-2">
            <v-card-item>
                <v-card-title>Organization Information</v-card-title>
                <v-card-subtitle></v-card-subtitle>
                <v-card-text>
                    Phone Number
                    <br>
                    08-1234-5678
                </v-card-text>
                <v-card-text>
                    Website
                    <br>
                    <a href="exampl.com">example.com</a>
                </v-card-text>
                <v-card-text>
                    E-mail
                    <br>
                    example@gmail.com
                </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card height="100%">
            Google Maps Plugin
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
  
  <style>
    .v-list-item-subtitle {
      border-top: 1em;
    }
  </style>
  