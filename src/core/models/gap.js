import _ from "lodash";
import PossibleSolution from "./possibleSolution";
import {CustomFormField} from "./customFormField";
import {BOTTLENECK_PROGRAM_ID} from "../constants";


const TITLE_DATA_ELEMENT = 'JbMaVyglSit';
const DESCRIPTION_DATA_ELEMENT = 'GsbZkewUna5';
const METHOD_DATA_ELEMENT = 'W50aguV39tU';
const SOLUTION_LINK_DATA_ELEMENT = 'kBkyDytdOmC';
const GAP_PROGRAM_STAGE_ID = 'zXB8tWKuwcl';

export default class Gap {

    constructor(event = {event: '', dataValues: []}, possibleSolutionEvents = []) {
        const {event: eventId, dataValues, trackedEntityInstance} = event;
        this.id = eventId;
        this.title = _.find(dataValues, ['dataElement', TITLE_DATA_ELEMENT])?.value;
        this.description = _.find(dataValues, ['dataElement', DESCRIPTION_DATA_ELEMENT])?.value;
        this.method = _.find(dataValues, ['dataElement', METHOD_DATA_ELEMENT])?.value;
        this.solutionLinkage = _.find(dataValues, ['dataElement', SOLUTION_LINK_DATA_ELEMENT])?.value;
        this.possibleSolutions = _.map(possibleSolutionEvents, (solution) => new PossibleSolution(solution));
        this.indicatorId = trackedEntityInstance;

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
        this.title = data[TITLE_DATA_ELEMENT];
        this.description = data[DESCRIPTION_DATA_ELEMENT];
        this.method = data[METHOD_DATA_ELEMENT];
    }

    getFormValues() {
        let formData = {}
        formData[TITLE_DATA_ELEMENT] = this.status;
        formData[DESCRIPTION_DATA_ELEMENT] = this.description;
        formData[METHOD_DATA_ELEMENT] = this.method;
        return formData
    }

    getPayload() {
        function getDataValues({title, description, method, solutionLinkage }) {
            const dataValues = [];
            dataValues.push({'dataElement': TITLE_DATA_ELEMENT, value: title})
            dataValues.push({'dataElement': DESCRIPTION_DATA_ELEMENT, value: description})
            dataValues.push({'dataElement': METHOD_DATA_ELEMENT, value: method})
            dataValues.push({'dataElement': SOLUTION_LINK_DATA_ELEMENT, value: solutionLinkage})
            return dataValues;
        }
        return {
            event: this.id,
            trackedEntityInstance: this.indicatorId,
            program: BOTTLENECK_PROGRAM_ID,
            programStage: GAP_PROGRAM_STAGE_ID,
            dataValues: getDataValues(this.toJson())
        }
    }

    static getFormFields(programConfig) {
        const {programStages} = programConfig;
        const gapProgramStage = _.find(programStages, ['id', GAP_PROGRAM_STAGE_ID]);
        const {programStageDataElements} = gapProgramStage;
        const formFields = [];

        if (programStageDataElements) {
            for (const dataElement of programStageDataElements) {
                const {compulsory, dataElement: element} = dataElement;
                const {name, id, formName, valueType} = element;
                if (id !== SOLUTION_LINK_DATA_ELEMENT) {
                    const formField = new CustomFormField({id, name, valueType, formName, compulsory});
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
