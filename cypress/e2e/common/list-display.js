import {Then,} from "@badeball/cypress-cucumber-preprocessor"

Then(/^list of identified gaps and agreed solutions should be displayed$/, function () {
    cy.get('#challenge-list').should('be.visible')
});
