import PossibleSolution from "./possibleSolution";
import {CustomFormField} from "./customFormField";

const solutionPayload = {
    "programStage": "JJaKjcOBapi",
    "orgUnit": "O6uvpzGd5pu",
    "event": "A9MBVerCdz2",
    "trackedEntityInstance": "bZNMQihFlvN",
    "eventDate": "2021-05-12T08:12:22.450",
    "orgUnitName": "Bo",
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
}

describe('Test solution', () => {
    it('constructor creates valid instance', () => {
        const solution = new PossibleSolution(solutionPayload);
        expect(solution.id).toBeDefined()
        expect(solution.eventDate).toBeDefined()
        expect(solution.gapLinkage).toBeDefined()
        expect(solution.actionLinkage).toBeDefined()
        expect(solution.solution).toBeDefined()
    })
    it('setValuesForm', () => {
        const formValues = {"upT2cOT6UfJ": {"value": "Testing solution", "name": "upT2cOT6UfJ"}}
        const solution = new PossibleSolution();
        solution.setValuesFromForm(formValues);
        expect(solution.solution).toBeDefined();
    })
    it('getFormValues', () => {
        const solution = new PossibleSolution(solutionPayload);
        const formValues = solution.getFormValues();
        expect(formValues).toEqual({"upT2cOT6UfJ": {"value": expect.any(String), "name": "upT2cOT6UfJ"}})
    })
    it('getPayload', () => {
        const dataFromForm = {"upT2cOT6UfJ": {"value": "Testing solution", "name": "upT2cOT6UfJ"}}
        const solution = new PossibleSolution();
        solution.setValuesFromForm({...dataFromForm, gapLinkage: 'gapLinkage', indicatorId: 'indicatorId'});
        expect(solution.getPayload('O6uvpzGd5pu')).toEqual({
            "event": expect.any(String),
            "orgUnit": "O6uvpzGd5pu",
            "eventDate": expect.any(Date),
            "trackedEntityInstance": "indicatorId",
            "program": "Uvz0nfKVMQJ",
            "programStage": "JJaKjcOBapi",
            "dataValues": [{"dataElement": "upT2cOT6UfJ", "value": expect.any(String)}, {
                "dataElement": "kBkyDytdOmC",
                "value": expect.any(String)
            }, {"dataElement": "Y4CIGFwWYJD", "value": expect.any(String)}]
        })
    })
    it('getFormFields', () => {
        const solutionMetadata = {
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
                        "name": "Actiontracker_Solution To PossibleSolution Linkage",
                        "id": "kBkyDytdOmC",
                        "formName": "Solution To PossibleSolution Linkage",
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
                        "name": "Actiontracker_Solution To PossibleSolution Linkage",
                        "id": "kBkyDytdOmC",
                        "formName": "Solution To PossibleSolution Linkage",
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
        expect(PossibleSolution.getFormFields(solutionMetadata)).toEqual([
            new CustomFormField({
                "id": "upT2cOT6UfJ",
                "name": "Actiontracker_Solution ",
                "formName": "Solution",
                "valueType": "LONG_TEXT",
                "compulsory": true
            }),
        ])
    })
})

