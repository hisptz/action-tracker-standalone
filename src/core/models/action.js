import _ from 'lodash';
import ActionStatus from "./actionStatus";
import {CustomFormField} from "./customFormField";
import {ACTION_PROGRAM_ID, ACTION_TRACKED_ENTITY_TYPE} from "../constants";
import {uid} from "../helpers/utils";

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
        this.enrollmentId = enrollments ? enrollments[0].id : uid();
        this.enrollmentDate = enrollments ? enrollments[0]?.enrollmentDate : new Date();
        this.incidentDate = enrollments ? enrollments[0]?.incidentDate : new Date();
        this.status = enrollments ? enrollments[0]?.status : 'ACTIVE';

        //Bind all methods
        this.toString = this.toString.bind(this);
        this.toJson = this.toJson.bind(this);
        this.getLatestStatus = this.getLatestStatus.bind(this)
        this.getPayload = this.getPayload.bind(this);
        this.setValuesFromForm = this.setValuesFromForm.bind(this);
        this.getFormValues = this.getFormValues.bind(this);
    }

    getLatestStatus(events) {
        return _.find(_.reverse(_.sortBy(events, (event)=>new Date(event?.eventDate)))[0]?.dataValues, ['dataElement', STATUS_ATTRIBUTE])?.value
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
            actionToSolutionLinkage: this.actionToSolutionLinkage,
            enrollmentDate: this.enrollmentDate,
            incidentDate: this.incidentDate,
            status: this.status,
            enrollmentId: this.enrollmentId
        }
    }

    setValuesFromForm(data) {
        this.title = data[TITLE_ATTRIBUTE]?.value;
        this.description = data[DESCRIPTION_ATTRIBUTE]?.value;
        this.startDate = data[START_DATE_ATTRIBUTE]?.value;
        this.endDate = data[END_DATE_ATTRIBUTE]?.value;
        this.designation = data[DESIGNATION_ATTRIBUTE]?.value;
        this.responsiblePerson = data[RESPONSIBLE_PERSON_ATTRIBUTE]?.value;
        this.actionToSolutionLinkage = data['solutionLinkage'];
        this.id = this.id || uid();
        this.incidentDate = this.incidentDate || new Date();
        this.enrollmentDate = this.enrollmentDate || new Date();
        this.status = this.status || 'ACTIVE';
        this.enrollmentId = this.enrollmentId || uid()
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

    getPayload(events = [], orgUnit = '') {
        function getAttributes({
                                   title,
                                   description,
                                   startDate,
                                   endDate,
                                   responsiblePerson,
                                   designation,
                                   actionToSolutionLinkage
                               }) {
            const attributes = [];
            attributes.push({attribute: TITLE_ATTRIBUTE, value: title});
            attributes.push({attribute: DESCRIPTION_ATTRIBUTE, value: description});
            attributes.push({attribute: START_DATE_ATTRIBUTE, value: startDate});
            attributes.push({attribute: END_DATE_ATTRIBUTE, value: endDate});
            attributes.push({attribute: RESPONSIBLE_PERSON_ATTRIBUTE, value: responsiblePerson});
            attributes.push({attribute: DESIGNATION_ATTRIBUTE, value: designation});
            attributes.push({attribute: ACTION_TO_SOLUTION_LINKAGE, value: actionToSolutionLinkage});
            return attributes;
        }

        const programEvents = events.map(event => ({...event, trackedEntityInstance: this.id, orgUnit}))

        function getEnrollments({id, enrollmentDate, incidentDate, status, enrollmentId}) {
            return [
                {
                    program: ACTION_PROGRAM_ID,
                    trackedEntityInstance: id,
                    enrollmentDate,
                    incidentDate,
                    status,
                    orgUnit,
                    events: programEvents,
                    enrollment: enrollmentId
                }
            ]
        }

        return {
            trackedEntityInstance: this.id,
            trackedEntityType: ACTION_TRACKED_ENTITY_TYPE,
            orgUnit,
            attributes: getAttributes(this.toJson()),
            enrollments: getEnrollments(this.toJson())
        }
    }

    static getFormFields(programConfig) {
        const {programTrackedEntityAttributes} = programConfig || {};
        const formFields = [];
        if (programTrackedEntityAttributes) {
            for (const trackedEntityAttribute of programTrackedEntityAttributes) {
                const {mandatory, trackedEntityAttribute: attribute} = trackedEntityAttribute || {};
                const {name, id, formName, valueType} = attribute || {};
                if (id !== ACTION_TO_SOLUTION_LINKAGE) {
                    const formField = new CustomFormField({id, name, valueType, formName, mandatory});
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
