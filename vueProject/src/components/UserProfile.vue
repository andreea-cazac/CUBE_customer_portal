<template>
    <div>
        <h2>User Profile</h2>
        <button @click="loginGoogle">Log in with Google</button>
        <button @click="loginMicrosoft">Log in with Microsoft</button>
        <pre v-if="user">
            <code>{{ user }}</code>
        </pre>
    </div>
</template>

<script>
import { ref, inject, onMounted } from 'vue';

export default {
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

        onMounted(() => {
            if (window.location.href.indexOf('code=') > -1 && window.location.href.indexOf('state=') > -1) {
                if(window.location.href.indexOf('google') > -1) {
                    googleUserManager.signinRedirectCallback().then(loggedInUser => {
                        console.log(loggedInUser);  // the user object contains the tokens and profile
                        user.value = loggedInUser; // If Google user logged in, set user to Google user
                    }).catch(err => {
                        console.error(err);
                    });
                }

            microsoftUserManager.signinRedirectCallback().then(loggedInUser => {
            console.log(loggedInUser);  // the user object contains the tokens and profile
            user.value = loggedInUser; // If Microsoft user logged in, set user to Microsoft user
        }).catch(err => {
            console.error(err);
        });
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