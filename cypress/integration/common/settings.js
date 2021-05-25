When(/^opening the management panel$/, function () {
    cy.get('[data-test="settings-button"]').click()
});

Given(/^an authorized technical lead$/, function () {
    cy.visit('/')
});
