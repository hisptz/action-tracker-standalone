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
    cy.get('#period-selector').click()
    cy.contains(period).dblclick();
    cy.get('button').contains('Update').click();
})

defineParameterType({
    name: 'district',
    regexp: new RegExp(acceptedDistricts.join('|'))
})

When("selecting assigned district {district}", function (selectedDistrict) {
    cy.get('#orgUnit-selector').click({timeout: 8000})
    cy.get('[data-test="dhis2-uiwidgets-orgunittree-node-toggle"]').click({timeout: 9000});
    cy.wait(1000)
    cy.contains(selectedDistrict).click({timeout: 5000});
    cy.get('button').contains('Update').click();
})


And(/^select to track actions$/, function () {
    cy.get('#tracking-button').click();
});
