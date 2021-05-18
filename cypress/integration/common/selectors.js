import {When} from "cypress-cucumber-preprocessor/steps";


When(/^selecting period for planning$/, function () {
    cy.fixture('configs').then((conf) => {
        cy.get('#period-selector').click()
        cy.wait(1000);
        cy.get('[data-test="period-dimension-fixed-periods-button"]').click();
        cy.wait(500);
        cy.get('[data-test="dhis2-uicore-select-input"]').click();
        cy.get('[data-test="dhis2-uicore-layer"]')
            .get('[data-test="dhis2-uicore-popper"]')
            .get('[data-test="dhis2-uicore-select-menu-menuwrapper"]')
            .get(`[data-test="period-dimension-fixed-period-filter-period-type-option-${conf.planningPeriodType.toUpperCase()}"]`).click()
        cy.contains(conf.planningPeriod).dblclick();
        cy.get('button').contains('Update').click();
        cy.wait(1000);
    })
})

When(/^selecting assigned district$/, function () {
    cy.fixture('configs').then((config) => {
        cy.get('#orgUnit-selector').click()
        cy.wait(3000);
        cy.get('[data-test="dhis2-uiwidgets-orgunittree-node-toggle"]').click();
        cy.wait(1000);
        cy.contains(config.planningOrgUnit).click();
        cy.get('button').contains('Update').click();
        cy.wait(1000);
    })

})
