Cypress.Commands.add('login', () => {
    cy.request({
        method: 'POST',
        url: 'https://cube-testing.solidpartners.nl/cp/login',
        body: {
            "ap": "google",   // change the token according to you
            "token" :"ya29.a0AWY7CknENwc6so8TcO7aCu2-1__bIgI_hPuqXQKO_todFI-2CN5wAgWoSTQi31cg_hA81yZUuVqW5JRk680uskL3f-Fa-lhi4862VJx1g4yF-HyK10jmL7hYev7FkXKDX4SKSI0lfomQzz1X3Qel74jRNHUslQaCgYKAZkSARASFQG1tDrpQoIFEUTYckJ8DWyAVaboIA0165" ,
            "email" : "alexblajievschi07@gmail.com"
        }
    })
        .its('body')
        .then((body) => {
            cy.wrap(body.token).as('token');
            cy.wrap(body.relations[0].id).as('relationId');
        });
});

Cypress.Commands.add('fetchRelationData', () => {
    cy.get('@token').then((token) => {
        cy.get('@relationId').then((relationId) => {
            cy.request({
                method: 'GET',
                url: `https://cube-testing.solidpartners.nl/cp/relations/${relationId}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Access-Control-Allow-Origin':  'http://localhost:5173'
                }
            })
                .its('body')
                .as('profile');
        });
    });
});
Cypress.Commands.add('getTickets', () => {
    cy.get('@token').then((token) => {
        cy.get('@relationId').then((relationId) => {
            // If relationId is undefined, log an error
            if (!relationId) {
                console.error("relationId is undefined. Please check the login command.");
            }

            cy.request({
                method: 'GET', // Update to GET if needed
                url: `https://cube-testing.solidpartners.nl/cp/relations/${relationId}/work_orders`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
                .its('body')
                .as('tickets'); // Wraps the response body as 'tickets'
        });
    });
});


