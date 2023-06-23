import { defineStore } from 'pinia';

export const useTenantStore = defineStore('tenant', {
    // unique id of the store across your application

    // state: () => ({
    //     tenant:
    //         JSON.parse(localStorage.getItem("tenant")) ||
    //         {},
    // }),

    // getters: {
    //     getTenant: state => state.tenant
    // },

    // actions: {
    //     setTenant(tenant){
    //         this.tenant = tenant;
    //         localStorage.setItem("tenant", JSON.stringify(tenant));
    //     }
    // }
    state: () => ({
        tenant:{
            cubeUrl: "",
            settings: {
            primary_color: 'red',
            accent_color: "",
            logo: "",
            favicon: "",
            banner: "",
            backgroundImage: ""
        }}
    }),
    getters: {
        cubeUrl: (state) => state.cubeUrl,
        primaryColor: (state) => state.settings.primary_color,
        logo: (state) => state.settings.logo,
        favicon: (state) => state.settings.favicon,
        banner: (state) => state.settings.banner,
        backgroundImage: (state) => state.settings.backgroundImage,
    },
    actions: {
        setTenant(tenant){
            this.tenant = tenant;
        }
    }


});
