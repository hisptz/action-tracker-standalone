Feature: Action Item Documentation

  As Henry, a CHMT member,
  I want to see all major actions we have to work on
  so that I can plan my duties or our duties accordingly

  @focus
  Scenario: Add Action Item
    Given an authorized CHMT member
    When selecting assigned district Bombali
    When selecting period for planning as 2020
    And with the list of identified gaps and agreed solutions
    When setting action items for agreed the solutions
    And saving action items
    Then CHMT member should be displayed with save confirmation message/notification
    And update should be reflected in the list
