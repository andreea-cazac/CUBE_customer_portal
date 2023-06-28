Cypress.Commands.add('login', () => {
    cy.request({
        method: 'POST',
        url: 'https://cube-testing.solidpartners.nl/cp/login',
        body: {
            "ap": "google",   // change the token according to you
            "token" :"ya29.a0AWY7CklvbGDhZUfYfq0QKsDPZiZjOzPAKxNyTQC5WryX0zUOM9Wa5GYuIVhO_gTq1jUpd_0w1IO5B0sJ69w0vCxX6xPXsL-qFJfw-wwJDQvk6YHHrSlqKs4vRCQnWhbj8j4L_yyk8rKrNWWq-QKd3YhoDTXrRAaCgYKAdYSARASFQG1tDrp9hpb0lM1juvyXYFB1lXxbQ0165" ,
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


