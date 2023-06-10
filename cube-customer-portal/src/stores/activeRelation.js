import {defineStore} from "pinia";

export const useActiveRelationStore = defineStore('activeRelationStore', {
    state: () => ({
        activeRelation:
            JSON.parse(localStorage.getItem("activeRelation")) ||
            { "id": 50018, "name": "placeholder BV", "permissions": [ "show_tickets", "create_tickets" ] }, // PLACEHOLDER
    }),

    getters: {
        getActiveRelation: state => state.activeRelation
    },

    actions: {
        setActiveRelation(relation){
            this.activeRelation = relation;
            localStorage.setItem("activeRelation", JSON.stringify(relation))
        }
    }
})
