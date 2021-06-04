import * as _ from "lodash";
import {CustomFormField} from "./customFormField";
import {BottleneckConstants, PossibleSolutionConstants} from "../constants";
import {uid} from "../helpers/utils/utils";


export default class PossibleSolution {

    constructor(event = {event: '', dataValues: []}) {
        const {event: eventId, dataValues, trackedEntityInstance, eventDate, orgUnit} = event || {};
        this.id = eventId;
        this.eventDate = eventDate;
        this.solution = _.find(dataValues, ['dataElement', PossibleSolutionConstants.SOLUTION_DATA_ELEMENT])?.value;
        this.gapLinkage = _.find(dataValues, ['dataElement', PossibleSolutionConstants.GAP_TO_SOLUTION_LINKAGE_DATA_ELEMENT])?.value;
        this.actionLinkage = _.find(dataValues, ['dataElement', PossibleSolutionConstants.SOLUTION_TO_ACTION_LINKAGE_DATA_ELEMENT])?.value;
        this.indicatorId = trackedEntityInstance;
        this.orgUnit = orgUnit;

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
        this.solution = data[PossibleSolutionConstants.SOLUTION_DATA_ELEMENT]?.value;
        this.gapLinkage = this.gapLinkage || data['gapLinkage'];
        this.indicatorId = this.indicatorId || data['indicatorId'];
        this.actionLinkage = this.actionLinkage || uid();
        this.id = this.id || uid();
        this.eventDate = this.eventDate || new Date()
    }

    getFormValues() {
        let formData = {}
        formData[PossibleSolutionConstants.SOLUTION_DATA_ELEMENT] = {
            name: PossibleSolutionConstants.SOLUTION_DATA_ELEMENT,
            value: this.solution
        };
        return formData
    }

    getPayload(orgUnit = '') {
        function getDataValues({solution, actionLinkage, gapLinkage}) {
            const dataValues = [];
            dataValues.push({'dataElement': PossibleSolutionConstants.SOLUTION_DATA_ELEMENT, value: solution})
            dataValues.push({
                'dataElement': PossibleSolutionConstants.GAP_TO_SOLUTION_LINKAGE_DATA_ELEMENT,
                value: gapLinkage
            })
            dataValues.push({
                'dataElement': PossibleSolutionConstants.SOLUTION_TO_ACTION_LINKAGE_DATA_ELEMENT,
                value: actionLinkage
            })
            return dataValues;
        }

        return {
            event: this.id,
            orgUnit,
            eventDate: this.eventDate,
            trackedEntityInstance: this.indicatorId,
            program: BottleneckConstants.PROGRAM_ID,
            programStage: PossibleSolutionConstants.PROGRAM_STAGE_ID,
            dataValues: getDataValues(this.toJson())
        }
    }

    static getFormFields(programConfig) {
        const {programStages} = programConfig;
        const gapProgramStage = _.find(programStages, ['id', PossibleSolutionConstants.PROGRAM_STAGE_ID]);
        const {programStageDataElements} = gapProgramStage;
        const formFields = [];

        for (const dataElement of programStageDataElements) {
            const {compulsory, dataElement: element} = dataElement;
            const {id} = element;
            if (id !== PossibleSolutionConstants.SOLUTION_TO_ACTION_LINKAGE_DATA_ELEMENT && id !== PossibleSolutionConstants.GAP_TO_SOLUTION_LINKAGE_DATA_ELEMENT) {
                const formField = new CustomFormField({...element, compulsory});
                formFields.push(formField);
            }
        }

        return formFields;

    }

    toString() {
        return JSON.stringify(this.toJson());
    }

}
