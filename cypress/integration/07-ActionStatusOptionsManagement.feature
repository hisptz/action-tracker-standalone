Feature: Action Status Options Management
  As Husna, an administrative user, I want to be able to define colour codes for managing progress of actions so that
  users can easily know progress of actions they will be tracking

  Scenario: List action status options
    Given an authorized technical lead
    When opening the management panel
    And opening section to manage action statuses
    Then administrator should be presented with a list of previous documented action statuses

  Scenario: Open action status options form
    Given an authorized technical lead
    When opening the management panel
    And opening section to manage action statuses
    Then administrator should be able to open for form for setting up new action status
  @Focus
  Scenario: Create action status option
    Given an authorized technical lead
    When opening the management panel
    And opening section to manage action statuses
    And form for setting up action status is open
    When typing in required details including selecting color for the status
    And save the details
    Then save success notification should be displayed and new action should be reflected in the list

  Scenario: Edit action status option
    Given an authorized technical lead
    When opening the management panel
    And opening section to manage action statuses
    And list of documented actions statuses is opened
    When I select on a specific status
    Then form for editing the action status should be opened
    When I edit the name of action status option
    Then save the details
    Then edit success notification should be displayed and new action should be reflected in the list

  Scenario: Delete action status option
    Given an authorized technical lead
    When opening the management panel
    And opening section to manage action statuses
    And list of documented actions statuses is opened
    When I select on a specific status
    When selecting to delete an action status
    And delete confirmation dialog is displayed
    Then I should be able to confirm delete and action status should be removed from the list

  Scenario: Delete already used action status option
    Given an authorized technical lead
    When opening the management panel
    And opening section to manage action statuses
    And list of documented actions statuses is opened
    And I select on a action status option that is already used on some recorded action status
    When selecting to delete an action status
    And delete confirmation dialog is displayed
    Then I should be restricted to delete



