import {Then} from "@badeball/cypress-cucumber-preprocessor"

/**
 *     Scenario: View Gap and Solution List
 */


/**
 *  Scenario: View Empty List
 */

Then("I should be presented with a message There are no interventions documented for selected organisation unit and period.", function () {
    cy.get('#empty-challenge-list').contains("There are no interventions documented for selected organisation unit and period.");
});
