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
            <span class="d-none d-sm-flex ma-3">Active Relation BV</span>
            <v-icon class="ma-1">mdi-account-switch-outline</v-icon>
          </v-btn>
        </template>
        <v-list-item v-for="item in items" :key="item.index" :href='item.route' >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
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


      <v-list>
        <v-list-item
            v-for="link in links"
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

export default {
  data() {
    return {
      drawer: false,
      links: [
        { icon: "mdi-view-dashboard", text: "Dashboard", route: "/account" },
        { icon: "mdi-account", text: "Profile", route: "/account/profile" },
        { icon: "mdi-clipboard-text", text: "Tickets", route: "/account/tickets" },
        { icon: "mdi-receipt-text-clock", text: "Invoices", route: "/account/invoices" },
        { icon: "mdi-toolbox-outline", text: "Services", route: "/account/services" },
        { icon: "mdi-account-group", text: "Team", route: "/account/teams" }
      ],
      languages: [
        {title: 'English', route: 'https://translate.google.com/'},
        {title: 'Nederlands', route: 'https://translate.google.com/'},
      ],
      items: [
        {title: 'Saxion', route: 'https://mijn.saxion.nl/'},
        {title: 'Solid Partners', route: 'https://mijn-t.solidpartners.nl/'}
      ]
    };
  },
};

</script>

<style scoped>

</style>
