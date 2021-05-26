Feature: Challenge Identification Methods Management

  As George, HMIS technical lead, I want to be able to set up the action tracker to include documentation of methods
  used to derive the action so that users can complete fields related to methods used e.g., if it is BNA then they
  can add interventions, bottlenecks and indicators.

  Scenario: List challenge methods options
    Given an authorized technical lead
    When opening the management panel
    And open section to manage challenge identification methods
    Then a list of already set challenge identification methods should be visible

  Scenario: Add challenge methods option
    Given an authorized technical lead
    When opening the management panel
    And open section to manage challenge identification methods
    Then a button to open a form for setting up new method should be visible
    And when the button is clicked, it should open a form for setting up a new method
    When the form is filled with the required fields
    And the form is submitted
    Then a success notification should be displayed
    And the changes should be reflected on the list


  Scenario: Edit challenge methods option
    Given an authorized technical lead
    When opening the management panel
    And open section to manage challenge identification methods
    When a list of challenge identification methods is displayed
    And the edit button for one of the method is clicked
    Then the editing form should be displayed with prefilled values
    When the changes are made
    And the form is submitted
    Then a success notification should be displayed
    And the edited changes should be reflected on the list


  Scenario: Delete challenge methods option
    Given an authorized technical lead
    When opening the management panel
    And open section to manage challenge identification methods
    When a list of challenge identification methods is displayed
    And the delete button for one of the method is clicked
    Then a confirmation dialog should be displayed asking for delete confirmation
    When the method is deleted
    Then a success notification should be displayed
    And the deleted method should not visible on the list


