Feature: General Settings Management

  As Husna, an administrative user, I want to be able to define frequency (monthly, quarterly, annually etc.) for
  actions to be reviewed so that users can be guided on specific periods/frequency they will be expected to provide
  feedback on progress

  Scenario:
    Given an authorized technical lead
    When opening the management panel
    And opening section to manage planning and tracking frequencies
    Then I should be presented with way to set planning period
  Scenario:
    Given an authorized technical lead
    When opening the management panel
    And opening section to manage planning and tracking frequencies
    When I select period type and save
    Then the selected period type should be saved, save success message displayed and period selection should reflect selected type

  Scenario:
    Given an authorized technical lead
    When opening the management panel
    And opening section to manage planning and tracking frequencies
    And planning period is selected
    When I view list of frequency for tracking actions
    Then I should be displayed a list with period types at same level or lower than the selected planning period type
  Scenario:
    Given an authorized technical lead
    And I view list of frequency for tracking actions
    When I select action tracking frequency and save
    Then the selected frequency should be saved, save success message displayed and tracking periods should reflect selected frequency

  Scenario:
    Given an authorized technical lead
    And opening the management panel
    And opening section to manage planning and tracking frequencies
    Then I should be presented with a way to set planning organisation unit level
  Scenario:
    Given an authorized technical lead
    And opening the management panel
    And opening section to manage planning and tracking frequencies
    When I select a planning organisation unit level
    Then the selected planning organisation unit level should be saved and the changes reflected


