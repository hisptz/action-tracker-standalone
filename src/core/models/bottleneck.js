import _ from 'lodash';
import Gap from "./gap";
import {CustomFormField} from "./customFormField";
import {BottleneckConstants} from "../constants";
import {uid} from "../helpers/utils";


export default class Bottleneck {

    constructor(trackedEntityInstance) {
        const {trackedEntityInstance: teiId, attributes, enrollments, orgUnit} = trackedEntityInstance || {};
        this.id = teiId;
        this.indicator = _.find(attributes, ['attribute', BottleneckConstants.INDICATOR_ATTRIBUTE])?.value;
        this.bottleneck = _.find(attributes, ['attribute', BottleneckConstants.BOTTLENECK_ATTRIBUTE])?.value;
        this.intervention = _.find(attributes, ['attribute', BottleneckConstants.INTERVENTION_ATTRIBUTE])?.value;
        this.coverageIndicator = _.find(attributes, ['attribute', BottleneckConstants.COVERAGE_INDICATOR])?.value;
        const events = enrollments ? _.groupBy(enrollments[0]?.events, 'programStage') : [];
        this.enrollmentId = enrollments ? enrollments[0].id : uid();
        this.enrollmentDate = enrollments ? enrollments[0]?.enrollmentDate : new Date();
        this.incidentDate = enrollments ? enrollments[0]?.incidentDate : new Date();
        this.status = enrollments ? enrollments[0]?.status : 'ACTIVE';
        this.orgUnit = orgUnit;
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
        const gapEvents = events[BottleneckConstants.GAP_PROGRAM_STAGE_ID];
        const solutionEvents = events[BottleneckConstants.SOLUTION_PROGRAM_STAGE];
        this.gaps = _.map(gapEvents, (gapEvent) => {
            const gapSolutions = _.filter(solutionEvents, ({dataValues}) => {
                return _.find(dataValues, ['dataElement', BottleneckConstants.GAP_TO_SOLUTION_LINKAGE])?.value ===
                    _.find(gapEvent.dataValues, ['dataElement', BottleneckConstants.GAP_TO_SOLUTION_LINKAGE])?.value
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
        this.bottleneck = data[BottleneckConstants.BOTTLENECK_ATTRIBUTE];
        this.intervention = data[BottleneckConstants.INTERVENTION_ATTRIBUTE];
        this.coverageIndicator = data[BottleneckConstants.COVERAGE_INDICATOR];
        this.id = this.id || uid();
        this.incidentDate = this.incidentDate || new Date();
        this.enrollmentDate = this.enrollmentDate || new Date();
        this.status = this.status || 'ACTIVE';
        this.enrollmentId = this.enrollmentId || uid()
    }

    getFormValues() {
        let formData = {}
        formData[BottleneckConstants.INDICATOR_ATTRIBUTE] = this.indicator;
        // formData[BOTTLENECK_ATTRIBUTE] = this.bottleneck;
        // formData[INTERVENTION_ATTRIBUTE] = this.intervention;
        // formData[COVERAGE_INDICATOR] = this.coverageIndicator;
        return formData
    }

    getPayload(events = [], orgUnit = '') {
        function getAttributes({indicator, intervention, coverageIndicator, bottleneck}) {
            const attributes = [];
            attributes.push({attribute: BottleneckConstants.INDICATOR_ATTRIBUTE, value: indicator});
            attributes.push({attribute: BottleneckConstants.INTERVENTION_ATTRIBUTE, value: intervention});
            attributes.push({attribute: BottleneckConstants.COVERAGE_INDICATOR, value: coverageIndicator});
            attributes.push({attribute: BottleneckConstants.BOTTLENECK_ATTRIBUTE, value: bottleneck});
            return _.filter(attributes, 'value');
        }

        const programEvents = events.map(event => ({...event, trackedEntityInstance: this.id, }))

        function getEnrollments({id, status, enrollmentDate, incidentDate, enrollmentId}) {
            return [
                {
                    program: BottleneckConstants.PROGRAM_ID,
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
            trackedEntityType: BottleneckConstants.TRACKED_ENTITY_TYPE,
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
                const formField = new CustomFormField({...attribute, mandatory});
                formFields.push(formField);
            }
        }

        return formFields;

    }

    toString() {
        return JSON.stringify(this.toJson())
    }
}
