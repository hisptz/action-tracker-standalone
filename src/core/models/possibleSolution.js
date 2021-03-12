import _ from "lodash";

const SOLUTION_DATA_ELEMENT = 'upT2cOT6UfJ';
const GAP_TO_SOLUTION_LINKAGE_DATA_ELEMENT = 'kBkyDytdOmC';
const SOLUTION_TO_ACTION_LINKAGE_DATA_ELEMENT = 'Y4CIGFwWYJD';

export default class PossibleSolution {

    constructor(event = {event: '', dataValues: []}) {
        const {event: eventId, dataValues} = event;
        this.id = eventId;
        this.solution = _.find(dataValues, ['dataElement', SOLUTION_DATA_ELEMENT])?.value;
        this.gapLinkage = _.find(dataValues, ['dataElement', GAP_TO_SOLUTION_LINKAGE_DATA_ELEMENT])?.value;
        this.actionLinkage = _.find(dataValues, ['dataElement', SOLUTION_TO_ACTION_LINKAGE_DATA_ELEMENT])?.value;

        this.toString = this.toString.bind(this);
        this.toJson = this.toJson.bind(this);
    }

    toJson() {
        return {
            id: this.id,
            solution: this.solution,
            gapLinkage: this.gapLinkage,
            actionLinkage: this.actionLinkage
        }
    }

    toString() {
        return JSON.stringify(this.toJson());
    }

}
