/**
 * Scenario: Add Action Item
 */

const actionItemFieldNames = {
    title: 'HQxzVwKedKu',
    description: 'GlvCtGIytIz',
    startDate: 'jFjnkx49Lg3',
    endDate: 'BYCbHJ46BOr',
    responsiblePerson: 'G3aWsZW2MpV',
    designation: 'Ax6bWbKn46e'
}

And('with the list of identified gaps and agreed solutions', () => {
    cy.get('#challenge-list').should('be.visible')
})
When('setting action items for agreed the solutions', () => {
    cy.get('[data-test="add-action-button"]').first().click()
    cy.get(`#${actionItemFieldNames.title}`).type('Auto testing Action Item')
    cy.get(`#${actionItemFieldNames.description}`).type('This is an automated test to verify adding successfully of an action item')
    cy.get(`#${actionItemFieldNames.startDate}`).type('2020-01-01')
    cy.get(`#${actionItemFieldNames.endDate}`).type('2020-12-31')
    cy.get(`#${actionItemFieldNames.responsiblePerson}`).type('Eric Chingalo')
    cy.get(`#${actionItemFieldNames.designation}`).type('District Officer');
})
And('saving action items', () => {
    cy.get('button').contains('Save Action').click()
})
And('update should be reflected in the list', () => {
    cy.get('td').contains('Auto testing Action Item')
    cy.get('td').contains('Eric Chingalo')
    cy.get('td').contains('District Officer')
})

