import {defineStore} from "pinia";

export const useRelationsStore = defineStore('relationsStore', {
    state: () => ({
     relations: [],
    }),

    getters: {
        getRelations: state => state.relations,
    },

    actions: {
        setRelations(relations){
            this.relations = relations;
        }
    }
})