/**
 *  Scenario: View Tracked Action List
 */

Given("an authorized CHMT member", () => {});
When("selecting assigned district", () => {});
And("selecting period of planned actions", () => {});
And("select to track actions", () => {});
Then(
  "list of identified gaps, their solutions, action items and statuses should be displayed in calendar view fashion following configured period type",
  () => {}
);

/**
 * Scenario: View Empty Tracked Action List
 */

Given("an authorized CHMT member", () => {});
When("selecting assigned district", () => {});
And("selecting period of planned actions", () => {});
And("select to track actions", () => {});
Then(
  'I should be presented with a message "You currently don\'t have any gaps to work on"',
  () => {}
);
