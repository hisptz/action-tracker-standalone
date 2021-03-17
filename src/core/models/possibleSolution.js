import _ from "lodash";
import {CustomFormField} from "./customFormField";
import {BOTTLENECK_PROGRAM_ID} from "../constants";
import {uid} from "../helpers/utils";

const SOLUTION_DATA_ELEMENT = 'upT2cOT6UfJ';
const GAP_TO_SOLUTION_LINKAGE_DATA_ELEMENT = 'kBkyDytdOmC';
const SOLUTION_TO_ACTION_LINKAGE_DATA_ELEMENT = 'Y4CIGFwWYJD';
const SOLUTION_PROGRAM_STAGE = 'JJaKjcOBapi';

export default class PossibleSolution {

    constructor(event = {event: '', dataValues: []}) {
        const {event: eventId, dataValues, trackedEntityInstance, eventDate} = event || {};
        this.id = eventId;
        this.eventDate = eventDate;
        this.solution = _.find(dataValues, ['dataElement', SOLUTION_DATA_ELEMENT])?.value;
        this.gapLinkage = _.find(dataValues, ['dataElement', GAP_TO_SOLUTION_LINKAGE_DATA_ELEMENT])?.value;
        this.actionLinkage = _.find(dataValues, ['dataElement', SOLUTION_TO_ACTION_LINKAGE_DATA_ELEMENT])?.value;
        this.indicatorId = trackedEntityInstance

        this.toString = this.toString.bind(this);
        this.toJson = this.toJson.bind(this);
        this.getPayload = this.getPayload.bind(this);
        this.setValuesFromForm = this.setValuesFromForm.bind(this);
        this.getFormValues = this.getFormValues.bind(this);
    }

    toJson() {
        return {
            id: this.id,
            solution: this.solution,
            gapLinkage: this.gapLinkage,
            actionLinkage: this.actionLinkage,
            indicatorId: this.indicatorId,
            eventDate: this.eventDate
        }
    }

    setValuesFromForm(data) {
        console.log(data);
        this.solution = data[SOLUTION_DATA_ELEMENT]?.value;
        this.gapLinkage = data['gapLinkage'];
        this.indicatorId = data['indicatorId'];
        this.actionLinkage = this.actionLinkage || uid();
        this.id = this.id || uid();
        this.eventDate = this.eventDate || new Date()
    }

    getFormValues() {
        let formData = {}
        formData[SOLUTION_DATA_ELEMENT] = this.solution;
        return formData
    }

    getPayload(orgUnit = '') {
        function getDataValues({solution, actionLinkage, gapLinkage}) {
            const dataValues = [];
            dataValues.push({'dataElement': SOLUTION_DATA_ELEMENT, value: solution})
            dataValues.push({'dataElement': GAP_TO_SOLUTION_LINKAGE_DATA_ELEMENT, value: gapLinkage})
            dataValues.push({'dataElement': SOLUTION_TO_ACTION_LINKAGE_DATA_ELEMENT, value: actionLinkage})
            return dataValues;
        }

        return {
            event: this.id,
            orgUnit,
            eventDate: this.eventDate,
            trackedEntityInstance: this.indicatorId,
            program: BOTTLENECK_PROGRAM_ID,
            programStage: SOLUTION_PROGRAM_STAGE,
            dataValues: getDataValues(this.toJson())
        }
    }

    static getFormFields(programConfig) {
        const {programStages} = programConfig;
        const gapProgramStage = _.find(programStages, ['id', SOLUTION_PROGRAM_STAGE]);
        const {programStageDataElements} = gapProgramStage;
        const formFields = [];

        for (const dataElement of programStageDataElements) {
            const {compulsory, dataElement: element} = dataElement;
            const {name, id, formName, valueType} = element;
            if (id !== SOLUTION_TO_ACTION_LINKAGE_DATA_ELEMENT && id !== GAP_TO_SOLUTION_LINKAGE_DATA_ELEMENT) {
                const formField = new CustomFormField({id, name, valueType, formName, compulsory});
                formFields.push(formField);
            }
        }

        return formFields;

    }

    toString() {
        return JSON.stringify(this.toJson());
    }

}
