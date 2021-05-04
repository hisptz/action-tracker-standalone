import _ from 'lodash';
import ActionStatus from "./actionStatus";
import {CustomFormField} from "./customFormField";
import {ActionConstants} from "../constants";
import {uid} from "../helpers/utils";
import {getJSDate} from "../services/dateUtils";


export default class Action {

    constructor(trackedEntityInstance = {
        trackedEntityInstance: '',
        attributes: [],
        enrollments: [{events: []}],
        relationships: []
    }) {
        const {
            trackedEntityInstance: teiId,
            attributes,
            enrollments,
            relationships,
            orgUnit
        } = trackedEntityInstance || {};
        this.id = teiId;
        this.title = _.find(attributes, ['attribute', ActionConstants.TITLE_ATTRIBUTE])?.value;
        this.description = _.find(attributes, ['attribute', ActionConstants.DESCRIPTION_ATTRIBUTE])?.value;
        this.startDate = _.find(attributes, ['attribute', ActionConstants.START_DATE_ATTRIBUTE])?.value;
        this.endDate = _.find(attributes, ['attribute', ActionConstants.END_DATE_ATTRIBUTE])?.value;
        this.responsiblePerson = _.find(attributes, ['attribute', ActionConstants.RESPONSIBLE_PERSON_ATTRIBUTE])?.value;
        this.designation = _.find(attributes, ['attribute', ActionConstants.DESIGNATION_ATTRIBUTE])?.value;
        this.actionToSolutionLinkage = _.find(attributes, ['attribute', ActionConstants.ACTION_TO_SOLUTION_LINKAGE])?.value;
        this.actionStatusList = enrollments && _.map(enrollments[0].events, (event) => new ActionStatus(event));
        this.relationshipId = relationships && relationships[0]?.relationship
        this.challengeId = relationships && relationships[0]?.from?.trackedEntityInstance?.trackedEntityInstance
        this.latestStatus = this.getLatestStatus(enrollments && enrollments[0].events);
        this.enrollmentId = enrollments ? enrollments[0].id : uid();
        this.enrollmentDate = enrollments ? enrollments[0]?.enrollmentDate : new Date();
        this.incidentDate = enrollments ? enrollments[0]?.incidentDate : new Date();
        this.status = enrollments ? enrollments[0]?.status : 'ACTIVE';
        this.orgUnit = orgUnit;
        this.pastDueDate = this.getActionStatusOnDueDate(enrollments && enrollments[0].events)

        //Bind all methods
        this.toString = this.toString.bind(this);
        this.toJson = this.toJson.bind(this);
        this.getLatestStatus = this.getLatestStatus.bind(this)
        this.getPayload = this.getPayload.bind(this);
        this.setValuesFromForm = this.setValuesFromForm.bind(this);
        this.getFormValues = this.getFormValues.bind(this);
        this.getActionStatusOnDueDate = this.getActionStatusOnDueDate.bind(this);
    }

    getActionStatusOnDueDate(events = []) {
        if (_.isEmpty(events)) {
            return true;
        } else {
            return new Date() > getJSDate(this.endDate) && !(this.latestStatus === 'Completed') //TODO: This should be configurable
        }
    }

    getLatestStatus(events) {
        return _.find(_.reverse(_.sortBy(events, (event) => new Date(event?.eventDate)))[0]?.dataValues, ['dataElement', ActionConstants.STATUS_ATTRIBUTE])?.value || 'N/A' //TODO: Change to something appropriate and acceptable
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
            enrollmentId: this.enrollmentId,
            challengeId: this.challengeId,
            relationshipId: this.relationshipId
        }
    }

    setValuesFromForm(data) {
        this.title = data[ActionConstants.TITLE_ATTRIBUTE]?.value;
        this.description = data[ActionConstants.DESCRIPTION_ATTRIBUTE]?.value;
        this.startDate = data[ActionConstants.START_DATE_ATTRIBUTE]?.value;
        this.endDate = data[ActionConstants.END_DATE_ATTRIBUTE]?.value;
        this.designation = data[ActionConstants.DESIGNATION_ATTRIBUTE]?.value;
        this.responsiblePerson = data[ActionConstants.RESPONSIBLE_PERSON_ATTRIBUTE]?.value;
        this.actionToSolutionLinkage = this.actionToSolutionLinkage || data['solution']?.actionLinkage;
        this.challengeId = this.challengeId || data['solution']?.indicatorId
        this.id = this.id || uid();
        this.incidentDate = this.incidentDate || new Date();
        this.enrollmentDate = this.enrollmentDate || new Date();
        this.status = this.status || 'ACTIVE';
        this.enrollmentId = this.enrollmentId || uid()
    }

    getFormValues() {
        let formData = {}
        formData[ActionConstants.TITLE_ATTRIBUTE] = {name: ActionConstants.TITLE_ATTRIBUTE, value: this.title};
        formData[ActionConstants.DESCRIPTION_ATTRIBUTE] = {
            name: ActionConstants.DESCRIPTION_ATTRIBUTE,
            value: this.description
        };
        formData[ActionConstants.DESIGNATION_ATTRIBUTE] = {
            name: ActionConstants.DESIGNATION_ATTRIBUTE,
            value: this.designation
        };
        formData[ActionConstants.START_DATE_ATTRIBUTE] = {
            name: ActionConstants.START_DATE_ATTRIBUTE,
            value: this.startDate
        };
        formData[ActionConstants.END_DATE_ATTRIBUTE] = {name: ActionConstants.END_DATE_ATTRIBUTE, value: this.endDate};
        formData[ActionConstants.RESPONSIBLE_PERSON_ATTRIBUTE] = {
            name: ActionConstants.RESPONSIBLE_PERSON_ATTRIBUTE,
            value: this.responsiblePerson
        };
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
            attributes.push({attribute: ActionConstants.TITLE_ATTRIBUTE, value: title});
            attributes.push({attribute: ActionConstants.DESCRIPTION_ATTRIBUTE, value: description});
            attributes.push({attribute: ActionConstants.START_DATE_ATTRIBUTE, value: startDate});
            attributes.push({attribute: ActionConstants.END_DATE_ATTRIBUTE, value: endDate});
            attributes.push({attribute: ActionConstants.RESPONSIBLE_PERSON_ATTRIBUTE, value: responsiblePerson});
            attributes.push({attribute: ActionConstants.DESIGNATION_ATTRIBUTE, value: designation});
            attributes.push({attribute: ActionConstants.ACTION_TO_SOLUTION_LINKAGE, value: actionToSolutionLinkage});
            return attributes;
        }

        const programEvents = events.map(event => ({...event, trackedEntityInstance: this.id, orgUnit}));

        function getRelationships({challengeId, relationshipId, id}) {
            return [
                {
                    relationshipType: ActionConstants.BOTTLENECK_ACTION_RELATIONSHIP_TYPE,
                    relationship: relationshipId || uid(),
                    from: {
                        trackedEntityInstance: {
                            trackedEntityInstance: challengeId
                        }
                    },
                    to: {
                        trackedEntityInstance: {
                            trackedEntityInstance: id
                        }
                    }

                }
            ]
        }

        function getEnrollments({id, enrollmentDate, incidentDate, status, enrollmentId}) {
            return [
                {
                    program: ActionConstants.PROGRAM_ID,
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
            trackedEntityType: ActionConstants.ACTION_TRACKED_ENTITY_TYPE,
            orgUnit,
            attributes: getAttributes(this.toJson()),
            enrollments: getEnrollments(this.toJson()),
            relationships: getRelationships(this.toJson())
        }
    }

    static getFormFields(programConfig) {
        const {programTrackedEntityAttributes} = programConfig || {};
        const formFields = [];
        if (programTrackedEntityAttributes) {
            for (const trackedEntityAttribute of programTrackedEntityAttributes) {
                const {mandatory, trackedEntityAttribute: attribute} = trackedEntityAttribute || {};
                const {id} = attribute || {};
                if (id !== ActionConstants.ACTION_TO_SOLUTION_LINKAGE) {
                    const formField = new CustomFormField({...attribute, mandatory});
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
