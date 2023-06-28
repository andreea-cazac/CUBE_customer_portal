import { createI18n } from 'vue-i18n'
import { mount } from '@cypress/vue'
import { createPinia } from 'pinia'  // Make sure to import createPinia
import Navigation from './Navigation.vue'
import en from "../stores/en"
import nl from "../stores/nl"

const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: {
    en: en,
    nl: nl
  }
})

// Create a new instance of Pinia
const pinia = createPinia();

describe('<Navigation />', () => {
  it('renders', () => {
    mount(Navigation, {
      global: {
        plugins: [i18n, pinia]  // Add the pinia instance to the plugins array
      }
    })
  });

  it('allows the user to log out', () => {
    mount(Navigation, {
      global: {
        plugins: [i18n, pinia]
      }
    });

    // Simulate the logout action
    cy.get('.logoutButton').click();

  });
})
