<template>
  <v-container fluid fill-height class="d-flex flex-column justify-center align-center">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card color="red lighten-5" class="pa-6" outlined>
          <v-card-title class="text-h4">Oopps!</v-card-title>
          <v-card-text class="text-body-1">
            Sorry, seems like you have to login firstly!
            Please go to the
            <router-link to="/login">login page</router-link>
            and try to login.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Unauthorized",
}
</script>
