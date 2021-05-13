import Gap from "./gap";
import {CustomFormField} from "./customFormField";

const gapPayload = {
    "programStage": "zXB8tWKuwcl",
    "orgUnit": "O6uvpzGd5pu",
    "event": "GBN9ljg0tiV",
    "trackedEntityInstance": "bZNMQihFlvN",
    "eventDate": "2021-05-12T08:08:52.813",
    "orgUnitName": "Bo",
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

describe('Test gap', () => {
    it('constructor creates valid instance', () => {
        const gap = new Gap(gapPayload);
        expect(gap.id).toBeDefined()
        expect(gap.eventDate).toBeDefined()
        expect(gap.indicatorId).toBeDefined()
        expect(gap.method).toBeDefined()
        expect(gap.title).toBeDefined()
    })
    it('setValuesForm', () => {
        const formValues = {
            "JbMaVyglSit": {"value": "Testing Gap", "name": "JbMaVyglSit"},
            "GsbZkewUna5": {"value": "Testing gap", "name": "GsbZkewUna5"},
            "W50aguV39tU": {"value": "Bottleneck analysis", "name": "W50aguV39tU"}
        }
        const gap = new Gap();
        gap.setValuesFromForm(formValues);
        expect(gap.title).toBeDefined()
        expect(gap.description).toBeDefined()
        expect(gap.method).toBeDefined()
    })
    it('getFormValues', () => {
        const gap = new Gap(gapPayload);
        const formValues = gap.getFormValues();
        expect(formValues).toEqual({
            "JbMaVyglSit": {"value": expect.any(String), "name": "JbMaVyglSit"},
            "GsbZkewUna5": {"value": expect.any(String), "name": "GsbZkewUna5"},
            "W50aguV39tU": {"value": expect.any(String), "name": "W50aguV39tU"}
        })
    })
    it('getPayload', () => {
        const dataFromForm = {
            "JbMaVyglSit": {"value": "Testing Gap", "name": "JbMaVyglSit"},
            "GsbZkewUna5": {"value": "Testing gap", "name": "GsbZkewUna5"},
            "W50aguV39tU": {"value": "Bottleneck analysis", "name": "W50aguV39tU"}
        }
        const gap = new Gap();
        gap.setValuesFromForm(dataFromForm);
        gap.indicatorId = 'indicatorId'
        expect(gap.getPayload('O6uvpzGd5pu')).toEqual({
            "event": expect.any(String),
            "orgUnit": expect.any(String),
            "trackedEntityInstance": 'indicatorId',
            "program": "Uvz0nfKVMQJ",
            "programStage": "zXB8tWKuwcl",
            "dataValues": [{"dataElement": "JbMaVyglSit", "value": expect.any(String)}, {
                "dataElement": "GsbZkewUna5",
                "value": expect.any(String)
            }, {"dataElement": "W50aguV39tU", "value": expect.any(String)}, {
                "dataElement": "kBkyDytdOmC",
                "value": expect.any(String)
            }],
            "eventDate": expect.any(Date)
        })
    })
    it('getFormFields', () => {
        const gapMetadata = {
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
        expect(Gap.getFormFields(gapMetadata)).toEqual([
            new CustomFormField({
                "id": "JbMaVyglSit",
                "name": "Actiontracker_Title",
                "formName": "Title",
                "valueType": "TEXT",
                "compulsory": true
            }),
            new CustomFormField({
                "id": "GsbZkewUna5",
                "name": "Actiontracker_Description",
                "formName": "Description",
                "valueType": "LONG_TEXT",
                "compulsory": true
            }),
            new CustomFormField({
                "id": "W50aguV39tU",
                "name": "Actiontracker_Method",
                "formName": "Method",
                "valueType": "TEXT",
                "compulsory": true,
                "optionSet": {
                    "options": [{
                        "code": "Bottleneck analysis",
                        "name": "Bottleneck analysis"
                    }, {"code": "Root cause analysis", "name": "Root cause analysis"}, {
                        "code": "Another Method",
                        "name": "Another Method"
                    }]
                }
            })
        ])
    })
})

