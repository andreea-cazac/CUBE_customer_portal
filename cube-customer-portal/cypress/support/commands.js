Cypress.Commands.add('login', () => {
    cy.request({
        method: 'POST',
        url: 'https://cube-testing.solidpartners.nl/cp/login',
        body: {
            "ap": "google",   // change the token according to you
            "token" :"ya29.a0AWY7Ckmls9t4HlWBtIzEvbzkCFVeEJtdjN61uzn26egPimhrr4H_B-luDF2TTO2H3M7IBDu2-D2lxQGNcrLLABzEHeYDHBr8yvrHSJ6nwt1xJJ0t1czzt-DKhbO3tuKOh01rlm5dqd0obtohiVBgdsm-fgPTaCgYKAXUSARMSFQG1tDrpi8m1QBNkDcOsAKn9ZVwuUA0163" ,
            "email" : "andreeacayac@gmail.com"
        }
    })
        .its('body')
        .then((body) => {
            // save token in Cypress alias
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


