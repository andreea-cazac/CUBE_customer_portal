import {defineStore} from "pinia";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        token: localStorage.getItem("token") || "",
    }),

    getters: {
        getToken: state => state.token,
    },

    actions: {
        setToken(token) {
            this.token = token;
            localStorage.setItem("token", token); // Save token to localStorage
        },

        deleteToken() {
            localStorage.removeItem("token");
        }
    },

})
