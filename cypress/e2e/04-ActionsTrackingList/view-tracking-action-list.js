import {Then} from "@badeball/cypress-cucumber-preprocessor"

/**
 *  Scenario: View Tracked Action List
 */

/**
 * Scenario: View Empty Tracked Action List
 */

Then(/^list of identified gaps, their solutions, action items and statuses should be displayed in calendar view fashion following configured period type$/, function () {
    cy.get("th").contains('January 2020 - March 2020')
    cy.get("th").contains('April 2020 - June 2020')
    cy.get("th").contains('July 2020 - September 2020')
    cy.get("th").contains('October 2020 - December 2020')
});
Then(/^I should be presented with a message "([^"]*)"$/, function () {
    cy.get('#empty-challenge-list').contains("There are no interventions documented for selected organisation unit and period.");
});
