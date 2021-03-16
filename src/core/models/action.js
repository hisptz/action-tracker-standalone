import _ from 'lodash';
import ActionStatus from "./actionStatus";
import {CustomFormField} from "./customFormField";
import {ACTION_PROGRAM_ID} from "../constants";

const TITLE_ATTRIBUTE = 'HQxzVwKedKu'
const DESCRIPTION_ATTRIBUTE = 'GlvCtGIytIz'
const START_DATE_ATTRIBUTE = 'jFjnkx49Lg3';
const END_DATE_ATTRIBUTE = 'BYCbHJ46BOr';
const RESPONSIBLE_PERSON_ATTRIBUTE = 'G3aWsZW2MpV';
const DESIGNATION_ATTRIBUTE = 'Ax6bWbKn46e';
const ACTION_TO_SOLUTION_LINKAGE = 'Hi3IjyMXzeW';
const STATUS_ATTRIBUTE = 'f8JYVWLC7rE';


export default class Action {

    constructor(trackedEntityInstance = {
        trackedEntityInstance: '',
        attributes: [],
        enrollments: [{events: []}]
    }) {
        const {trackedEntityInstance: teiId, attributes, enrollments} = trackedEntityInstance;
        this.id = teiId;
        this.title = _.find(attributes, ['attribute', TITLE_ATTRIBUTE])?.value;
        this.description = _.find(attributes, ['attribute', DESCRIPTION_ATTRIBUTE])?.value;
        this.startDate = _.find(attributes, ['attribute', START_DATE_ATTRIBUTE])?.value;
        this.endDate = _.find(attributes, ['attribute', END_DATE_ATTRIBUTE])?.value;
        this.responsiblePerson = _.find(attributes, ['attribute', RESPONSIBLE_PERSON_ATTRIBUTE])?.value;
        this.designation = _.find(attributes, ['attribute', DESIGNATION_ATTRIBUTE])?.value;
        this.actionToSolutionLinkage = _.find(attributes, ['attribute', ACTION_TO_SOLUTION_LINKAGE])?.value;
        this.actionStatusList = _.map(enrollments[0].events, (event) => new ActionStatus(event));
        this.latestStatus = this.getLatestStatus(enrollments[0].events);

        //Bind all methods
        this.toString = this.toString.bind(this);
        this.toJson = this.toJson.bind(this);
        this.getLatestStatus = this.getLatestStatus.bind(this)
        this.getPayload = this.getPayload.bind(this);
        this.setValuesFromForm = this.setValuesFromForm.bind(this);
        this.getFormValues = this.getFormValues.bind(this);
    }

    getLatestStatus(events){
        return _.find(_.reverse(_.sortBy(events, ['eventDate']))[0]?.dataValues, ['dataElement', STATUS_ATTRIBUTE])?.value
    }

    toJson() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            startDate: this.startDate,
            endDate: this.endDate,
            responsiblePerson: this.responsiblePerson,
            designation: this.designation,
            actionToStatusLinkage: this.actionToSolutionLinkage
        }
    }

    setValuesFromForm(data) {
        this.title = data[TITLE_ATTRIBUTE];
        this.description = data[DESCRIPTION_ATTRIBUTE];
        this.startDate = data[START_DATE_ATTRIBUTE];
        this.endDate = data[END_DATE_ATTRIBUTE];
        this.designation = data[DESIGNATION_ATTRIBUTE];
        this.responsiblePerson = data[RESPONSIBLE_PERSON_ATTRIBUTE];
    }

    getFormValues() {
        let formData = {}
        formData[TITLE_ATTRIBUTE] = this.title;
        formData[DESCRIPTION_ATTRIBUTE] = this.description;
        formData[DESIGNATION_ATTRIBUTE] = this.designation;
        formData[START_DATE_ATTRIBUTE] = this.startDate;
        formData[END_DATE_ATTRIBUTE] = this.endDate;
        formData[RESPONSIBLE_PERSON_ATTRIBUTE] = this.responsiblePerson;
        return formData
    }

    getPayload() {
        function getAttributes({title, description, startDate, endDate, responsiblePerson, designation}) {
            const attributes = [];
            attributes.push({attribute: TITLE_ATTRIBUTE, value: title});
            attributes.push({attribute: DESCRIPTION_ATTRIBUTE, value: description});
            attributes.push({attribute: START_DATE_ATTRIBUTE, value: startDate});
            attributes.push({attribute: END_DATE_ATTRIBUTE, value: endDate});
            attributes.push({attribute: RESPONSIBLE_PERSON_ATTRIBUTE, value: responsiblePerson});
            attributes.push({attribute: DESIGNATION_ATTRIBUTE, value: designation});
            return attributes;
        }
        function getEnrollments() {
            return [
                {
                    program: ACTION_PROGRAM_ID,
                }
            ]
        }
        return {
            trackedEntityInstance: this.id,
            attributes: getAttributes(this.toJson()),
            enrollments: getEnrollments()
        }
    }

    static getFormFields(programConfig) {
        const {programTrackedEntityAttributes} = programConfig || {};
        const formFields = [];
        if (programTrackedEntityAttributes) {
            for (const trackedEntityAttribute of programTrackedEntityAttributes) {
                const {mandatory, trackedEntityAttribute: attribute} = trackedEntityAttribute || {};
                const {name, id, formName, valueType} = attribute || {};
                if(id !== ACTION_TO_SOLUTION_LINKAGE){
                    const formField = new CustomFormField({id, name, valueType, formName, mandatory});
                    formFields.push(formField);
                }
            }
        }
        console.log(formFields);

        return formFields;

    }

    toString() {
        return JSON.stringify(this.toJson())
    }

}
