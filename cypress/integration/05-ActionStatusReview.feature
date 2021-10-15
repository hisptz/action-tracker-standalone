Feature: Action Status Review

  As Henry, a CHMT member,
  I want to be able to know more information about the actions we are working on including what was the issue, agreed solutions and what happened to the agreed solutions
  so that I will be in position to come up with alternative plans if required.

  @focus
  Scenario: Update Action Status
    Given an authorized CHMT member
    When selecting assigned district Bombali
    And selecting period for planning as 2020
    And select to track actions
    When selecting an action to track
    And updating status or timeline for the action items
    And and save updates
    Then CHMT member should be displayed with save confirmation message/notification
    And updated status should be reflected in the list
