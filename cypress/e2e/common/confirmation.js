import {Then, When} from "@badeball/cypress-cucumber-preprocessor"


Then(/^CHMT member should be displayed with save confirmation message\/notification$/, function () {
    cy.get('[data-test="dhis2-uicore-alertbar"]').should('have.class', 'success')
});
