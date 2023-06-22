<template>
    <nav>
        <v-navigation-drawer v-model="drawer" color="white">
            <v-row no-gutters>
                <v-col class="mt-6 text-center">
                    <v-img cover src="https://mijn.solidpartners.nl/upload/site/118-0083%20Solid%20Partners%202021%20Logo%20RGB%20Color%20Blue%202x.png" alt=""></v-img>
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
                        <v-list-item-title class="solid-blue">{{ $t(link.textKey) }}</v-list-item-title>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar class="b-solid-blue">
            <v-app-bar-nav-icon class="b-solid-blue text-white" @click="drawer = !drawer">
            </v-app-bar-nav-icon>

            <v-toolbar-title class="b-solid-blue text-white">
                <span class="font-weight-light">{{ $t('welcomeMessage') }}</span>
            </v-toolbar-title>



            <v-menu location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn variant="flat" class="b-solid-blue text-white" size="small" v-bind="props" >
                        <span v-if="activeRelation" class="d-none d-sm-flex ma-3">{{ activeRelation.name }}</span>
                        <v-icon class="ma-1">mdi-account-switch-outline</v-icon>
                    </v-btn>
                </template>
                <v-list-item class="bg-white border" v-for="(item, index) in relations" :key="index" @click="selectRelation(item)" >
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
            </v-menu>


            <v-menu location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn variant="flat" class="b-solid-blue text-white" size="small" v-bind="props" >
                        <span class=" d-none d-sm-flex ma-3">{{ $t('active_language') }} </span>
                        <v-icon class="ma-1">mdi-translate</v-icon>
                    </v-btn>
                </template>
                <v-list-item class="bg-white border" v-for="language in languages" :key="language.code" @click="changeLanguage(language.code)">
                    <v-list-item-title>{{ language.title }}</v-list-item-title>
                </v-list-item>

            </v-menu>


            <v-btn class="logoutButton" color="b-solid-blue text-white" :key="logout" router :to="loginRoute">
                <span class="d-none d-sm-flex"  @click="logout()" >{{ $t('signOut') }}</span>
                <v-icon>mdi-exit-to-app</v-icon>
            </v-btn>
        </v-toolbar>
    </nav>
</template>

<script>

import {useActiveRelationStore} from '@/stores/activeRelation.js';
import {computed, ref} from "vue";
import {useUserRelationsStore} from "@/stores/userRelationsStore";
import {useUserStore} from "@/stores/userStore";


export default {
    setup() {
        // relations for the dropdown
      const relationsStore = useUserRelationsStore();
      const relationStoreRef = ref(relationsStore);
      const relations = computed(() => relationStoreRef.value.getUserRelations);

      const userStore = useUserStore();

      const activeRelationStore = useActiveRelationStore();
      const activeRelationStoreRef = ref(activeRelationStore);
      const activeRelation = computed(() => activeRelationStoreRef.value.getActiveRelation); // always up to date

      const selectRelation = (relation) => {
        activeRelationStoreRef.value.setActiveRelation(relation);
        window.location.reload();
      };

      const logout = () => {
        activeRelationStore.removeActiveRelation();
        relationsStore.removeUserRelations();
        userStore.removeToken();
      };

        const pages = [
            { icon: "mdi-view-dashboard", textKey: "dashboard", route: "/account/dashboard"},
            { icon: "mdi-account", textKey: "profile", route: "/account/profile" },
            { icon: "mdi-clipboard-text", textKey: "tickets", route: "/account/tickets", permission:"customer:ticket:show" },
            { icon: "mdi-receipt", textKey: "invoices", route: "/account/invoices", permission:"customer:invoice:show"},
            { icon: "mdi-toolbox-outline", textKey: "services", route: "/account/services", permission:"customer:service:show"},
            { icon: "mdi-account-group", textKey: "team", route: "/account/teams", permission:"customer:team:show"}
        ];

        const loginRoute = "/login";

      const permittedPages = computed(() => {
        let activePermissions = "";
        if (activeRelation.value && activeRelation.value.permissions) {
          activePermissions = activeRelation.value.permissions;
        }
        return pages.filter((page) => activePermissions.includes(page.permission) || !page.permission);
      });

        return {
            relations,
            activeRelation,
            selectRelation,
            permittedPages,
          logout,
          loginRoute
        }
    },
    data() {
        return {
            drawer: true,
            languages: [
                {title: 'English', code: 'en'},
                {title: 'Nederlands', code: 'nl'},
            ]
        };
    },
    methods: {
        changeLanguage(lang) {
            this.$i18n.locale = lang;
        }
    }

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
