<template>
    <v-container fluid>
        <v-row class="mb-5 pa-5">
            <v-col>
                <h1>Profile</h1>
            </v-col>
            <v-col>
                <h5 class="float-right">Mijn Tenant / Profile</h5>
            </v-col>
        </v-row>
        <v-row>
        <v-col cols="12" sm="6">
          <v-card class="pa-2">
            <v-card-item>
                <v-card-title class="text-color mb-5">Organization Information</v-card-title>
                
                <v-card-text>
                    <strong class="text-color">Phone Number</strong>
                    <br>
                    08-1234-5678
                </v-card-text>
                <v-card-text>
                    <strong class="text-color">Website</strong>
                    <br>
                    <a href="exampl.com">example.com</a>
                </v-card-text>
                <v-card-text>
                    <strong class="text-color">E-mail</strong>
                    <br>
                    example@gmail.com
                </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card class="mb-5">
            <v-card-title>
                Hogeschool Saxion
                <br> 
                Handelskade 75, 7417 DH Deventer, Netherlands
            </v-card-title>
            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d9769.673810876622!2d6.1681328!3d52.2539459!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c7ea44b80520ed%3A0x5afb1403968e3695!2sHogeschool%20Saxion!5e0!3m2!1sen!2snl!4v1685276822306!5m2!1sen!2snl" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </v-card>
          <v-card class="mb-5">
            <v-card-title>
                Solid Partners B.V.
                <br> 
                Maagdenburgstraat 10, 7421 ZB Deventer, Netherlands
            </v-card-title>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.246572270293!2d6.212076178362184!3d52.238904871989014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c7eaf887c8aa05%3A0xc1e6c2f9641ef5!2sSolid%20Partners%20B.V.!5e0!3m2!1sen!2snl!4v1685276967390!5m2!1sen!2snl" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </v-card>
          <v-card>
            <v-card-title>
                Deventer
                <br> 
                Stationsplein 7, 7411 HB Devente, Netherlands
            </v-card-title>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2442.271092068718!2d6.15917627836263!3d52.25662207199328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c7ea4277826887%3A0x5fd443bc63b56998!2sDeventer!5e0!3m2!1sen!2snl!4v1685277009491!5m2!1sen!2snl" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
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

    .text-color{
        color: #0061ba;
    }

  </style>
  