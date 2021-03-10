Feature: Gap And Solution List

    As Henry, a CHMT member,
    I want to see all major actions we have to work on
    so that I can plan my duties or our duties accordingly

    @focus
    Scenario: View Gap and Solution List
        Given an authorized CHMT member
        When selecting assigned district
        And selecting period for planning
        Then list of identified gaps and agreed solutions should be displayed

    @focus
    Scenario: View Empty List
        Given an authorized CHMT member
        When selecting assigned district
        And selecting period for planning
        Then I should be presented with a message "You currently don't have any gaps to work on"