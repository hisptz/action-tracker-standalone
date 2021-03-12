import _ from 'lodash';
import Gap from "./gap";

const BOTTLENECK_ATTRIBUTE = 'WLFrBgfl7lU';
const INDICATOR_ATTRIBUTE = 'tVlKbtVfNjc';
const INTERVENTION_ATTRIBUTE = 'jZ6WL4NQtp5';
const COVERAGE_INDICATOR = 'imiLbaQKYnA';
const GAP_PROGRAM_STAGE_ID = 'zXB8tWKuwcl';
const SOLUTION_PROGRAM_STAGE = 'JJaKjcOBapi';
const GAP_TO_SOLUTION_LINKAGE = 'kBkyDytdOmC';

export default class Indicator {

    constructor(trackedEntityInstance) {
        const {trackedEntityInstance: teiId, attributes, enrollments} = trackedEntityInstance;
        this.id = teiId;
        this.indicator = _.find(attributes, ['attribute', INDICATOR_ATTRIBUTE])?.value;
        this.bottleneck = _.find(attributes, ['attribute', BOTTLENECK_ATTRIBUTE])?.value;
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
            gaps: this.gaps
        }
    }

    toString() {
        return JSON.stringify(this.toJson())
    }
}
