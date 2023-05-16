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
import { ref, inject } from 'vue';

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
