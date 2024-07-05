import {createApp} from 'vue'
import {createPinia} from "pinia";
import {UserManager} from 'oidc-client';
import {PublicClientApplication} from "@azure/msal-browser";
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import {loadFonts} from './plugins/webfontloader'
import {createI18n} from 'vue-i18n'
import en from "./stores/en"
import nl from "./stores/nl"

require('dotenv').config();

loadFonts()

export const pinia = createPinia();

class MsalUserManager {
    constructor(msalApplication, loginRequest) {
        this.msalApplication = msalApplication;
        this.loginRequest = loginRequest;
    }

    async signIn() {
        return await this.msalApplication.loginPopup(this.loginRequest);
    }

    getUser() {
        const accounts = this.msalApplication.getAllAccounts();
        if (accounts.length > 0) {
            return Promise.resolve(accounts[0]);
        }
        return Promise.resolve(null);
    }
}

const i18n = createI18n({
    locale: 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages: {
        en: en,
        nl: nl
    }
})

const googleConfig = {
    authority: "https://accounts.google.com",
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: "http://localhost:5173",
    response_type: "code",
    scope: "openid profile email"
};

const microsoftConfig = {
    auth: {
        clientId: "dd58c02e-f53c-4c17-ba26-e33a9f62fd4f",
        authority: "https://login.microsoftonline.com/common/",
        //redirectUri: "http://localhost:5173/account/dashboard", // Must be registered as a SPA redirectURI on your app registration
    },
    //   cache: {
    //     cacheLocation: 'localStorage' // Options are localStorage, sessionStorage, memoryStorage
    //   },
};

const googleUserManager = new UserManager(googleConfig);

const pca = new PublicClientApplication(microsoftConfig);
const microsoftUserManager = new MsalUserManager(pca, {
    scopes: ["user.read"],
    redirectUri: "http://localhost:5173",
});

createApp(App)
    .use(router)
    .use(vuetify)
    .use(pinia)
    .use(i18n)
    .provide('googleUserManager', googleUserManager)
    .provide('microsoftUserManager', microsoftUserManager)
    .mount('#app')


