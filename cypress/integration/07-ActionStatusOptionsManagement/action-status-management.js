When(/^opening section to manage action statuses$/, function () {
    cy.get('[data-test="menu-item-/action-status-settings"]').click()
});
Then(/^administrator should be presented with a list of previous documented action statuses$/, function () {
    cy.get('[data-test="action-status-options-table"]').should('exist')
});
Then(/^administrator should be able to open for form for setting up new action status$/, function () {
    cy.get('#add-action-status-button').click();
});
When(/^form for setting up action status is open$/, function () {
    cy.get('#add-action-status-button').click();
    cy.get('input[name="name"]').should('exist')
    cy.get('input[name="code"]').should('exist')
    cy.get('input[name="color"]').should('exist')
    cy.get('input[name="icon"]').should('exist')
});
When(/^typing in required details including selecting color for the status$/, function () {
    cy.get('input[name="name"]').type('Testing Action Status Option')
    cy.get('input[name="code"]').type('action status code')
    cy.get('input[name="color"]').click().then(_ => {
        cy.get('div[title="#7ED321"]').click()
    })
    cy.get('.icon-picker-field').first().click()
    cy.get('#dhis2-icon-dhis2_logo_outline').click()
    cy.get('button').contains('Select').click()

});
When(/^save the details$/, function () {
    cy.get('button').contains('Save Action Status').click()
});
Then(/^save success notification should be displayed and new action should be reflected in the list$/, function () {
    cy.get('[data-test="dhis2-uicore-alertbar"]').should('have.class', 'success')
    cy.get('[data-test="dhis2-uicore-tablecell"]').contains('Testing Action Status Option').should('exist')

});
Given(/^list of documented actions statuses is opened$/, function () {
    cy.get('[data-test="action-status-options-table"]').should('exist')
});
When(/^I select on a specific status$/, function () {
    cy.get('[data-test="action-status-option-menu-action status code"]').click()
});
Then(/^form for editing the action status should be opened$/, function () {
    cy.get('[data-test="dhis2-uicore-menuitem"]').contains('Edit').click()
});
When(/^selecting to delete an action status$/, function () {
    cy.get('[data-test="dhis2-uicore-menuitem"]').contains('Delete').click()

});
When(/^delete confirmation dialog is displayed$/, function () {
    cy.get('[data-test="dhis2-uicore-modal"]').contains('Confirm Delete').should('be.visible')
});
Then(/^I should be able to confirm delete and action status should be removed from the list$/, function () {
    cy.get('button').contains('Delete').click()
    cy.wait(3000)
    cy.get('[data-test="dhis2-uicore-tablecell"]').contains('Edited Testing Action Status Option').should('not.exist')
});
When(/^I select on a action status option that is already used on some recorded action status$/, function () {
    cy.get('[data-test="action-status-option-menu-Completed"]').click()
});

Then(/^I should be restricted to delete$/, function () {
    cy.wait(1000)
    cy.get('button').contains('Delete').should('be.disabled')

});
When(/^I edit the name of action status option$/, function () {
    cy.get('input[name="name"]').clear()
    cy.get('input[name="name"]').type('Edited Testing Action Status Option')
});
Then(/^edit success notification should be displayed and new action should be reflected in the list$/, function () {
    cy.get('[data-test="dhis2-uicore-alertbar"]').should('have.class', 'success')
    cy.wait(3000)
    cy.get('[data-test="dhis2-uicore-tablecell"]').contains('Edited Testing Action Status Option').should('exist')
});
