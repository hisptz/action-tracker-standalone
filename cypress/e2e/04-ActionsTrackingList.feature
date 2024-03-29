Feature: Action Tracking List

    As Henry, a CHMT member,
    I want to be able to know more information about the actions we are working on including what was the issue, agreed solutions and what happened to the agreed solutions
    so that I will be in position to come up with alternative plans if required.

    @focus
    Scenario: View Tracked Action List
        Given an authorized CHMT member
        When selecting assigned district Bo
        Then selecting period for planning as 2020
        Then select to track actions
        Then list of identified gaps, their solutions, action items and statuses should be displayed in calendar view fashion following configured period type

    @focus
    Scenario: View Empty Tracked Action List
        Given an authorized CHMT member
        When selecting assigned district Tonkolili
        Then selecting period for planning as 2020
        Then select to track actions
        Then I should be presented with a message "There are no interventions documented for selected organisation unit and period."
