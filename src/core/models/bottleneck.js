import _ from 'lodash';
import Gap from "./gap";
import {CustomFormField} from "./customFormField";
import {get} from "react-hook-form";
import {BOTTLENECK_PROGRAM_ID} from "../constants";
import {uid} from "../helpers/utils";

const BOTTLENECK_TRACKED_ENTITY_TYPE = 'jLaBp1GaZQ9';
const BOTTLENECK_ATTRIBUTE = 'WLFrBgfl7lU';
const INDICATOR_ATTRIBUTE = 'tVlKbtVfNjc';
const INTERVENTION_ATTRIBUTE = 'jZ6WL4NQtp5';
const COVERAGE_INDICATOR = 'imiLbaQKYnA';
const GAP_PROGRAM_STAGE_ID = 'zXB8tWKuwcl';
const SOLUTION_PROGRAM_STAGE = 'JJaKjcOBapi';
const GAP_TO_SOLUTION_LINKAGE = 'kBkyDytdOmC';

export default class Bottleneck {

    constructor(trackedEntityInstance) {
        const {trackedEntityInstance: teiId, attributes, enrollments} = trackedEntityInstance || {};
        this.id = teiId;
        this.indicator = _.find(attributes, ['attribute', INDICATOR_ATTRIBUTE])?.value;
        this.bottleneck = _.find(attributes, ['attribute', BOTTLENECK_ATTRIBUTE])?.value;
        this.intervention = _.find(attributes, ['attribute', INTERVENTION_ATTRIBUTE])?.value;
        this.coverageIndicator = _.find(attributes, ['attribute', COVERAGE_INDICATOR])?.value;
        const events = enrollments ? _.groupBy(enrollments[0]?.events, 'programStage') : [];
        this.enrollmentId = enrollments ? enrollments[0].id : uid();
        this.enrollmentDate = enrollments ? enrollments[0]?.enrollmentDate : new Date();
        this.incidentDate = enrollments ? enrollments[0]?.incidentDate : new Date();
        this.status = enrollments ? enrollments[0]?.status : 'ACTIVE';
        //Bind all methods
        this.getGaps = this.getGaps.bind(this);
        this.toString = this.toString.bind(this);
        this.toJson = this.toJson.bind(this);
        this.getPayload = this.getPayload.bind(this);
        this.setValuesFromForm = this.setValuesFromForm.bind(this);
        this.getFormValues = this.getFormValues.bind(this);

        this.getGaps(events);

    }

    getGaps(events = []) {
        const gapEvents = events[GAP_PROGRAM_STAGE_ID];
        const solutionEvents = events[SOLUTION_PROGRAM_STAGE];
        this.gaps = _.map(gapEvents, (gapEvent) => {
            const gapSolutions = _.filter(solutionEvents, ({dataValues}) => {
                return _.find(dataValues, ['dataElement', GAP_TO_SOLUTION_LINKAGE])?.value ===
                    _.find(gapEvent.dataValues, ['dataElement', GAP_TO_SOLUTION_LINKAGE])?.value
            })
            return new Gap(gapEvent, gapSolutions);
        })
    }

    toJson() {
        return {
            id: this.id,
            indicator: this.indicator,
            intervention: this.intervention,
            coverageIndicator: this.coverageIndicator,
            bottleneck: this.bottleneck,
            gaps: this.gaps,
            enrollmentDate: this.enrollmentDate,
            incidentDate: this.incidentDate,
            status: this.status,
            enrollmentId: this.enrollmentId
        }
    }

    setValuesFromForm(data) {
        this.indicator = data['indicator'];
        this.bottleneck = data[BOTTLENECK_ATTRIBUTE];
        this.intervention = data[INTERVENTION_ATTRIBUTE];
        this.coverageIndicator = data[COVERAGE_INDICATOR];
        this.id = this.id || uid();
        this.incidentDate = this.incidentDate || new Date();
        this.enrollmentDate = this.enrollmentDate || new Date();
        this.status = this.status || 'ACTIVE';
        this.enrollmentId = this.enrollmentId || uid()
    }

    getFormValues() {
        let formData = {}
        formData[INDICATOR_ATTRIBUTE] = this.indicator;
        // formData[BOTTLENECK_ATTRIBUTE] = this.bottleneck;
        // formData[INTERVENTION_ATTRIBUTE] = this.intervention;
        // formData[COVERAGE_INDICATOR] = this.coverageIndicator;
        return formData
    }

    getPayload(events = [], orgUnit = '') {
        function getAttributes({indicator, intervention, coverageIndicator, bottleneck}) {
            const attributes = [];
            attributes.push({attribute: INDICATOR_ATTRIBUTE, value: indicator});
            attributes.push({attribute: INTERVENTION_ATTRIBUTE, value: intervention});
            attributes.push({attribute: COVERAGE_INDICATOR, value: coverageIndicator});
            attributes.push({attribute: BOTTLENECK_ATTRIBUTE, value: bottleneck});
            return _.filter(attributes, 'value');
        }

        const programEvents = events.map(event => ({trackedEntityInstance: this.id, ...event}))

        function getEnrollments({id, status, enrollmentDate, incidentDate, enrollmentId}) {
            return [
                {
                    program: BOTTLENECK_PROGRAM_ID,
                    trackedEntityInstance: id,
                    events: programEvents,
                    enrollmentDate,
                    incidentDate,
                    status,
                    orgUnit,
                    enrollment: enrollmentId
                }
            ]
        }

        return {
            orgUnit,
            trackedEntityType: BOTTLENECK_TRACKED_ENTITY_TYPE,
            trackedEntityInstance: this.id,
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
                const formField = new CustomFormField({id, name, valueType, formName, mandatory});
                formFields.push(formField);
            }
        }

        return formFields;

    }

    toString() {
        return JSON.stringify(this.toJson())
    }
}
