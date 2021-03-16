import _ from 'lodash';
import {CustomFormField} from "./customFormField";
import {ACTION_PROGRAM_ID} from "../constants";

const STATUS_DATA_ELEMENT = 'f8JYVWLC7rE';
const REVIEW_DATE_DATA_ELEMENT = 'nodiP54ocf5';
const REMARKS_DATA_ELEMENT = 'FnengvwgsQv';
const ACTION_STATUS_PROGRAM_STAGE_ID = 'cBiAEANcXAj';
export default class ActionStatus {

    constructor(event = {event: '', dataValues: []}) {
        const {event: eventId, dataValues, trackedEntityInstance} = event;
        this.id = eventId;
        this.status = _.find(dataValues, ['dataElement', STATUS_DATA_ELEMENT])?.value;
        this.remarks = _.find(dataValues, ['dataElement', REMARKS_DATA_ELEMENT])?.value;
        this.reviewDate = _.find(dataValues, ['dataElement', REVIEW_DATE_DATA_ELEMENT])?.value;
        this.actionId = trackedEntityInstance

        //Bind all methods
        this.toJson = this.toJson.bind(this);
        this.toString = this.toString.bind(this);
        this.getPayload = this.getPayload.bind(this);
        this.setValuesFromForm = this.setValuesFromForm.bind(this);
        this.getFormValues = this.getFormValues.bind(this);
    }

    toJson() {
        return {
            id: this.id,
            status: this.status,
            remarks: this.remarks,
            reviewDate: this.reviewDate
        }
    }

    setValuesFromForm(data) {
        this.status = data[STATUS_DATA_ELEMENT];
        this.remarks = data[REMARKS_DATA_ELEMENT];
        this.reviewDate = data[REVIEW_DATE_DATA_ELEMENT];
        this.actionId = data['actionId'];
    }

    getFormValues() {
        let formData = {}
        formData[STATUS_DATA_ELEMENT] = this.status;
        formData[REVIEW_DATE_DATA_ELEMENT] = this.reviewDate;
        formData[REMARKS_DATA_ELEMENT] = this.remarks;
        formData['actionId'] = this.actionId;
        return formData
    }

    getPayload() {

        function getDataValues({status, remarks, reviewDate}) {
            const dataValues = [];
            dataValues.push({'dataElement': STATUS_DATA_ELEMENT, value: status})
            dataValues.push({'dataElement': REMARKS_DATA_ELEMENT, value: remarks})
            dataValues.push({'dataElement': REVIEW_DATE_DATA_ELEMENT, value: reviewDate})
            return dataValues;
        }

        return {
            event: this.id,
            trackedEntityInstance: this.actionId,
            program: ACTION_PROGRAM_ID,
            programStage: ACTION_STATUS_PROGRAM_STAGE_ID,
            dataValues: getDataValues(this.toJson())
        }
    }

    static getFormFields(programConfig) {
        const {programStages} = programConfig;
        const gapProgramStage = _.find(programStages, ['id', ACTION_STATUS_PROGRAM_STAGE_ID]);
        const {programStageDataElements} = gapProgramStage;
        const formFields = [];

        if (programStageDataElements) {
            for (const dataElement of programStageDataElements) {
                const {compulsory, dataElement: element} = dataElement;
                const {name, id, formName, valueType, optionSet} = element;
                const formField = new CustomFormField({id, name, valueType, formName, compulsory, optionSet});
                formFields.push(formField);
            }
        }

        return formFields;

    }

    toString() {
        return JSON.stringify(this.toJson());
    }

}
