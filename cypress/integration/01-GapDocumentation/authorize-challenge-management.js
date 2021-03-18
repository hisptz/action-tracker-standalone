
/**
 * Scenario: Authorize Challenge Management
 */

Given("an authorized District Planning officer", () => {
  cy.visit("/");
  cy.login('admin', 'district')
});
When(" selecting assigned district", () => {
 
});
And("selecting period for planning", () => {

});
Then(
  "I should be authorized or have a means to add a challenges should be visible and enabled",
  () => {

  }
);

/**
 * Scenario: Access Challenge Management Form
 */

Given("an authorized District Planning officer", () => {
  cy.visit("/");
  cy.login('admin', 'district')
});
And("I am allowed to access challenges managment form", () => {
  
});
When("opening the form to record challenges", () => {
 
});

Then("form with all needed fields should be displayed", () => {
  
});
