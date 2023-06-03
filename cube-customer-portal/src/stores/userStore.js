import {defineStore} from "pinia";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        token: sessionStorage.getItem("token") || "",
    }),

    getters: {
        getToken: state => state.token,
    },

    actions: {
        setToken(token) {
            this.token = token;
            sessionStorage.setItem("token", token); // Save token to sessionStorage
        },
    },
})
