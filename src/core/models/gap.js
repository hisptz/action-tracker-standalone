import _ from "lodash";
import PossibleSolution from "./possibleSolution";


const TITLE_DATA_ELEMENT = '';
const DESCRIPTION_DATA_ELEMENT = '';
const METHOD_DATA_ELEMENT = '';
const SOLUTION_LINK_DATA_ELEMENT = '';

export default class Gap {

    constructor(event = {event: '', dataElements: []}, possibleSolutionEvents = []) {
        const {event: eventId, dataElements} = event;
        this.id = eventId;
        this.title = _.find(dataElements, ['dataElement', TITLE_DATA_ELEMENT])?.value;
        this.description = _.find(dataElements, ['dataElement', DESCRIPTION_DATA_ELEMENT])?.value;
        this.method = _.find(dataElements, ['dataElement', METHOD_DATA_ELEMENT])?.value;
        this.solutionLinkage = _.find(dataElements, ['dataElement', SOLUTION_LINK_DATA_ELEMENT])?.value;
        this.possibleSolutions = _.map(possibleSolutionEvents, (solution) => new PossibleSolution(solution));

        this.toString = this.toString.bind(this);
        this.toJson = this.toJson.bind(this);

    }

    toJson() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            method: this.method,
            possibleSolutions: this.possibleSolutions
        }
    }

    toString() {
        return JSON.stringify(this.toJson())
    }

}
