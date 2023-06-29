import Tickets from './Tickets.vue';
import {mount} from '@cypress/vue';
import {createI18n} from 'vue-i18n';
import en from '@/stores/en';
import nl from '@/stores/nl';
import {createPinia} from 'pinia';
import {useTenantStore} from "@/stores/tenant";

const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: {
    en: en,
    nl: nl
  }
});

const pinia = createPinia();
const tenantStore = useTenantStore(pinia);  // pass the pinia instance


// mock the store's state
tenantStore.setTenant({
  settings: {
    logo: 'testLogo.png',
    favicon: 'favicon.png',
    accent_color: 'blue',
    primary_color: 'red'
  }
});

describe('<Tickets />', () => {
    beforeEach(() => {
      cy.on('uncaught:exception', (err, runnable) => {
        // Prevent failing the test
        return false
      })

      cy.login().then(() => {
        cy.getTickets();
        cy.fetchRelationData();
      });
    });

  it('Check if the API for getting the tickets exits so that the table below wll be filled.', () => {
    cy.get('@token').then((token) => {
      cy.get('@relationId').then((relationId) => {
        // Make the API call using cy.request()
        cy.request({
          method: 'GET',
          url: `https://cube-testing.solidpartners.nl/cp/relations/${relationId}/work_orders/`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then((response) => {
          // Assert that the API response has a 200 status code
          expect(response.status).to.eq(200);

          // Perform further assertions or actions with the response body
        });
      });
    });
  });
  it('Check if the table that needs to be filled with tickets exists', () => {
    mount(Tickets, {
      global: {
        plugins: [pinia, i18n],
      },
    });
    cy.get('#ticketTable') // Update the selector to target the v-table element with the specific id
        .should('exist');
  });

  it('User should be able to create a ticket.', () => {
    mount(Tickets, {
      global: {
        plugins: [pinia, i18n],
      },
    });
    cy.get('#createTicketButton') // Update the selector to target the v-table element with the specific id
        .should('exist');
    cy.get('#createTicketForm') // Update the selector to target the v-table element with the specific id
        .should('exist');
  });
  it('The system must provide the functionality to filter and sort tickets based on creation time, status and priority.  ', () => {
    mount(Tickets, {
      global: {
        plugins: [pinia, i18n],
      },
    });

    // Select the element by data-cy attribute and simulate a click
    cy.get('[data-cy=sortDate]').click();

    // Add any assertions you need here to verify sortDate was called

    cy.get('[data-cy=sortPriority]').click();

    // Add any assertions you need here to verify sortPriority was called

    cy.get('[data-cy=sortStatus]').click();

    // Add any assertions you need here to verify sortStatus was called
  });



});



