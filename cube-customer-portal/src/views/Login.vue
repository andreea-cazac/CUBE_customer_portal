<template>
    <v-app class="backgroundPage">
        <v-container style="display: flex; justify-content: center; align-items: center; height: 100vh">
            <div class="circle circle1"></div>
            <div class="circle circle2"></div>
            <div class="circle circle3"></div>
            <div class="circle circle4"></div>
            <div class="circle circle5"></div>

            <v-card class="loginCard"  rounded="lg" >
              <v-img aspect-ratio="2.5" class="logoContainer"></v-img>
                <v-card-title class="loginText mb-10">Log in with one of the providers:</v-card-title>
                <p v-if="errorMessage" class="errorText">{{ errorMessage }}</p>
                <v-card-actions class="justify-center">
                  <div class="button-group">
                    <v-btn
                        variant="outlined"
                        class="loginButtons"
                        icon="mdi-google"
                        @click="loginGoogle"
                    >
                      <v-icon size="x-large" icon="mdi-google"></v-icon>
                    </v-btn>

                    <v-btn
                        variant="outlined"
                        class="loginButtons"
                        icon="mdi-microsoft-windows"
                        @click="loginMicrosoft"
                    >
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

export default {
    name: 'LoginPage',
    setup() {
      try{
        const googleUserManager = inject('googleUserManager');
        const microsoftUserManager = inject('microsoftUserManager');
        const user = ref(null);
        const router = useRouter();
        const userRelations = useUserRelationsStore();
        const activeRelationStore = useActiveRelationStore();
        const userStore = useUserStore(); // use Vuex store
        const tenantStore = useTenantStore();
        const errorMessage = ref("");
        //const tenantStoreRef = ref(tenantStore);
        //has to be decommented after we set a normal host
        //const hostUrl = ref(window.location.href);
        const tenantData = ref(null);
      const logoUrl = computed(() => {
        if (tenantStore.tenant.value && tenantStore.tenant.value.settings && tenantStore.tenant.value.settings.logo) {
          return tenantStore.tenant.value.settings.logo;
        }
        return "";  // return an empty string or a placeholder image URL when logo is not yet fetched.
      });



        googleUserManager.getUser().then(u => {
            user.value = u;
        });

        microsoftUserManager.getUser().then(u => {
            user.value = u;
        });

        onMounted(async () => {
          const handleResponse = async (response) => {
              if (response.ok) {
                  return response.json();
              } else if (response.status === 401 || response.status === 422) {
                  // redirect to error page
                  errorMessage.value = "You are an unauthorized user for this Customer Portal";
                  throw new Error('Unauthorized');
              } else {
                  console.error('Response failed');
                  throw new Error('Response failed');
              }
          }
          //Retrieving tenant design
          //console.log(window.location.href);
          //has to be changed to: https://apim-solidpartners-p.azure-api.net/cp-tenant-mock/getTenant/${hostUrl.value} after setting up a normal host
          const response = await fetch(`https://apim-solidpartners-p.azure-api.net/cp-tenant-mock/getTenant/mijn.solidpartners.nl`);
          if (response.ok) {
            tenantData.value = await response.json();
            tenantStore.setTenant(tenantData);

            // Update the CSS variables
            if (tenantData.value) {
                document.documentElement.style.setProperty('--primary-color', tenantData.value.settings.primary_color);
                document.documentElement.style.setProperty('--accent-color', tenantData.value.settings.accent_color);
                document.documentElement.style.setProperty('--background-image', `url(${tenantData.value.settings.backgroundImage})`);
                document.documentElement.style.setProperty('--logo', `url(${tenantData.value.settings.logo})`);
                document.documentElement.style.setProperty('--favicon', `url(${tenantData.value.settings.favicon})`);
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

                        // //our approach with the mock API
                        //   const data = {
                        //       ap: "google",
                        //       token: loggedInUser.id_token,
                        //       email: loggedInUser.profile.email
                        //   };
//
                        //   const response = await fetch('https://apim-solidpartners-p.azure-api.net/cp-cube-mock/cp/login', {
                        //       method: 'POST',
                        //       body: JSON.stringify(data)
                        //   });

                              //Frans approach, with the real test API

                              const data2 = {
                                ap: "google",
                                token: loggedInUser.access_token,
                                email: loggedInUser.profile.email
                              };

                              const response2 = await fetch('https://cube-testing.solidpartners.nl/cp/login', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data2)
                              });

                              handleResponse(response2).then(responseData => {
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
                                  }
                              }).catch(err => {
                                  console.error(err);
                              });
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
                 const data = {
                   ap: "microsoft",
                   token: loggedInUser.accessToken, // Access the idToken from the Microsoft user
                   email: email.preferred_username// Access the email from the Microsoft user
                 };

                 const response = await fetch('https://cube-testing.solidpartners.nl/cp/login', {
                   method: 'POST',
                   body: JSON.stringify(data)
                 });
//
                  handleResponse(response).then(responseData => {
                      if(responseData) {
                            userStore.setToken(responseData.token);
                            //persist authentication tokens between sessions, so a user doesn't need to log in every time they open the portal in their browser.
                          //  localStorage.setItem('authToken', responseData.token);

                            // check if token is not null or undefined
                            if (userStore.getToken) {
                                router.push('/account/dashboard');
                            }
                      }
                  }).catch(err => {
                      console.error(err);
                  });
                    }
                } catch (err) {
                    console.error(err);
                }
            },
          logoUrl,
          user,
          errorMessage
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
    border-radius: 50%;
}

.circle1 {
    width: 200px;
    height: 200px;
    background: var(--accent-color);
    top: -5%;
    left: -5%;
}

.circle2 {
    width: 150px;
    height: 150px;
    background: var(--accent-color);
    bottom: 20%;
    right: 10%;
}

.circle3 {
    width: 300px;
    height: 300px;
    border: 2px solid var(--accent-color);
    bottom: 10%;
    right: 60%;
}

.circle4 {
  width: 300px;
  height: 300px;
  border: 2px solid var(--accent-color);
  bottom: -5%;
  right: -5%;
}

.circle5 {
  width: 100px;
  height: 100px;
  border: 2px solid var(--accent-color);
  bottom: 70%;
  right: 40%;
}

.loginCard{
  width: 600px;
  height: 500px;
  background-image: var(--background-image);
  background-size: 700px 500px;
}
.backgroundPage {
  background-color: var(--primary-color);
  background-size: 1920px 980px;
}

.loginText{
  color: var(--primary-color);
  text-align: center;
  font-size: x-large;
}

 .button-group {
   display: flex;
   justify-content: space-between;
   padding: 0;
 }

.loginButtons{
  border-color: var(--primary-color);
  border-radius: 50%;
  border-width: 0.15rem;
  width: 80px; /* default width for larger screens */
  height: 80px; /* default height for larger screens */
  margin: 1.5rem; /* Increase the spacing around the buttons */
}

@media (max-width: 360px) {
  .loginButtons{
    width: 50px; /* smaller width for screens less than or equal to 360px wide */
    height: 50px; /* smaller height for screens less than or equal to 360px wide */
  }
}

.logoContainer {
  background-image: var(--logo);
  background-position: center;
  height: 170px;
}

.errorText {
  color: red;
  text-align: center;
  font-size: large;

}


</style>


