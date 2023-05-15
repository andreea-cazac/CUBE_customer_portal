<template>
    <div>
        <h2>User Profile</h2>
        <button @click="login">Log in</button>
        <pre v-if="user">
        <code>{{ user }}</code>
      </pre>
    </div>
</template>

<script>
import { ref, inject } from 'vue';

export default {
    setup() {
        const userManager = inject('userManager');
        const user = ref(null);

        userManager.getUser().then(u => {
            user.value = u;
        });

        return {
            login: () => {
                userManager.signinRedirect();
            },
            user
        };
    }
};
</script>
