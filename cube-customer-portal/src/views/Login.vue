<template>
    <v-app :style="{backgroundColor: primary_color}">
      <v-container class="d-flex align-center justify-center fill-height">
        <v-avatar class="circle" :style="getCircleStyle(200, { top: '-5%', left: '-5%' }, { fill: true, fillColor: accent_color})"></v-avatar>
        <v-avatar class="circle" :style="getCircleStyle(150, { bottom: '20%', right: '10%' }, { fill: true, fillColor: accent_color})"></v-avatar>
        <v-avatar class="circle" :style="getCircleStyle(300, { bottom: '10%', right: '60%' }, { fill: false, border: true, borderColor: accent_color})"></v-avatar>
        <v-avatar class="circle" :style="getCircleStyle(300, { bottom: '-5%', right: '-5%' }, { fill: false, border: true, borderColor: accent_color })"></v-avatar>
        <v-avatar class="circle" :style="getCircleStyle(100, { bottom: '70%', right: '40%' }, { fill: false, border: true, borderColor: accent_color })"></v-avatar>


        <v-card rounded="lg" >
          <v-img v-bind:src="logo" alt="logo"></v-img>
          <v-card-title class="text-center" :style="{color: primary_color}">Log in with one of the providers:</v-card-title>

                <v-card-actions class="justify-center">
                  <div>
                    <v-btn size="x-large" v-bind:color="primary_color" variant="outlined" icon="mdi-google" @click="loginGoogle">
                      <v-icon size="x-large" icon="mdi-google"></v-icon>
                    </v-btn>

                    <v-btn style="margin: 25px" size="x-large" v-bind:color="primary_color" variant="outlined" icon="mdi-microsoft-windows" @click="loginMicrosoft">
                      <v-icon size="x-large" icon="mdi-microsoft-windows"></v-icon>
                    </v-btn>
                  </div>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-app>
</template>

<script>
import {ref, inject, onMounted, computed} from 'vue';
import {useRouter} from "vue-router";
import {useActiveRelationStore} from '../stores/activeRelation'
import {useUserStore} from '../stores/userStore.js'
import {useTenantStore} from '../stores/tenant';
import {useUserRelationsStore} from "../stores/userRelationsStore";
import {useFavicon} from "@vueuse/core";
import mixins from '../stores/mixins.js';

export default {
    name: 'LoginPage',
   mixins: [mixins],
    setup() {
      try{
        const googleUserManager = inject('googleUserManager');
        const microsoftUserManager = inject('microsoftUserManager');
        const user = ref(null);
        const router = useRouter();
        const userRelations = useUserRelationsStore();
        const activeRelationStore = useActiveRelationStore();
        const userStore = useUserStore();
        const tenantStore = useTenantStore();
        //const tenantStoreRef = ref(tenantStore);
        //has to be decommented after we set a normal host
        //const hostUrl = ref(window.location.href);
        const tenantData = ref(null);

        //tenantDesign
        const logo = tenantStore.tenant.settings.logo;
        const accent_color = tenantStore.tenant.settings.accent_color;
        const primary_color = tenantStore.tenant.settings.primary_color;

      const logoUrl = computed(() => {
        if (tenantStore.tenant.value && tenantStore.tenant.value.settings && tenantStore.tenant.value.settings.logo) {
          return tenantStore.tenant.value.settings.logo;
        }
        return "";  // return an empty string or a placeholder image URL when logo is not yet fetched.
      });

      //Circle styling
        const getCircleStyle = (size, position, options = {}) => {
          const { fill = true, fillColor = accent_color, border = true, borderColor = accent_color } = options;

          const style = {
            width: `${size}px`,
            height: `${size}px`,
            ...position,
          };

          if (fill) {
            style.background = fillColor;
          }

          if (border) {
            style.border = `2px solid ${borderColor}`;
          }

          return style;
        };


        googleUserManager.getUser().then(u => {
            user.value = u;
        });

        microsoftUserManager.getUser().then(u => {
            user.value = u;
        });

        onMounted(async () => {

          //Retrieving tenant design
          //console.log(window.location.href);
          //has to be changed to: https://apim-solidpartners-p.azure-api.net/cp-tenant-mock/getTenant/${hostUrl.value} after setting up a normal host
          const response = await fetch(`https://apim-solidpartners-p.azure-api.net/cp-tenant-mock/getTenant/localhost`);
          if (response.ok) {
            tenantData.value = await response.json();
            tenantStore.setTenant(tenantData.value);

            // Update the CSS variables
            if (tenantData.value) {
              //Favicon usage
              //console.log(tenantStore.getTenantDesign().settings.favicon);
             const favicon = computed(() => tenantStore.tenant.settings.favicon);
              useFavicon(favicon.value);
             }

          } else {
            console.log("Tenant not figured out");
          }

            if (window.location.href.indexOf('code=') > -1 && window.location.href.indexOf('state=') > -1) {
                if(window.location.href.indexOf('google') > -1) {
                    googleUserManager.signinRedirectCallback().then(async loggedInUser => {
                        user.value = loggedInUser; // If Google user logged in, set user to Google user

                        if (loggedInUser) {
                            try {
//logging in with Google
                              const googleData = {
                                ap: "google",
                                token: loggedInUser.access_token,
                                email: loggedInUser.profile.email
                              };

                              console.log(loggedInUser.access_token);
                              console.log(loggedInUser.id_token);
                              const tokenGoogle = await fetch('https://cube-testing.solidpartners.nl/cp/login', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(googleData)
                              });


                                if (tokenGoogle.ok) {
                                  const responseData = await tokenGoogle.json();



if(responseData) {
    // Step 1: Store relations in localStorage
    const newRelations = responseData.relations.map(relation => ({
        id: relation.id,
        name: relation.name,
        permissions: relation.permissions
    }));

  userStore.setToken(responseData.token);
  activeRelationStore.setActiveRelation(newRelations[0]);
  userRelations.setUserRelations(newRelations);

    // check if token is not null or undefined
    if (userStore.getToken) {
        router.push('/account/dashboard');
    }
}} else {
                                    console.error('Response failed');
                                }
                            } catch (err) {
                                console.error(err);
                            }
                        }
                    }).catch(err => {
                        console.error(err);
                    });
                }
            }
        });

        return {
            loginGoogle: () => {
                googleUserManager.signinRedirect();
            },
            loginMicrosoft: async () => {
                try {
                    const loggedInUser = await microsoftUserManager.signIn();
                    user.value = loggedInUser; // If Microsoft user logged in, set user to Microsoft user
                    const email = loggedInUser.idTokenClaims;

                    if (loggedInUser) {

                   //our approach with the mock API
          //      const data = {
          //          ap: "microsoft",
          //          token: loggedInUser.idToken, // Access the idToken from the Microsoft user
          //          email: email.preferred_username// Access the email from the Microsoft user
          //      };
          //      console.log(data);
          //      const response = await fetch('https://apim-solidpartners-p.azure-api.net/cp-cube-mock/cp/login', {
          //          method: 'POST',
          //          body: JSON.stringify(data)
          //      });


                   //Frans approach with the real test API
                 const microsoftData = {
                   ap: "microsoft",
                   token: loggedInUser.accessToken, // Access the idToken from the Microsoft user
                   email: email.preferred_username// Access the email from the Microsoft user
                 };

                 const tokenMicrosoft = await fetch('https://cube-testing.solidpartners.nl/cp/login', {
                   method: 'POST',
                   headers: {
                     'Content-Type': 'application/json'
                   },
                   body: JSON.stringify(microsoftData)
                 });
//
                        if (tokenMicrosoft.ok) {
                            const responseData = await tokenMicrosoft.json();
                            userStore.setToken(responseData.token);

                            //persist authentication tokens between sessions, so a user doesn't need to log in every time they open the portal in their browser.
                          //  localStorage.setItem('authToken', responseData.token);

                            // check if token is not null or undefined
                            if (userStore.getToken) {
                                router.push('/account/dashboard');
                            }
                        } else {
                            console.error('Response failed');
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            },
          logoUrl,
          getCircleStyle,
          user,
          accent_color,
          primary_color,
          logo
        };
    } catch (error) {
    console.error('Error in setup:', error);
    throw error; // Rethrow the error to ensure it's not silently suppressed
  }

    }
};
</script>

<style scoped>
.circle {
    position: absolute;

}

.loginButtons{
  border-color: var(--primary-color);
  border-radius: 50%;
  border-width: 0.15rem;
  width: 80px; /* default width for larger screens */
  height: 80px; /* default height for larger screens */
  margin: 1.5rem; /* Increase the spacing around the buttons */
}

@use 'vuetify/settings' with (
$button-padding: 10rem,
);

</style>


