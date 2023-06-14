<template>
    <v-app style="background: darkblue;">
        <v-container style="display: flex; justify-content: center; align-items: center; height: 100vh;">
            <div class="circle circle1"></div>
            <div class="circle circle2"></div>
            <div class="circle circle3"></div>

            <v-card class="mx-auto" color="white" rounded="lg" max-width="500">
                <v-card-title class="text-center">Log in with one of the providers:</v-card-title>

                <v-card-actions class="justify-center">
                    <v-btn
                        variant="outlined"
                        style="border: 1px solid darkblue; border-radius: 50%;"
                        icon="mdi-google"
                        @click="loginGoogle"
                    >
                        <v-icon size="large" icon="mdi-google"></v-icon>
                    </v-btn>
                    <div>
                        <v-btn class="mx-2"
                               variant="outlined"
                               style="border: 1px solid darkblue; border-radius: 50%;"
                               icon="mdi-microsoft-windows"
                               @click="loginMicrosoft"
                        >
                            <v-icon size="large" icon="mdi-microsoft-windows"></v-icon>
                        </v-btn>
                    </div>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-app>
</template>

<script>
import { ref, inject, onMounted } from 'vue';
import {useRouter} from "vue-router";
import {useActiveRelationStore} from '../stores/activeRelation'
import {useUserStore} from '../stores/userStore.js'
import {useUserRelationsStore} from "@/stores/userRelationsStore";

export default {
    name: 'LoginPage',
    setup() {
      try{
        const googleUserManager = inject('googleUserManager');
        const microsoftUserManager = inject('microsoftUserManager');
        const user = ref(null);
        const router = useRouter();
      const activeRelationStore = useActiveRelationStore(); // use Vuex store
      const userStore = useUserStore(); // use Vuex store

      const userRelations = useUserRelationsStore();
        googleUserManager.getUser().then(u => {
            user.value = u;
        });

        microsoftUserManager.getUser().then(u => {
            user.value = u;
        });

        onMounted(async () => {
            if (window.location.href.indexOf('code=') > -1 && window.location.href.indexOf('state=') > -1) {
                if(window.location.href.indexOf('google') > -1) {
                    googleUserManager.signinRedirectCallback().then(async loggedInUser => {
                        user.value = loggedInUser; // If Google user logged in, set user to Google user

                        if (loggedInUser) {
                            try {

                                const data = {
                                    ap: "string",
                                    token: loggedInUser.id_token,
                                    email: loggedInUser.profile.email
                                };

                                const response = await fetch('https://apim-solidpartners-p.azure-api.net/cp-cube-mock/cp/login', {
                                    method: 'POST',
                                    body: JSON.stringify(data)
                                });

                                if (response.ok) {
                                    const responseData = await response.json();

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
                    console.log(loggedInUser); // the user object contains the tokens and profile
                    user.value = loggedInUser; // If Microsoft user logged in, set user to Microsoft user
                    const email = loggedInUser.idTokenClaims;

                    if (loggedInUser) {
                        const data = {
                            ap: "string",
                            token: loggedInUser.idToken, // Access the idToken from the Microsoft user
                            email: email.preferred_username// Access the email from the Microsoft user
                        };
                        console.log(data);
                        const response = await fetch('https://apim-solidpartners-p.azure-api.net/cp-cube-mock/cp/login', {
                            method: 'POST',
                            body: JSON.stringify(data)
                        });
                        console.log("Response sent");
                        if (response.ok) {
                            const responseData = await response.json();
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
            user
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
    border: 2px solid cyan;
    top: -5%;
    left: -10%;
}

.circle2 {
    width: 150px;
    height: 150px;
    background: rgba(255, 255, 255, 0.1);
    bottom: 20%;
    right: 10%;
}

.circle3 {
    width: 300px;
    height: 300px;
    border: 2px solid cyan;
    background: rgba(255, 255, 255, 0.1);
    bottom: -50px;
    right: -50px;
}
</style>
