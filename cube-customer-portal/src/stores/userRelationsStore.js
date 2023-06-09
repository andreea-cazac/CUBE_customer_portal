import {defineStore} from "pinia";

export const useUserRelationsStore = defineStore('userRelationsStore', {
    state: () => ({
        userRelations:
            JSON.parse(localStorage.getItem("userRelations")) ||
            [{ "id": 50018, "name": "placeholder BV", "permissions": [ "show_tickets", "create_tickets" ] }], // PLACEHOLDER
    }),

    getters: {
        getUserRelations: state => state.userRelations
    },

    actions: {
        setUserRelations(userRelations){
            this.userRelations = userRelations;
            localStorage.setItem("userRelations", JSON.stringify(userRelations))
        }
    }
})
