import _ from 'lodash';
import Gap from "./gap";

const INDICATOR_ATTRIBUTE = '';
const INTERVENTION_ATTRIBUTE = '';
const COVERAGE_INDICATOR = '';
const GAP_PROGRAM_STAGE_ID = '';
const SOLUTION_PROGRAM_STAGE = '';
const GAP_TO_SOLUTION_LINKAGE = '';
const SOLUTION_TO_GAP_LINKAGE = '';

export default class Indicator {

    constructor(trackedEntityInstance = {trackedEntityInstance: '', attributes: [], enrollments: [{events: []}]}) {
        const {trackedEntityInstance: teiId, attributes, enrollments} = trackedEntityInstance;
        this.id = teiId;
        this.indicator = _.find(attributes, ['attribute', INDICATOR_ATTRIBUTE])?.value;
        this.intervention = _.find(attributes, ['attribute', INTERVENTION_ATTRIBUTE])?.value;
        this.coverageIndicator = _.find(attributes, ['attribute', COVERAGE_INDICATOR])?.value;
        const events = _.groupBy(enrollments[0]?.events, 'programStage');

        //Bind all methods
        this.getGaps = this.getGaps.bind(this);
        this.toString = this.toString.bind(this);
        this.toJson = this.toJson.bind(this);

        this.getGaps(events);

    }

    getGaps(events) {
        const gapEvents = events[GAP_PROGRAM_STAGE_ID];
        const solutionEvents = events[SOLUTION_PROGRAM_STAGE];
        this.gaps = _.map(gapEvents, (gapEvent) => {
            const gapSolutions = _.filter(solutionEvents, ({dataElements}) => {
                return _.find(dataElements, ['dataElement', SOLUTION_TO_GAP_LINKAGE])?.value ===
                    _.find(gapEvent.dataElements, ['dataElement', GAP_TO_SOLUTION_LINKAGE])
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
            gaps: this.gaps
        }
    }

    toString() {
        return JSON.stringify(this.toJson())
    }
}
