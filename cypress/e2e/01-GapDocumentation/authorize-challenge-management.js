import {Then, When} from "@badeball/cypress-cucumber-preprocessor"
/**
 * Scenario: Authorize Challenge Management
 */
Then(/^I should be authorized or have a means to add a challenges should be visible and enabled$/, function () {
    cy.get('[data-test="add-intervention-button"]',).contains('Add Intervention',).click()
});


When(/^I am allowed to access challenges management form$/, function () {
    cy.get('[data-test="add-intervention-button"]').contains('Add Intervention',).should('be.visible');
});

