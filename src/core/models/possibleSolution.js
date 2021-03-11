import _ from "lodash";

const SOLUTION_DATA_ELEMENT = '';
const SOLUTION_GAP_LINKAGE_DATA_ELEMENT = '';

export default class PossibleSolution {

    constructor(event = {event: '', dataElements: []}) {
        const {event: eventId, dataElements} = event;
        this.id = eventId;
        this.solution = _.find(dataElements, ['dataElement', SOLUTION_DATA_ELEMENT])?.value;
        this.gapLinkage = _.find(dataElements, ['dataElement', SOLUTION_GAP_LINKAGE_DATA_ELEMENT])?.value;

        this.toString = this.toString.bind(this);
        this.toJson = this.toJson.bind(this);
    }

    toJson() {
        return {
            id: this.id,
            solution: this.solution,
            gapLinkage: this.gapLinkage
        }
    }

    toString() {
        return JSON.stringify(this.toJson());
    }

}
