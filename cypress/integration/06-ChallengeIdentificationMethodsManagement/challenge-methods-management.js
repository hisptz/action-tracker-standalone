When(/^open section to manage challenge identification methods$/, function () {
    cy.get('[data-test="menu-item-/challenge-methods"]').click()

});
Then(/^a list of already set challenge identification methods should be visible$/, function () {
    cy.get('[data-test="challenge-methods-table"]').should('be.visible')
});
Then(/^a button to open a form for setting up new method should be visible$/, function () {
    cy.get('#add-challenge-method-button').should('be.visible')

});
Then(/^when the button is clicked, it should open a form for setting up a new method$/, function () {
    cy.get('#add-challenge-method-button').click()
});
When(/^the form is filled with the required fields$/, function () {
    cy.get('input[name="name"]').type('Testing Challenge Methods')
    cy.get('input[name="code"]').type('challenge code')
});
When(/^the form is submitted$/, function () {
    cy.get('button').contains('Save Method').click()
});
Then(/^a success notification should be displayed$/, function () {
    cy.get('[data-test="dhis2-uicore-alertbar"]').should('have.class', 'success')
});
Then(/^the changes should be reflected on the list$/, function () {
    cy.wait(3000)
    cy.get('[data-test="dhis2-uicore-tablecell"]').contains('Testing Challenge Methods').should('exist')
    cy.get('[data-test="dhis2-uicore-tablecell"]').contains('challenge code').should('exist')
});
When(/^a list of challenge identification methods is displayed$/, function () {
    cy.get('[data-test="challenge-methods-table"]').should('exist')
});
When(/^the edit button for one of the method is clicked$/, function () {
    cy.get('[data-test="challenge-method-menu-challenge code"]').click();
    cy.get('[data-test="dhis2-uicore-menuitem"]').contains('Edit').click()

});
Then(/^the editing form should be displayed with prefilled values$/, function () {
    cy.get('input[name="name"]').should('contain.value', 'Testing Challenge Methods')
    cy.get('input[name="code"]').should('contain.value', 'challenge code')
});
When(/^the changes are made$/, function () {
    cy.get('input[name="name"]').clear()
    cy.get('input[name="name"]').type('Edited Testing Challenge Methods')

});
When(/^the delete button for one of the method is clicked$/, function () {
    cy.get('[data-test="challenge-method-menu-challenge code"]').click();
    cy.get('[data-test="dhis2-uicore-menuitem"]').contains('Delete').click()
});
Then(/^a confirmation dialog should be displayed asking for delete confirmation$/, function () {
    cy.get('[data-test="dhis2-uicore-modal"]').contains('Confirm Delete').should('be.visible')
});
When(/^the method is deleted$/, function () {
    cy.get('button').contains('Delete').click()
});
Then(/^the deleted method should not visible on the list$/, function () {
    cy.get('[data-test="dhis2-uicore-tablecell"]').contains('Testing Challenge Methods').should('not.exist')
    cy.get('[data-test="dhis2-uicore-tablecell"]').contains('challenge code').should('not.exist')
});

Then(/^the edited changes should be reflected on the list$/, function () {
    cy.wait(3000)
    cy.get('[data-test="dhis2-uicore-tablecell"]').contains('Edited Testing Challenge Methods').should('exist')
    cy.get('[data-test="dhis2-uicore-tablecell"]').contains('challenge code').should('exist')
});
