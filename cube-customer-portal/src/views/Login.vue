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
import axios from 'axios';

export default {
    name: 'LoginPage',
    setup() {
        const googleUserManager = inject('googleUserManager');
        const microsoftUserManager = inject('microsoftUserManager');
        const user = ref(null);

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
                        console.log(loggedInUser);
                        user.value = loggedInUser;

                        const data = {
                            ap: "string",
                            token: loggedInUser.id_token,
                            email: loggedInUser.profile.email
                        };

                        const res = await axios.post('https://apim-solidpartners-p.azure-api.net/cp-cube-mock/login', data);
                        localStorage.setItem('authToken', res.data.token);
                        this.$router.push({name: 'account'});

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
            loginMicrosoft: () => {
                microsoftUserManager.signinRedirect();
            },
            user
        };
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
