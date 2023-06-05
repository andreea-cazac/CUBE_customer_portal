<template>
  <nav>
    <v-navigation-drawer v-model="drawer" color="white">
      <v-row no-gutters>
        <v-col class="mt-6 text-center">
          <v-img cover src="https://mijn.solidpartners.nl/upload/site/118-0083%20Solid%20Partners%202021%20Logo%20RGB%20Color%20Blue%202x.png" alt=""></v-img>
<!--          <p class="text-white ma-10 center text-h5 ">Solid partners</p>-->
        </v-col>
      </v-row>


      <v-list v-if="permittedPages" color="#000161">
        <v-list-item
            v-for="link in permittedPages"
            :key="link.text"
            router
            :to="link.route"
        >
          <v-list-item-action class="active">

            <v-icon class="solid-blue mx-3">{{ link.icon }}</v-icon>
            <v-list-item-title class="solid-blue">{{ link.text }}</v-list-item-title>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar class="b-solid-blue">
      <v-app-bar-nav-icon class="b-solid-blue text-white" @click="drawer = !drawer">
      </v-app-bar-nav-icon>

      <v-toolbar-title class="b-solid-blue text-white">
        <span class="font-weight-light">Welcome, </span>
        <span>Client Name!</span>
      </v-toolbar-title>


      <v-menu location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn variant="flat" class="b-solid-blue text-white" size="small" v-bind="props" >
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
          <v-btn variant="flat" class="b-solid-blue text-white" size="small" v-bind="props" >
            <span class="d-none d-sm-flex ma-3"> Active Language </span>
            <v-icon class="ma-1">mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list-item v-for="language in languages" :key="language.index" :href='language.route' >
          <v-list-item-title>{{ language.title }}</v-list-item-title>
        </v-list-item>
      </v-menu>


      <v-btn color="b-solid-blue text-white">
        <span class="d-none d-sm-flex">Sign Out</span>
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-toolbar>
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
.solid-blue{
  color: #000161;
}
.b-solid-blue{
  background: #000161;
}

</style>
