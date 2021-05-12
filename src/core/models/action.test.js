import Action from "./action";
import {CustomFormField} from "./customFormField";
const actionPayload = {
    "trackedEntityInstance": "IskzfRox6Y7",
    "relationships": [
        {
            "relationship": "HvRPRFqOUKP",
            "from": {
                "trackedEntityInstance": {
                    "trackedEntityInstance": "bZNMQihFlvN"
                }
            }
        }
    ],
    "attributes": [
        {
            "attribute": "jFjnkx49Lg3",
            "value": "2020-01-01"
        },
        {
            "attribute": "Hi3IjyMXzeW",
            "value": "RyntrjFSMLK"
        },
        {
            "attribute": "Ax6bWbKn46e",
            "value": "DMO"
        },
        {
            "attribute": "G3aWsZW2MpV",
            "value": "Eric Chingalo"
        },
        {
            "attribute": "BYCbHJ46BOr",
            "value": "2020-12-31"
        },
        {
            "attribute": "GlvCtGIytIz",
            "value": "Testing item"
        },
        {
            "attribute": "HQxzVwKedKu",
            "value": "Testing Action tem"
        }
    ],
    "enrollments": [
        {
            "events": [
                {
                    "programStage": "cBiAEANcXAj",
                    "event": "Rhup2Apbmd6",
                    "trackedEntityInstance": "IskzfRox6Y7",
                    "eventDate": "2020-01-01T00:00:00.000",
                    "dataValues": [
                        {
                            "dataElement": "FnengvwgsQv",
                            "value": "Waiting on approval"
                        },
                        {
                            "dataElement": "f8JYVWLC7rE",
                            "value": "Waiting"
                        },
                        {
                            "dataElement": "nodiP54ocf5",
                            "value": "2020-01-01"
                        }
                    ]
                }
            ]
        }
    ]
}

describe('Test action', () => {
    it('creates valid instance', () => {
        const action = new Action(actionPayload);
        expect(action.id).toBeDefined()
        expect(action.title).toBeDefined()
        expect(action.description).toBeDefined()
        expect(action.startDate).toBeDefined()
        expect(action.endDate).toBeDefined()
        expect(action.actionToSolutionLinkage).toBeDefined()
        expect(action.relationshipId).toBeDefined()
        expect(action.challengeId).toBeDefined()
    })
    it('setValuesForm', () => {
        const formValues = {
            "HQxzVwKedKu": {"value": "Testing Action tem", "name": "HQxzVwKedKu"},
            "GlvCtGIytIz": {"value": "Testing payload", "name": "GlvCtGIytIz"},
            "jFjnkx49Lg3": {"value": "2020-01-01", "name": "jFjnkx49Lg3"},
            "BYCbHJ46BOr": {"value": "2020-12-31", "name": "BYCbHJ46BOr"},
            "G3aWsZW2MpV": {"value": "Eric Chingalo", "name": "G3aWsZW2MpV"},
            "Ax6bWbKn46e": {"value": "District Officer", "name": "Ax6bWbKn46e"},
            "solution": {
                "id": "L2LF0SeYaAO",
                "eventDate": "2021-05-04T07:58:37.533",
                "solution": "Adding solution...",
                "gapLinkage": "ks6e1xgCiNt",
                "actionLinkage": "UZL8VQkJzva",
                "indicatorId": "DN24bdPY232",
                "orgUnit": "fdc6uOvgoji"
            }
        }
        const action = new Action();
        action.setValuesFromForm(formValues);
        expect(action.id).toBeDefined()
        expect(action.title).toBeDefined()
        expect(action.description).toBeDefined()
        expect(action.startDate).toBeDefined()
        expect(action.endDate).toBeDefined()
        expect(action.actionToSolutionLinkage).toBeDefined()
    })
    it('getFormValues', () => {
        const action = new Action(actionPayload);
        const formValues = action.getFormValues();
        expect(formValues).toEqual({
            "HQxzVwKedKu": {"value": "Testing Action tem", "name": "HQxzVwKedKu"},
            "GlvCtGIytIz": {"value": "Testing item", "name": "GlvCtGIytIz"},
            "jFjnkx49Lg3": {"value": "2020-01-01", "name": "jFjnkx49Lg3"},
            "BYCbHJ46BOr": {"value": "2020-12-31", "name": "BYCbHJ46BOr"},
            "G3aWsZW2MpV": {"value": "Eric Chingalo", "name": "G3aWsZW2MpV"},
            "Ax6bWbKn46e": {"value": "DMO", "name": "Ax6bWbKn46e"},
        })
    })
    it('getPayload', () => {
        const dataFromForm = {
            "HQxzVwKedKu": {"value": "Another Testing Action", "name": "HQxzVwKedKu"},
            "GlvCtGIytIz": {"value": "Testing value", "name": "GlvCtGIytIz"},
            "jFjnkx49Lg3": {"value": "2020-01-01", "name": "jFjnkx49Lg3"},
            "BYCbHJ46BOr": {"value": "2020-12-31", "name": "BYCbHJ46BOr"},
            "G3aWsZW2MpV": {"value": "Erick Chingalo", "name": "G3aWsZW2MpV"},
            "Ax6bWbKn46e": {"value": "Regional Officer", "name": "Ax6bWbKn46e"},
            "solution": {
                "id": "A9MBVerCdz2",
                "eventDate": "2021-05-12T08:12:22.450",
                "solution": "Retain staff",
                "gapLinkage": "tAd1rQ7UcXz",
                "actionLinkage": "RyntrjFSMLK",
                "indicatorId": "bZNMQihFlvN",
                "orgUnit": "O6uvpzGd5pu"
            }
        }
        const action = new Action();
        action.setValuesFromForm(dataFromForm);
        expect(action.getPayload([], 'O6uvpzGd5pu')).toEqual({
            "trackedEntityInstance": expect.any(String),
            "trackedEntityType": "TFYpX5EXmYp",
            "orgUnit": "O6uvpzGd5pu",
            "attributes": [
                {"attribute": "HQxzVwKedKu", "value": "Another Testing Action"}, {
                    "attribute": "GlvCtGIytIz",
                    "value": "Testing value"
                }, {"attribute": "jFjnkx49Lg3", "value": "2020-01-01"}, {
                    "attribute": "BYCbHJ46BOr",
                    "value": "2020-12-31"
                }, {"attribute": "G3aWsZW2MpV", "value": "Erick Chingalo"}, {
                    "attribute": "Ax6bWbKn46e",
                    "value": "Regional Officer"
                }, {"attribute": "Hi3IjyMXzeW", "value": "RyntrjFSMLK"}],
            "enrollments": [{
                "program": "unD7wro3qPm",
                "trackedEntityInstance": expect.any(String),
                "enrollmentDate": expect.any(Date),
                "incidentDate": expect.any(Date),
                "status": "ACTIVE",
                "orgUnit": "O6uvpzGd5pu",
                "events": [],
                "enrollment": expect.any(String)
            }],
            "relationships": expect.any(Array)
        })
    })
    it('getFormFields', () => {
        const actionMetadata = {
            "id": "unD7wro3qPm",
            "programStages": [{
                "id": "cBiAEANcXAj",
                "programStageDataElements": [{
                    "displayInReports": true,
                    "compulsory": true,
                    "dataElement": {
                        "name": "Actiontracker_Action status",
                        "id": "f8JYVWLC7rE",
                        "formName": "Action status",
                        "valueType": "TEXT",
                        "optionSet": {
                            "options": [{
                                "code": "Waiting",
                                "name": "Waiting",
                                "style": {"color": "#b8e986", "icon": "triangle_medium_positive"}
                            }, {
                                "code": "Testing",
                                "name": "Testing",
                                "style": {"color": "#50e3c2", "icon": "i_note_action_outline"}
                            }, {
                                "code": "Not started",
                                "name": "Not started",
                                "style": {"color": "#4a90e2", "icon": "alert_positive"}
                            }, {
                                "code": " In progress",
                                "name": "In progress",
                                "style": {"color": "#f5a623", "icon": "high_level_positive"}
                            }, {
                                "code": "Completed",
                                "name": "Completed",
                                "style": {"color": "#7ed321", "icon": "yes_positive"}
                            }, {
                                "code": "Cancelled",
                                "name": "Cancelled",
                                "style": {"color": "#d0021b", "icon": "no_outline"}
                            }]
                        }
                    }
                }, {
                    "displayInReports": true,
                    "compulsory": true,
                    "dataElement": {
                        "name": "Actiontracker_Review Date",
                        "id": "nodiP54ocf5",
                        "formName": "Review Date",
                        "valueType": "DATE"
                    }
                }, {
                    "displayInReports": true,
                    "compulsory": false,
                    "dataElement": {
                        "name": "Actiontracker_Remarks / comments",
                        "id": "FnengvwgsQv",
                        "formName": "Remarks / comment",
                        "valueType": "LONG_TEXT"
                    }
                }]
            }],
            "programTrackedEntityAttributes": [{
                "displayInList": true,
                "mandatory": true,
                "searchable": true,
                "trackedEntityAttribute": {
                    "name": "Actiontracker_Title",
                    "id": "HQxzVwKedKu",
                    "formName": "Title",
                    "valueType": "TEXT"
                }
            }, {
                "displayInList": true,
                "mandatory": true,
                "searchable": true,
                "trackedEntityAttribute": {
                    "name": "Actiontracker_Description",
                    "id": "GlvCtGIytIz",
                    "formName": "Description",
                    "valueType": "LONG_TEXT"
                }
            }, {
                "displayInList": true,
                "mandatory": true,
                "searchable": true,
                "trackedEntityAttribute": {
                    "name": "Actiontracker_Start Date",
                    "id": "jFjnkx49Lg3",
                    "formName": "Start Date",
                    "valueType": "DATE"
                }
            }, {
                "displayInList": true,
                "mandatory": true,
                "searchable": true,
                "trackedEntityAttribute": {
                    "name": "Actiontracker_End Date",
                    "id": "BYCbHJ46BOr",
                    "formName": "End Date",
                    "valueType": "DATE"
                }
            }, {
                "displayInList": true,
                "mandatory": false,
                "searchable": true,
                "trackedEntityAttribute": {
                    "name": "Actiontracker_Responsible Person",
                    "id": "G3aWsZW2MpV",
                    "formName": "Responsible Person",
                    "valueType": "TEXT"
                }
            }, {
                "displayInList": true,
                "mandatory": false,
                "searchable": false,
                "trackedEntityAttribute": {
                    "name": "Actiontracker_Designation",
                    "id": "Ax6bWbKn46e",
                    "formName": "Designation",
                    "valueType": "TEXT"
                }
            }, {
                "displayInList": false,
                "mandatory": false,
                "searchable": false,
                "trackedEntityAttribute": {
                    "name": "Actiontracker_Action To Solution Linkage",
                    "id": "Hi3IjyMXzeW",
                    "formName": "Action To Solution Linkage",
                    "valueType": "TEXT"
                }
            }]
        };
        expect(Action.getFormFields(actionMetadata)).toEqual([new CustomFormField({
            "id": "HQxzVwKedKu",
            "name": "Actiontracker_Title",
            "formName": "Title",
            "valueType": "TEXT",
            "mandatory": true
        }), new CustomFormField({
            "id": "GlvCtGIytIz",
            "name": "Actiontracker_Description",
            "formName": "Description",
            "valueType": "LONG_TEXT",
            "mandatory": true
        }), new CustomFormField({
            "id": "jFjnkx49Lg3",
            "name": "Actiontracker_Start Date",
            "formName": "Start Date",
            "valueType": "DATE",
            "mandatory": true
        }), new CustomFormField({
            "id": "BYCbHJ46BOr",
            "name": "Actiontracker_End Date",
            "formName": "End Date",
            "valueType": "DATE",
            "mandatory": true
        }), new CustomFormField({
            "id": "G3aWsZW2MpV",
            "name": "Actiontracker_Responsible Person",
            "formName": "Responsible Person",
            "valueType": "TEXT",
            "mandatory": false
        }), new CustomFormField({
            "id": "Ax6bWbKn46e",
            "name": "Actiontracker_Designation",
            "formName": "Designation",
            "valueType": "TEXT",
            "mandatory": false
        })])
    })
})
