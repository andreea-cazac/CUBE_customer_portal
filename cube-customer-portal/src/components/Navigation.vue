<template>
  <nav>
    <v-toolbar>
      <v-app-bar-nav-icon class="text-grey-darken-4" @click="drawer = !drawer">
      </v-app-bar-nav-icon>

      <v-toolbar-title class="text-grey-darken-4">
        <span class="font-weight-light">Welcome, </span>
        <span>Client Name!</span>
      </v-toolbar-title>


      <v-menu location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn variant="flat" class="bg-grey-lighten-3 text-grey" size="small" v-bind="props" >
            <span v-if="activeRelation" class="d-none d-sm-flex ma-3">{{ activeRelation.name }}</span>
            <v-icon class="ma-1">mdi-account-switch-outline</v-icon>
          </v-btn>
        </template>
        <v-list-item v-for="(item, index) in relations" :key="index" @click="selectRelation(item)" >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-menu>


      <v-menu location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn variant="flat" class="bg-grey-lighten-3 text-grey" size="small" v-bind="props" >
            <span class="d-none d-sm-flex ma-3"> Active Language </span>
            <v-icon class="ma-1">mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list-item v-for="language in languages" :key="language.index" :href='language.route' >
          <v-list-item-title>{{ language.title }}</v-list-item-title>
        </v-list-item>
      </v-menu>


      <v-btn color="grey-darken-1">
        <span class="d-none d-sm-flex">Sign Out</span>
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" color="grey-lighten-1">
      <v-row no-gutters>
        <v-col class="mt-6 text-center">
          <p class="text-white ma-10 center text-h5 ">Company Name</p>
        </v-col>
      </v-row>


      <v-list v-if="permittedPages">
        <v-list-item
            v-for="link in permittedPages"
            :key="link.text"
            router
            :to="link.route"
        >
          <v-list-item-action>

            <v-icon class="text-white mx-3">{{ link.icon }}</v-icon>
            <v-list-item-title class="text-white">{{ link.text }}</v-list-item-title>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>

import {useRelationsStore} from '@/stores/relations.js';
import {useActiveRelationStore} from '@/stores/activeRelation.js';
import {computed, ref} from "vue";


export default {
  setup() {
    // relations for the dropdown
    const relationsStore = useRelationsStore();
    const relations = relationsStore.getRelations;

    const activeRelationStore = useActiveRelationStore();
    const activeRelationStoreRef = ref(activeRelationStore);
    const activeRelation = computed(() => activeRelationStoreRef.value.getActiveRelation); // always up to date

    const selectRelation = (relation) => {
      activeRelationStoreRef.value.setActiveRelation(relation);
    };


    const pages = [
      { icon: "mdi-view-dashboard", text: "Dashboard", route: "/account/dashboard"},
      { icon: "mdi-account", text: "Profile", route: "/account/profile" },
      { icon: "mdi-clipboard-text", text: "Tickets", route: "/account/tickets", permission:"show_tickets" },
      { icon: "mdi-receipt", text: "Invoices", route: "/account/invoices", permission:"show_invoices"},
      { icon: "mdi-toolbox-outline", text: "Services", route: "/account/services", permission:"show_services"},
      { icon: "mdi-account-group", text: "Team", route: "/account/teams", permission:"show_team"}
    ];
    const permittedPages = computed(() => {
      let activePermissions="";
      if(activeRelation.value.permissions){
        activePermissions = activeRelation.value.permissions;
      }
      return pages.filter((page) => activePermissions.includes(page.permission) || !page.permission);

    });

    return {
      relations,
      activeRelation,
      selectRelation,
      permittedPages
    }
  },
  data() {
    return {
      drawer: true,
      languages: [
        {title: 'English', route: 'https://translate.google.com/'},
        {title: 'Nederlands', route: 'https://translate.google.com/'},
      ]
    };
  },
};

</script>

<style scoped>

</style>
