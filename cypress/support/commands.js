Cypress.Commands.add("login", (username, password) => {
    cy.get('#j_username').type(username);
    cy.get('#j_password').type(password);
    cy.get("[data-test=dhis2-adapter-loginsubmit]").should("be.visible").click();

});
