
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
});

Then(/^the added intervention should be reflected on the list$/, function () {
    cy.get('#challenge-list').should('be.visible')
});

Then(/^i should be able to open a bottleneck form$/, function () {
    cy.get('[data-test="add-bottleneck-button"]').first().click();
});
Then(/^bottleneck form with all required fields should be visible$/, function () {
    cy.get('#JbMaVyglSit').should('be.visible')
    cy.get('#GsbZkewUna5').should('be.visible')
    cy.get('[data-test="dhis2-uiwidgets-singleselectfield-W50aguV39tU-content"]').should('be.visible')

});
Then(/^i should be able to fill all the bottleneck form field and submit the form$/, function () {
    cy.get('#JbMaVyglSit').type('Testing add bottleneck')
    cy.get('#GsbZkewUna5').type('This is an automated test to verify adding a bottleneck')
    cy.get('[data-test="dhis2-uiwidgets-singleselectfield-W50aguV39tU-content"]').click();
    cy.get('[data-test="dhis2-uicore-singleselectoption"]').contains('Root cause analysis').click()
    cy.get('button').contains('Save Bottleneck').click()
});
Then(/^the added bottleneck should be reflected on the list$/, function () {
    cy.get('td').contains('Testing add bottleneck').should('be.visible')
});

Then(/^i should be able to open the possible solution form$/, function () {
    cy.get('[data-test="add-solution-button"]').click();
});
Then(/^possible solution form with all the required fields should be visible$/, function () {
    cy.get('#upT2cOT6UfJ').should('be.visible')
});
Then(/^I should be able to fill all the possible solution form fields and submit the form$/, function () {
    cy.get('#upT2cOT6UfJ').type('This is an automated test to verify adding possible solution')
    cy.get('button').contains('Save Solution').click()
});
Then(/^the added solution should be reflected on the list$/, function () {
    cy.get('td').contains('This is an automated test to verify adding possible solution').should('be.visible')
    deleteIntervention()
});
