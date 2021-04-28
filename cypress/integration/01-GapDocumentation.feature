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
        And I am allowed to access challenges managment form
        When opening the form to record challenges
        Then form with all needed fields should be displayed

    @focus
    Scenario: Record Challenges
        Given an authorized District Planning officer
        And Form to record challenges is opened
        When selecting indicator or bottleneck with challenges
        And type in faced challenges for the indicator one after another
        And save the details
        Then district planning officer should be displayed with save confirmation message
        And saved data should be reflected in the list
