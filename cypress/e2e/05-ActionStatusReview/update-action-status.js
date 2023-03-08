import {Then, When} from "@badeball/cypress-cucumber-preprocessor"

/**
 * Scenario: Update Action Status
 */

const actionStatusFieldIds = {
    status: 'f8JYVWLC7rE',
    reviewDate: 'nodiP54ocf5',
    remarks: 'FnengvwgsQv'
}
When(/^selecting an action to track$/, function () {
    cy.get('#add-action-status-button').first().click()
});

When(/^updating status or timeline for the action items$/, function () {

    cy.get(`[data-test="dhis2-uiwidgets-singleselectfield-${actionStatusFieldIds.status}-content"]`).click();
    cy.get('[data-test="dhis2-uicore-singleselectoption"]').contains('In progress').click();
    cy.get(`#${actionStatusFieldIds.reviewDate}`).type('2020-02-01')
    cy.get(`#${actionStatusFieldIds.remarks}`).type('This is an automated test to verify adding action status.')
});

When(/^and save updates$/, function () {
    cy.get('button').contains('Save Action Status').click();
});

Then(/^updated status should be reflected in the list$/, function () {
    cy.get('#action-status-remarks').contains('This is an automated test to verify adding action status.').should('exist')
});
