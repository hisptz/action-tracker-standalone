/**
 * Scenario: Record Challenges
 */

function deleteIntervention(){
    cy.get('[data-test="context-menu-button-challenge-card"]').click()
    cy.get('[data-test="dhis2-uicore-menuitem"]').get('a').contains('Delete').click();
    cy.get('[data-test="dhis2-uicore-button"]').contains('Delete').click();
}


When(/^opening the form to record challenges$/, function () {
    cy.get('[data-test="add-intervention-button"]').contains('Add Intervention').click()
})


Then(/^form with all needed fields should be displayed$/, function () {
    cy.fixture('intervention').then(interventionConstants => {
        cy.get(`#${interventionConstants.interventionFieldId}`);
        cy.get('[data-test="dhis2-uicore-field-content"]')
    })
});


Then(/^i should be able to fill all the fields and submit the form$/, function () {

    cy.get('#jZ6WL4NQtp5').type('Testing adding interventions');
    cy.get('[data-test="dhis2-uicore-transferoption"]').contains('Testing Indicator 1').dblclick();
    cy.get('button').contains('Save Intervention').click();
    cy.get('[data-test="dhis2-uicore-alertbar"]').should('have.class', 'success')
    cy.wait(3000);
    deleteIntervention();
});
