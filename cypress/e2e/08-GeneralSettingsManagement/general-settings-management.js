import {Then, When, Given} from "@badeball/cypress-cucumber-preprocessor"


When(/^opening section to manage planning and tracking frequencies$/, function () {
    cy.get('[data-test="menu-item-/general-settings"]').click()
});
Then(/^I should be presented with way to set planning period$/, function () {
    cy.get('[data-test="Planning Period-select-content"]').should('exist')
    cy.get('[data-test="Tracking Period-select-content"]').should('exist')
});
When(/^I select period type and save$/, function () {
    cy.get('[data-test="Planning Period-select-content"]').click()
    cy.get('[data-test="SixMonthlyApril-option"]').scrollIntoView()
    cy.get('[data-test="SixMonthlyApril-option"]').click()

});
Then(/^the selected period type should be saved, save success message displayed and period selection should reflect selected type$/, function () {
    cy.get('[data-test="dhis2-uicore-alertbar"]').should('have.class', 'success')
    cy.get('[data-test="dhis2-uicore-select-input"]').contains('SixMonthlyApril').should('exist')
});
When(/^planning period is selected$/, function () {
    cy.get('[data-test="dhis2-uicore-select-input"]').contains('SixMonthlyApril').should('exist')
});
When(/^I view list of frequency for tracking actions$/, function () {
    cy.get('[data-test="Tracking Period-select-content"]').click()

});
Then(/^I should be displayed a list with period types at same level or lower than the selected planning period type$/, function () {
    cy.get('[data-test="SixMonthlyApril-option"]').should('exist')
    cy.get('[data-test="Yearly-option"]').should('not.exist')
});
When(/^I select action tracking frequency and save$/, function () {
    cy.get('[data-test="Monthly-option"]').click()

});
Then(/^the selected frequency should be saved, save success message displayed and tracking periods should reflect selected frequency$/, function () {
    cy.get('[data-test="dhis2-uicore-alertbar"]').should('have.class', 'success')
    cy.get('[data-test="dhis2-uicore-select-input"]').contains('Monthly').should('exist')

});
Then(/^I should be presented with a way to set planning organisation unit level$/, function () {
    cy.get('[data-test="planning-org-unit-level-select"]').should('exist')
});
When(/^I select a planning organisation unit level$/, function () {
    cy.get('[data-test="planning-org-unit-level-select"]').click()
    cy.get('[data-test="tTUf91fCytl-option"]').click()
});
Then(/^the selected planning organisation unit level should be saved and the changes reflected$/, function () {
    cy.get('[data-test="dhis2-uicore-alertbar"]').should('have.class', 'success')
    cy.get('[data-test="dhis2-uicore-select-input"]').contains('Chiefdom').should('exist')

});

function resetAllConfigs() {
    cy.get('[data-test="Planning Period-select-content"]').click()
    cy.get('[data-test="dhis2-uicore-singleselect-filterinput"]').type('Yearly')
    cy.get('[data-test="Yearly-option"]').click()

    cy.get('[data-test="Tracking Period-select-content"]').click()
    cy.get('[data-test="dhis2-uicore-singleselect-filterinput"]').type('Quarterly')
    cy.get('[data-test="Quarterly-option"]').click()

    cy.get('[data-test="planning-org-unit-level-select"]').click()
    cy.get('[data-test="wjP19dkFeIk-option"]').click()

}

// After(()=>{
//     resetAllConfigs();
// })


Given(/^reset all configuration$/, function () {
    resetAllConfigs()
});
