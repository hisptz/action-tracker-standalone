Feature: General Settings Management

  As Husna, an administrative user, I want to be able to define frequency (monthly, quarterly, annually etc.) for
  actions to be reviewed so that users can be guided on specific periods/frequency they will be expected to provide
  feedback on progress

  Scenario: Verify planning and tracking period settings availability
    Given an authorized technical lead
    When opening the management panel
    And opening section to manage planning and tracking frequencies
    Then I should be presented with way to set planning period

  Scenario: Set planning period
    Given an authorized technical lead
    When opening the management panel
    And opening section to manage planning and tracking frequencies
    When I select period type and save
    Then the selected period type should be saved, save success message displayed and period selection should reflect selected type

  Scenario: Verify tracking period list
    Given an authorized technical lead
    When opening the management panel
    And opening section to manage planning and tracking frequencies
    And planning period is selected
    When I view list of frequency for tracking actions
    Then I should be displayed a list with period types at same level or lower than the selected planning period type
  Scenario: Set tracking period
    Given an authorized technical lead
    When opening the management panel
    And opening section to manage planning and tracking frequencies
    And I view list of frequency for tracking actions
    When I select action tracking frequency and save
    Then the selected frequency should be saved, save success message displayed and tracking periods should reflect selected frequency

  Scenario: Verify planning org unit level settings availability
    Given an authorized technical lead
    And opening the management panel
    And opening section to manage planning and tracking frequencies
    Then I should be presented with a way to set planning organisation unit level

  Scenario: Set planning org unit level
    Given an authorized technical lead
    And opening the management panel
    And opening section to manage planning and tracking frequencies
    When I select a planning organisation unit level
    Then the selected planning organisation unit level should be saved and the changes reflected

  Scenario: All configurations are reset
    Given reset all configuration


