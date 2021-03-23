import _ from 'lodash';
import {CustomFormField} from "./customFormField";
import {ActionConstants, ActionStatusConstants} from "../constants";
import {uid} from "../helpers/utils";


export default class ActionStatus {

    constructor(event = {event: '', dataValues: []}) {
        const {event: eventId, dataValues, trackedEntityInstance, eventDate} = event;
        this.id = eventId;
        this.status = _.find(dataValues, ['dataElement', ActionStatusConstants.STATUS_DATA_ELEMENT])?.value;
        this.remarks = _.find(dataValues, ['dataElement', ActionStatusConstants.REMARKS_DATA_ELEMENT])?.value;
        this.reviewDate = _.find(dataValues, ['dataElement', ActionStatusConstants.REVIEW_DATE_DATA_ELEMENT])?.value;
        this.actionId = trackedEntityInstance
        this.eventDate = eventDate;

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
            reviewDate: this.reviewDate,
            actionId: this.actionId,
            eventDate: this.eventDate
        }
    }

    setValuesFromForm(data) {
        this.status = data[ActionStatusConstants.STATUS_DATA_ELEMENT]?.value;
        this.remarks = data[ActionStatusConstants.REMARKS_DATA_ELEMENT]?.value;
        this.reviewDate = data[ActionStatusConstants.REVIEW_DATE_DATA_ELEMENT]?.value;
        this.actionId = this.actionId || data['actionId'];
        this.id = this.id || uid();
        this.eventDate = this.eventDate || data[ActionStatusConstants.REVIEW_DATE_DATA_ELEMENT]?.value
    }

    getFormValues() {
        let formData = {}
        formData[ActionStatusConstants.STATUS_DATA_ELEMENT] = {
            name: ActionStatusConstants.STATUS_DATA_ELEMENT,
            value: this.status
        };
        formData[ActionStatusConstants.REVIEW_DATE_DATA_ELEMENT] = {
            name: ActionStatusConstants.REVIEW_DATE_DATA_ELEMENT,
            value: this.reviewDate
        };
        formData[ActionStatusConstants.REMARKS_DATA_ELEMENT] = {
            name: ActionStatusConstants.REMARKS_DATA_ELEMENT,
            value: this.remarks
        };
        formData['actionId'] = this.actionId;
        return formData
    }

    getPayload(orgUnit = '') {

        function getDataValues({status, remarks, reviewDate}) {
            const dataValues = [];
            dataValues.push({'dataElement': ActionStatusConstants.STATUS_DATA_ELEMENT, value: status})
            dataValues.push({'dataElement': ActionStatusConstants.REMARKS_DATA_ELEMENT, value: remarks})
            dataValues.push({'dataElement': ActionStatusConstants.REVIEW_DATE_DATA_ELEMENT, value: reviewDate})
            return dataValues;
        }

        return {
            event: this.id,
            eventDate: this.eventDate,
            trackedEntityInstance: this.actionId,
            program: ActionConstants.PROGRAM_ID,
            orgUnit,
            programStage: ActionStatusConstants.ACTION_STATUS_PROGRAM_STAGE_ID,
            dataValues: getDataValues(this.toJson())
        }
    }

    static getFormFields(programConfig) {
        const {programStages} = programConfig;
        const gapProgramStage = _.find(programStages, ['id', ActionStatusConstants.ACTION_STATUS_PROGRAM_STAGE_ID]);
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
