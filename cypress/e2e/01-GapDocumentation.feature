Feature: Gap or Challenges Documentation

    As Maryam, a district planning officer,
    I want to be able to document challenges I face
    so that I will be able to follow-up easily in the future
    @focus
    Scenario: Authorize Challenge Management
        Given an authorized District Planning officer
        When selecting assigned district Kono
        And selecting period for planning as 2020
        Then I should be authorized or have a means to add a challenges should be visible and enabled

    @focus
    Scenario: Access Challenge Management Form
        Given an authorized District Planning officer
        When selecting assigned district Kono
        And selecting period for planning as 2020
        And I am allowed to access challenges management form
        When opening the form to record challenges
        Then form with all needed fields should be displayed

    @focus
    Scenario: Record Challenges
        Given an authorized District Planning officer
        When selecting assigned district Kono
        And selecting period for planning as 2020
        When opening the form to record challenges
        And form with all needed fields should be displayed
        Then i should be able to fill all the fields and submit the form
        Then the added intervention should be reflected on the list

        # Added these to test adding bottleneck, and possible solution
        Then i should be able to open a bottleneck form
        And bottleneck form with all required fields should be visible
        Then i should be able to fill all the bottleneck form field and submit the form
        Then the added bottleneck should be reflected on the list
        Then i should be able to open the possible solution form
        And possible solution form with all the required fields should be visible
        Then I should be able to fill all the possible solution form fields and submit the form
        Then the added solution should be reflected on the list

