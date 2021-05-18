Feature: Gap/Challenges Documentation

    As Maryam, a district planning officer,
    I want to be able to document challenges I face
    so that I will be able to follow-up easily in the future

    @focus
    Scenario: Authorize Challenge Management
        Given an authorized District Planning officer
        When selecting assigned district
        And selecting period for planning
        Then I should be authorized or have a means to add a challenges should be visible and enabled

    @focus
    Scenario: Access Challenge Management Form
        Given an authorized District Planning officer
        When selecting assigned district
        And selecting period for planning
        And I am allowed to access challenges management form
        When opening the form to record challenges
        Then form with all needed fields should be displayed

    @focus
    Scenario: Record Challenges
        Given an authorized District Planning officer
        When selecting assigned district
        And selecting period for planning
        When opening the form to record challenges
        And form with all needed fields should be displayed
        Then i should be able to fill all the fields and submit the form

