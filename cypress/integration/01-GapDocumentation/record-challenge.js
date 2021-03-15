/**
 * Scenario: Record Challenges
 */


Given('an authorized District Planning officer', () => {
    cy.visit("/");
    cy.login('admin', 'district')
}) 
And('Form to record challenges is opened', () => {}) 
When('selecting indicator or bottleneck with challenges', () => {}) 
And('type in faced challenges for the indicator one after another', () => {}) 
And('save the details', () => {}) 
Then('district planning officer should be displayed with save confirmation message and saved data should be reflected in the list', () => {}) 
