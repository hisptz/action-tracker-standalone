import * as _ from "lodash";
import PossibleSolution from "./possibleSolution";
import {CustomFormField} from "./customFormField";
import {BottleneckConstants, GapConstants} from "../constants";
import {uid} from "../helpers/utils/utils";


export default class Gap {

    constructor(event = {event: '', dataValues: []}, possibleSolutionEvents = []) {
        const {event: eventId, dataValues, trackedEntityInstance, eventDate, orgUnit, orgUnitName} = event || {};
        this.id = eventId;
        this.eventDate = eventDate;
        this.title = _.find(dataValues, ['dataElement', GapConstants.TITLE_DATA_ELEMENT])?.value;
        this.description = _.find(dataValues, ['dataElement', GapConstants.DESCRIPTION_DATA_ELEMENT])?.value;
        this.method = _.find(dataValues, ['dataElement', GapConstants.METHOD_DATA_ELEMENT])?.value;
        this.solutionLinkage = _.find(dataValues, ['dataElement', GapConstants.SOLUTION_LINK_DATA_ELEMENT])?.value;
        this.possibleSolutions = _.map(possibleSolutionEvents, (solution) => new PossibleSolution(solution));
        this.indicatorId = trackedEntityInstance;
        this.orgUnit = orgUnit;
        this.orgUnitName = orgUnitName;

        this.toString = this.toString.bind(this);
        this.toJson = this.toJson.bind(this);
        this.getPayload = this.getPayload.bind(this);
        this.setValuesFromForm = this.setValuesFromForm.bind(this);
        this.getFormValues = this.getFormValues.bind(this);

    }

    toJson() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            method: this.method,
            possibleSolutions: this.possibleSolutions,
            solutionLinkage: this.solutionLinkage,
            indicatorId: this.indicatorId
        }
    }

    setValuesFromForm(data) {
        this.title = data[GapConstants.TITLE_DATA_ELEMENT]?.value;
        this.description = data[GapConstants.DESCRIPTION_DATA_ELEMENT]?.value;
        this.method = data[GapConstants.METHOD_DATA_ELEMENT]?.value;
        this.solutionLinkage = this.solutionLinkage || uid();
        this.id = this.id || uid();
        this.eventDate = this.eventDate || new Date()
    }

    getFormValues() {
        let formData = {}
        formData[GapConstants.TITLE_DATA_ELEMENT] = {name: GapConstants.TITLE_DATA_ELEMENT, value: this.title};
        formData[GapConstants.DESCRIPTION_DATA_ELEMENT] = {
            name: GapConstants.DESCRIPTION_DATA_ELEMENT,
            value: this.description
        };
        formData[GapConstants.METHOD_DATA_ELEMENT] = {name: GapConstants.METHOD_DATA_ELEMENT, value: this.method};
        return formData
    }

    getPayload(orgUnit = '') {
        function getDataValues({title, description, method, solutionLinkage}) {
            const dataValues = [];
            dataValues.push({'dataElement': GapConstants.TITLE_DATA_ELEMENT, value: title})
            dataValues.push({'dataElement': GapConstants.DESCRIPTION_DATA_ELEMENT, value: description})
            dataValues.push({'dataElement': GapConstants.METHOD_DATA_ELEMENT, value: method})
            dataValues.push({'dataElement': GapConstants.SOLUTION_LINK_DATA_ELEMENT, value: solutionLinkage})
            return dataValues;
        }

        return {
            event: this.id,
            orgUnit,
            trackedEntityInstance: this.indicatorId,
            program: BottleneckConstants.PROGRAM_ID,
            programStage: GapConstants.GAP_PROGRAM_STAGE_ID,
            dataValues: getDataValues(this.toJson()),
            eventDate: this.eventDate
        }
    }

    static getFormFields(programConfig) {
        const {programStages} = programConfig;
        const gapProgramStage = _.find(programStages, ['id', GapConstants.PROGRAM_STAGE_ID]);
        const {programStageDataElements} = gapProgramStage;
        const formFields = [];

        if (programStageDataElements) {
            for (const dataElement of programStageDataElements) {
                const {compulsory, dataElement: element} = dataElement;
                const {id} = element;
                if (id !== GapConstants.SOLUTION_LINK_DATA_ELEMENT) {
                    const formField = new CustomFormField({...element, compulsory});
                    formFields.push(formField);
                }
            }
        }

        return formFields;
    }

    toString() {
        return JSON.stringify(this.toJson())
    }

}
