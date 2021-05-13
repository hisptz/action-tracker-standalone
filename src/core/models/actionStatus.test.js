import ActionStatus from "./actionStatus";
import {CustomFormField} from "./customFormField";

const actionStatusPayload = {
    "programStage": "cBiAEANcXAj",
    "orgUnit": "O6uvpzGd5pu",
    "event": "Rhup2Apbmd6",
    "trackedEntityInstance": "IskzfRox6Y7",
    "eventDate": "2020-01-01T00:00:00.000",
    "orgUnitName": "Bo",
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

describe('Test actionStatus', () => {
    it('constructor creates valid instance', () => {
        const actionStatus = new ActionStatus(actionStatusPayload);
        expect(actionStatus.id).toBeDefined()
        expect(actionStatus.eventDate).toBeDefined()
        expect(actionStatus.reviewDate).toBeDefined()
        expect(actionStatus.status).toBeDefined()
    })
    it('setValuesForm', () => {
        const formValues = {
            "f8JYVWLC7rE": {"value": "Waiting", "name": "f8JYVWLC7rE"},
            "nodiP54ocf5": {"value": "2020-01-09", "name": "nodiP54ocf5"},
            "FnengvwgsQv": {"value": "Waiting testing", "name": "FnengvwgsQv"}
        }
        const actionStatus = new ActionStatus();
        actionStatus.setValuesFromForm(formValues);
        expect(actionStatus.status).toBeDefined()
        expect(actionStatus.remarks).toBeDefined()
        expect(actionStatus.reviewDate).toBeDefined()
    })
    it('getFormValues', () => {
        const actionStatus = new ActionStatus(actionStatusPayload);
        const formValues = actionStatus.getFormValues();
        expect(formValues).toEqual({
            "f8JYVWLC7rE": {"value": expect.any(String), "name": "f8JYVWLC7rE"},
            "nodiP54ocf5": {"value": expect.any(String), "name": "nodiP54ocf5"},
            "FnengvwgsQv": {"value": expect.any(String), "name": "FnengvwgsQv"},
            "actionId": expect.any(String)
        })
    })
    it('getPayload', () => {
        const dataFromForm = {
            "f8JYVWLC7rE": {"value": "Waiting", "name": "f8JYVWLC7rE"},
            "nodiP54ocf5": {"value": "2020-01-09", "name": "nodiP54ocf5"},
            "FnengvwgsQv": {"value": "Waiting testing", "name": "FnengvwgsQv"}
        }
        const actionStatus = new ActionStatus();
        actionStatus.setValuesFromForm(dataFromForm);
        actionStatus.actionId = 'actionId'
        expect(actionStatus.getPayload('O6uvpzGd5pu')).toEqual({
            "event": expect.any(String),
            "eventDate": expect.any(String),
            "trackedEntityInstance": 'actionId',
            "program": "unD7wro3qPm",
            "orgUnit": "O6uvpzGd5pu",
            "programStage": "cBiAEANcXAj",
            "dataValues": [{"dataElement": "f8JYVWLC7rE", "value": expect.any(String)}, {
                "dataElement": "FnengvwgsQv",
                "value": expect.any(String)
            }, {"dataElement": "nodiP54ocf5", "value": expect.any(String)}
            ]
        })
    })
    it('getFormFields', () => {
        const actionStatusMetadata = {
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
        }
        expect(ActionStatus.getFormFields(actionStatusMetadata)).toEqual([
            new CustomFormField({
                "id": "f8JYVWLC7rE",
                "name": "Actiontracker_Action status",
                "formName": "Action status",
                "valueType": "TEXT",
                "compulsory": true,
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
                    }, {"code": "Cancelled", "name": "Cancelled", "style": {"color": "#d0021b", "icon": "no_outline"}}]
                }
            }),
            new CustomFormField({
                "id": "nodiP54ocf5",
                "name": "Actiontracker_Review Date",
                "formName": "Review Date",
                "valueType": "DATE",
                "compulsory": true
            }),
            new CustomFormField({
                "id": "FnengvwgsQv",
                "name": "Actiontracker_Remarks / comments",
                "formName": "Remarks / comment",
                "valueType": "LONG_TEXT",
                "compulsory": false
            })
        ])
    })
})

