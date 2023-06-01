import {defineStore} from "pinia";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        token: '',
    }),

    getters: {
        getToken: state => state.token,
    },

    actions: {
        setToken(token){
            this.token = token;
        }
    }
})