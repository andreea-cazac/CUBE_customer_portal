import Dashboard from './Dashboard.vue'
import {createI18n} from "vue-i18n";
import { mount } from '@cypress/vue'
import en from "@/stores/en";
import nl from "@/stores/nl";
import {createPinia} from "pinia";


const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: {
    en: en,
    nl: nl
  }
});

const pinia = createPinia();
describe('<Dashboard />', () => {

  it('Dashboard must contain user’s amount of tickets, and recent tickets. ', () => {
    mount(Dashboard, {
      global: {
        plugins: [pinia, i18n],
      },
    });

    cy.get('#recentTickets').should('exist');
    cy.get('#ticketsContainer').should('exist');
  });
})