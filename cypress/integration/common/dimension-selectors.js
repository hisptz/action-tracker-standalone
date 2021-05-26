const acceptedDistricts = [
    'Kono',
    'Bo',
    'Bombali',
    'Tonkolili'
]

const acceptedPeriods = [
    '2020',
    '2021'
]

defineParameterType({
    name: 'period',
    regexp: new RegExp(acceptedPeriods.join('|'))
})

And("selecting period for planning as {period}", function (period) {
    cy.fixture('configs').then((conf) => {
        cy.get('#period-selector').click()
        cy.get('[data-test="period-dimension-fixed-periods-button"]').click();
        cy.get('[data-test="dhis2-uicore-select-input"]').click();
        cy.get('[data-test="dhis2-uicore-layer"]')
            .get('[data-test="dhis2-uicore-popper"]')
            .get('[data-test="dhis2-uicore-select-menu-menuwrapper"]')
            .get(`[data-test="period-dimension-fixed-period-filter-period-type-option-${conf.planningPeriodType.toUpperCase()}"]`).click()
        cy.contains(period).dblclick();
        cy.get('button').contains('Update').click();
    })
})

defineParameterType({
    name: 'district',
    regexp: new RegExp(acceptedDistricts.join('|'))
})

When("selecting assigned district {district}", function (selectedDistrict) {
    cy.fixture('configs').then((config) => {
        cy.get('#orgUnit-selector').click({timeout: 8000})
        cy.get('[data-test="dhis2-uiwidgets-orgunittree-node-toggle"]').click({timeout: 9000});
        cy.contains(selectedDistrict).click({timeout: 5000});
        cy.get('button').contains('Update').click();
    })

})


And(/^select to track actions$/, function () {
    cy.get('#tracking-button').click();
});