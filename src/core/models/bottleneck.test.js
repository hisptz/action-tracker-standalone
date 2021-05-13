import Bottleneck from "./bottleneck";
import {CustomFormField} from "./customFormField";

const bottleneckPayload = {
    "orgUnit": "O6uvpzGd5pu",
    "trackedEntityInstance": "bZNMQihFlvN",
    "attributes": [
        {
            "attribute": "tVlKbtVfNjc",
            "value": "zwT9WM1hIGV"
        },
        {
            "attribute": "jZ6WL4NQtp5",
            "value": "This here intervention"
        }
    ],
    "enrollments": [
        {
            "events": [
                {
                    "programStage": "JJaKjcOBapi",
                    "event": "A9MBVerCdz2",
                    "dataValues": [
                        {
                            "dataElement": "upT2cOT6UfJ",
                            "value": "Retain staff"
                        },
                        {
                            "dataElement": "kBkyDytdOmC",
                            "value": "tAd1rQ7UcXz"
                        },
                        {
                            "dataElement": "Y4CIGFwWYJD",
                            "value": "RyntrjFSMLK"
                        }
                    ]
                },
                {
                    "programStage": "JJaKjcOBapi",
                    "event": "V7V5NkJEsra",
                    "dataValues": [
                        {
                            "dataElement": "upT2cOT6UfJ",
                            "value": "Train staff"
                        },
                        {
                            "dataElement": "kBkyDytdOmC",
                            "value": "tAd1rQ7UcXz"
                        },
                        {
                            "dataElement": "Y4CIGFwWYJD",
                            "value": "PqQf0YtVdEm"
                        }
                    ]
                },
                {
                    "programStage": "JJaKjcOBapi",
                    "event": "I3afaNhnV1X",
                    "dataValues": [
                        {
                            "dataElement": "upT2cOT6UfJ",
                            "value": "Train staff"
                        },
                        {
                            "dataElement": "kBkyDytdOmC",
                            "value": "tAd1rQ7UcXz"
                        },
                        {
                            "dataElement": "Y4CIGFwWYJD",
                            "value": "Y2dTrHDbN5y"
                        }
                    ]
                },
                {
                    "programStage": "zXB8tWKuwcl",
                    "event": "GBN9ljg0tiV",
                    "dataValues": [
                        {
                            "dataElement": "GsbZkewUna5",
                            "value": "Most staff working on the project are untrained"
                        },
                        {
                            "dataElement": "JbMaVyglSit",
                            "value": "Untrained staff"
                        },
                        {
                            "dataElement": "kBkyDytdOmC",
                            "value": "tAd1rQ7UcXz"
                        },
                        {
                            "dataElement": "W50aguV39tU",
                            "value": "Bottleneck analysis"
                        }
                    ]
                }
            ]
        }
    ]
}

describe('Test bottleneck', () => {
    it('constructor creates valid instance', () => {
        const bottleneck = new Bottleneck(bottleneckPayload);
        expect(bottleneck.id).toBeDefined()
        expect(bottleneck.indicator).toBeDefined()
        expect(bottleneck.intervention).toBeDefined()
        expect(bottleneck.orgUnit).toBeDefined()
    })
    it('setValuesForm', () => {
        const formValues = {
            "jZ6WL4NQtp5": {"value": "This here intervention", "name": "jZ6WL4NQtp5"},
            "tVlKbtVfNjc": {"name": "tVlKbtVfNjc", "value": "zwT9WM1hIGV"}
        }
        const bottleneck = new Bottleneck();
        bottleneck.setValuesFromForm(formValues);
        expect(bottleneck.indicator).toBeDefined()
        expect(bottleneck.intervention).toBeDefined()
    })
    it('getFormValues', () => {
        const bottleneck = new Bottleneck(bottleneckPayload);
        const formValues = bottleneck.getFormValues();
        expect(formValues).toEqual({
            "jZ6WL4NQtp5": {"value": expect.any(String), "name": "jZ6WL4NQtp5"},
            "tVlKbtVfNjc": {"name": "tVlKbtVfNjc", "value": expect.any(String)}
        })
    })
    it('getPayload', () => {
        const dataFromForm = {
            "jZ6WL4NQtp5": {"value": "This here intervention", "name": "jZ6WL4NQtp5"},
            "tVlKbtVfNjc": {"name": "tVlKbtVfNjc", "value": "zwT9WM1hIGV"}
        }
        const bottleneck = new Bottleneck();
        bottleneck.setValuesFromForm(dataFromForm);
        expect(bottleneck.getPayload([], 'O6uvpzGd5pu')).toEqual({
            "orgUnit": expect.any(String),
            "trackedEntityType": "jLaBp1GaZQ9",
            "trackedEntityInstance": expect.any(String),
            "attributes": [{"attribute": "tVlKbtVfNjc", "value": expect.any(String)}, {
                "attribute": "jZ6WL4NQtp5",
                "value": expect.any(String)
            }],
            "enrollments": [{
                "program": "Uvz0nfKVMQJ",
                "trackedEntityInstance": expect.any(String),
                "events": [],
                "enrollmentDate": expect.any(Date),
                "incidentDate": expect.any(Date),
                "status": "ACTIVE",
                "orgUnit": expect.any(String),
                "enrollment": expect.any(String)
            }]
        })
    })
    it('getFormFields', () => {
        const bottleneckMetadata = {
            "id": "Uvz0nfKVMQJ",
            "programStages": [{
                "id": "zXB8tWKuwcl",
                "programStageDataElements": [{
                    "displayInReports": true,
                    "compulsory": true,
                    "dataElement": {
                        "name": "Actiontracker_Title",
                        "id": "JbMaVyglSit",
                        "formName": "Title",
                        "valueType": "TEXT"
                    }
                }, {
                    "displayInReports": true,
                    "compulsory": true,
                    "dataElement": {
                        "name": "Actiontracker_Description",
                        "id": "GsbZkewUna5",
                        "formName": "Description",
                        "valueType": "LONG_TEXT"
                    }
                }, {
                    "displayInReports": true,
                    "compulsory": true,
                    "dataElement": {
                        "name": "Actiontracker_Method",
                        "id": "W50aguV39tU",
                        "formName": "Method",
                        "valueType": "TEXT",
                        "optionSet": {
                            "options": [{
                                "code": "Bottleneck analysis",
                                "name": "Bottleneck analysis"
                            }, {
                                "code": "Root cause analysis",
                                "name": "Root cause analysis"
                            }, {"code": "Another Method", "name": "Another Method"}]
                        }
                    }
                }, {
                    "displayInReports": true,
                    "compulsory": false,
                    "dataElement": {
                        "name": "Actiontracker_Solution To Gap Linkage",
                        "id": "kBkyDytdOmC",
                        "formName": "Solution To Gap Linkage",
                        "valueType": "TEXT"
                    }
                }]
            }, {
                "id": "JJaKjcOBapi",
                "programStageDataElements": [{
                    "displayInReports": true,
                    "compulsory": true,
                    "dataElement": {
                        "name": "Actiontracker_Solution ",
                        "id": "upT2cOT6UfJ",
                        "formName": "Solution",
                        "valueType": "LONG_TEXT"
                    }
                }, {
                    "displayInReports": true,
                    "compulsory": false,
                    "dataElement": {
                        "name": "Actiontracker_Solution To Gap Linkage",
                        "id": "kBkyDytdOmC",
                        "formName": "Solution To Gap Linkage",
                        "valueType": "TEXT"
                    }
                }, {
                    "displayInReports": true,
                    "compulsory": false,
                    "dataElement": {
                        "name": "Actiontracker_Solution To Action Linkage",
                        "id": "Y4CIGFwWYJD",
                        "formName": "Solution To Action Linkage",
                        "valueType": "TEXT"
                    }
                }]
            }],
            "programTrackedEntityAttributes": [{
                "displayInList": true,
                "mandatory": true,
                "searchable": true,
                "trackedEntityAttribute": {
                    "name": "Actiontracker_Intervention",
                    "id": "jZ6WL4NQtp5",
                    "formName": "Intervention",
                    "valueType": "TEXT"
                }
            }, {
                "displayInList": true,
                "mandatory": false,
                "searchable": true,
                "trackedEntityAttribute": {
                    "name": "Actiontracker_Bottleneck",
                    "id": "WLFrBgfl7lU",
                    "formName": "Bottleneck",
                    "valueType": "TEXT"
                }
            }, {
                "displayInList": true,
                "mandatory": false,
                "searchable": true,
                "trackedEntityAttribute": {
                    "name": "Actiontracker_Coverage Indicator",
                    "id": "imiLbaQKYnA",
                    "formName": "Coverage Indicator",
                    "valueType": "TEXT"
                }
            }, {
                "displayInList": true,
                "mandatory": true,
                "searchable": true,
                "trackedEntityAttribute": {
                    "name": "Actiontracker_Indicator",
                    "id": "tVlKbtVfNjc",
                    "formName": "Indicator",
                    "valueType": "TEXT"
                }
            }]
        }
        expect(Bottleneck.getFormFields(bottleneckMetadata)).toEqual([new CustomFormField({
            "id": "jZ6WL4NQtp5",
            "name": "Actiontracker_Intervention",
            "formName": "Intervention",
            "valueType": "TEXT",
            "mandatory": true
        }), new CustomFormField({
            "id": "tVlKbtVfNjc",
            "name": "Actiontracker_Indicator",
            "formName": "Indicator",
            "valueType": "TEXT",
            "mandatory": true
        })])
    })

})

