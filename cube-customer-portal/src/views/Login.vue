<template>
    <v-app style="background: darkblue;">
        <v-container style="display: flex; justify-content: center; align-items: center; height: 100vh;">
            <div class="circle circle1"></div>
            <div class="circle circle2"></div>
            <div class="circle circle3"></div>

            <!--            logo of the host down below. Question: where do we take it from since the user is not logged it and we don't know where to take the png from -->
            <v-card class="mx-auto" color="white" rounded="lg" max-width="500">
                <!--                <v-img-->
                <!--                        src="cube-customer-portal/src/assets/solidPartnersLogo.png"/>-->

                <v-card-title class="text-center">Log in with one of the providers:</v-card-title>

                <!--                HERE: functionality to be added to handle the login process-->
                <v-card-actions class="justify-center">

                    <!--                    LOGIN PROCESS: router link should work only if the user has the token already-->
                    <router-link style="text-decoration: none" :to="{name: 'account'}">
                        <v-btn
                                variant="outlined"
                                style="border: 1px solid darkblue; border-radius: 50%;"
                                icon="mdi-google"
                        >
                            <v-icon size="large" icon ="mdi-google"></v-icon>
                        </v-btn></router-link>
                    <div>
                        <router-link style="text-decoration: none" :to="{name: 'account'}">
                            <v-btn class="mx-2"
                                   variant="outlined"
                                   style="border: 1px solid darkblue; border-radius: 50%;"
                                   icon="mdi-microsoft-windows"
                            >
                                <v-icon size="large" icon="mdi-microsoft-windows"></v-icon>
                            </v-btn></router-link>
                    </div>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-app>
</template>

<script>

export default {
    name: 'LoginPage',
    setup() {
        return {};
    },
}
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
