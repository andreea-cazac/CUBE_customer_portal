import Tickets from './Tickets.vue';
import {mount} from '@cypress/vue';
import {createI18n} from 'vue-i18n';
import en from '@/stores/en';
import nl from '@/stores/nl';
import {createPinia} from 'pinia';

const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: {
    en: en,
    nl: nl
  }
});

const pinia = createPinia();

describe('<Tickets />', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.getTickets();
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

  it('should display tickets with all statuses', () => {
    // Get the token
    cy.get('@token').then((token) => {
      // Get the relationId
      cy.get('@relationId').then((relationId) => {
        // Make a request to fetch the tickets
        cy.request({
          method: 'GET',
          url: `https://cube-testing.solidpartners.nl/cp/relations/${relationId}/work_orders`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then((response) => {
          // Assert that the API response has a 200 status code
          expect(response.status).to.eq(200);

          // Assert that the response body contains tickets with all statuses
          expect(response.body.some(ticket => displayStatus(ticket.status) === 'Finished')).to.be.true;
          expect(response.body.some(ticket => displayStatus(ticket.status) === 'To-Do')).to.be.true;
          expect(response.body.some(ticket => displayStatus(ticket.status) === 'In-Progress')).to.be.true;

          // Mount the Tickets component
          mount(Tickets, {
            global: {
              plugins: [pinia, i18n],
            },
            propsData: { tickets: response.body },
          });

          // After the Tickets component has been mounted, check that the DOM contains elements with all status classes
          cy.get('.bcg-green').should('exist');
          cy.get('.bcg-blue').should('exist');
          cy.get('.bcg-orange-light').should('exist');
        });
      });
    });
  });

});



